import { defineConfig } from 'dumi';

export default defineConfig({
  title: '通用组件',
  logo: 'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  outputPath: 'docs-dist',
  themeConfig: {
    nav: [
      // 自动匹配 /components/* 路由
      {
        title: '组件', // 默认显示
        link: '/components/ripple', // 指向任意组件
        // 关键：children 会根据当前路由自动切换显示
        children: [
          { title: 'Ripple 涟漪', link: '/components/ripple' },
          { title: 'Button 按钮', link: '/components/button' },
          { title: 'Input 输入框', link: '/components/input' },
        ],
      },
      { title: '指南', link: '/guide' },
      { title: 'GitHub', link: 'https://github.com/xxx' },
    ],
  },
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