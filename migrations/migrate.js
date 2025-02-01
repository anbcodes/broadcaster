import { readdir } from "fs/promises";
import { join } from "path";
import pg from "pg";
import { createInterface } from "readline/promises";

const rl = createInterface({ input: process.stdin, output: process.stdout });
/**
 * @typedef {{
 *  run: (args: {db: pg.Client, sql: typeof sql}) => void | Promise<void>
 * }} Migration
 */

const db = new pg.Client({
  connectionString: process.env.PG_URL,
});

db.connect();

/**
 * Use as a tagged template literal
 * @param {TemplateStringsArray} strings 
 * @param {any[]} args
 */
const sql = (strings, ...args) => {
    let query = strings[0];
    for (let i = 1; i < strings.length; i++) {
        query += `$${i}`;
        query += strings[i];
    }
    console.log('RUN:', query, args);
    return db.query(query, args);
}

// Check for migration table
const result = await sql`
SELECT EXISTS (
   SELECT FROM pg_catalog.pg_class c
   JOIN   pg_catalog.pg_namespace n ON n.oid = c.relnamespace
   WHERE  n.nspname = 'public'
   AND    c.relname = 'schema_versions'
   AND    c.relkind = 'r'    -- only tables
   );    
`;


/** @type {number} */
let lastMigration;
if (!result.rows[0].exists) {
    lastMigration = -1;
} else {
    const result = await db.query("SELECT version FROM schema_versions WHERE schema = 'public'");
    lastMigration = result.rows[0].version;
}

const dirname = new URL('.', import.meta.url).pathname;

const migrations = await readdir(join(dirname, 'public'))
console.log(migrations);
db.query("BEGIN");
try {
    for (const path of migrations) {
        const version = parseInt(path.split('.')[0]);
        const { migration } = await import(join(dirname, 'public', path));
        if (version <= lastMigration) {
            continue;
        }
        console.log("Migrating to version", version);
        await migration.run({db, sql});
        await db.query("INSERT INTO schema_versions (schema, version) VALUES ('public', $1) ON CONFLICT (schema) DO UPDATE SET version = $1", [version]);
    }

    if (await rl.question('Commit? (y/n)') === 'y') {
        await db.query("COMMIT");
    } else {
        await db.query("ROLLBACK");
    }
} catch (e) {
    console.error(e);
    await db.query("ROLLBACK");
}

await db.end();
rl.close();