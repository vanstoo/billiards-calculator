import * as React from 'react'
import { memo } from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { chooseImg, isValidArray } from '@/utils'
import './index.scss'

export interface ImgUploadProps {
  uploadList: string[] // 附件列表
  uploadFile: (tempFilePaths: string[]) => Promise<void> // 上传图片
  delFileItem: (file: string) => void // 删除图片
}

export interface ImgUploadProps {}

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
      <View className="img-item">
        <Image
          src="https://alyqfqjsix.cdn.bspapp.com/ALYQFQJSIX-9fdd81ce-5fdd-4699-b24d-c74bf4be872f/2b2df056-2d29-400b-8e94-f0133c3cf542.png"
          onClick={() => chooseImg(uploadFile)}
          mode="aspectFill"
        />
      </View>
    </View>
  )
}

export default memo(ImgUpload)
