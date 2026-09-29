import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createServer } from "vite";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { deleteApp } from "firebase/app";
import { terminate, setLogLevel } from "firebase/firestore";

// Always exercise the actual application APIs against local emulators.
process.env.VITE_USE_FIREBASE_EMULATORS = "true";
const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
});
const { auth, db, firebaseApp } = await server.ssrLoadModule(
  "/src/shared/firebase/client.ts",
);
assert.ok(auth && db && firebaseApp);
const credentials = JSON.parse(
  await readFile("seed-credentials-react-abcederian-emulator.local", "utf8"),
);
setLogLevel("silent");
async function login(id) {
  const account = credentials[id];
  assert.ok(account, "Run npm run seed -- --emulator first.");
  await signInWithEmailAndPassword(auth, account.email, account.password);
}
try {
  const donations = await server.ssrLoadModule(
    "/src/features/donations/api/donations.api.ts",
  );
  const orders = await server.ssrLoadModule(
    "/src/features/orders/api/orders.api.ts",
  );
  const needs = await server.ssrLoadModule(
    "/src/features/sponsorships/api/sponsorships.api.ts",
  );
  const feedback = await server.ssrLoadModule(
    "/src/features/feedback/api/feedback.api.ts",
  );
  const schema = await server.ssrLoadModule(
    "/src/features/feedback/feedback.schema.ts",
  );
  const available = await donations.getAvailableDonations();
  assert.ok(available.length >= 6);
  assert.ok(
    available.every((item) => !item.description.includes("Sample listing")),
  );
  await login("okoa-demo-donor");
  const donationId = await donations.createDonation(
    {
      title: "Community breakfast bread",
      category: "Food",
      quantity: "12 loaves",
      location: "Westlands",
      description:
        "Wrapped wholemeal loaves available for the community kitchen.",
    },
    "okoa-demo-donor",
    "Amina’s Community Market",
  );
  await login("okoa-demo-kitchen");
  const orderId = await orders.requestDonation(
    donationId,
    "okoa-demo-kitchen",
    "seed-community-table-kitchen",
  );
  assert.equal((await donations.getDonation(donationId)).status, "requested");
  await assert.rejects(() =>
    orders.requestDonation(
      donationId,
      "okoa-demo-kitchen",
      "seed-community-table-kitchen",
    ),
  );
  await assert.rejects(() => orders.markHandoff(orderId, "okoa-demo-kitchen"));
  await login("okoa-demo-donor");
  await orders.markHandoff(orderId, "okoa-demo-donor");
  assert.equal((await orders.getOrder(orderId)).status, "pickup");
  await login("okoa-demo-kitchen");
  await orders.confirmReceipt(orderId, "okoa-demo-kitchen");
  assert.equal((await donations.getDonation(donationId)).status, "received");
  const needId = await needs.createSponsorship({
    organizationId: "seed-community-table-kitchen",
    ownerUserId: "okoa-demo-kitchen",
    title: "Rice for weekday lunches",
    description: "Three sealed bags of rice for our weekday community lunches.",
    unit: "bags",
    targetQuantity: 3,
  });
  await login("okoa-demo-supporter");
  await needs.pledgeToSponsorship(needId, "okoa-demo-supporter", 3);
  assert.equal((await needs.getSponsorship(needId)).status, "fulfilled");
  assert.equal(
    (await needs.getMyPledge(needId, "okoa-demo-supporter")).quantity,
    3,
  );
  await assert.rejects(() =>
    needs.pledgeToSponsorship(needId, "okoa-demo-supporter", 1),
  );
  const input = {
    category: "Suggestion",
    rating: 5,
    message: "The community needs registration steps are easy to follow.",
  };
  assert.equal(schema.validateFeedback(input), null);
  assert.ok(schema.validateFeedback({ ...input, rating: 0 }));
  await assert.rejects(() =>
    feedback.submitFeedback("okoa-demo-supporter", {
      ...input,
      message: "short",
    }),
  );
  await feedback.submitFeedback("okoa-demo-supporter", input);
  assert.ok(
    (await feedback.getMyFeedback("okoa-demo-supporter")).some(
      (item) => item.message === input.message,
    ),
  );
  await assert.rejects(
    () => feedback.getMyFeedback("okoa-demo-kitchen"),
    (error) => error.code === "permission-denied",
  );
  await assert.rejects(
    () => feedback.submitFeedback("okoa-demo-kitchen", input),
    (error) => error.code === "permission-denied",
  );
  await signOut(auth);
  await assert.rejects(
    () => feedback.submitFeedback("okoa-demo-supporter", input),
    (error) => error.code === "permission-denied",
  );
  console.log(
    "Presentation APIs passed: seeded accounts, real request and handoff, duplicate prevention, organization needs, pledge fulfillment, feedback validation and privacy.",
  );
} finally {
  await terminate(db);
  await deleteApp(firebaseApp);
  await server.close();
}
