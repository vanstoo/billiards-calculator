import * as React from 'react'
import { memo } from 'react'
import Taro from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import { View } from '@tarojs/components'
import { UserInfo } from '../../../typings'
import './index.scss'

export interface HelpInfoProps {}

const HelpInfo: React.FC<HelpInfoProps> = () => {
  const userInfo: UserInfo = Taro.getStorageSync('userInfo')

  const imgList = [
    'cloud://test-odvq4.7465-test-odvq4-1302918325/billImg/1600853141527.jpg',
    'cloud://test-odvq4.7465-test-odvq4-1302918325/billImg/1600853161456.jpg',
    'cloud://test-odvq4.7465-test-odvq4-1302918325/billImg/结束.png',
  ]
  // 预览图片
  const previewImage = (index: number) => {
    let previewList = imgList
    Taro.previewImage({
      current: previewList[index], // 当前显示图片的http链接
      urls: previewList, // 需要预览的图片http链接列表
    })
  }
  return (
    <View className="help-info">
      {userInfo.hasCreatePerm ? (
        <AtButton type="primary" onClick={() => previewImage(0)}>
          查看流程图
        </AtButton>
      ) : (
        '这里放教程'
      )}
    </View>
  )
}

export default memo(HelpInfo)
