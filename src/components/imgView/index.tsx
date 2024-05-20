import * as React from 'react'
import { memo } from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { isValidArray } from '@/utils'
import './index.scss'

export interface ImgViewProps {
  uploadList: string[] // 附件列表
}

const ImgView: React.FC<ImgViewProps> = ({ uploadList }) => {
  // 预览图片
  const previewImage = (index: number) => {
    let previewList = uploadList
    Taro.previewImage({
      current: previewList[index], // 当前显示图片的http链接
      urls: previewList, // 需要预览的图片http链接列表
    })
  }

  return (
    <View className="img-view">
      {isValidArray(uploadList) &&
        uploadList.map((item: string, index: number) => {
          return (
            <View className="img-item" key={item}>
              <Image src={item} onClick={() => previewImage(index)} mode="aspectFill" />
            </View>
          )
        })}
    </View>
  )
}

export default memo(ImgView)
