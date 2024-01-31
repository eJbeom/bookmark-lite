import { Configuration } from 'webpack';
import * as path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyPlugin from 'copy-webpack-plugin';

const stylesHandler = MiniCssExtractPlugin.loader;

const mode =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';

const config: Configuration = {
  mode,
  devtool: mode === 'development' ? 'inline-source-map' : false,
  entry: {
    content_script: path.resolve(__dirname, 'src/scripts/content_script.ts'),
    background_script: path.resolve(
      __dirname,
      'src/scripts/background_script.ts'
    ),
    popup_script: path.resolve(__dirname, 'src/scripts/popup_script.ts'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: ['/node_modules/'],
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [stylesHandler, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'pages/[name].css',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'public',
          globOptions: {
            ignore: ['**/*.scss'],
          },
        },
      ],
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
    alias: {
      '@': path.resolve(__dirname),
    },
  },
};

export default config;
