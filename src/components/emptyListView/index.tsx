import * as React from 'react'
import { memo } from 'react'
import { View, Image } from '@tarojs/components'
import './index.scss'

export interface EmptyListViewProps {}

const EmptyListView: React.FC<EmptyListViewProps> = () => {
  return (
    <View className="empty-search">
      <Image
        src="https://alyqfqjsix.cdn.bspapp.com/ALYQFQJSIX-9fdd81ce-5fdd-4699-b24d-c74bf4be872f/f124096b-6ccd-425a-8032-8d07149f57d8.png"
        mode="aspectFill"
      />
      <View>没有当前条件下的信息和数据。</View>
    </View>
  )
}

export default memo(EmptyListView)
