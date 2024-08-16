import metaUrlPlugin from '@chialab/esbuild-plugin-meta-url';
import esbuild from 'esbuild';

await esbuild.build({
  plugins: [
    metaUrlPlugin(),
  ],
  bundle: true,
  minify: true,
  sourcemap: true,
  format: 'esm',
  entryPoints: ['./src/lib/pglite/worker.ts'],
  outdir: './public/pglite',
});

