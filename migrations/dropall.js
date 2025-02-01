import pg from "pg";
import { createInterface } from "readline/promises";

const rl = createInterface({ input: process.stdin, output: process.stdout });

const db = new pg.Client({
  connectionString: process.env.PG_URL,
});

db.connect();

if (
  (await rl.question("Are you sure you want to drop all tables? (yes/no) ")) ===
  "yes"
) {
  await db.query("DROP TABLE schema_versions;");
  await db.query("DROP TABLE group_members;");
  await db.query("DROP TABLE posts;");
  await db.query("DROP TABLE sessions;");
  await db.query("DROP TABLE groups;");
  await db.query("DROP TABLE users;");
  console.log("All tables dropped.");
}

db.end();
