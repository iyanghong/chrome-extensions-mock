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
      modulePreload:false,
      outDir: '../dist',
      emptyOutDir: false,
      cssCodeSplit: false,
      sourcemap: false,
      minify:'esbuild',
      /*lib: {
        entry: resolve(__dirname, './src/content/main.ts'),
        name: 'ChromeExtensionMock2', // umd的变量名
        fileName: (format) => `/static/js/content.${format}.js`, // 输出文件名
        formats: ['es'],
      },*/
      rollupOptions: {
        input: {
          content: resolve(__dirname, './src/content/main.ts'),
          main: resolve(__dirname, './src/index.html'),
          options: resolve(__dirname, './src/options.html')
        },
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name].min.js',
          assetFileNames: 'static/[ext]/name-[hash].[ext]',
        },

      }
    }
  });
};
