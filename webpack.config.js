const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require('webpack');

const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
  mode: isDevelopment ? 'development' : 'production',

  entry: {
    main: './src/index.tsx',
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isDevelopment ? '[name].js' : '[name].[contenthash].js',
    chunkFilename: isDevelopment ? '[id].js' : '[id].[contenthash].js',
    publicPath: '/',
    clean: true,
  },

  // eval-cheap-module-source-map: 行级 source map，转译快，重新编译只重算出错行
  devtool: isDevelopment ? 'eval-source-map' : 'source-map',

  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 3000,
    hot: true,
    compress: true,
    historyApiFallback: true,
    open: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
      progress: true,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,        // 改变 Origin 头，解决跨域
        secure: false,             // 如果目标服务器是 HTTPS，设置为 true
        ws: true,                  // 支持 WebSocket 代理
        pathRewrite: {
          // '^/api': '',          // 如果需要重写路径，取消注释
        },
        // 添加请求头
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        // 代理日志
        logLevel: 'debug',
        // 自定义代理行为
        onProxyReq: (proxyReq, req, res) => {
          console.log(`[Proxy] ${req.method} ${req.url} -> ${proxyReq.path}`);
        },
        onProxyRes: (proxyRes, req, res) => {
          // 添加跨域响应头
          proxyRes.headers['Access-Control-Allow-Origin'] = '*';
          proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS';
          proxyRes.headers['Access-Control-Allow-Headers'] = 'X-Requested-With, content-type, Authorization';
        },
      },
    },
    // 允许跨域访问 devServer
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.less'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
    },
    fallback: {
      // 如果遇到 polyfill 问题，可以添加
      // "path": require.resolve("path-browserify"),
    },
  },

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        // 仅处理 src 与 packages（workspace 包经 symlink 解析后落在此处）
        // 移除带负向断言的 exclude，正则求值更便宜
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'packages')
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              "@babel/preset-env",
              ["@babel/preset-react", { runtime: "automatic" }],
              "@babel/preset-typescript"
            ],
            cacheDirectory: true,
            plugins: isDevelopment ? ['react-refresh/babel'] : [],
             sourceMaps: true,
          },
        },
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]--[hash:base64:5]',
              },
              importLoaders: 2,
            },
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                auto: true,
                localIdentName: isDevelopment
                  ? '[path][name]__[local]--[hash:base64:5]'
                  : '[hash:base64:8]',
              },
            },
          },
          'postcss-loader',
        ],
        exclude: /\.module\.css$/,
      },
      {
        test: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: isDevelopment
                  ? '[path][name]__[local]--[hash:base64:5]'
                  : '[hash:base64:8]',
              },
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024,
          },
        },
        generator: {
          filename: 'assets/images/[name].[hash][ext]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name].[hash][ext]',
        },
      },
    ],
  },

  plugins: [
    // dev server 产物在内存中，无需清盘；生产构建由 output.clean 负责
    !isDevelopment && new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      inject: 'body',
      minify: !isDevelopment ? {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      } : false,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.API_URL': JSON.stringify(process.env.API_URL || 'http://localhost:5000'),
    }),
    isDevelopment && new ReactRefreshWebpackPlugin(),
    isDevelopment && new webpack.HotModuleReplacementPlugin(),
  ].filter(Boolean),

  // 开发环境关闭 splitChunks / runtimeChunk，减少编译开销；生产环境保留完整分包
  optimization: isDevelopment
    ? {
        splitChunks: false,
        runtimeChunk: false,
      }
    : {
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // 1. 最高优先级：antd UI 库（最大）
            antd: {
              test: /[\\/]node_modules[\\/](antd|@ant-design)[\\/]/,
              name: 'antd',
              chunks: 'all',
              priority: 30,
              enforce: true,
            },

            // 2. React 核心
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react',
              chunks: 'all',
              priority: 25,
            },

            // 3. Redux
            redux: {
              test: /[\\/]node_modules[\\/](@reduxjs|redux)[\\/]/,
              name: 'redux',
              chunks: 'all',
              priority: 22,
            },

            // 4. 内部 workspace 包（通过 node_modules 软链接）
            '@ui': {
              test: /[\\/]node_modules[\\/]@ui[\\/]/,
              name: '@ui',
              chunks: 'all',
              priority: 20,
            },
            '@utils': {
              test: /[\\/]node_modules[\\/]@utils[\\/]/,
              name: '@utils',
              chunks: 'all',
              priority: 20,
            },
            '@maxgraph': {
              test: /[\\/]node_modules[\\/]@maxgraph[\\/]/,
              name: '@maxgraph',
              chunks: 'all',
              priority: 20,
            },

            // 5. 其他大库（可选）
            lodash: {
              test: /[\\/]node_modules[\\/]lodash[\\/]/,
              name: 'lodash',
              chunks: 'all',
              priority: 18,
            },

            // 6. 剩下的 packages（源码中的，不是 node_modules）
            packages: {
              test: /[\\/]packages[\\/]/,
              name: 'packages',
              chunks: 'all',
              priority: 8,
              reuseExistingChunk: true,
            },

            // 7. 其他第三方库兜底（优先级最低）
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 5,
            },

            // 8. 公共业务代码
            commons: {
              name: 'commons',
              minChunks: 2,
              chunks: 'all',
              priority: 0,
              reuseExistingChunk: true,
            },
          },
        },
        runtimeChunk: 'single',
        minimize: true,
      },

  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },

  // 开发环境忽略性能提示
  performance: {
    hints: isDevelopment ? false : 'warning',
  },
};