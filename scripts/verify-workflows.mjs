import assert from "node:assert/strict";
import { deleteApp, initializeApp } from "firebase/app";
import {
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getAuth,
} from "firebase/auth";
import {
  collection,
  connectFirestoreEmulator,
  deleteDoc,
  deleteField,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  runTransaction,
  setDoc,
  setLogLevel,
  terminate,
  updateDoc,
  where,
} from "firebase/firestore";

const projectId = "react-abcederian";
setLogLevel("silent");
const suffix = Date.now();
async function account(label) {
  const app = initializeApp({ apiKey: "demo-key", projectId }, label);
  const auth = getAuth(app);
  connectAuthEmulator(auth, "http://127.0.0.1:9299", { disableWarnings: true });
  const db = getFirestore(app);
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  const user = (
    await createUserWithEmailAndPassword(
      auth,
      `${label}-${suffix}@example.test`,
      "Passw0rd!",
    )
  ).user;
  await setDoc(doc(db, "users", user.uid), {
    username: label,
    email: user.email,
    role: "user",
    createdAt: Date.now(),
  });
  return { app, user, db };
}
async function denied(label, action) {
  await assert.rejects(
    action,
    (error) => error?.code === "permission-denied",
    label,
  );
}
async function seedAdmin(uid) {
  const url = `http://127.0.0.1:8080/v1/projects/${projectId}/databases/(default)/documents/users/${uid}?updateMask.fieldPaths=role`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: "Bearer owner",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields: { role: { stringValue: "admin" } } }),
  });
  assert.equal(response.ok, true, await response.text());
}

const donor = await account("donor");
const partner = await account("partner");
const admin = await account("admin");
const outsider = await account("outsider");
await seedAdmin(admin.user.uid);
assert.equal(
  (await getDoc(doc(admin.db, "users", admin.user.uid))).data().role,
  "admin",
);
await denied("self role elevation", () =>
  updateDoc(doc(donor.db, "users", donor.user.uid), { role: "admin" }),
);
await denied("self organization claim", () =>
  updateDoc(doc(donor.db, "users", donor.user.uid), {
    organizationId: "someone-else",
  }),
);
await updateDoc(doc(donor.db, "users", donor.user.uid), {
  username: "Donor One",
});

const donationId = `donation-${suffix}`;
const donationRef = doc(donor.db, "donations", donationId);
const baseDonation = {
  title: "Fresh vegetables",
  category: "Food",
  quantity: "4 boxes",
  location: "Westlands",
  description: "Fresh produce ready for collection this afternoon.",
  imageUrl:
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
  donorId: donor.user.uid,
  donorName: "donor",
  status: "available",
  createdAt: Date.now(),
};
await setDoc(donationRef, baseDonation);
const otherImageDonation = doc(donor.db, "donations", `other-image-${suffix}`);
await setDoc(otherImageDonation, {
  ...baseDonation,
  imageUrl: "https://example.com/photo.jpg",
});
assert.equal(
  (await getDoc(otherImageDonation)).data().imageUrl,
  "https://example.com/photo.jpg",
);
await deleteDoc(otherImageDonation);
await updateDoc(donationRef, { quantity: "5 boxes" });
await denied("non-owner edit", () =>
  updateDoc(doc(partner.db, "donations", donationId), { title: "Hijacked" }),
);
const removable = doc(donor.db, "donations", `removable-${suffix}`);
await setDoc(removable, baseDonation);
await denied("non-owner delete", () =>
  deleteDoc(doc(partner.db, "donations", removable.id)),
);
await deleteDoc(removable);

const applicationId = partner.user.uid;
const application = {
  userId: applicationId,
  name: "Community Shelter",
  type: "Shelter",
  location: "Nairobi",
  description: "We serve neighbors with weekly meals and supplies.",
  contactEmail: partner.user.email,
  status: "pending",
  createdAt: Date.now(),
};
await setDoc(
  doc(partner.db, "organizationApplications", applicationId),
  application,
);
await denied("other user's application edit", () =>
  updateDoc(doc(outsider.db, "organizationApplications", applicationId), {
    name: "Hijacked shelter",
  }),
);
const now = Date.now();
await runTransaction(admin.db, async (tx) => {
  const appRef = doc(admin.db, "organizationApplications", applicationId);
  const orgRef = doc(admin.db, "organizations", applicationId);
  const userRef = doc(admin.db, "users", applicationId);
  const notificationRef = doc(
    admin.db,
    "notifications",
    `application_approved_${applicationId}_${application.createdAt}`,
  );
  await Promise.all([tx.get(appRef), tx.get(orgRef), tx.get(userRef)]);
  tx.update(appRef, {
    status: "approved",
    reviewedAt: now,
    reviewerId: admin.user.uid,
  });
  tx.set(orgRef, {
    name: application.name,
    type: application.type,
    location: application.location,
    description: application.description,
    ownerUserId: applicationId,
    createdAt: now,
  });
  tx.update(userRef, { organizationId: applicationId });
  tx.set(notificationRef, {
    recipientId: applicationId,
    actorId: admin.user.uid,
    type: "application_approved",
    sourceId: applicationId,
    createdAt: now,
    readAt: null,
  });
});
assert.equal(
  (await getDoc(doc(partner.db, "users", applicationId))).data().organizationId,
  applicationId,
);

