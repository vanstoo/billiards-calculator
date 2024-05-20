import Taro from '@tarojs/taro'
import { getMpServerless, formatDate } from '@/utils'
import { FilePrefix } from '@/typings'
import dayjs from 'dayjs'

// 上传图片
export const chooseImg = (callback: Function, count: number = 1) => {
  Taro.showActionSheet({
    itemList: ['拍摄照片', '从手机相册选择'],
    success: (res: any) => {
      if (!res.cancel) {
        Taro.chooseMedia({
          count: count,
          mediaType: ['image'],
          sizeType: ['compressed'], // 默认传压缩图
          sourceType: res.tapIndex === 0 ? ['camera'] : ['album'],
          success: imgRes => {
            console.log(imgRes, 'Taro.chooseImage')
            callback(imgRes.tempFiles)
          },
        })
      }
    },
  })
}

// 上传图片
export const uploadImg = async (
  tempFiles: Taro.chooseMedia.ChooseMedia[],
  filePrefix: FilePrefix,
): Promise<string[]> => {
  const mpServerless = getMpServerless()
  Taro.showLoading({
    title: '上传中',
    mask: true,
  })
  let task = tempFiles.map(({ tempFilePath }, idx) => {
    let fileSplit = tempFilePath.split('.')
    let fileSuffix = fileSplit[fileSplit.length - 1]
    let cloudPath = `/${filePrefix}/${formatDate(dayjs(), 'YYYYMMDDHHmmssSSS')}_${idx + 1}.${fileSuffix}`
    console.log(filePrefix, cloudPath, 'cloudPath')
    return new Promise<string>((resolve, reject) => {
      mpServerless.file
        .uploadFile({
          filePath: tempFilePath,
          cloudPath, // 云端文件路径
        })
        .then(res => resolve(res.fileUrl))
        .catch(() => reject(new Error('上传失败')))
    })
  })
  try {
    const res_1 = await Promise.all(task)
    Taro.showToast({
      icon: 'success',
      title: '上传成功',
      mask: true,
    })
    return res_1
  } catch (err) {
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
  }
}

// 预览图片
export const previewImg = (url: string, urlList: string[]) => {
  Taro.previewImage({
    current: url, // 当前显示图片的http链接
    urls: urlList, // 需要预览的图片http链接列表
  })
}
