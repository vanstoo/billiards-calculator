import * as React from 'react'
import { memo } from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { chooseImg, isValidArray } from '@/utils'
import './index.scss'

export interface ImgUploadProps {
  uploadList: string[] // 附件列表
  uploadFile: (tempFiles: Taro.chooseMedia.ChooseMedia[]) => Promise<void> // 上传图片
  delFileItem: (file: string) => void // 删除图片
}

const ImgUpload: React.FC<ImgUploadProps> = ({ uploadList, delFileItem, uploadFile }) => {
  // 预览图片
  const previewImage = (index: number) => {
    let previewList = uploadList
    Taro.previewImage({
      current: previewList[index], // 当前显示图片的http链接
      urls: previewList, // 需要预览的图片http链接列表
    })
  }

  return (
    <View className="img-upload">
      {isValidArray(uploadList) &&
        uploadList.map((item: string, index: number) => {
          return (
            <View className="img-item" key={item}>
              <View className="del-item" onClick={() => delFileItem(item)}>
                <View className="at-icon at-icon-close-circle"></View>
              </View>
              <Image src={item} onClick={() => previewImage(index)} mode="aspectFill" />
            </View>
          )
        })}
      {uploadList?.length < 3 && (
        <View className="img-item">
          <Image
            src="https://mp-1323a910-dca2-4115-8f03-bb5a391ab617.cdn.bspapp.com/cloudstorage/b6d6a4b6-e69f-4910-b390-0d38a3af7b6c.png"
            onClick={() => chooseImg(uploadFile, 3)}
            mode="aspectFill"
          />
        </View>
      )}
    </View>
  )
}

export default memo(ImgUpload)
