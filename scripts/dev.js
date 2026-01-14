import esbuild from "esbuild";
import fs from "node:fs";
import { relative, resolve } from "node:path";
import { createRequire } from "node:module";
import { parseArgs } from "node:util";
import { dtsPlugin } from "esbuild-plugin-d.ts";

const require = createRequire(import.meta.url);

const {
  values: { dir, prod },
} = parseArgs({
  allowPositionals: true,
  options: {
    dir: {
      type: "string",
      short: "d",
      default: "packages",
    },
    prod: {
      type: "boolean",
      short: "p",
      default: false,
    },
  },
});

const pkgBase = resolve(process.cwd(), dir || "packages");
const targets = fs.readdirSync(pkgBase);
const transPath = (obj, pkgBasePath = "", dirKeys = []) => {
  if (!dirKeys?.length) return obj;
  for (const keys of dirKeys) {
    if (!keys) continue;
    const keyList = keys.split(".");
    let cur = obj;
    for (let i = 0; i < keyList.length; i++) {
      const key = keyList[i];
      if (i === keyList.length - 1) {
        if (Array.isArray(cur[key])) {
          cur[key] = cur[key].map((itm) => {
            if (typeof itm === "string") {
              return resolve(pkgBasePath, itm);
            }
            return itm;
          });
        } else if (typeof cur[key] === "string") {
          cur[key] = resolve(pkgBasePath, cur[key]);
        }
        continue;
      }
      cur = cur[key];
    }
  }
  return obj;
};
const merge = (target, source) => {
  if (
    typeof target !== "object" ||
    typeof source !== "object" ||
    Array.isArray(target) ||
    Array.isArray(source) ||
    target instanceof Set ||
    source instanceof Set ||
    target instanceof Map ||
    source instanceof Map
  ) {
    return source ?? target;
  } else {
    for (const key of Object.keys(source)) {
      target[key] = merge(target[key], source[key]);
    }
    return target;
  }
};

for (const target of targets) {
  const pkgBasePath = resolve(pkgBase, target);
  const pkg = require(`${pkgBasePath}/package.json`);
  if (!pkg.buildOptions) continue;
  const def = {
    dirKeys: ["esbuild.outdir", "esbuild.entryPoints"], // 需要处理目录相对项目根位置的key
    formats: ["esm"], // 编译输出格式类型
    tsconfig: undefined, // ts配置文件，若配置了则会生成ts的xx.d.ts文件
    esbuild: {
      // esbuild配置覆盖
      entryNames: `[dir]/[name]${prod ? ".prod" : ""}`,
      outdir: "dist",
      sourcemap: true,
      bundle: true,
      platform: "neutral",
      assetNames: "assets/[name]-[hash]",
      chunkNames: "chunks/[name]-[hash]",
      define: {
        __VERSION__: `"${pkg.version}"`,
        __DEV__: prod ? `false` : `true`,
      },
    },
  };
  const mergeOpt = merge(def, pkg.buildOptions);
  const {
    formats,
    tsconfig: tsconfig_path,
    esbuild: esbuildOpt,
  } = transPath(mergeOpt, pkgBasePath, mergeOpt.dirKeys);

  esbuildOpt.external = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
    "path",
    "url",
    "stream",
  ];

  esbuildOpt.plugins = [
    {
      name: "log-rebuild",
      setup(build) {
        const {
          initialOptions: { format, outdir },
        } = build;
        build.onEnd(() => {
          console.log(
            `format: ${format}; built: ${relative(process.cwd(), outdir)}`
          );
        });
      },
    },
  ];

  for (let i = 0; i < formats.length; i++) {
    const f = formats[i];
    esbuildOpt.format = f;
    esbuildOpt.splitting = f === "esm";
    if (!esbuildOpt.outExtension) {
      esbuildOpt.outExtension = {};
    }
    if (!esbuildOpt.outExtension[".js"]) {
      esbuildOpt.outExtension[".js"] =
        {
          iife: ".js",
          cjs: ".cjs",
          esm: ".mjs",
        }[f] || ".js";
    }

    if (tsconfig_path && i === formats.length - 1) {
      const path = resolve(pkgBasePath, tsconfig_path);
      if (fs.existsSync(path)) {
        const tsconfig = require(path) || {};
        if (!tsconfig.compilerOptions) {
          tsconfig.compilerOptions = {};
        }
        if (!tsconfig.compilerOptions.outDir) {
          tsconfig.compilerOptions.outDir = esbuildOpt.outdir;
        } else {
          tsconfig.compilerOptions.outDir = resolve(
            pkgBasePath,
            tsconfig.compilerOptions.outDir
          );
        }
        esbuildOpt.plugins.push(
          dtsPlugin({
            tsconfig,
          })
        );
      }
    }

    esbuild.context(esbuildOpt).then((ctx) => ctx.watch());
  }
}
