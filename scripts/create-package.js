import { input } from "@inquirer/prompts";
import fs from "node:fs";
import path from "node:path";

try {
  const packageName = await input({
    message: "Enter the package's name:",
    required: true,
  });

  if (packageName.match(/[,./\\:]/)) {
    console.log("Package name contains invalid characters.");
    process.exit(1);
  }

  const packageDir = path.resolve("./packages", packageName);
  if (fs.existsSync(packageDir)) {
    console.log("This package folder already exists.");
    process.exit(1);
  }

  fs.mkdirSync(packageDir);

  const packageJson = {
    name: `@nexus/${packageName}`,
    type: "module",
    private: true,
    devDependencies: {
      "@nexus/eslint-config": "workspace:*",
    },
  };

  fs.writeFileSync(
    path.join(packageDir, "package.json"),
    JSON.stringify(packageJson, null, 2)
  );

  const tsconfig = { extends: "../../tsconfig.json" };

  fs.writeFileSync(
    path.join(packageDir, "tsconfig.json"),
    JSON.stringify(tsconfig, null, 2)
  );

  const eslintConfig =
    "import defaultConfig from '@nexus/eslint-config' \n export default defaultConfig";

  fs.writeFileSync(path.join(packageDir, "eslint.config.js"), eslintConfig);

  console.log(
    "Package initialized succesfully. Run pnpm install to finish the configuration."
  );
} catch (error) {
  console.error("Error initializing the package:", error);
}
