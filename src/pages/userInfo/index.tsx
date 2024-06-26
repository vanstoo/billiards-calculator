import * as React from 'react'
import { memo, useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtButton, AtAvatar, AtIcon } from 'taro-ui'
import { UseRequest, useUserInfo } from '@/hooks'
import { calNum } from '@/utils'
import { LevelTag } from '@/components'
import './index.less'

type MenuItem = {
  title: string
  icon: string
  path: string
  permission: boolean
  sort: number
}

export interface UserInfoProps {}

const UserInfoPage: React.FC<UserInfoProps> = () => {
  const { userInfo, isAdmin } = useUserInfo()

  const [participantsListCount, setParticipantsListCount] = useState(0) // 我发起的活动
  const [creatorListcount, setCreatorListcount] = useState(0) // 我参与的活动数量
  const [playDuration, setPlayDuration] = useState(0) // 打球时长

  const MenuList: MenuItem[] = [
    {
      title: '开通约球权限',
      icon: 'lock',
      path: '/pages/bonusPreferences/assignAuth/index',
      permission: userInfo?.hasCreatePerm,
      sort: 1,
    },
    {
      title: '修改档位',
      icon: 'equalizer',
      // 跳转编辑档位页面 普通用户半年才可更新一次 管理员随时可更新
      path: '/pages/bonusPreferences/editUserLevel/index',
      permission: true,
      sort: 2,
    },
    {
      title: '修改档位记录',
      icon: 'search',
      path: '/pages/bonusPreferences/levelLogList/index',
      permission: true,
      sort: 3,
    },
    {
      title: '赞助信息记录',
      icon: 'heart',
      path: '/pages/bonusPreferences/sponsor/sponsorList/index',
      permission: true,
      sort: 4,
    },
    {
      title: '修改赞助人',
      icon: 'shopping-bag',
      path: '/pages/bonusPreferences/sponsor/sponsorUpdate/index',
      permission: isAdmin,
      sort: 5,
    },
  ]

  useEffect(() => {
    if (userInfo?.userOpenId) {
      // 获取发起数量
      UseRequest('invitation', {
        type: 'getListCountByCreator',
        userOpenId: userInfo?.userOpenId,
      }).then(res => {
        // console.log(res, 'getListCountByCreator')
        if (res) {
          setCreatorListcount(res?.total)
        }
      })
      // 获取参加数量
      UseRequest('invitation', {
        type: 'getListCountByParticipants',
        userOpenId: userInfo?.userOpenId,
      }).then(res => {
        // console.log(res, 'getListCountByParticipants')
        if (res) {
          setParticipantsListCount(res?.total)
        }
      })
      // // 获取打球时长
      // UseRequest('invitation', {
      //   type: 'getCombineList',
      // }).then(res => {
      //   if (res && isValidArray(res.list)) {
      //     // 过滤开始结束时间相同或不存在的数据
      //     let validArr = res.list.filter(x => x.startTime && x.endTime && x.startTime !== x.endTime)
      //     const { durationSum } = calDurationByParticipants(validArr)
      //     setPlayDuration(durationSum)
      //   }
      // })
    }
  }, [userInfo?.userOpenId])

  // 跳转到我发起/我参与的活动列表页面
  const goToGameInvitationList = (type: 'creator' | 'participant') => {
    let param = type === 'creator' ? 'searchByCreator=true' : 'searchByParticipants=true'
    Taro.navigateTo({ url: `/pages/gameInvitation/list/index?${param}=true` })
  }

  // 无权限页面
  if (!userInfo?.userOpenId) {
    return (
      <View className="no-permission-page">
        <Image src="https://mp-1323a910-dca2-4115-8f03-bb5a391ab617.cdn.bspapp.com/cloudstorage/bdb255d2-e26e-4b02-a2c0-19bd397860ea.svg" />
        <View>暂无权限</View>
        <AtButton
          type="primary"
          onClick={() => Taro.navigateTo({ url: '/pages/userInfo/editUserInfo/index' })}
          className="user-btn"
        >
          点击注册登录
        </AtButton>
      </View>
    )
  }

  const onMenuItemClick = (path: string) => {
    Taro.navigateTo({ url: path })
  }
  const gotoUpdatePage = () => {
    Taro.navigateTo({ url: '/pages/userInfo/editUserInfo/index?type=edit' })
  }

  return (
    <View className="user-page">
      <View className="user-info">
        <View className="user-box">
          <AtAvatar
            circle
            text="头"
            image={
              userInfo?.avatarUrl ||
              'https://mp-1323a910-dca2-4115-8f03-bb5a391ab617.cdn.bspapp.com/cloudstorage/5365db08-3858-4ea9-8c1d-3132f399d06f.png'
            }
            size="large"
          />
          <View className="user-name">{userInfo?.nickName || '—'}</View>
          <View>
            <LevelTag type="primary" level={userInfo?.level} />
          </View>
          <View className="edit-btn" onClick={gotoUpdatePage}>
            修改
          </View>
        </View>
        <View className="invitation-info">
          {userInfo?.hasCreatePerm && (
            <View
              className="info-item"
              hoverClass="item-hovered"
              hoverStayTime={200}
              onClick={() => goToGameInvitationList('creator')}
            >
              <View className="info-value">{creatorListcount}</View>
              <View className="info-label">我发起的</View>
            </View>
          )}
          <View
            className="info-item"
            hoverClass="item-hovered"
            hoverStayTime={200}
            onClick={() => goToGameInvitationList('participant')}
          >
            <View className="info-value">{participantsListCount}</View>
            <View className="info-label">我参与的</View>
          </View>
          <View
            className="info-item"
            onClick={() =>
              Taro.showToast({
                title: '暂不支持（懒得做）',
                mask: true,
                icon: 'none',
              })
            }
          >
            <View className="info-value">{calNum(playDuration / 60)}</View>
            <View className="info-label">打球时长(小时)</View>
          </View>
        </View>
      </View>
      <View className="user-service">
        <View className="service-title">附加功能</View>
        <View className="service-box">
          {MenuList.filter(({ permission }) => permission).map(item => {
            return (
              <View
                key={item.title}
                className="service-item"
                hoverClass="item-hovered"
                hoverStayTime={200}
                onClick={() => onMenuItemClick(item.path)}
              >
                <AtIcon value={item.icon} size="30" />
                <View>{item.title}</View>
              </View>
            )
          })}
        </View>
      </View>
    </View>
  )
}

export default memo(UserInfoPage)
