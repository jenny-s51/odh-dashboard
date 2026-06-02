const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('@module-federation/enhanced/webpack');

const BASE_DIR = path.resolve(__dirname, '..');
const BASE_SRC_DIR = path.resolve(BASE_DIR, 'src');
const REPO_ROOT = path.resolve(BASE_DIR, '../..');
const PLUGIN_CORE_DIR = path.resolve(REPO_ROOT, 'packages/plugin-core/src');
const INTERNAL_DIR = path.resolve(REPO_ROOT, 'frontend/src');

/**
 * Shared webpack configuration factory for all distributions.
 *
 * @param {object} [options]
 * @param {string} [options.distributionSrcDir] - Source directory for the distribution. Defaults to base's src/.
 * @param {string} [options.outputDir] - Output directory. Defaults to <distributionSrcDir>/../public.
 * @param {string} [options.title] - HTML page title. Defaults to 'App Shell'.
 * @param {string[]} [options.additionalIncludes] - Extra directories to compile with swc-loader.
 * @param {object} [options.deps] - package.json dependencies for MF shared config. Defaults to base's.
 */
module.exports = ({
  distributionSrcDir = BASE_SRC_DIR,
  outputDir,
  title = 'App Shell',
  additionalIncludes = [],
  deps,
} = {}) => {
  const resolvedDeps =
    deps || require(path.resolve(path.dirname(distributionSrcDir), 'package.json')).dependencies;
  const resolvedOutputDir = outputDir || path.resolve(path.dirname(distributionSrcDir), 'public');

  return {
    entry: {
      app: path.join(distributionSrcDir, 'index.tsx'),
    },
    module: {
      rules: [
        {
          test: /\.(tsx|ts|jsx|js)?$/,
          exclude: /node_modules/,
          include: [
            distributionSrcDir,
            BASE_SRC_DIR,
            PLUGIN_CORE_DIR,
            INTERNAL_DIR,
            ...additionalIncludes,
          ],
          use: [{ loader: 'swc-loader' }],
        },
        {
          test: /\.(svg|ttf|eot|woff|woff2)$/,
          include: [
            path.resolve(REPO_ROOT, 'node_modules/@patternfly/patternfly/assets/fonts'),
            path.resolve(REPO_ROOT, 'node_modules/@patternfly/patternfly/assets/pficon'),
          ],
          use: {
            loader: 'file-loader',
            options: {
              outputPath: 'fonts',
              name: '[name].[ext]',
            },
          },
        },
        {
          test: /\.svg$/,
          include: (input) => input.indexOf('bgimages') > -1,
          use: {
            loader: 'svg-url-loader',
            options: { limit: 10000 },
          },
        },
        {
          test: /\.svg$/,
          include: (input) =>
            input.indexOf('bgimages') === -1 &&
            input.indexOf('fonts') === -1 &&
            input.indexOf('pficon') === -1,
          use: { loader: 'raw-loader' },
        },
        {
          test: /\.(jpg|jpeg|png|gif)$/i,
          include: [
            distributionSrcDir,
            BASE_SRC_DIR,
            path.resolve(REPO_ROOT, 'node_modules/@patternfly/patternfly/assets/images'),
          ],
          use: [
            {
              loader: 'url-loader',
              options: { limit: 5000, outputPath: 'images', name: '[name].[ext]' },
            },
          ],
        },
        {
          test: /\.s[ac]ss$/i,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    output: {
      filename: '[name].bundle.js',
      path: resolvedOutputDir,
      publicPath: '/',
      chunkFilename: '[name]-[chunkhash].js',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(distributionSrcDir, 'index.html'),
        title,
      }),
      new ModuleFederationPlugin({
        name: 'host',
        filename: 'remoteEntry.js',
        shared: {
          react: { singleton: true, requiredVersion: resolvedDeps.react, eager: true },
          'react-dom': { singleton: true, requiredVersion: resolvedDeps['react-dom'], eager: true },
          'react-router': {
            singleton: true,
            requiredVersion: resolvedDeps['react-router'],
            eager: true,
          },
          'react-router-dom': {
            singleton: true,
            requiredVersion: resolvedDeps['react-router-dom'],
            eager: true,
          },
          '@patternfly/react-core': {
            singleton: true,
            requiredVersion: resolvedDeps['@patternfly/react-core'],
          },
          '@openshift/dynamic-plugin-sdk': {
            singleton: true,
            requiredVersion: resolvedDeps['@openshift/dynamic-plugin-sdk'],
            eager: true,
          },
        },
        exposes: {},
      }),
    ],
    resolve: {
      extensions: ['.js', '.ts', '.tsx', '.jsx'],
      symlinks: true,
      cacheWithContext: false,
    },
  };
};
