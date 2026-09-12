// naano's real vertical categories (see llms.txt "By vertical" section --
// these match the actual /for/<slug> pages on the live site). Shared by
// creator profiles (Phase 2) and campaign briefs (Phase 3) so matching.ts
// compares against one consistent vocabulary.
export const VERTICAL_VALUES = [
  "sales-tech",
  "revops",
  "devtools",
  "product",
  "hr-tech",
  "fintech",
  "marketing-ops",
  "vertical-saas",
] as const;

export type Vertical = (typeof VERTICAL_VALUES)[number];

export const VERTICAL_LABELS: Record<Vertical, string> = {
  "sales-tech": "Sales-tech",
  revops: "RevOps",
  devtools: "Devtools",
  product: "Product & PM tools",
  "hr-tech": "HR-tech",
  fintech: "Fintech",
  "marketing-ops": "Martech & marketing-ops",
  "vertical-saas": "Vertical SaaS",
};
