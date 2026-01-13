import esbuild from "esbuild";
import fs from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { parseArgs } from "node:util";
import { polyfillNode } from "esbuild-plugin-polyfill-node";
import { dtsPlugin } from "esbuild-plugin-d.ts";

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

const {
  values: { prod },
  positionals,
} = parseArgs({
  allowPositionals: true,
  options: {
    prod: {
      type: "boolean",
      short: "p",
      default: false,
    },
  },
});

const targets = positionals.length
  ? positionals
  : ["pinia-plugin-persist", "pdf-view"];

const outputFormat = "esm";

const postfix = "esm-bundler";

for (const target of targets) {
  const pkgBase = `packages`;
  const pkgBasePath = `../${pkgBase}/${target}`;
  const pkg = require(`${pkgBasePath}/package.json`);
  const outfile = resolve(
    __dirname,
    `${pkgBasePath}/dist/index.${postfix}.${prod ? `prod.` : ``}js`
  );
  const relativeOutfile = relative(process.cwd(), outfile);
  const external = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
    "path",
    "url",
    "stream",
  ];
  const plugins = [
    {
      name: "log-rebuild",
      setup(build) {
        build.onEnd(() => {
          console.log(`built: ${relativeOutfile}`);
        });
      },
    },
  ];

  if (pkg.buildOptions.needType) {
    const tsconfig_path = resolve(__dirname, `${pkgBasePath}/tsconfig.json`);
    let tsconfig = {};
    const def = {
      compilerOptions: {
        target: "es6",
        strict: true,
        outDir: "dist",
        declaration: true,
        emitDeclarationOnly: true,
      },
      include: ["**/*.ts"],
    };
    if (fs.existsSync(tsconfig_path)) {
      tsconfig =
        require(resolve(__dirname, `${pkgBasePath}/tsconfig.json`)) || def;
    }
    if (!tsconfig.compilerOptions) {
      tsconfig.compilerOptions = {};
    }
    if (!tsconfig.compilerOptions.outDir) {
      tsconfig.compilerOptions.outDir = "dist";
    }
    tsconfig.compilerOptions.outDir = resolve(
      __dirname,
      `${pkgBasePath}/`,
      tsconfig.compilerOptions.outDir
    );
    plugins.push(
      dtsPlugin({
        tsconfig,
      })
    );
  }

  esbuild
    .context({
      entryPoints: [resolve(__dirname, `${pkgBasePath}/src/index.ts`)],
      outfile,
      bundle: true,
      external,
      sourcemap: true,
      format: outputFormat,
      globalName: pkg.buildOptions?.name,
      platform: "browser",
      plugins,
      define: {
        __VERSION__: `"${pkg.version}"`,
        __DEV__: prod ? `false` : `true`,
      },
    })
    .then((ctx) => ctx.watch());
}
