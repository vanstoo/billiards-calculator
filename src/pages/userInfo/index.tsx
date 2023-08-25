import * as React from 'react'
import dayjs from 'dayjs'
import { memo, useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtButton, AtAvatar, AtIcon } from 'taro-ui'
import { UseRequest } from '@/hooks'
import { UserInfo } from '@/typings'
import { calNum, formatDate } from '@/utils'
import './index.less'

export interface UserInfoProps {}

const UserInfoPage: React.FC<UserInfoProps> = () => {
  const userInfo: UserInfo = Taro.getStorageSync('userInfo')
  const [participantsListCount, setParticipantsListCount] = useState(0) // 我发起的活动
  const [creatorListcount, setCreatorListcount] = useState(0) // 我参与的活动数量
  const [playDuration, setPlayDuration] = useState(0) // 打球时长

  useEffect(() => {
    // 获取发起数量
    UseRequest('invitation', {
      type: 'getListCountByCreator',
      userOpenId: userInfo.userOpenId,
    }).then(res => {
      // console.log(res, 'getListCountByCreator')
      if (res) {
        setCreatorListcount(res?.total)
      }
    })
    // 获取参加数量
    UseRequest('invitation', {
      type: 'getListCountByParticipants',
      userOpenId: userInfo.userOpenId,
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
  }, [])

  // 跳转到我发起/我参与的活动列表页面
  const goToGameInvitationList = (type: 'creator' | 'participant') => {
    let param = type === 'creator' ? 'searchByCreator=true' : 'searchByParticipants=true'
    Taro.navigateTo({ url: `/pages/gameInvitation/list/index?${param}=true` })
  }

  // 无权限页面
  if (!userInfo.userOpenId) {
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

  const gotoUpdatePage = () => {
    let canEdit = dayjs(userInfo?.updateTime || dayjs())
      .add(7, 'days')
      .isBefore(dayjs(), 'days')
    if (canEdit) {
      Taro.navigateTo({ url: '/pages/userInfo/editUserInfo/index?type=edit' })
    } else {
      Taro.showToast({
        title: `距离上次修改不足七天，请在${formatDate(dayjs(userInfo.updateTime).add(7, 'days'))}后尝试修改`,
        icon: 'none',
        duration: 3000,
        mask: true,
      })
    }
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
          <View className="edit-btn" onClick={gotoUpdatePage}>
            修改
          </View>
        </View>
        <View className="invitation-info">
          {userInfo.hasCreatePerm && (
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
      {userInfo.hasCreatePerm && (
        <View className="user-service">
          <View className="service-title">用户服务</View>
          <View className="service-box">
            <View
              className="service-item"
              hoverClass="item-hovered"
              hoverStayTime={200}
              onClick={() => Taro.navigateTo({ url: '/pages/assignAuth/index' })}
            >
              <AtIcon value="lock" size="30" />
              <View>帮新用户开通发起约球权限</View>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

export default memo(UserInfoPage)
