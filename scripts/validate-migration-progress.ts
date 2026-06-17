import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { parseMigrationProgressPayload } from "../src/features/migration/migration-progress.helpers";

const DATA_PATH = fileURLToPath(
  new URL("../public/data/migration-progress.json", import.meta.url),
);

const payload = JSON.parse(await readFile(DATA_PATH, "utf8")) as unknown;
const progress = parseMigrationProgressPayload(payload);

if (!progress) {
  throw new Error("Migration progress JSON has an unexpected shape.");
}

if (progress.status === "loaded" && !progress.rpcInfo.sourceRpcLabel?.trim()) {
  throw new Error("Loaded migration progress JSON is missing an RPC source.");
}

if (JSON.stringify(payload).includes("Source: Ethereum mainnet")) {
  throw new Error("Migration progress JSON contains a vague source label.");
}

console.log(
  `Migration progress JSON valid: ${progress.status}, checked ${progress.checkedAt}.`,
);
