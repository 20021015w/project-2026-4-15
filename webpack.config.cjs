const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const webpack = require("webpack");


const isDevelopment = process.env.NODE_ENV === "development";


module.exports = {
  mode: isDevelopment ? "development" : "production",

  entry: {
    main: "./src/index.tsx",
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: isDevelopment ? "[name].js" : "[name].[contenthash].js",
    chunkFilename: isDevelopment ? "[id].js" : "[id].[contenthash].js",
    publicPath: "/",
    clean: true,
  },

  devtool: isDevelopment ? "eval-source-map" : "source-map",

  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    port: 5713,
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
    proxy: [
      {
        context: ["/api"],
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        ws: true,
        // pathRewrite: { "^/api": "" },

        onProxyReq: (proxyReq, req) => {
          console.log(`[Proxy] ${req.method} ${req.url} -> ${proxyReq.path}`);
          // 请求头在这里设置，不要写外层headers
          // proxyReq.setHeader("xxx", "xxx")
        },

        onProxyRes: (proxyRes, req, res) => {
          proxyRes.headers["Access-Control-Allow-Origin"] = "*";
          proxyRes.headers["Access-Control-Allow-Methods"] =
            "GET, POST, PUT, DELETE, PATCH, OPTIONS";
          proxyRes.headers["Access-Control-Allow-Headers"] =
            "X-Requested-With, content-type, Authorization";
        },
      },
    ],
    allowedHosts: "all",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
  },

  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx", ".less"],
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@features": path.resolve(__dirname, "src/features"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
    },
    fallback: {
      // "path": require.resolve("path-browserify"),
    },
  },

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        include: [
          path.resolve(__dirname, "src"),
          path.resolve(__dirname, "packages"),
        ],
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              ["@babel/preset-react", { runtime: "automatic" }],
              "@babel/preset-typescript",
            ],
            cacheDirectory: true,
            plugins: isDevelopment ? ["react-refresh/babel"] : [],
            sourceMaps: true,
          },
        },
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[local]--[hash:base64:5]",
              },
              importLoaders: 2,
            },
          },
          {
            loader: "less-loader",
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
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: {
                auto: true,
                localIdentName: isDevelopment
                  ? "[path][name]__[local]--[hash:base64:5]"
                  : "[hash:base64:8]",
              },
            },
          },
          "postcss-loader",
        ],
        exclude: /\.module\.css$/,
      },
      {
        test: /\.module\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: isDevelopment
                  ? "[path][name]__[local]--[hash:base64:5]"
                  : "[hash:base64:8]",
              },
            },
          },
          "postcss-loader",
        ],
      },
      {
        test: /\.s[ac]ss$/,
        use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024,
          },
        },
        generator: {
          filename: "assets/images/[name].[hash][ext]",
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[name].[hash][ext]",
        },
      },
    ],
  },

  plugins: [
    !isDevelopment && new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "index.html",
      inject: "body",
      minify: !isDevelopment
        ? {
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
        }
        : false,
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.API_URL": JSON.stringify(
        process.env.API_URL || "http://localhost:5000"
      ),
    }),
    isDevelopment && new ReactRefreshWebpackPlugin(),
    isDevelopment && new webpack.HotModuleReplacementPlugin(),
  ].filter(Boolean),

  optimization: isDevelopment
    ? {
      splitChunks: false,
      runtimeChunk: false,
    }
    : {
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          antd: {
            test: /[\\/]node_modules[\\/](antd|@ant-design)[\\/]/,
            name: "antd",
            chunks: "all",
            priority: 30,
            enforce: true,
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: "react",
            chunks: "all",
            priority: 25,
          },
          redux: {
            test: /[\\/]node_modules[\\/](@reduxjs|redux)[\\/]/,
            name: "redux",
            chunks: "all",
            priority: 22,
          },
          "@ui": {
            test: /[\\/]node_modules[\\/]@ui[\\/]/,
            name: "@ui",
            chunks: "all",
            priority: 20,
          },
          "@utils": {
            test: /[\\/]node_modules[\\/]@utils[\\/]/,
            name: "@utils",
            chunks: "all",
            priority: 20,
          },
          "@maxgraph": {
            test: /[\\/]node_modules[\\/]@maxgraph[\\/]/,
            name: "@maxgraph",
            chunks: "all",
            priority: 20,
          },
          lodash: {
            test: /[\\/]node_modules[\\/]lodash[\\/]/,
            name: "lodash",
            chunks: "all",
            priority: 18,
          },
          packages: {
            test: /[\\/]packages[\\/]/,
            name: "packages",
            chunks: "all",
            priority: 8,
            reuseExistingChunk: true,
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
            priority: 5,
          },
          commons: {
            name: "commons",
            minChunks: 2,
            chunks: "all",
            priority: 0,
            reuseExistingChunk: true,
          },
        },
      },
      runtimeChunk: "single",
      minimize: true,
    },

  cache: {
    type: "filesystem",
    buildDependencies: {
      config: [__filename],
    },
  },

  performance: {
    hints: isDevelopment ? false : "warning",
  },
};
