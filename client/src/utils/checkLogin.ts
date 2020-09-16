import Taro from '@tarojs/taro'

export const goToLoginPage = () => {
  Taro.showToast({
    title: '请先授权登陆',
    icon: 'none',
    mask: true,
  })
  let timer = setTimeout(() => {
    Taro.navigateTo({ url: '/pages/index/index?defaultKey=2' })
    clearTimeout(timer)
  }, 2000)
}
