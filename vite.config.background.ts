import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import {resolve} from 'path';
// @ts-ignore
import WindiCSS from 'vite-plugin-windicss'
import {BACKGROUND_OUTPUT} from './constant'
import topLevelAwait from 'vite-plugin-top-level-await'
import VitePluginCopy from './build/copy'

export default ({mode, command}) => {
  console.log(mode, command);

  return defineConfig({
    root: './src/',
    base: '/',
    envDir: '../',
    plugins: [
      vue(),
      WindiCSS(),
      topLevelAwait({
        promiseExportName: '__tla',
        promiseImportName: i => `__tla_${i}`
      }),
      //@ts-ignore
      VitePluginCopy([{
        from: '../public',
        to: '../dist'
      }])
    ],
    define: {
      'process.env': {}
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    build: {
      emptyOutDir: true,
      outDir: BACKGROUND_OUTPUT,
      lib: {
        entry: resolve(__dirname, 'src/background/index.ts'),
        // 设置生成文件的文件名
        fileName: () => `index.js`, // 输出文件名
        formats: ['es'],
      },
    },
  });
};
