import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
type Manifest = {
  [key: string]: ManifestChunk;
};
interface ManifestChunk {
  src?: string;
  file: string;
  css?: string[];
  assets?: string[];
  isEntry?: boolean;
  name?: string;
  isDynamicEntry?: boolean;
  imports?: string[];
  dynamicImports?: string[];
}

export async function parseManifest() {
  try {
    const manifest = await readFile(path.resolve(import.meta.dirname, ".vite", "manifest.json"), { encoding: "utf-8" });
    const parsedManifest = JSON.parse(manifest) as Manifest;
    const manifestEntries = Object.entries(parsedManifest);
    let entryChunk: ManifestChunk | undefined;
    for (const [key, value] of manifestEntries) {
      if (value.isEntry) {
        entryChunk = value;
        break;
      }
    }

    if (!entryChunk) throw new Error("Could not find the entry chunk.");

    const cssModules = entryChunk.css!.map((cssModule) => `<link rel="stylesheet" href="${cssModule}"/>`).join("\n");

    const entryJS = `<script type="module" src="${entryChunk.file}"></script>`;
    const htmlOutput = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nexus</title>
  ${cssModules}
</head>
<body>
  <div id="root"></div>
  
  ${entryJS}
</body>
</html>
    `;

    await writeFile(path.resolve(import.meta.dirname, "index.html"), htmlOutput);
  } catch (error) {
    console.error("Error while reading the manifest");
    throw new Error(error as string);
  }
}

await parseManifest();
