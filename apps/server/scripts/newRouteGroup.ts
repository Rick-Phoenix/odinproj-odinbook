import { input, select } from "@inquirer/prompts";
import chalk from "chalk";
import dedent from "dedent";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";

async function newRouteGroup() {
  const routesFolderPath = path.resolve(process.cwd(), "src/routes");

  const routeGroupName = await input({
    message: "Enter the route group's name:",
    required: true,
    validate(value) {
      return /^[a-z$A-Z-]{2,40}$/.test(value);
    },
  });

  const isAuthenticatedRoute = await select({
    message: `Does this route include an authenticated user? ${chalk.red("--- This will cause bugs if wrong! ---")}`,
    choices: [
      { name: "Yes", value: true },
      { name: "No", value: false },
    ],
  });

  const destinationFolder = path.resolve(routesFolderPath, routeGroupName);
  const globalConfigFile = path.join(routesFolderPath, "routingConfig.ts");

  if (!existsSync(globalConfigFile)) {
    console.error("Global routing config file not found.");
    return;
  }

  if (existsSync(destinationFolder)) {
    console.error("This route group already exists.");
    return;
  }

  const globalConfigContent = await fs.readFile(globalConfigFile, "utf-8");

  const configRegex = /\.route\([^)]+\);\s*$/m;
  const importsRegex = /^import .*;\n\s*\n(?!import)/m;

  const configMatch = globalConfigContent.match(configRegex);
  const importsMatch = globalConfigContent.match(importsRegex);

  if (!configMatch) {
    console.error(
      "Could not find the global config block. Check the formatting for that file."
    );
    return;
  }

  if (!importsMatch) {
    console.error(
      "Could not find the import config block. Check the formatting for that file."
    );
    return;
  }

  const [configBlock] = configMatch;
  const [importsBlock] = importsMatch;

  const updatedConfig = configBlock.replace(
    /;$/,
    `.route("/${routeGroupName}", ${routeGroupName}Router);`
  );
  const updatedImports = importsBlock.replace(
    /\n$/,
    `import { ${routeGroupName}Router } from './${routeGroupName}/${routeGroupName}Router';\n\n`
  );

  const updatedContent = globalConfigContent
    .replace(configRegex, updatedConfig)
    .replace(importsRegex, updatedImports);

  await fs.writeFile(globalConfigFile, updatedContent, { flag: "w+" });

  await fs.mkdir(destinationFolder);

  const newFilePath = path.join(
    destinationFolder,
    `${routeGroupName}Router.ts`
  );

  const routerBoilerplate = dedent`import { createRouter } from "../../lib/create-app";
  ${isAuthenticatedRoute ? 'import type { AppBindingsWithUser } from "../../types/app-bindings";' : ""}
  
  export const ${routeGroupName}Router = createRouter${isAuthenticatedRoute ? "<AppBindingsWithUser>" : ""}();
  `;

  await fs.writeFile(newFilePath, routerBoilerplate, { flag: "w+" });

  console.log(chalk.green("✔") + " Task completed!");
}

await newRouteGroup();
