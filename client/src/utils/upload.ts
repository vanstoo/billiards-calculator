import dayjs from 'dayjs'
import Taro from '@tarojs/taro'

// 上传图片
export const chooseImg = (callback: Function, onlyCamera: boolean = false) => {
  Taro.showActionSheet({
    itemList: onlyCamera ? ['拍摄照片'] : ['拍摄照片', '从手机相册选择'],
    success: (res: any) => {
      if (!res.cancel) {
        Taro.chooseImage({
          count: 1,
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
export const uploadImg = (res: string[], folderName: 'billImg') => {
  Taro.showLoading({
    title: '上传中',
    mask: true,
  })
  const filePath = res[0]
  const cloudPath = `${folderName}/${dayjs().valueOf()}.jpg` // 时间戳作为路径
  return Taro.cloud.uploadFile({ cloudPath, filePath }).then(res => {
    if (res && res.fileID) {
      Taro.showToast({
        icon: 'success',
        title: '上传成功',
        mask: true,
      })
      console.log(res, 'uploadFileuploadFileuploadFileuploadFile', cloudPath)
      return res.fileID
    } else {
      let timer = setTimeout(() => {
        Taro.showToast({
          title: `${res && res.errMsg ? res.errMsg : '上传失败'}`,
          icon: 'none',
          mask: true,
        })
        clearTimeout(timer)
      }, 1500)
    }
  })
}
