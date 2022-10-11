export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/assignAuth/index',
    'pages/gameInvitation/create/index',
    'pages/gameInvitation/detail/index',
    'pages/gameInvitation/list/index',
    'pages/gameInvitation/finish/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
  permission: {
    'scope.userLocation': {
      desc: '你的位置信息将用于小程序定位',
    },
  },
  requiredPrivateInfos: ['chooseLocation'],
  lazyCodeLoading: 'requiredComponents',
})
