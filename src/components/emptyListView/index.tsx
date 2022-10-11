import * as React from 'react'
import { memo } from 'react'
import { View, Image } from '@tarojs/components'
import './index.scss'

export interface EmptyListViewProps {}

const EmptyListView: React.FC<EmptyListViewProps> = () => {
  return (
    <View className="empty-search">
      <Image
        src="https://mp-1323a910-dca2-4115-8f03-bb5a391ab617.cdn.bspapp.com/cloudstorage/306029e9-775f-403e-ad17-dcf4e71f15d8.png"
        mode="aspectFill"
      />
      <View>没有当前条件下的信息和数据。</View>
    </View>
  )
}

export default memo(EmptyListView)
