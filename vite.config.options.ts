import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import {resolve} from 'path';
// @ts-ignore
import WindiCSS from 'vite-plugin-windicss'
import {OPTIONS_OUTPUT} from './constant'

export default ({ mode, command }) => {
  console.log(mode, command);

  return defineConfig({
    root: './src/',
    base: '/options',
    envDir: '../',
    plugins: [
      vue(),
      WindiCSS(),
    ],
    define: {
      'process.env': {}
    },
    // @ts-ignore
    rollupOptions: {
      plugins: [nodePolyfills()]
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    build: {
      modulePreload:false,
      outDir: OPTIONS_OUTPUT,
      emptyOutDir: false,
      cssCodeSplit: false,
      sourcemap: false,
      minify:'esbuild',
      rollupOptions: {
        input: resolve(__dirname, './src/options/index.html'),
        output: {
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name].min.js',
          assetFileNames: '[ext]/name-[hash].[ext]',
        },

      }
    }
  });
};
