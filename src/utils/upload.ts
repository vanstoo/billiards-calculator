import Taro from '@tarojs/taro'
import { MPServerless } from '@alicloud/mpserverless-sdk/dist/esm/mpserverless'

// 上传图片
export const chooseImg = (callback: Function, onlyCamera: boolean = false) => {
  Taro.showActionSheet({
    itemList: onlyCamera ? ['拍摄照片'] : ['拍摄照片', '从手机相册选择'],
    success: (res: any) => {
      if (!res.cancel) {
        Taro.chooseImage({
          count: 9,
          sizeType: ['compressed'], // 默认传压缩图
          sourceType: res.tapIndex === 0 ? ['camera'] : ['album'],
          success: imgRes => {
            console.log(imgRes, 'Taro.chooseImage')
            callback(imgRes.tempFilePaths)
          },
        })
      }
    },
  })
}

// 上传图片
export const uploadImg = (filePath: string[]): Promise<string[]> => {
  const mpServerless: MPServerless = Taro.getApp()?.$app?.mpServerless || ''
  Taro.showLoading({
    title: '上传中',
    mask: true,
  })
  let task = filePath.map(file => {
    return new Promise((resolve, reject) => {
      mpServerless.file
        .uploadFile({ filePath: file })
        .then(res => resolve(res.fileUrl))
        .catch(() => reject(new Error('上传失败')))
    })
  })
  return Promise.all(task)
    .then((res: string[]) => {
      Taro.showToast({
        icon: 'success',
        title: '上传成功',
        mask: true,
      })
      // console.log(res, 'finall')
      return res
    })
    .catch(err => {
      console.log(err)
      let timer = setTimeout(() => {
        Taro.showToast({
          title: '上传失败',
          icon: 'none',
          mask: true,
        })
        clearTimeout(timer)
      }, 1500)
      return []
    })
}
