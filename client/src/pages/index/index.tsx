import * as React from 'react'
import { useState, memo } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTabBar } from 'taro-ui'
import { UserInfo, HelpInfo } from '../components'
import InvitationList from '../gameInvitation/list'
import './index.scss'

export interface IndexProps {}

const tabMenu = [
  { title: '首页', iconType: 'home' },
  { title: '帮助', iconType: 'help' },
  { title: '信息', iconType: 'user' },
]

// 带tabbar首页
const Index: React.FC<IndexProps> = () => {
  const [tabKey, setTabKey] = useState<number>(0)

  // tab 切换
  const handleTabClick = (value: number) => {
    // console.log(value, typeof value);
    setTabKey(value)
  }

  return (
    <View className="home-page">
      {tabKey === 0 && <InvitationList goToLogin={handleTabClick} />}
      {tabKey === 1 && <HelpInfo />}
      {tabKey === 2 && <UserInfo />}
      <AtTabBar
        color="#999"
        selectedColor="#0055ff"
        fixed
        tabList={tabMenu}
        onClick={handleTabClick}
        current={tabKey}
      />
    </View>
  )
}

export default memo(Index)
