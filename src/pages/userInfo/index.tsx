import * as React from 'react'
import { memo, useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtButton, AtAvatar, AtIcon } from 'taro-ui'
import { UseRequest } from '@/hooks'
import { UserInfo } from '@/typings'
import { isValidArray, calDurationByParticipants, calNum, formatDate } from '@/utils'
import dayjs from 'dayjs'
import './index.less'

export interface UserInfoProps {}

const UserInfoPage: React.FC<UserInfoProps> = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>(Taro.getStorageSync('userInfo'))
  const [participantsListCount, setParticipantsListCount] = useState(0) // 我发起的活动
  const [creatorListcount, setCreatorListcount] = useState(0) // 我参与的活动数量
  const [playDuration, setPlayDuration] = useState(0) // 打球时长

  useEffect(() => {
    // // 获取发起数量
    // UseRequest('invitation', {
    //   type: 'getListCountByCreator',
    // }).then(res => {
    //   // console.log(res, 'getListCountByCreator')
    //   if (res) {
    //     setCreatorListcount(res?.total)
    //   }
    // })
    // // 获取参加数量
    // UseRequest('invitation', {
    //   type: 'getListCountByParticipants',
    // }).then(res => {
    //   // console.log(res, 'getListCountByParticipants')
    //   if (res) {
    //     setParticipantsListCount(res?.total)
    //   }
    // })
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

  const getUserProfile = () => {
    Taro.getUserProfile({
      desc: '用于完善用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: detail => {
        console.log(detail)
        if (detail.userInfo) {
          Taro.showLoading({
            title: '更新用户信息中...',
            mask: true,
          })
          // 新增/更新用户信息
          UseRequest('login', {
            type: 'create',
            nickName: detail.userInfo.nickName,
            avatarUrl: detail.userInfo.avatarUrl,
            updateTime: new Date(dayjs().valueOf()),
          }).then(res => {
            console.log(res, 'result')
            if (res) {
              Taro.hideLoading()
              // 更新本地用户信息
              Taro.showLoading({
                title: '获取用户信息中...',
                mask: true,
              })
              UseRequest('login', {
                type: 'get',
              }).then(result => {
                // console.log(result, " login");
                Taro.hideLoading()
                Taro.setStorageSync('userInfo', result)
                setUserInfo(result)
                Taro.redirectTo({ url: '/pages/index/index?defaultKey=0' })
              })
            }
          })
        }
      },
      fail: () => {
        Taro.showToast({
          title: '只有授权才可登陆！',
          mask: true,
          icon: 'none',
        })
      },
    })
  }

  // 获取并格式化所有人参与人数据
  const getAndFormatParticipants = () => {
    // UseRequest('invitation', {
    //   type: 'getList',
    //   pageNum: 1,
    //   pageSize: 1000,
    //   searchByCreator: false,
    //   searchByParticipants: false,
    // }).then(result => {
    //   if (result && result.list) {
    //     let arr = []
    //     result.list.map(x => {
    //       if (x.participants) {
    //         arr = arr.concat(
    //           x.participants.map(y => ({
    //             ...y,
    //             invitationId: x._id,
    //             createTime: x.lastUpdateTime,
    //             updateTime: x.lastUpdateTime,
    //           })),
    //         )
    //       }
    //     })
    //     // console.log(arr, 'arr')
    //     console.log(JSON.stringify(arr), 'arr')
    //   }
    // })
  }

  // 跳转到我发起/我参与的活动列表页面
  const goToGameInvitationList = (type: 'creator' | 'participant') => {
    let param = type === 'creator' ? 'searchByCreator=true' : 'searchByParticipants=true'
    // Taro.navigateTo({ url: `/pages/gameInvitation/list/index?${param}=true` })
  }

  // 无权限页面
  if (!userInfo.userOpenId) {
    return (
      <View className="no-permission-page">
        <Image src="https://alyqfqjsix.cdn.bspapp.com/ALYQFQJSIX-9fdd81ce-5fdd-4699-b24d-c74bf4be872f/8dfc8233-96ab-478e-ac28-26dff4f6afea.svg" />
        <View>暂无权限</View>
        <AtButton type="primary" onClick={getUserProfile} className="user-btn">
          点击授权登录
        </AtButton>
      </View>
    )
  }
  return (
    <View className="user-page">
      <View className="user-info">
        <View className="user-box">
          <AtAvatar circle text="头" image={userInfo?.avatarUrl} size="large" />
          <View className="user-name">{userInfo?.nickName || '—'}</View>
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
            // hoverClass="item-hovered" hoverStayTime={200}
            // onClick={getAndFormatParticipants}
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
