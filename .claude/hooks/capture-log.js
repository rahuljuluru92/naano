#!/usr/bin/env node
/*
 * Claude Code hook: appends verbatim prompt/response pairs to .agent-logs/.
 * Wired to UserPromptSubmit and Stop in ../settings.json.
 * Must never throw or exit non-zero — a logging failure must not interrupt the session.
 * Also commits each appended entry immediately (git add + commit scoped to that one
 * log file) so capture lands in git history as it happens, per the assignment's
 * "commit as you go" rule, instead of relying on someone remembering to batch-commit.
 */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const REPO_ROOT = process.env.CLAUDE_PROJECT_DIR || path.resolve(__dirname, "..", "..");
const LOG_DIR = path.join(REPO_ROOT, ".agent-logs");
const ERROR_LOG = path.join(REPO_ROOT, ".claude", "hooks", ".capture-errors.log");
const AUTHOR = "rahul juluru";
const PROJECT = "naano-clone";
const TOOL = "claude-code";
const DEFAULT_MODEL = "unknown";

function pad(n) {
  return String(n).padStart(2, "0");
}

function fmtFilenameStamp(d) {
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}_${pad(
    d.getUTCHours()
  )}-${pad(d.getUTCMinutes())}-${pad(d.getUTCSeconds())}`;
}

function isoDatePart(iso) {
  return (iso || "").slice(0, 10);
}

function shortId(sessionId) {
  return (sessionId || "").slice(0, 8);
}

function readStdinJson() {
  const data = fs.readFileSync(0, "utf8");
  return JSON.parse(data);
}

function readTranscriptTail(transcriptPath) {
  const result = {
    lastAssistantText: null,
    lastAssistantModel: null,
    lastAssistantTimestamp: null,
    lastUserText: null,
  };
  let raw;
  try {
    raw = fs.readFileSync(transcriptPath, "utf8");
  } catch (e) {
    return result;
  }
  const lines = raw.split("\n").filter(Boolean);
  for (let i = lines.length - 1; i >= 0; i--) {
    let entry;
    try {
      entry = JSON.parse(lines[i]);
    } catch (e) {
      continue;
    }
    if (!result.lastAssistantText && entry.type === "assistant" && entry.message) {
      const content = entry.message.content;
      if (Array.isArray(content)) {
        const texts = content.filter((c) => c && c.type === "text").map((c) => c.text);
        if (texts.length) {
          result.lastAssistantText = texts.join("\n\n");
          result.lastAssistantModel = entry.message.model || null;
          result.lastAssistantTimestamp = entry.timestamp || null;
        }
      }
    }
    if (!result.lastUserText && entry.type === "user" && entry.message) {
      const content = entry.message.content;
      if (typeof content === "string") {
        result.lastUserText = content;
      }
    }
    if (result.lastAssistantText && result.lastUserText) break;
  }
  return result;
}

function findExistingLogFile(sessionId) {
  if (!fs.existsSync(LOG_DIR)) return null;
  const suffix = `_${shortId(sessionId)}.md`;
  const match = fs.readdirSync(LOG_DIR).find((f) => f.endsWith(suffix));
  return match ? path.join(LOG_DIR, match) : null;
}

function buildFrontmatterBlock(fm) {
  return `---
session_id: ${fm.session_id}
date: ${fm.date}
author: ${fm.author}
model: ${fm.model}
tool: ${fm.tool}
project: ${fm.project}
total_exchanges: ${fm.total_exchanges}
first_prompt_time: ${fm.first_prompt_time}
last_prompt_time: ${fm.last_prompt_time}
---
`;
}

function buildNewFile(fm) {
  return `${buildFrontmatterBlock(fm)}
# Session Log - ${fm.date}

Session: \`${shortId(fm.session_id)}\` | Project: \`${fm.project}\` | Author: \`${fm.author}\`

---
`;
}

function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    fm[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return { fm, headerEnd: m[0].length, rawHeader: m[0] };
}

function countTagOccurrences(text, type, sessionId) {
  // Anchored to line-start and scoped to this session's id so that a captured
  // prompt/response which itself contains example "[LOG_ENTRY ...]" text
  // (e.g. someone pasting this very setup doc) is never mistaken for a real entry.
  const re = new RegExp(`^\\[LOG_ENTRY type=${type} num=\\d+ session=${shortId(sessionId)}\\]$`, "gm");
  return (text.match(re) || []).length;
}

