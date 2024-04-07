import Taro, { useDidShow } from '@tarojs/taro'
import React, { useEffect, PropsWithChildren } from 'react'
import { getMpServerless } from '@/utils'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import './app.less'
import './custom-variables.scss'

dayjs.locale('zh-cn')

const App: React.FC<PropsWithChildren> = ({ children }) => {
  const mpServerless = getMpServerless()
  const init = async () => {
    await mpServerless.init()
  }

  useEffect(() => {
    init()
  }, [])

  useDidShow(() => {
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
  })

  return children
}

export default App
