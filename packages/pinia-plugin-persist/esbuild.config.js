import { dtsPlugin } from 'esbuild-plugin-d.ts';
import esbuild from 'esbuild';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

const require = createRequire(import.meta.url);
const tsconfig = require('./tsconfig.json');
const pkg = require('./package.json');

const option = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  entryNames: `[dir]/[name]`,
  format: 'esm',
  splitting: true,
  outdir: 'dist',
  sourcemap: true,
  platform: 'neutral',
  plugins: [
    {
      name: 'log-rebuild',
      setup(build) {
        const {
          initialOptions: { format, outdir },
        } = build;
        build.onEnd(() => {
          console.log(`format: ${format}; built: ${resolve(process.cwd(), outdir)}`);
        });
      },
    },
    dtsPlugin({
      tsconfig,
    }),
  ],
  assetNames: 'assets/[name]-[hash]',
  chunkNames: 'chunks/[name]-[hash]',
  outExtension: {
    '.js': '.mjs',
  },
  external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
};

esbuild.context(option).then((ctx) => {
  ctx.watch();
});

export default option;
