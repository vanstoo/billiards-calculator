import Taro from '@tarojs/taro'
import { RequestApi } from '@/typings'
import { MPServerless } from '@alicloud/mpserverless-sdk/dist/esm/mpserverless'

// 默认POST请求
export const UseRequest = async (name: RequestApi, data: any) => {
  const mpServerless: MPServerless = Taro.getApp()?.$app?.mpServerless || ''
  return mpServerless?.function
    .invoke(name, data)
    .then((res: any) => {
      // console.log(name, "apiResponse", res);
      if (res?.result?.errMsg) {
        Taro.showToast({
          title: `获取失败，请稍后尝试或联系管理员，异常信息：${res.result.errMsg}`,
          icon: 'none',
          duration: 5000,
          mask: true,
        })
        let timer = setTimeout(() => {
          Taro.hideLoading()
          clearTimeout(timer)
          return null
        }, 5000)
      } else {
        return res.result
      }
    })
    .catch(err => {
      console.log(err, 'catctError')
      if (err?.message?.includes('Command failed with error 11000')) {
        Taro.showToast({
          title: `该昵称已被使用，请更换昵称后再提交`,
          icon: 'none',
          duration: 3000,
          mask: true,
        })
      } else {
        Taro.showToast({
          title: `获取失败，请稍后尝试或联系管理员`,
          icon: 'none',
          duration: 3000,
          mask: true,
        })
      }
      let timer = setTimeout(() => {
        Taro.hideLoading()
        clearTimeout(timer)
        return null
      }, 3000)
    })
}
