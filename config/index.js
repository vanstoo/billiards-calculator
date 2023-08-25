const path = require('path')

const config = {
  projectName: 'billiards-calculator-aliyun',
  date: '2022-9-28',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  alias: {
    '@/components': path.resolve(__dirname, '..', 'src/components'),
    '@/constant': path.resolve(__dirname, '..', 'src/constant'),
    '@/hooks': path.resolve(__dirname, '..', 'src/hooks'),
    '@/pages': path.resolve(__dirname, '..', 'src/pages'),
    '@/typings': path.resolve(__dirname, '..', 'src/typings'),
    '@/utils': path.resolve(__dirname, '..', 'src/utils'),
    'taro-ui$': 'taro-ui/lib/index',
  },
  framework: 'react',
  compiler: 'webpack5',
  cache: {
    enable: true, // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
  },
  mini: {
    webpackChain(chain, webpack) {
      chain.merge({
        optimization: {
          splitChunks: {
            cacheGroups: {
              lodash: {
                name: 'lodash',
                priority: 1000,
                test(module) {
                  return /node_modules[\\/]lodash/.test(module.context)
                },
              },
            },
          },
        },
      })
      // webpack打包体积分析
      chain.plugin('analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
    },
    commonChunks(commonChunks) {
      commonChunks.push('lodash')
      return commonChunks
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
      url: {
        enable: true,
        config: {
          limit: 1024, // 设定转换尺寸上限
        },
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
  },
}

module.exports = function(merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
