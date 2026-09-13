// Seed v2 (Phase 8): rich demo data so the deployed app looks alive
// immediately -- creators across verticals/tiers/countries, brands with
// active campaigns, and bookings spanning every stage of the pipeline
// (invited, in_progress, submitted, approved, paid, declined), with real
// submission stats and a paid payout.
//
// Named .mjs, not .ts (per the original plan), to match the one seed-adjacent
// script that already exists in this repo (dev-create-test-users.mjs) and
// avoid depending on a TypeScript runner that may not be installed wherever
// this gets run.
//
// Additive only -- never deletes or modifies existing rows. Safe to re-run:
// every insert is guarded by a lookup or a unique-constraint check first, so
// a second run skips everything it already created instead of erroring out
// or duplicating data.
//
// Usage: node --env-file=.env.local scripts/seed-demo.mjs

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Run with: node --env-file=.env.local scripts/seed-demo.mjs",
  );
  process.exit(1);
}

const PASSWORD = "SeedDemo123!";

const CREATORS = [
  {
    key: "priya",
    email: "priya.sharma@naano-demo.test",
    display_name: "Priya Sharma",
    linkedin_url: "https://www.linkedin.com/in/priyasharma-dev",
    country: "India",
    verticals: ["devtools", "product"],
    follower_tier: "micro",
    price_per_post: 35,
    bio: "DevRel lead turned independent creator. I write about API design, SDKs, and what actually gets developers to adopt a tool.",
  },
  {
    key: "marcus",
    email: "marcus.chen@naano-demo.test",
    display_name: "Marcus Chen",
    linkedin_url: "https://www.linkedin.com/in/marcuschen-fintech",
    country: "Singapore",
    verticals: ["fintech"],
    follower_tier: "mid",
    price_per_post: 85,
    bio: "Ex-fintech operator covering payments infra, embedded finance, and compliance for a B2B audience across APAC.",
  },
  {
    key: "sofia",
    email: "sofia.rossi@naano-demo.test",
    display_name: "Sofia Rossi",
    linkedin_url: "https://www.linkedin.com/in/sofiarossi-mktg",
    country: "Italy",
    verticals: ["marketing-ops"],
    follower_tier: "nano",
    price_per_post: 22,
    bio: "Marketing ops consultant sharing lifecycle and attribution breakdowns for early-stage B2B teams.",
  },
  {
    key: "jamal",
    email: "jamal.carter@naano-demo.test",
    display_name: "Jamal Carter",
    linkedin_url: "https://www.linkedin.com/in/jamalcarter-sales",
    country: "United States",
    verticals: ["sales-tech", "revops"],
    follower_tier: "macro",
    price_per_post: 160,
    bio: "20-year sales leader now writing daily about pipeline discipline, RevOps tooling, and quota math.",
  },
  {
    key: "lena",
    email: "lena.fischer@naano-demo.test",
    display_name: "Lena Fischer",
    linkedin_url: "https://www.linkedin.com/in/lenafischer-hr",
    country: "Germany",
    verticals: ["hr-tech"],
    follower_tier: "micro",
    price_per_post: 40,
    bio: "People-ops leader writing about HR tech buying committees and what actually gets a tool past procurement.",
  },
  {
    key: "diego",
    email: "diego.torres@naano-demo.test",
    display_name: "Diego Torres",
    linkedin_url: "https://www.linkedin.com/in/diegotorres-saas",
    country: "Mexico",
    verticals: ["vertical-saas"],
    follower_tier: "mid",
    price_per_post: 70,
    bio: "Vertical SaaS operator (ex-Head of Growth) breaking down niche-market GTM for LinkedIn's B2B crowd.",
  },
  {
    key: "amara",
    email: "amara.okafor@naano-demo.test",
    display_name: "Amara Okafor",
    linkedin_url: "https://www.linkedin.com/in/amaraokafor-pm",
    country: "Nigeria",
    verticals: ["product"],
    follower_tier: "nano",
    price_per_post: 25,
    bio: "Product manager writing short, practical breakdowns of PM tooling and roadmap tradeoffs.",
  },
  {
    key: "yuki",
    email: "yuki.tanaka@naano-demo.test",
    display_name: "Yuki Tanaka",
    linkedin_url: "https://www.linkedin.com/in/yukitanaka-eng",
    country: "Japan",
    verticals: ["devtools", "product"],
    follower_tier: "macro",
    price_per_post: 130,
    bio: "Engineering director and one of the largest devtools voices on LinkedIn in APAC. Reviews developer platforms in public.",
  },
];

