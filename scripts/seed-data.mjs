import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";

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
// with their matching subjects so sample listings always show relevant images.
const donationSamples = [
  {
    id: "seed-vegetable-crates",
    title: "Assorted vegetable crates",
    category: "Food",
    quantity: "4 crates",
    location: "Westlands, Nairobi",
    description:
      "Sample listing: assorted fresh vegetables in four crates, shown here to demonstrate a community pickup.",
    imageUrl: image("1635341083777-5f93a755e916"),
  },
  {
    id: "seed-bakery-bread",
    title: "Fresh bakery loaves",
    category: "Food",
    quantity: "18 loaves",
    location: "Kilimani, Nairobi",
    description:
      "Sample listing: freshly baked bread loaves, shown here as an example of a same-day food donation.",
    imageUrl: image("1509440159596-0249088772ff"),
  },
  {
    id: "seed-fruit-baskets",
    title: "Mixed fruit baskets",
    category: "Food",
    quantity: "6 baskets",
    location: "Parklands, Nairobi",
    description:
      "Sample listing: mixed seasonal fruit baskets, shown here to illustrate a ready-to-share produce listing.",
    imageUrl: image("1619566636858-adf3ef46400b"),
  },
  {
    id: "seed-canned-goods",
    title: "Canned pantry goods",
    category: "Food",
    quantity: "24 cans",
    location: "Lavington, Nairobi",
    description:
      "Sample listing: assorted unopened canned foods, shown here as an example of shelf-stable pantry support.",
    imageUrl: image("1738618140037-09e11c8e644a"),
  },
  {
    id: "seed-clean-towels",
    title: "Clean bath towels",
    category: "Essentials",
    quantity: "12 towels",
    location: "South B, Nairobi",
    description:
      "Sample listing: clean bath towels, shown here to demonstrate an essentials donation for a shelter.",
    imageUrl: image("1523471826770-c437b4636fe6"),
  },
  {
    id: "seed-toiletries",
    title: "Personal care supplies",
    category: "Essentials",
    quantity: "2 cartons",
    location: "Ngara, Nairobi",
    description:
      "Sample listing: assorted personal care products, shown here to demonstrate a useful essentials donation.",
    imageUrl: image("1603990103103-baf3ada7af1c"),
  },
];

const organizationOwnerId = "foodbridge-seed-organization";
const organizationSamples = [
  {
    id: "seed-community-table-kitchen",
    name: "Community Table Kitchen",
    type: "NGO",
    location: "Westlands, Nairobi",
    description:
      "Sample partner: volunteers prepare shared meals and coordinate surplus food for neighborhood distribution.",
    imageUrl: image("1599059813005-11265ba4b4ce"),
    ownerUserId: organizationOwnerId,
  },
  {
    id: "seed-family-shelter",
    name: "Family Shelter Network",
    type: "Shelter",
    location: "South B, Nairobi",
    description:
      "Sample partner: a shelter example showing how donated meals, towels, and daily essentials could support families.",
    imageUrl: image("1560220604-1985ebfe28b1"),
    ownerUserId: organizationOwnerId,
  },
  {
    id: "seed-neighborhood-pantry",
    name: "Neighborhood Pantry Network",
    type: "NGO",
    location: "Ngara, Nairobi",
    description:
      "Sample partner: a community pantry example for sorting food donations and connecting neighbors with staples.",
    imageUrl: image("1593113646773-028c64a8f1b8"),
    ownerUserId: organizationOwnerId,
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
      "Sample need: rice packs would help a community kitchen prepare regular shared meals for neighbors.",
    imageUrl: image("1536304993881-ff6e9eefa2a6"),
    unit: "bags",
    targetQuantity: 30,
  },
  {
    id: "seed-blankets",
    organizationId: "seed-family-shelter",
    organizationName: "Family Shelter Network",
    ownerUserId: organizationOwnerId,
    title: "Blankets for families",
    description:
      "Sample need: clean blankets would help a family shelter keep a ready supply for new arrivals.",
    imageUrl: image("1734553529922-bc020a21643b"),
    unit: "blankets",
    targetQuantity: 24,
  },
  {
    id: "seed-hygiene-kits",
    organizationId: "seed-family-shelter",
    organizationName: "Family Shelter Network",
    ownerUserId: organizationOwnerId,
    title: "Personal care kits",
    description:
      "Sample need: unopened personal care items would make useful welcome kits for shelter guests.",
    imageUrl: image("1631390179406-0bfe17e9f89d"),
    unit: "kits",
    targetQuantity: 40,
  },
  {
    id: "seed-school-notebooks",
    organizationId: "seed-neighborhood-pantry",
    organizationName: "Neighborhood Pantry Network",
    ownerUserId: organizationOwnerId,
    title: "Notebooks for learners",
    description:
      "Sample need: new notebooks would support children whose families visit the community pantry.",
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
const documentsPath = `/projects/${projectId}/databases/(default)/documents`;
let created = 0;
let skipped = 0;

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
    try {
      await requestWithRetry(() => client.get(documentPath));
      skipped += 1;
      continue;
    } catch (cause) {
      if (cause.status !== 404) throw cause;
    }

    if (dryRun) {
      console.log(`Would create ${collectionName}/${sample.id}`);
      continue;
    }

    const { id, ...details } = sample;
    const data = {
      ...details,
      ...fieldsForSample(sample),
      createdAt: Date.now() - index * 60 * 60 * 1000,
    };
    const fields = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        typeof value === "number"
          ? { integerValue: String(value) }
          : { stringValue: value },
      ]),
    );
    try {
      await requestWithRetry(() =>
        client.post(`${collectionPath}?documentId=${id}`, { fields }),
      );
    } catch (cause) {
      if (cause.status === 409) {
        skipped += 1;
        continue;
      }
      throw cause;
    }
    created += 1;
    console.log(`Created ${collectionName}/${id}`);
  }
}

await seedCollection("donations", donationSamples, () => ({
  status: "available",
  donorId: "foodbridge-seed-donor",
  donorName: "Okoa Food sample",
}));
await seedCollection("organizations", organizationSamples, () => ({}));
await seedCollection("sponsorships", sponsorshipSamples, () => ({
  pledgedQuantity: 0,
  status: "open",
}));

console.log(
  `${dryRun ? "Dry run complete" : "Seed complete"}: ${created} created, ${skipped} already present in ${projectId}${emulator ? " emulator" : ""}.`,
);
