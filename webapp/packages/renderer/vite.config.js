/* eslint-env node */

import {chrome} from '../../electron-vendors.config.json';
import vue from '@vitejs/plugin-vue';
import {renderer} from 'unplugin-auto-expose';
import {join} from 'node:path';
import {injectAppVersion} from '../../version/inject-app-version-plugin.mjs';
import {vitePluginForArco} from '@arco-plugins/vite-vue';

// your plugin installation

const PACKAGE_ROOT = __dirname;
const PROJECT_ROOT = join(PACKAGE_ROOT, '../..');

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  envDir: PROJECT_ROOT,
  resolve: {
    alias: [
      {
        find: '/@/',
        replacement: join(PACKAGE_ROOT, 'src') + '/',
      },
      {
        find: 'vue-i18n',
        replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
      },
    ],
  },
  base: '',
  server: {
    fs: {
      strict: true,
    },
  },
  build: {
    sourcemap: true,
    target: `chrome${chrome}`,
    outDir: 'dist',
    assetsDir: '.',
    rollupOptions: {
      input: join(PACKAGE_ROOT, 'index.html'),
    },
    emptyOutDir: true,
    reportCompressedSize: false,
  },
  test: {
    environment: 'happy-dom',
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  plugins: [
    vue(),
    renderer.vite({
      preloadEntry: join(PACKAGE_ROOT, '../preload/src/index.ts'),
    }),
    injectAppVersion(),
    new vitePluginForArco({
      theme: '@arco-themes/vue-am-alas',
    }),
  ],
  optimizeDeps: {
    include: [
      '@arco-design/web-vue/es/locale/lang/zh-cn',
      '@arco-design/web-vue/es/locale/lang/en-us',
      '@arco-design/web-vue/es/locale/lang/ja-jp',
      '@arco-design/web-vue/es/locale/lang/zh-tw',
    ],
  },
};

export default config;