const BRANDS = [
  {
    key: "northwind",
    email: "brand.northwind@naano-demo.test",
    company_name: "Northwind Analytics",
    website: "https://northwind-analytics.example.com",
    industry: "Developer tools",
    bio: "Northwind builds observability tooling for platform teams. We brief creators who can speak credibly to engineers, not just marketers.",
  },
  {
    key: "ledgerly",
    email: "brand.ledgerly@naano-demo.test",
    company_name: "Ledgerly",
    website: "https://ledgerly.example.com",
    industry: "Fintech",
    bio: "Ledgerly is embedded accounting infrastructure for vertical SaaS platforms. We work with operators who understand B2B fintech buying cycles.",
  },
  {
    key: "talently",
    email: "brand.talently@naano-demo.test",
    company_name: "Talently",
    website: "https://talently.example.com",
    industry: "HR tech",
    bio: "Talently is an ATS built for high-volume hiring teams. We're looking for people-ops voices our buyers already trust.",
  },
];

const CAMPAIGNS = [
  {
    key: "northwind-devadvocacy",
    brandKey: "northwind",
    title: "Developer Advocacy Push",
    description:
      "Looking for hands-on devtools/product creators to walk their audience through real usage of our observability SDK -- not a sponsored-post placement, an actual workflow post.",
    verticals: ["devtools", "product"],
    target_follower_tier: "micro",
    budget_min: 30,
    budget_max: 60,
  },
  {
    key: "northwind-awareness",
    brandKey: "northwind",
    title: "DevTools Awareness Q2",
    description:
      "Top-of-funnel awareness push ahead of our Q2 launch. Prioritizing reach over deep technical review for this one.",
    verticals: ["devtools"],
    target_follower_tier: "macro",
    budget_min: 100,
    budget_max: 180,
  },
  {
    key: "ledgerly-thought-leadership",
    brandKey: "ledgerly",
    title: "Fintech Thought Leadership",
    description:
      "Brief is intentionally loose: share your own take on embedded finance, referencing Ledgerly as one example among others. Needs to read as your opinion, not an ad.",
    verticals: ["fintech"],
    target_follower_tier: "mid",
    budget_min: 60,
    budget_max: 120,
  },
  {
    key: "talently-launch",
    brandKey: "talently",
    title: "HR Tech Launch Campaign",
    description:
      "Launching our new high-volume hiring workflow. Looking for people-ops creators who can speak to the actual pain of screening at scale.",
    verticals: ["hr-tech"],
    target_follower_tier: "micro",
    budget_min: 25,
    budget_max: 50,
  },
];

// status drives which of submissions/payouts get attached below.
const BOOKINGS = [
  { creatorKey: "amara", campaignKey: "northwind-devadvocacy", status: "invited" },
  { creatorKey: "jamal", campaignKey: "northwind-awareness", status: "invited" },
  { creatorKey: "diego", campaignKey: "ledgerly-thought-leadership", status: "in_progress" },
  {
    creatorKey: "priya",
    campaignKey: "northwind-devadvocacy",
    status: "submitted",
    submission: {
      post_url: "https://www.linkedin.com/posts/priyasharma-dev_devtools-observability-activity-7123456789",
      impressions: 8400,
      clicks: 210,
      leads: 14,
    },
  },
  {
    creatorKey: "lena",
    campaignKey: "talently-launch",
    status: "submitted",
    submission: {
      post_url: "https://www.linkedin.com/posts/lenafischer-hr_hrtech-hiring-activity-7123456790",
      impressions: 6200,
      clicks: 140,
      leads: 9,
    },
  },
  {
    creatorKey: "yuki",
    campaignKey: "northwind-awareness",
    status: "approved",
    submission: {
      post_url: "https://www.linkedin.com/posts/yukitanaka-eng_devtools-launch-activity-7123456791",
      impressions: 42000,
      clicks: 980,
      leads: 61,
    },
    payout: { status: "pending" },
  },
  { creatorKey: "sofia", campaignKey: "talently-launch", status: "declined" },
  {
    creatorKey: "marcus",
    campaignKey: "ledgerly-thought-leadership",
    status: "paid",
    submission: {
      post_url: "https://www.linkedin.com/posts/marcuschen-fintech_embeddedfinance-activity-7123456792",
      impressions: 19500,
      clicks: 410,
      leads: 27,
    },
    payout: { status: "paid", paid_at: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString() },
  },
];

async function findAuthUserByEmail(email) {
  // perPage: 200 covers this script's ~11 users in one page -- fine for a
  // one-time demo seed, not meant to scale to a real user base.
  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (error) throw error;
  return data.users.find((u) => u.email === email) ?? null;
}

async function ensureAuthUserAndProfile(email, role) {
  const { data: created, error } = await supabase.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { role },
  });

  let userId;
  if (error) {
    if (!/already.*registered/i.test(error.message)) throw error;
    const existing = await findAuthUserByEmail(email);
    if (!existing) throw error;
    userId = existing.id;
  } else {
    userId = created.user.id;
  }

  // admin.createUser() never runs the app's ensureProfile() Server Action
  // path (src/lib/auth/bootstrap.ts), so the profiles row -- which every FK
  // below depends on -- has to be created here explicitly.
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({ id: userId, role }, { onConflict: "id" });
  if (profileError) throw profileError;

  return userId;
}