function ensureLogFile(sessionId, nowIso, model) {
  let file = findExistingLogFile(sessionId);
  if (file) return file;
  fs.mkdirSync(LOG_DIR, { recursive: true });
  const date = isoDatePart(nowIso);
  const fm = {
    session_id: sessionId,
    date,
    author: AUTHOR,
    model: model || DEFAULT_MODEL,
    tool: TOOL,
    project: PROJECT,
    total_exchanges: 0,
    first_prompt_time: nowIso,
    last_prompt_time: nowIso,
  };
  file = path.join(LOG_DIR, `${fmtFilenameStamp(new Date(nowIso))}_${shortId(sessionId)}.md`);
  fs.writeFileSync(file, buildNewFile(fm));
  return file;
}

function updateFrontmatter(file, updates) {
  const text = fs.readFileSync(file, "utf8");
  const parsed = parseFrontmatter(text);
  if (!parsed) return;
  const fm = { ...parsed.fm, ...updates };
  const newBlock = buildFrontmatterBlock(fm);
  const rest = text.slice(parsed.headerEnd);
  fs.writeFileSync(file, newBlock + rest);
}

function appendEntry(file, { type, num, sessionId, timestamp, model, text }) {
  const block = `
[LOG_ENTRY type=${type} num=${num} session=${shortId(sessionId)}]
timestamp: ${timestamp}
model: ${model || DEFAULT_MODEL}

${text}

`;
  fs.appendFileSync(file, block);
}

function logError(err, context) {
  try {
    fs.mkdirSync(path.dirname(ERROR_LOG), { recursive: true });
    fs.appendFileSync(
      ERROR_LOG,
      `${new Date().toISOString()} ${context}: ${err && err.stack ? err.stack : err}\n`
    );
  } catch (e) {
    /* nothing further we can do */
  }
}

function commitLogFile(file, message) {
  // Best-effort: if this fails (e.g. a concurrent session holds the git lock, or a
  // commit hook rejects it), the capture append above has already succeeded and is
  // never lost — it just stays uncommitted until the next successful commit picks it
  // up. Failures are logged, never thrown.
  try {
    execFileSync("git", ["add", "--", file], { cwd: REPO_ROOT });
    execFileSync("git", ["commit", "-m", message], { cwd: REPO_ROOT });
  } catch (e) {
    const detail = e && e.stderr && e.stderr.length ? `${e.stack}\n${e.stderr.toString()}` : e;
    logError(detail, "git-commit");
  }
}

function main() {
  let input;
  try {
    input = readStdinJson();
  } catch (e) {
    logError(e, "stdin-parse");
    return;
  }

  const eventName = input.hook_event_name || input.hookEventName;
  const sessionId = input.session_id || input.sessionId;
  const transcriptPath = input.transcript_path || input.transcriptPath;
  if (!sessionId || !transcriptPath) return;

  const nowIso = new Date().toISOString();
  const tail = readTranscriptTail(transcriptPath);

  if (eventName === "UserPromptSubmit") {
    const promptText = typeof input.prompt === "string" ? input.prompt : tail.lastUserText;
    if (!promptText) return;
    const model = tail.lastAssistantModel || DEFAULT_MODEL;
    const file = ensureLogFile(sessionId, nowIso, model);
    const existing = fs.readFileSync(file, "utf8");
    const num = countTagOccurrences(existing, "PROMPT", sessionId) + 1;
    appendEntry(file, {
      type: "PROMPT",
      num,
      sessionId,
      timestamp: nowIso,
      model,
      text: promptText,
    });
    updateFrontmatter(file, { last_prompt_time: nowIso, model });
    commitLogFile(
      file,
      `Capture: PROMPT #${num} (session ${shortId(sessionId)})\n\nCo-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`
    );
    return;
  }

  if (eventName === "Stop") {
    const file = findExistingLogFile(sessionId) || ensureLogFile(sessionId, nowIso, tail.lastAssistantModel);
    if (!tail.lastAssistantText) return;
    const existing = fs.readFileSync(file, "utf8");
    const promptCount = countTagOccurrences(existing, "PROMPT", sessionId);
    const responseCount = countTagOccurrences(existing, "RESPONSE", sessionId);
    const num = responseCount < promptCount ? promptCount : responseCount + 1;
    const timestamp = tail.lastAssistantTimestamp || nowIso;
    const model = tail.lastAssistantModel || DEFAULT_MODEL;
    appendEntry(file, {
      type: "RESPONSE",
      num,
      sessionId,
      timestamp,
      model,
      text: tail.lastAssistantText,
    });
    updateFrontmatter(file, { total_exchanges: num, model });
    commitLogFile(
      file,
      `Capture: RESPONSE #${num} (session ${shortId(sessionId)})\n\nCo-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`
    );
    return;
  }
}

try {
  main();
} catch (e) {
  logError(e, "main");
}
