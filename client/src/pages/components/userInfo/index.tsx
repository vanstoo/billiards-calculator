import * as React from 'react'
import { memo, useState } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton, AtAvatar } from 'taro-ui'
import { UseRequest } from '../../../service'
import { UserInfo } from '../../../typings'
import './index.scss'

export interface UserInfoProps {}

const UserInfoPage: React.FC<UserInfoProps> = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>(Taro.getStorageSync('userInfo'))

  const getUserProfile = () => {
    wx.getUserProfile({
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
          }).then(res => {
            // console.log(res, "result");
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

  return (
    <View className="user-info">
      <View className="user-box">
        <AtAvatar circle text="头" image={userInfo?.avatarUrl}></AtAvatar>
        <View className="user-name">{userInfo?.nickName || '—'}</View>
      </View>
      {!userInfo.userOpenId && (
        <AtButton type="primary" onClick={getUserProfile} className="user-btn">
          点击授权登录
        </AtButton>
      )}
      {userInfo.hasCreatePerm && (
        <AtButton className="user-btn" onClick={() => Taro.navigateTo({ url: '/pages/assignAuth/index' })}>
          给新用户授权
        </AtButton>
      )}
    </View>
  )
}

export default memo(UserInfoPage)
