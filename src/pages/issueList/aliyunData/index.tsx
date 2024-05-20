import * as React from 'react'
import { memo } from 'react'
import { View, Image } from '@tarojs/components'
import { previewImg } from '@/utils'
import '../index.less'

interface AliyunDataProps {}

const ImgList = [
  'https://mp-1323a910-dca2-4115-8f03-bb5a391ab617.cdn.bspapp.com/common/小程序配额.png',
  'https://mp-1323a910-dca2-4115-8f03-bb5a391ab617.cdn.bspapp.com/common/微信云开发费用.png',
]

const AliyunData: React.FC<AliyunDataProps> = () => {
  return (
    <View className="article">
      <View className="article-h1">关于小程序云数据赞助说明</View>
      <View className="at-article__content">
        <View className="at-article__section">
          <View className="article-h3">1、小程序的数据存储到了哪里？</View>
          <View className="article-p">本小程序所有数据都通过阿里云的EMAS Serverless服务存储。</View>
          <View className="article-h3">2、EMAS Serverless费用是多少？</View>
          <View className="article-p">
            一开始使用的是EMAS
            Serverless的开发者版，但是每天的数据库读写次数分别为500/300次。在一次约球用户多的情况下会出现超出限制导致小程序无法使用。
            所以目前使用的是EMAS Serverless的基础版，费用为5元每月，具体配额如下图：
            <Image src={ImgList[0]} onClick={() => previewImg(ImgList[0], ImgList)} mode="aspectFill" />
          </View>
          <View className="article-h3">3、为什么使用阿里云的EMAS Serverless？</View>
          <View className="article-p">
            虽然微信小程序自带云开发及对应云数据存储服务，但是需要19.9元每月。相比之下，阿里云的EMAS
            Serverless是更有性价比的选择。
            <Image src={ImgList[1]} onClick={() => previewImg(ImgList[1], ImgList)} mode="aspectFill" />
          </View>
          <View className="article-h3">4、小程序云数据赞助福利</View>
          <View className="article-p">
            目前小程序会在首页列表顶部展示赞助人信息，后续考虑除了首页外，会在约球详情页面增加弹窗展示赞助人的信息，弹窗频率为暂定为一月一次。
          </View>
        </View>
      </View>
    </View>
  )
}

export default memo(AliyunData)
