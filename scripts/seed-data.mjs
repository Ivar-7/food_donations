import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { demoAccounts, seedAccounts } from "./seed-accounts.mjs";

const require = createRequire(import.meta.url);
const { Client } = require("firebase-tools/lib/apiv2.js");
const { getProjectDefaultAccount } = require("firebase-tools/lib/auth.js");
const { requireAuth } = require("firebase-tools/lib/requireAuth.js");

const args = new Set(process.argv.slice(2));
const emulator = args.has("--emulator");
const dryRun = args.has("--dry-run");
const projectIndex = process.argv.indexOf("--project");
const projectId =
  (projectIndex >= 0 ? process.argv[projectIndex + 1] : undefined) ??
  JSON.parse(await readFile(new URL("../.firebaserc", import.meta.url), "utf8"))
    .projects.default;

if (!/^[a-z][a-z0-9-]{4,29}$/.test(projectId))
  throw new Error("Provide a valid Firebase project ID.");

const image = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;

// Photo IDs come from free Unsplash photo pages. Keep these direct CDN URLs
// with their matching subjects so presentation listings show relevant images.
const donationSamples = [
  {
    id: "seed-vegetable-crates",
    title: "Assorted vegetable crates",
    category: "Food",
    quantity: "4 crates",
    location: "Westlands, Nairobi",
    description:
      "Four crates of fresh sukuma wiki, carrots and tomatoes from our morning market delivery. Sorted and ready for collection between 2 pm and 5 pm. Please bring reusable bags; best used within two days.",
    imageUrl: image("1635341083777-5f93a755e916"),
  },
  {
    id: "seed-bakery-bread",
    title: "Fresh bakery loaves",
    category: "Food",
    quantity: "18 loaves",
    location: "Kilimani, Nairobi",
    description:
      "Eighteen freshly baked wholemeal loaves, individually wrapped this morning. Contains wheat. Available for a community kitchen or shelter to collect before 6 pm today.",
    imageUrl: image("1509440159596-0249088772ff"),
  },
  {
    id: "seed-fruit-baskets",
    title: "Mixed fruit baskets",
    category: "Food",
    quantity: "6 baskets",
    location: "Parklands, Nairobi",
    description:
      "Six baskets of bananas, oranges and mangoes for school snacks or shared meals. Washed and packed for transport. Collection from our Parklands shop between 10 am and 4 pm.",
    imageUrl: image("1619566636858-adf3ef46400b"),
  },
  {
    id: "seed-canned-goods",
    title: "Canned pantry goods",
    category: "Food",
    quantity: "24 cans",
    location: "Lavington, Nairobi",
    description:
      "Twenty-four sealed cans of beans and tomatoes with at least six months before their best-before dates. Packed in two boxes, ready for a neighborhood pantry to collect on weekdays.",
    imageUrl: image("1738618140037-09e11c8e644a"),
  },
  {
    id: "seed-clean-towels",
    title: "Clean bath towels",
    category: "Essentials",
    quantity: "12 towels",
    location: "South B, Nairobi",
    description:
      "Twelve freshly laundered cotton bath towels in good condition, folded and packed. Suitable for a family shelter. Collection from South B by arrangement, Monday to Saturday.",
    imageUrl: image("1523471826770-c437b4636fe6"),
  },
  {
    id: "seed-toiletries",
    title: "Personal care supplies",
    category: "Essentials",
    quantity: "2 cartons",
    location: "Ngara, Nairobi",
    description:
      "Two sealed cartons containing soap, toothpaste and toothbrushes. All items are unopened and within expiry. Ideal for making welcome kits; collect from our Ngara store during working hours.",
    imageUrl: image("1603990103103-baf3ada7af1c"),
  },
];

const organizationOwnerId = "okoa-demo-kitchen";
const organizationSamples = [
  {
    id: "seed-community-table-kitchen",
    name: "Community Table Kitchen",
    type: "NGO",
    location: "Westlands, Nairobi",
    description:
      "Our volunteers prepare weekday lunches for 80 neighbors and connect surplus produce with families in Westlands. We welcome fresh vegetables, bread and pantry staples for our shared kitchen.",
    imageUrl: image("1599059813005-11265ba4b4ce"),
    ownerUserId: organizationOwnerId,
  },
  {
    id: "seed-family-shelter",
    name: "Family Shelter Network",
    type: "Shelter",
    location: "South B, Nairobi",
    description:
      "We provide temporary accommodation and daily meals for families in South B. Donations of bedding, clean towels and unopened toiletries help us welcome new arrivals with care.",
    imageUrl: image("1560220604-1985ebfe28b1"),
    ownerUserId: "okoa-demo-shelter",
  },
  {
    id: "seed-neighborhood-pantry",
    name: "Neighborhood Pantry Network",
    type: "NGO",
    location: "Ngara, Nairobi",
    description:
      "A volunteer-run Ngara pantry sharing weekly food parcels and school supplies with local families. We collect shelf-stable food, sort donations and distribute essentials every Saturday.",
    imageUrl: image("1593113646773-028c64a8f1b8"),
    ownerUserId: "okoa-demo-pantry",
  },
];

