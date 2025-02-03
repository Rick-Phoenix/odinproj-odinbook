import { seed } from "drizzle-seed";
import db from "./dbConfig.ts";
import { likes, users } from "./schema.ts";

async function main() {
  await seed(db, {
    likes,
    users,
  }).refine((f) => ({
    likes: { count: 200 },
  }));
}
