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
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx','.less'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
  
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules\/(?!(@maxgraph\/core|@maxgraph\/shared)\/)/,
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
            plugins: isDevelopment ? ['react-refresh/babel'] : []
          },
        },
      },
      {
        test: /\.less$/,  // 匹配 .less 文件
        use: [
          'style-loader',  // 将 CSS 注入到 DOM
          {
            loader: 'css-loader',
            options: {
              modules: {
                // 启用 CSS Modules，这样就能用 import styles from './index.less'
                localIdentName: '[local]--[hash:base64:5]',
              },
              importLoaders: 2,  // 在 css-loader 前应用的 loader 数
            },
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,  // 允许在 Less 中使用 JavaScript
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
            maxSize: 8 * 1024, // 8kb
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
    new CleanWebpackPlugin(),
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
    }),
    isDevelopment && new ReactRefreshWebpackPlugin(),
    isDevelopment && new webpack.HotModuleReplacementPlugin(),
  ].filter(Boolean),
  
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react',
          chunks: 'all',
          priority: 20,
        },
        redux: {
          test: /[\\/]node_modules[\\/](@reduxjs|redux)[\\/]/,
          name: 'redux',
          chunks: 'all',
          priority: 15,
        },
        commons: {
          name: 'commons',
          minChunks: 2,
          chunks: 'all',
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    },
    runtimeChunk: 'single',
    minimize: !isDevelopment,
  },
  
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
};