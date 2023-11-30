import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import webExtension from '@samrum/vite-plugin-web-extension';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import {resolve} from 'path';
// @ts-ignore
import manifest from './src/manifest';
import WindiCSS from 'vite-plugin-windicss'
import {POPUP_OUTPUT} from './constant'

export default ({ mode, command }) => {
  console.log(mode, command);

  return defineConfig({
    root: './src/',
    base: '/popup',
    envDir: '../',
    // publicDir: '../public',
    plugins: [
      vue(),
      WindiCSS(),
    ],
    define: {
      'process.env': {}
    },
    css: {
      devSourcemap: true
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
      outDir: POPUP_OUTPUT,
      emptyOutDir: false,
      cssCodeSplit: false,
      sourcemap: false,
      minify:'esbuild',
      rollupOptions: {
        input: resolve(__dirname, './src/popup/index.html'),
        output: {
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name].js',
          assetFileNames: '[ext]/name-[hash].[ext]',
        },

      }
    }
  });
};
