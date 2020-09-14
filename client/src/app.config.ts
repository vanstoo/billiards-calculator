export default {
  pages: [
    'pages/index/index',
    'pages/gameInvitation/create/index',
    'pages/gameInvitation/detail/index',
    'pages/gameInvitation/finish/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
  cloud: true,
  plugins: {
    chooseLocation: {
      version: '1.0.5',
      provider: 'wx76a9a06e5b4e693e',
    },
  },
  permission: {
    'scope.userLocation': {
      desc: '你的位置信息将用于小程序定位',
    },
  },
}
