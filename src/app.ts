import { Component, PropsWithChildren } from 'react'
import './app.less'

import MPServerless from '@alicloud/mpserverless-sdk'

const mpserverless = new MPServerless(wx, {
  appId: 'wx1bb44f3cd0747acd', // 小程序应用标识
  spaceId: '9fdd81ce-5fdd-4699-b24d-c74bf4be872f', // 服务空间标识
  clientSecret: 'qOWEDjRKm0cehFj4D7vaYQ==', // 服务空间 secret key
  endpoint: 'https://api.bspapp.com', // 服务空间地址，从小程序 serverless 控制台处获得
})

class App extends Component<PropsWithChildren> {
  componentDidMount() {
    mpserverless.init()
  }

  componentDidShow() {}

  componentDidHide() {}

  // this.props.children 是将要会渲染的页面
  render() {
    return this.props.children
  }
}

export default App