const sponsorshipSamples = [
  {
    id: "seed-rice-packs",
    organizationId: "seed-community-table-kitchen",
    organizationName: "Community Table Kitchen",
    ownerUserId: organizationOwnerId,
    title: "Rice for community meals",
    description:
      "Help us stock 30 five-kilogram bags of rice for our weekday lunch program. Sealed bags are welcome. Drop off at our Westlands kitchen Monday to Friday, 9 am–3 pm; coordinate with the kitchen team on arrival.",
    imageUrl: image("1536304993881-ff6e9eefa2a6"),
    unit: "bags",
    targetQuantity: 30,
  },
  {
    id: "seed-blankets",
    organizationId: "seed-family-shelter",
    organizationName: "Family Shelter Network",
    ownerUserId: "okoa-demo-shelter",
    title: "Blankets for families",
    description:
      "We need 24 clean, warm single-bed blankets for families arriving at our South B shelter. New or gently used blankets are welcome. Please wash and pack used items; drop off on weekdays between 10 am and 4 pm.",
    imageUrl: image("1734553529922-bc020a21643b"),
    unit: "blankets",
    targetQuantity: 24,
  },
  {
    id: "seed-hygiene-kits",
    organizationId: "seed-family-shelter",
    organizationName: "Family Shelter Network",
    ownerUserId: "okoa-demo-shelter",
    title: "Personal care kits",
    description:
      "Each welcome kit needs a bar of soap, toothpaste and a toothbrush. We are preparing 40 kits for shelter guests. Please pledge complete kits with unopened items and drop off at our South B reception during working hours.",
    imageUrl: image("1631390179406-0bfe17e9f89d"),
    unit: "kits",
    targetQuantity: 40,
  },
  {
    id: "seed-school-notebooks",
    organizationId: "seed-neighborhood-pantry",
    organizationName: "Neighborhood Pantry Network",
    ownerUserId: "okoa-demo-pantry",
    title: "Notebooks for learners",
    description:
      "Help 30 primary-school learners start the term with two exercise books each. We need 60 new A5 ruled notebooks. Our Ngara pantry receives school supplies on Saturdays, 9 am–1 pm.",
    imageUrl: image("1531346878377-a5be20888e57"),
    unit: "notebooks",
    targetQuantity: 60,
  },
];

if (!emulator) {
  const account = getProjectDefaultAccount(process.cwd());
  if (!account)
    throw new Error("Log in with `npx firebase login` before seeding.");
  await requireAuth({ project: projectId, ...account });
}

const client = new Client({
  urlPrefix: emulator
    ? "http://127.0.0.1:8080/v1"
    : "https://firestore.googleapis.com/v1",
  auth: !emulator,
});
const authClient = new Client({
  urlPrefix: emulator
    ? "http://127.0.0.1:9299/identitytoolkit.googleapis.com/v1"
    : "https://identitytoolkit.googleapis.com/v1",
  auth: !emulator,
});
await seedAccounts({
  authClient,
  projectId,
  dryRun,
  resetPasswords: args.has("--reset-passwords"),
  emulator,
});
const documentsPath = `/projects/${projectId}/databases/(default)/documents`;
const adminOptions = () =>
  emulator ? { headers: { Authorization: "Bearer owner" } } : {};
let created = 0;
let skipped = 0;
let upgraded = 0;

async function requestWithRetry(action) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      return await action();
    } catch (cause) {
      if (cause.status !== 500 || attempt === 3) throw cause;
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }
}

