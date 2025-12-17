import path from "path";
import fs from "fs-extra";

const basePath = process.cwd();

async function combineDist() {
  const packagesDir = path.join(basePath, "./apps");
  // Ensure root dist exists and is empty
  await fs.emptyDir(path.join(basePath, "./dist"));

  const packages = await fs.readdir(packagesDir);

  for (const pkg of packages) {
    const pkgDist = path.join(packagesDir, pkg, "dist");
    if (await fs.pathExists(pkgDist)) {
      await fs.copy(pkgDist, path.join(basePath, "./dist", pkg));
    }
  }
}

combineDist().catch(console.error);
