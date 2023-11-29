import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import webExtension from '@samrum/vite-plugin-web-extension';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import {resolve} from 'path';
// @ts-ignore
import manifest from './src/manifest';
import WindiCSS from 'vite-plugin-windicss'
// https://vitejs.dev/config/
export default ({ mode, command }) => {
  console.log(mode, command);

  return defineConfig({
    root: './src/',
    base: '/',
    envDir: '../',
    publicDir: '../public',
    plugins: [
      vue(),
      WindiCSS(),
      webExtension({
        // @ts-ignore
        manifest: {
          ...manifest
        }
      })
    ],
    define: {
      'process.env': {}
    },
    server: {
      host: '0.0.0.0',
      port: 30,
      strictPort: true,
      open: true
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
    compilerOptions: {
      "target": "es5",
      "module": "es6"
    },
    build: {
      outDir: '../dist',
      emptyOutDir: true,
      cssCodeSplit: true,
      sourcemap: true,
      lib: {
        entry: resolve(__dirname, './src/content/main.ts'),
        name: 'ChromeExtensionMock2', // umd的变量名
        fileName: (format) => `static/js/content.${format}.js`, // 输出文件名
        formats: ['es'],
      },
      rollupOptions: {
        // input:resolve(__dirname, './src/content/main.ts'),
        output: {
          // entryFileNames: 'static/js/[name].min.js',
          // inlineDynamicImports:false,
          // format: 'es'
        },

      }
    }
  });
};
