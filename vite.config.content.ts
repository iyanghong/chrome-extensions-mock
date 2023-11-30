import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import {resolve} from 'path';
import WindiCSS from 'vite-plugin-windicss'
import {CONTENT_SCRIPT_OUTPUT} from './constant'

export default ({ mode, command }) => {
  console.log(mode, command);

  return defineConfig({
    root: './src/',
    base: '/',
    envDir: '../',
    plugins: [
      vue(),
      WindiCSS(),
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
      outDir: CONTENT_SCRIPT_OUTPUT,
      emptyOutDir: true,
      lib: {
        entry: [resolve(__dirname, './src/content/index.ts')],
        fileName: (format, entryName) => `${entryName}.js`, // 输出文件名
        formats: ['cjs'],
      },
    }
  });
};
