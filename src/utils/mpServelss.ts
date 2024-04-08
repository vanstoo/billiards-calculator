import MPServerless from '@alicloud/mpserverless-sdk'

const mpServerless = new MPServerless(wx, {
  appId: 'wx1bb44f3cd0747acd', // 小程序应用标识
  spaceId: 'mp-1323a910-dca2-4115-8f03-bb5a391ab617', // 服务空间标识
  clientSecret: '0t05H+uwwHTD5c/Dw/wjag==', // 服务空间 secret key
  endpoint: 'https://api.next.bspapp.com', // 服务空间地址，从小程序 serverless 控制台处获得
})

export const getMpServerless = () => mpServerless
