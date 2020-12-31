import * as React from 'react'
import { memo } from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './index.scss'

export interface EmptyListViewProps {}

const EmptyListView: React.FC<EmptyListViewProps> = () => {
  return (
    <View className="empty-search">
      <Image
        src="https://image.qfstatic.com/qfSales/d8098a78-6999-436e-8608-28c407a74cd8/img-search-nodata@2x.png"
        mode="aspectFill"
      />
      <View>没有当前条件下的信息和数据。</View>
    </View>
  )
}

export default memo(EmptyListView)
