import { input, select } from "@inquirer/prompts";
import chalk from "chalk";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";

const routesFolderPath = path.resolve(process.cwd(), "src/routes");

const routesFolderContent = await fs.readdir(
  path.resolve(process.cwd(), "src/routes"),
  {
    withFileTypes: true,
  }
);

const routeNames = routesFolderContent
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

if (routeNames.length === 0) {
  console.error("The routes folder is empty.");
  process.exit(1);
}

const routeGroup = await select({
  message: "Where do you want to add the new route?",
  choices: routeNames.map((route) => {
    return {
      name: route,
      value: route,
    };
  }),
});

const routeName = await input({
  message: "Enter the route's name:",
  required: true,
  validate(value) {
    return /^[a-zA-Z-]{2,40}$/.test(value);
  },
});

const destinationFolder = path.resolve(routesFolderPath, routeGroup);
const routeConfigFile = path.join(destinationFolder, `${routeGroup}Router.ts`);
const globalConfigFile = path.join(routesFolderPath, "routingConfig.ts");
const newFilePath = path.join(destinationFolder, `${routeName}.ts`);

if (existsSync(newFilePath)) {
  console.error("A file with this name already exists.");
  process.exit(1);
}

if (!existsSync(routeConfigFile)) {
  console.error("Router config file not found.");
  process.exit(1);
}

if (!existsSync(globalConfigFile)) {
  console.error("Global routing config file not found.");
  process.exit(1);
}

const isAuthenticatedRoute = await select({
  message: `Does this route include an authenticated user? ${chalk.red("--- This will cause bugs if wrong! ---")}`,
  choices: [
    { name: "Yes", value: true },
    { name: "No", value: false },
  ],
});

const requestMethod = await select({
  message: "What's the request method?",
  choices: [
    { name: "get", value: "get" },
    { name: "post", value: "post" },
  ],
});

const routeBoilerplate = `
import { createRoute, z } from "@hono/zod-openapi";
import { OK } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import type { AppRouteHandler ${isAuthenticatedRoute ? ", AppBindingsWithUser" : ""} } from "../../types/app-bindings";

const tags = ["${routeGroup}"]

export const ${routeName} = createRoute({
  path: '/',
  method: '${requestMethod}',
  tags,
  request: {
    ${
      requestMethod === "post"
        ? `body: {
        
      }`
        : ""
    }
  },
  responses: {
    [OK]:
  }
});

export const ${routeName + "Handler"}: AppRouteHandler<typeof ${routeName}${isAuthenticatedRoute ? ", AppBindingsWithUser" : ""}> = async (c) => {
  
}
`;

await fs.writeFile(newFilePath, routeBoilerplate, { flag: "w+" });

console.log(chalk.green("✔") + " Task completed!");
