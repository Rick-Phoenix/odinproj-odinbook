import { input, select } from "@inquirer/prompts";
import chalk from "chalk";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";

const routesFolderPath = path.resolve(process.cwd(), "src/routes");

const routeGroupName = await input({
  message: "Enter the route group's name:",
  required: true,
  validate(value) {
    return /^[a-z$A-Z-]{2,40}$/.test(value);
  },
});

const destinationFolder = path.resolve(routesFolderPath, routeGroupName);

if (existsSync(destinationFolder)) {
  console.error("This route group already exists.");
  process.exit(1);
}

const isAuthenticatedRoute = await select({
  message:
    "Does this route include an authenticated user? (---This will cause bugs if wrong!---)",
  choices: [
    { name: "Yes", value: true },
    { name: "No", value: false },
  ],
});

await fs.mkdir(destinationFolder);

const newFilePath = path.join(destinationFolder, `${routeGroupName}Router.ts`);

const routerBoilerplate = `
import { createRouter } from "../../lib/create-app";
${isAuthenticatedRoute ? 'import type { AppBindingsWithUser } from "../../types/app-bindings"' : ""}

export const ${routeGroupName}Router = createRouter${isAuthenticatedRoute ? "<AppBindingsWithUser>" : ""}()
`;

await fs.writeFile(newFilePath, routerBoilerplate, { flag: "w+" });

console.log(chalk.green("✔") + " Task completed!");
