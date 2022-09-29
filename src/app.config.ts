export default defineAppConfig({
  pages: ['pages/index/index', 'pages/assignAuth/index'],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
  plugins: {
    chooseLocation: {
      version: '1.0.9',
      provider: 'wx76a9a06e5b4e693e',
    },
  },
  permission: {
    'scope.userLocation': {
      desc: '你的位置信息将用于小程序定位',
    },
  },
  lazyCodeLoading: 'requiredComponents',
})
