import { select, Separator, input } from "@inquirer/prompts";
import fs, { constants } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import chalk from "chalk";

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

const routeCategory = await select({
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

const destinationFolder = path.resolve(routesFolderPath, routeCategory);
const newFilePath = path.join(destinationFolder, `${routeName}.ts`);

if (existsSync(newFilePath)) {
  console.error("A file with this name already exists.");
  process.exit(1);
}

const routeBoilerplate = `
import { createRoute, z } from "@hono/zod-openapi";
import { httpCodes, notFoundSchema } from "@/lib/constants";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import type { AppRouteHandler } from "../../types/app-bindings";

const tags = ["${routeCategory}"]`;

await fs.writeFile(newFilePath, routeBoilerplate, { flag: "w+" });

console.log(chalk.green("✔") + " Task completed!");
