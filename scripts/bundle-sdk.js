#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const INCLUDED_EXTENSIONS = new Set([
  ".ts",
  ".js",
  ".json",
  ".md",
]);

const EXCLUDED_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  "coverage",
  "generated",
  "migrations",
]);

function walk(dir) {
  const files = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name)) continue;

      files.push(...walk(path.join(dir, entry.name)));
    }

    if (entry.isFile()) {
      const ext = path.extname(entry.name);

      if (INCLUDED_EXTENSIONS.has(ext)) {
        files.push(path.join(dir, entry.name));
      }
    }
  }

  return files;
}

function buildTree(dir, prefix = "") {
  let tree = "";

  const entries = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter(
      (entry) =>
        !EXCLUDED_DIRS.has(entry.name) &&
        !entry.name.startsWith(".")
    );

  entries.forEach((entry, index) => {
    const isLast = index === entries.length - 1;

    tree += `${prefix}${isLast ? "└── " : "├── "}${entry.name}\n`;

    if (entry.isDirectory()) {
      tree += buildTree(
        path.join(dir, entry.name),
        prefix + (isLast ? "    " : "│   ")
      );
    }
  });

  return tree;
}

function bundle(sourceDir, output = "context.md") {
  const files = walk(sourceDir);

  let content = "";

  content += "# NexusWager SDK Context\n\n";

  content += "## Folder Structure\n\n";
  content += "```txt\n";
  content += buildTree(sourceDir);
  content += "```\n\n";

  content += `Files Bundled: ${files.length}\n\n`;

  for (const file of files) {
    const relative = path.relative(sourceDir, file);

    const code = fs.readFileSync(file, "utf8");

    content += `# FILE: ${relative}\n\n`;

    content += "```ts\n";
    content += code;
    content += "\n```\n\n";
  }

  fs.writeFileSync(output, content);

  console.log(`✅ Generated ${output}`);
}

bundle(process.cwd());