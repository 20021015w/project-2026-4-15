import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'UI Components',
  logo: 'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  outputPath: 'docs-dist',

  // 👇 关键：开启 CSS / Less
  cssLoader: {},
  lessLoader: {
    lessOptions: {
      javascriptEnabled: true,
    },
  },

  // 👇 如果你要使用模块化 less（推荐）
  extraBabelPlugins: [],
  alias: {},
  theme: {},
  extraPostCSSPlugins: [],
});