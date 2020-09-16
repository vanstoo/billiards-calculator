import { Component } from 'react'
import Taro from '@tarojs/taro'
import { UseRequest } from './service'
import { goToLoginPage } from './utils'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')
import './app.scss'
import './custom-variables.scss'

class App extends Component {
  componentDidMount() {
    Taro.getSystemInfo({
      success: res => {
        console.log(res.platform)
        let envType = res.platform === 'devtools' ? 'test-odvq4' : 'prod-ahprr'
        Taro.cloud.init({
          env: envType,
          traceUser: true,
        })
      },
    })
  }

  componentDidShow() {
    UseRequest('login', {
      type: 'get',
    }).then(result => {
      console.log(result, ' login')
      if (!result) {
        goToLoginPage()
      } else {
        Taro.setStorageSync('userInfo', result)
      }
    })
    const updateManager = Taro.getUpdateManager()
    if (typeof updateManager === 'undefined') {
      return
    }
    updateManager.onCheckForUpdate(res => {
      // 请求完新版本信息的回调
      // console.log(res.hasUpdate, "请求完新版本信息的回调");
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

  // this.props.children 是将要会渲染的页面
  render() {
    return this.props.children
  }
}

export default App
