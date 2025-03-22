const fs = require("fs");
const path = require("path");
const { cwd } = require("process");

const sourceDir = path.join(cwd(), "./dist/temp");
const targetDir = path.join(cwd(), "./dist/cjs");

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function processDirectory(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(directory, entry.name);
    const relativePath = path.relative(sourceDir, directory);
    const targetSubDir = path.join(targetDir, relativePath);

    if (!fs.existsSync(targetSubDir)) {
      fs.mkdirSync(targetSubDir, { recursive: true });
    }

    if (entry.isDirectory()) {
      processDirectory(sourcePath);
    } else if (entry.isFile()) {
      const targetPath = path.join(
        targetSubDir,
        entry.name.endsWith(".js")
          ? entry.name.replace(/\.js$/, ".cjs")
          : entry.name,
      );
      // change .ts and .js files too
      // const targetPath = path.join(
      //   targetSubDir,
      //   entry.name.endsWith(".ts") || entry.name.endsWith(".js")
      //     ? entry.name.replace(/\.ts$/, ".cts").replace(/\.js$/, ".cjs")
      //     : entry.name,
      // );

      fs.copyFileSync(sourcePath, targetPath);
      // fs.unlinkSync(sourcePath);
    }
  }
}

processDirectory(sourceDir);
console.log("Successfully renamed .js files to .cjs");
