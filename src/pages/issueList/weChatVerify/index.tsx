import * as React from 'react'
import { memo } from 'react'
import { View, Image } from '@tarojs/components'
import { previewImg } from '@/utils'
import '../index.less'

interface weChatVerifyProps {}

const ImgList = [
  'https://mp-1323a910-dca2-4115-8f03-bb5a391ab617.cdn.bspapp.com/common/小程序认证1.jpg',
  'https://mp-1323a910-dca2-4115-8f03-bb5a391ab617.cdn.bspapp.com/common/认证3.jpg',
  'https://mp-1323a910-dca2-4115-8f03-bb5a391ab617.cdn.bspapp.com/common/小程序改名.png',
]

const weChatVerify: React.FC<weChatVerifyProps> = () => {
  return (
    <View className="article">
      <View className="article-h1">关于小程序认证赞助说明</View>
      <View className="at-article__content">
        <View className="at-article__section">
          <View className="article-h3">1、为什么需要年审认证？</View>
          <View className="article-p">
            小程序不通过年审认证的话，部分功能会受限。比如分享小程序的能力，而本小程序的分享功能是群内使用小程序的核心场景之一，所以需要完成年审认证。
            <Image src={ImgList[0]} onClick={() => previewImg(ImgList[0], ImgList)} mode="aspectFill" />
          </View>
          <View className="article-h3">2、小程序的认证费用是多少，时间是多长？</View>
          <View className="article-p">
            小程序认证费用30元，至少每年都认证一次。
            <Image src={ImgList[1]} onClick={() => previewImg(ImgList[1], ImgList)} mode="aspectFill" />
          </View>
          <View className="article-h3">3、小程序的认证福利</View>
          <View className="article-p">
            现小程序名称为‘王司徒666’，在当前认证期限结束后，新认证赞助人可在认证期间拥有小程序的2次改名特权（注：改名需符合小程序命名规范，部分商业名称可能需要一些相关材料才可过审）。
            <Image src={ImgList[2]} onClick={() => previewImg(ImgList[2], ImgList)} mode="aspectFill" />
          </View>
        </View>
      </View>
    </View>
  )
}

export default memo(weChatVerify)