const rejectedApplication = doc(
  outsider.db,
  "organizationApplications",
  outsider.user.uid,
);
await setDoc(rejectedApplication, {
  ...application,
  userId: outsider.user.uid,
  contactEmail: outsider.user.email,
});
await runTransaction(admin.db, async (tx) => {
  const appRef = doc(admin.db, "organizationApplications", outsider.user.uid);
  const snapshot = await tx.get(appRef);
  const reviewedAt = Date.now();
  tx.update(appRef, {
    status: "rejected",
    reviewedAt,
    reviewerId: admin.user.uid,
  });
  tx.set(
    doc(
      admin.db,
      "notifications",
      `application_rejected_${outsider.user.uid}_${snapshot.data().createdAt}`,
    ),
    {
      recipientId: outsider.user.uid,
      actorId: admin.user.uid,
      type: "application_rejected",
      sourceId: outsider.user.uid,
      createdAt: reviewedAt,
      readAt: null,
    },
  );
});
await updateDoc(rejectedApplication, {
  name: "Renewed Shelter",
  status: "pending",
  createdAt: Date.now(),
  reviewedAt: deleteField(),
  reviewerId: deleteField(),
});
assert.equal((await getDoc(rejectedApplication)).data().status, "pending");

const orderRef = doc(partner.db, "orders", donationId);
const requestNow = Date.now();
await runTransaction(partner.db, async (tx) => {
  const donation = doc(partner.db, "donations", donationId);
  const org = doc(partner.db, "organizations", applicationId);
  await Promise.all([tx.get(donation), tx.get(orderRef), tx.get(org)]);
  tx.update(donation, { status: "requested", orderId: donationId });
  tx.set(orderRef, {
    donationId,
    donationTitle: baseDonation.title,
    donorId: donor.user.uid,
    organizationId: applicationId,
    organizationName: application.name,
    requestedBy: applicationId,
    pickupCode: "084521",
    status: "requested",
    createdAt: requestNow,
    updatedAt: requestNow,
  });
  tx.set(doc(partner.db, "notifications", `order_requested_${donationId}`), {
    recipientId: donor.user.uid,
    actorId: applicationId,
    type: "order_requested",
    sourceId: donationId,
    createdAt: requestNow,
    readAt: null,
  });
});
await updateDoc(donationRef, { quantity: "6 boxes" });
assert.equal((await getDoc(donationRef)).data().quantity, "6 boxes");
await denied("double request", () =>
  setDoc(doc(partner.db, "orders", donationId), { status: "requested" }),
);
await denied("order outsider read", () =>
  getDoc(doc(outsider.db, "orders", donationId)),
);
const handoffNow = Date.now();
await runTransaction(donor.db, async (tx) => {
  const order = doc(donor.db, "orders", donationId);
  const donation = doc(donor.db, "donations", donationId);
  await Promise.all([tx.get(order), tx.get(donation)]);
  tx.update(order, { status: "pickup", updatedAt: handoffNow });
  tx.update(donation, { status: "pickup" });
  tx.set(doc(donor.db, "notifications", `order_pickup_${donationId}`), {
    recipientId: applicationId,
    actorId: donor.user.uid,
    type: "order_pickup",
    sourceId: donationId,
    createdAt: handoffNow,
    readAt: null,
  });
});
const receivedNow = Date.now();
await runTransaction(partner.db, async (tx) => {
  const order = doc(partner.db, "orders", donationId);
  const donation = doc(partner.db, "donations", donationId);
  await Promise.all([tx.get(order), tx.get(donation)]);
  tx.update(order, { status: "received", updatedAt: receivedNow });
  tx.update(donation, { status: "received" });
  tx.set(doc(partner.db, "notifications", `order_received_${donationId}`), {
    recipientId: donor.user.uid,
    actorId: applicationId,
    type: "order_received",
    sourceId: donationId,
    createdAt: receivedNow,
    readAt: null,
  });
});
assert.equal((await getDoc(donationRef)).data().status, "received");

