import Taro from '@tarojs/taro'
import { Component, PropsWithChildren } from 'react'
import MPServerless from '@alicloud/mpserverless-sdk'
import { goToLoginPage, formatDate } from './utils'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import './app.less'
import './custom-variables.scss'
dayjs.locale('zh-cn')

const mpServerless = new MPServerless(wx, {
  appId: 'wx1bb44f3cd0747acd', // 小程序应用标识
  spaceId: 'mp-1323a910-dca2-4115-8f03-bb5a391ab617', // 服务空间标识
  clientSecret: '0t05H+uwwHTD5c/Dw/wjag==', // 服务空间 secret key
  endpoint: 'https://api.next.bspapp.com', // 服务空间地址，从小程序 serverless 控制台处获得
})

class App extends Component<PropsWithChildren> {
  mpServerless = mpServerless

  async componentDidMount() {
    await mpServerless.init()
    mpServerless.function
      .invoke('login', {
        type: 'get',
      })
      .then((res: any) => {
        if (!res?.result) {
          goToLoginPage()
        } else {
          if (dayjs().isAfter(formatDate(res?.result.updateTime), 'month')) {
            Taro.setStorageSync('userInfo', {})
            goToLoginPage()
          } else {
            Taro.setStorageSync('userInfo', res?.result)
          }
        }
      })
  }

  componentDidShow() {
    const updateManager = Taro.getUpdateManager()
    if (typeof updateManager === 'undefined') {
      return
    }
    updateManager.onCheckForUpdate(res => {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate, '请求完新版本信息的回调')
    })
    updateManager.onUpdateReady(() => {
      Taro.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        },
      })
    })
    updateManager.onUpdateFailed(() => {
      // 新版本下载失败
      Taro.showToast({
        title: `新版本下载失败`,
        icon: 'none',
        duration: 3000,
        mask: true,
      })
    })
  }

  componentDidHide() {}

  componentDidCatchError(error) {
    console.log(error, 'componentDidCatchError')
  }

  render() {
    return this.props.children
  }
}

export default App