async function seedCollection(collectionName, samples, fieldsForSample) {
  const collectionPath = `${documentsPath}/${collectionName}`;
  for (const [index, sample] of samples.entries()) {
    const documentPath = `${collectionPath}/${sample.id}`;
    let legacy = false;
    let existing;
    try {
      existing = (
        await requestWithRetry(() => client.get(documentPath, adminOptions()))
      ).body.fields;
      legacy =
        existing.donorId?.stringValue === "foodbridge-seed-donor" ||
        existing.ownerUserId?.stringValue === "foodbridge-seed-organization";
      if (!legacy) {
        skipped += 1;
        continue;
      }
    } catch (cause) {
      if (cause.status !== 404) throw cause;
    }

    if (dryRun) {
      console.log(
        `Would ${legacy ? "upgrade" : "create"} ${collectionName}/${sample.id}`,
      );
      continue;
    }

    const { id, ...details } = sample;
    const data = {
      ...details,
      ...fieldsForSample(sample),
      createdAt: sample.createdAt ?? Date.now() - index * 60 * 60 * 1000,
    };
    const fields = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        value === null
          ? { nullValue: null }
          : typeof value === "number"
            ? { integerValue: String(value) }
            : { stringValue: value },
      ]),
    );
    try {
      if (legacy) {
        // Preserve handoff and pledge progress if the older records were used.
        for (const key of ["status", "orderId", "pledgedQuantity", "createdAt"])
          if (existing[key]) fields[key] = existing[key];
        await requestWithRetry(() =>
          client.patch(documentPath, { fields }, adminOptions()),
        );
      } else
        await requestWithRetry(() =>
          client.post(
            `${collectionPath}?documentId=${id}`,
            { fields },
            adminOptions(),
          ),
        );
    } catch (cause) {
      if (cause.status === 409) {
        skipped += 1;
        continue;
      }
      throw cause;
    }
    if (legacy) upgraded += 1;
    else created += 1;
    console.log(`${legacy ? "Upgraded" : "Created"} ${collectionName}/${id}`);
  }
}

await seedCollection(
  "users",
  demoAccounts.map(({ id, email, username, organizationId }) => ({
    id,
    email,
    username,
    ...(organizationId ? { organizationId } : {}),
  })),
  () => ({ role: "user" }),
);
await seedCollection("donations", donationSamples, () => ({
  status: "available",
  donorId: "okoa-demo-donor",
  donorName: "Amina’s Community Market",
}));
await seedCollection("organizations", organizationSamples, () => ({}));
await seedCollection("sponsorships", sponsorshipSamples, () => ({
  pledgedQuantity: 0,
  status: "open",
}));

const handoffs = [
  {
    id: "seed-pantry-maize",
    title: "Maize flour for family parcels",
    quantity: "10 bags",
    status: "requested",
    imageUrl: image("1536304993881-ff6e9eefa2a6"),
  },
  {
    id: "seed-kitchen-lunch",
    title: "Fresh produce for the lunch kitchen",
    quantity: "3 crates",
    status: "pickup",
    imageUrl: image("1635341083777-5f93a755e916"),
  },
  {
    id: "seed-shared-bread",
    title: "Bread for our breakfast table",
    quantity: "20 loaves",
    status: "received",
    imageUrl: image("1509440159596-0249088772ff"),
  },
];
await seedCollection("donations", handoffs, (item) => ({
  category: "Food",
  location: "Westlands, Nairobi",
  description:
    "Packed and shared with the Community Table Kitchen team for neighborhood meals.",
  donorId: "okoa-demo-donor",
  donorName: "Amina’s Community Market",
  orderId: item.id,
}));
await seedCollection(
  "orders",
  handoffs.map(({ id, title, status }, index) => ({
    id,
    donationId: id,
    donationTitle: title,
    status,
    donorId: "okoa-demo-donor",
    organizationId: "seed-community-table-kitchen",
    organizationName: "Community Table Kitchen",
    requestedBy: "okoa-demo-kitchen",
    pickupCode: String(482610 + index),
    updatedAt: Date.now(),
  })),
  () => ({}),
);
await seedCollection(
  "notifications",
  [
    {
      id: "seed-donor-request",
      recipientId: "okoa-demo-donor",
      actorId: "okoa-demo-kitchen",
      type: "order_requested",
      sourceId: "seed-pantry-maize",
    },
    {
      id: "seed-kitchen-pickup",
      recipientId: "okoa-demo-kitchen",
      actorId: "okoa-demo-donor",
      type: "order_pickup",
      sourceId: "seed-kitchen-lunch",
    },
    {
      id: "seed-donor-received",
      recipientId: "okoa-demo-donor",
      actorId: "okoa-demo-kitchen",
      type: "order_received",
      sourceId: "seed-shared-bread",
    },
  ],
  () => ({ readAt: null }),
);
// Use the actual pledge transaction to keep quantities, pledges and notifications consistent.
// Presentation needs start empty so the supporter can demonstrate a first pledge.

console.log(
  `${dryRun ? "Dry run complete" : "Seed complete"}: ${created} created, ${upgraded} upgraded, ${skipped} already present in ${projectId}${emulator ? " emulator" : ""}.`,
);
