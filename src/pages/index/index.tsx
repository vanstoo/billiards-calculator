import { FC, useState, memo, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTabBar, AtButton } from 'taro-ui'
import { goToLoginPage } from '@/utils'
import { useUserInfo } from '@/hooks'
import UserInfo from '../userInfo'
import IssueList from '../issueList'
import { InvitationList } from '../gameInvitation/components'

interface IndexProps {}

const tabMenu = [
  { title: '首页', iconType: 'home' },
  { title: 'Q&A', iconType: 'help' },
  { title: '信息', iconType: 'user' },
]

const Index: FC<IndexProps> = () => {
  const [tabKey, setTabKey] = useState<number>(0)
  const { defaultKey } = useRouter().params
  const { userInfo } = useUserInfo()

  useEffect(() => {
    // console.log(defaultKey, 'defaultKey')
    if (defaultKey) {
      setTabKey(Number(defaultKey))
    }
  }, [defaultKey])

  useEffect(() => {
    console.log(userInfo, 'userInfo Index useEffectuseEffectuseEffect')
  }, [userInfo])

  // tab 切换
  const handleTabClick = (value: number) => {
    // console.log(value, typeof value);
    setTabKey(value)
  }

  // 创建约球
  const goToCreateInvitation = () => {
    if (userInfo) {
      if (userInfo.hasCreatePerm && userInfo.userOpenId) {
        Taro.navigateTo({ url: '/pages/gameInvitation/create/index' })
      }
    } else {
      goToLoginPage()
    }
  }

  return (
    <View className="home-page">
      {tabKey === 0 && (
        <View className="initation-list-box">
          <InvitationList />
          {userInfo?.hasCreatePerm && (
            <View className="fixed-btn" style={{ paddingBottom: '170rpx' }}>
              <AtButton type="primary" circle onClick={goToCreateInvitation}>
                发起约球
              </AtButton>
            </View>
          )}
        </View>
      )}
      {tabKey === 1 && <IssueList />}
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
