import { randomBytes } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

export const demoAccounts = [
  {
    id: "okoa-demo-donor",
    email: "donor@okoa.example.test",
    username: "Amina’s Community Market",
  },
  {
    id: "okoa-demo-kitchen",
    email: "kitchen@okoa.example.test",
    username: "Community Table Kitchen",
    organizationId: "seed-community-table-kitchen",
  },
  {
    id: "okoa-demo-shelter",
    email: "shelter@okoa.example.test",
    username: "Family Shelter Network",
    organizationId: "seed-family-shelter",
  },
  {
    id: "okoa-demo-pantry",
    email: "pantry@okoa.example.test",
    username: "Neighborhood Pantry Network",
    organizationId: "seed-neighborhood-pantry",
  },
  {
    id: "okoa-demo-supporter",
    email: "supporter@okoa.example.test",
    username: "Wanjiku Mwangi",
  },
];

export async function seedAccounts({
  authClient,
  projectId,
  dryRun,
  resetPasswords,
  emulator,
}) {
  const path = `seed-credentials-${projectId}${emulator ? "-emulator" : ""}.local`;
  let credentials = {};
  const options = () =>
    emulator ? { headers: { Authorization: "Bearer owner" } } : {};
  try {
    credentials = JSON.parse(await readFile(path, "utf8"));
  } catch (cause) {
    if (cause.code !== "ENOENT") throw cause;
  }
  for (const account of demoAccounts) {
    if (dryRun) {
      console.log(`Would ensure presentation account ${account.email}`);
      continue;
    }
    const response = await authClient.post(
      "/accounts:lookup",
      { localId: [account.id], targetProjectId: projectId },
      options(),
    );
    const existing = response.body.users?.[0];
    if (existing && existing.email !== account.email)
      throw new Error(`Refusing to modify unrelated account ${account.id}.`);
    if (existing && !resetPasswords) {
      console.log(`Account ready: ${account.email}`);
      continue;
    }
    const password = randomBytes(18).toString("base64url");
    if (existing)
      await authClient.post(
        "/accounts:update",
        { localId: account.id, targetProjectId: projectId, password },
        options(),
      );
    else
      await authClient.post(
        "/accounts:signUp",
        {
          localId: account.id,
          targetProjectId: projectId,
          email: account.email,
          password,
          displayName: account.username,
        },
        options(),
      );
    credentials[account.id] = { email: account.email, password };
    await writeFile(path, `${JSON.stringify(credentials, null, 2)}\n`, {
      mode: 0o600,
    });
    console.log(`Account ready: ${account.email}`);
  }
  if (!dryRun)
    console.log(
      `Presentation sign-in details: ${path} (ignored by Git). Existing passwords are preserved; --reset-passwords replaces only these demo account passwords.`,
    );
}
