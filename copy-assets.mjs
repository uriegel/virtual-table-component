import { cp } from "node:fs/promises"

await cp(
    "source/module/styles",
    "dist/module/styles",
    { recursive: true }
);