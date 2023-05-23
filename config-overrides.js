const {
  disableEsLint,
  useBabelRc,
  override
} = require('customize-cra');
//const ThreadsPlugin = require('threads-plugin')
const path = require('path');

const threadLoaderConfig = {
  loader: 'thread-loader',
  options: {
    workerParallelJobs: 50,
    workerNodeArgs: ['--max-old-space-size=1024'],
    poolRespawn: false,
    poolTimeout: 2000,
    poolParallelJobs: 50,
    name: 'my-pool'
  }
};

// const addThreadsPlugin = config => {
//   config.plugins.push(new ThreadsPlugin());
//   return config;
// }


module.exports = override(
  //addThreadsPlugin,
  config => {
    const wasmExtensionRegExp = /\.wasm$/;

    config.module.rules.forEach(o => {
      if (o.enforce === 'pre') {
        o.use.unshift(threadLoaderConfig)
      }
      (o.oneOf || []).forEach(oneOf => {
        if (oneOf.loader && oneOf.loader.includes('file-loader')) {
          // make file-loader ignore WASM files
          oneOf.exclude.push(wasmExtensionRegExp);
        }
      });
    });

    config.resolve.extensions.push('.wasm');

    config.module.rules.push({
      test: wasmExtensionRegExp,
      include: path.resolve(__dirname, 'src'),
      use: [{ loader: require.resolve('wasm-loader'), options: {} }],
    });
    
    return config;
  },
  useBabelRc(),
  disableEsLint(),
  config => {
    const tsRegExp = /\.ts$/;

    //  // ts-loader is required to reference external typescript projects/files (non-transpiled)
    //  config.module.rules.push({
    //   test: tsRegExp,
    //   loader: 'ts-loader',
    //   //exclude: /node_modules/,
    //   options: {
    //     //transpileOnly: true,
    //     module: "esnext",
    //     //configFile: 'tsconfig.json',
    //   },
    // })
    //console.log(config.output.filename) //static/js/bundle.js
    //config.output.filename= '[chunkhash].[name].[contenthash].[contenthash].bundle.js';

    return config;
  },
);