const needId = `need-${suffix}`;
const sponsorshipRef = doc(partner.db, "sponsorships", needId);
await setDoc(sponsorshipRef, {
  organizationId: applicationId,
  organizationName: application.name,
  ownerUserId: applicationId,
  title: "Pantry staples",
  description: "We need pantry staples for family food parcels.",
  imageUrl:
    "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=1200&q=80",
  unit: "bags",
  targetQuantity: 10,
  pledgedQuantity: 0,
  status: "open",
  createdAt: Date.now(),
});
const otherImageNeed = doc(partner.db, "sponsorships", `other-image-${suffix}`);
await setDoc(otherImageNeed, {
  ...(await getDoc(sponsorshipRef)).data(),
  imageUrl: "https://example.com/photo.jpg",
});
assert.equal(
  (await getDoc(otherImageNeed)).data().imageUrl,
  "https://example.com/photo.jpg",
);
await denied("unapproved need", () =>
  setDoc(doc(donor.db, "sponsorships", `bad-${suffix}`), {
    organizationId: applicationId,
    organizationName: application.name,
    ownerUserId: donor.user.uid,
    title: "Invalid need",
    description: "This listing must be rejected by rules.",
    unit: "bags",
    targetQuantity: 10,
    pledgedQuantity: 0,
    status: "open",
    createdAt: Date.now(),
  }),
);
const pledgeNow = Date.now();
await runTransaction(donor.db, async (tx) => {
  const need = doc(donor.db, "sponsorships", needId);
  const pledge = doc(
    donor.db,
    "sponsorships",
    needId,
    "pledges",
    donor.user.uid,
  );
  await Promise.all([tx.get(need), tx.get(pledge)]);
  tx.set(pledge, { userId: donor.user.uid, quantity: 4, createdAt: pledgeNow });
  tx.update(need, { pledgedQuantity: 4, status: "open" });
  tx.set(
    doc(
      donor.db,
      "notifications",
      `pledge_received_${needId}_${donor.user.uid}`,
    ),
    {
      recipientId: applicationId,
      actorId: donor.user.uid,
      type: "pledge_received",
      sourceId: needId,
      createdAt: pledgeNow,
      readAt: null,
    },
  );
});
assert.equal((await getDoc(sponsorshipRef)).data().pledgedQuantity, 4);
await denied("duplicate pledge", () =>
  setDoc(doc(donor.db, "sponsorships", needId, "pledges", donor.user.uid), {
    userId: donor.user.uid,
    quantity: 1,
    createdAt: Date.now(),
  }),
);
const finalPledgeAt = Date.now();
await runTransaction(outsider.db, async (tx) => {
  const need = doc(outsider.db, "sponsorships", needId);
  const pledge = doc(
    outsider.db,
    "sponsorships",
    needId,
    "pledges",
    outsider.user.uid,
  );
  await Promise.all([tx.get(need), tx.get(pledge)]);
  tx.set(pledge, {
    userId: outsider.user.uid,
    quantity: 6,
    createdAt: finalPledgeAt,
  });
  tx.update(need, { pledgedQuantity: 10, status: "fulfilled" });
  tx.set(
    doc(
      outsider.db,
      "notifications",
      `pledge_received_${needId}_${outsider.user.uid}`,
    ),
    {
      recipientId: applicationId,
      actorId: outsider.user.uid,
      type: "pledge_received",
      sourceId: needId,
      createdAt: finalPledgeAt,
      readAt: null,
    },
  );
});
assert.equal((await getDoc(sponsorshipRef)).data().status, "fulfilled");
const donorNotifications = await getDocs(
  query(
    collection(donor.db, "notifications"),
    where("recipientId", "==", donor.user.uid),
    orderBy("createdAt", "desc"),
  ),
);
assert.equal(donorNotifications.size, 2);
await updateDoc(donorNotifications.docs[0].ref, { readAt: Date.now() });
const donorOrders = await getDocs(
  query(
    collection(donor.db, "orders"),
    where("donorId", "==", donor.user.uid),
    orderBy("createdAt", "desc"),
  ),
);
assert.equal(donorOrders.size, 1);
const partnerOrders = await getDocs(
  query(
    collection(partner.db, "orders"),
    where("requestedBy", "==", partner.user.uid),
    orderBy("createdAt", "desc"),
  ),
);
assert.equal(partnerOrders.size, 1);
const partnerNotifications = await getDocs(
  query(
    collection(partner.db, "notifications"),
    where("recipientId", "==", partner.user.uid),
    orderBy("createdAt", "desc"),
  ),
);
assert.equal(partnerNotifications.size, 4);
const pendingApplications = await getDocs(
  query(
    collection(admin.db, "organizationApplications"),
    where("status", "==", "pending"),
  ),
);
assert.equal(
  pendingApplications.docs.some((item) => item.id === outsider.user.uid),
  true,
);
const impact = await Promise.all([
  getCountFromServer(
    query(
      collection(donor.db, "donations"),
      where("status", "==", "available"),
    ),
  ),
  getCountFromServer(
    query(collection(donor.db, "donations"), where("status", "==", "received")),
  ),
  getCountFromServer(collection(donor.db, "organizations")),
]);
assert.equal(impact[0].data().count >= 0, true);
assert.equal(impact[1].data().count >= 1, true);
assert.equal(impact[2].data().count >= 1, true);
console.log(
  "Firestore workflows passed: donations, approval, order handoff, pledge, notifications, and access controls.",
);
await Promise.all(
  [donor, partner, admin, outsider].map((account) => terminate(account.db)),
);
await Promise.all(
  [donor, partner, admin, outsider].map((account) => deleteApp(account.app)),
);