async function seedCreator(spec) {
  const { data: existing } = await supabase
    .from("creator_profiles")
    .select("user_id")
    .eq("display_name", spec.display_name)
    .maybeSingle();

  if (existing) {
    console.log(`  ${spec.display_name}: already seeded`);
    return existing.user_id;
  }

  const userId = await ensureAuthUserAndProfile(spec.email, "creator");

  const { error } = await supabase.from("creator_profiles").insert({
    user_id: userId,
    display_name: spec.display_name,
    linkedin_url: spec.linkedin_url,
    country: spec.country,
    verticals: spec.verticals,
    follower_tier: spec.follower_tier,
    price_per_post: spec.price_per_post,
    bio: spec.bio,
  });
  if (error) throw error;

  console.log(`  ${spec.display_name}: created`);
  return userId;
}

async function seedBrand(spec) {
  const { data: existing } = await supabase
    .from("brand_profiles")
    .select("user_id")
    .eq("company_name", spec.company_name)
    .maybeSingle();

  if (existing) {
    console.log(`  ${spec.company_name}: already seeded`);
    return existing.user_id;
  }

  const userId = await ensureAuthUserAndProfile(spec.email, "brand");

  const { error } = await supabase.from("brand_profiles").insert({
    user_id: userId,
    company_name: spec.company_name,
    website: spec.website,
    industry: spec.industry,
    bio: spec.bio,
  });
  if (error) throw error;

  console.log(`  ${spec.company_name}: created`);
  return userId;
}

async function seedCampaign(spec, brandId) {
  const { data: existing } = await supabase
    .from("campaigns")
    .select("id")
    .eq("brand_id", brandId)
    .eq("title", spec.title)
    .maybeSingle();

  if (existing) {
    console.log(`  ${spec.title}: already seeded`);
    return existing.id;
  }

  const { data: created, error } = await supabase
    .from("campaigns")
    .insert({
      brand_id: brandId,
      title: spec.title,
      description: spec.description,
      verticals: spec.verticals,
      target_follower_tier: spec.target_follower_tier,
      budget_min: spec.budget_min,
      budget_max: spec.budget_max,
      status: "active",
    })
    .select("id")
    .single();
  if (error) throw error;

  console.log(`  ${spec.title}: created`);
  return created.id;
}

async function seedBooking(spec, campaignId, creatorId, agreedPrice) {
  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      campaign_id: campaignId,
      creator_id: creatorId,
      status: spec.status,
      agreed_price: agreedPrice,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      console.log(`  ${spec.creatorKey} -> ${spec.campaignKey}: already seeded`);
      const { data: existing } = await supabase
        .from("bookings")
        .select("id")
        .eq("campaign_id", campaignId)
        .eq("creator_id", creatorId)
        .single();
      return existing?.id ?? null;
    }
    throw error;
  }

  console.log(`  ${spec.creatorKey} -> ${spec.campaignKey}: created (${spec.status})`);
  return booking.id;
}

async function seedSubmission(bookingId, submission) {
  if (!bookingId || !submission) return;
  const { error } = await supabase.from("submissions").insert({ booking_id: bookingId, ...submission });
  if (error && error.code !== "23505") throw error;
}

async function seedPayout(bookingId, payout) {
  if (!bookingId || !payout) return;
  // amount is never set here -- payouts_set_amount (0004) derives it from
  // the booking's agreed_price at insert time, same as the real approve flow.
  const { error } = await supabase.from("payouts").insert({ booking_id: bookingId, ...payout });
  if (error && error.code !== "23505") throw error;
}

async function main() {
  console.log("Seeding creators...");
  const creatorIds = {};
  for (const spec of CREATORS) {
    creatorIds[spec.key] = await seedCreator(spec);
  }

  console.log("\nSeeding brands...");
  const brandIds = {};
  for (const spec of BRANDS) {
    brandIds[spec.key] = await seedBrand(spec);
  }

  console.log("\nSeeding campaigns...");
  const campaignIds = {};
  for (const spec of CAMPAIGNS) {
    campaignIds[spec.key] = await seedCampaign(spec, brandIds[spec.brandKey]);
  }

  console.log("\nSeeding bookings, submissions, and payouts...");
  for (const spec of BOOKINGS) {
    const creator = CREATORS.find((c) => c.key === spec.creatorKey);
    const bookingId = await seedBooking(
      spec,
      campaignIds[spec.campaignKey],
      creatorIds[spec.creatorKey],
      creator.price_per_post,
    );
    await seedSubmission(bookingId, spec.submission);
    await seedPayout(bookingId, spec.payout);
  }

  console.log(
    `\nDone. ${CREATORS.length} creators, ${BRANDS.length} brands, ${CAMPAIGNS.length} campaigns, ` +
      `${BOOKINGS.length} bookings. All seed accounts use the password: ${PASSWORD}`,
  );
}

main().catch((err) => {
  console.error("\nSeed failed:", err);
  process.exit(1);
});
