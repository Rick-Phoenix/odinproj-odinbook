import { input, confirm } from "@inquirer/prompts";
import { execSync } from "child_process";

try {
  const migrationName = await input({
    message: "Enter migration name: ",
    required: true,
  });

  const confirmation = await confirm({
    message: "Confirm? ",
    default: true,
  });

  if (!confirmation) {
    console.log("\nMigration canceled.");
    process.exit(0);
  }

  execSync(`pnpm exec prisma migrate dev --name ${migrationName}`, {
    stdio: "inherit",
  });
} catch (err) {
  if (err instanceof Error && err.name === "ExitPromptError") {
    console.log("\nMigration canceled.");
    process.exit(0);
  } else {
    console.log("Error:", err);
    process.exit(1);
  }
}
