import { BClient } from "./index.js";

// Optional, if you want to use a different server or different "fetch" function.
const client = new BClient({ url: "https://localhost:5173" });

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

await client.login("test", "test");

await client.post("Test");

const f = await client.feed();
console.log(f.map((v) => v.content).join("\n"));
