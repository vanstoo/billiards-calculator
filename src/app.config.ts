export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/gameInvitation/create/index',
    'pages/gameInvitation/detail/index',
    'pages/gameInvitation/list/index',
    'pages/gameInvitation/finish/index',
    'pages/userInfo/editUserInfo/index',
    'pages/bonusPreferences/assignAuth/index',
    'pages/bonusPreferences/editUserLevel/index',
    'pages/bonusPreferences/levelLogList/index',
    'pages/bonusPreferences/sponsor/sponsorUpdate/index',
    'pages/bonusPreferences/sponsor/sponsorList/index',
    'pages/issueList/userLevel/index',
    'pages/issueList/aliyunData/index',
    'pages/issueList/weChatVerify/index',
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
