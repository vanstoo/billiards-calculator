import * as React from 'react'
import { memo, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import { AtList, AtListItem, AtTextarea, AtFloatLayout, AtButton } from 'taro-ui'
import { formatDate, returnNowTime } from '@/utils'
import { UseRequest, useUserInfo } from '@/hooks'
import { MapLocationInfo } from '@/typings'
import debounce from 'lodash/debounce'
import dayjs from 'dayjs'
import '../index.scss'

export interface InvitationCreateProps {}

const EmptyLocation: MapLocationInfo = {
  address: '',
  latitude: 0,
  longitude: 0,
  name: '',
}

// 发起邀请
const InvitationCreate: React.FC<InvitationCreateProps> = () => {
  const [targetDate, setTargetDate] = useState(formatDate(dayjs()))
  const [targetTime, setTargetTime] = useState(returnNowTime()) // 目标时间
  const [locationInfo, setLocationInfo] = useState<MapLocationInfo>(EmptyLocation) // 地址信息
  const [showRemark, setShowRemark] = useState(false)
  const [remark, setRemark] = useState('') // 描述
  const { userInfo } = useUserInfo()

  const onDateChange = e => {
    console.log(e.detail, 'onDateChange')
    setTargetDate(e.detail.value)
  }

  const onTimeChange = e => {
    console.log(e.detail)
    setTargetTime(e.detail.value)
  }

  // 修改描述
  const handleRemarkChange = debounce(value => {
    setRemark(value)
  }, 300)

  const onSubmit = debounce(() => {
    console.log('onsubmit')
    if (!locationInfo.latitude) {
      Taro.showToast({
        title: '请先选择约球地点',
        mask: true,
        icon: 'none',
      })
    } else {
      let param = {
        type: 'create',
        locationInfo: locationInfo,
        targetTime: `${targetDate} ${targetTime}`,
        remark: remark,
        userOpenId: userInfo?.userOpenId,
        updateTime: new Date(dayjs().valueOf()),
      }
      console.log(param)
      Taro.showLoading({
        title: '发起约球中...',
        mask: true,
      })
      UseRequest('invitation', param).then(result => {
        if (result._id) {
          Taro.showToast({
            title: '发起成功',
            mask: true,
          })
          let timer = setTimeout(() => {
            console.log('result._id', result._id)
            Taro.hideLoading()
            clearTimeout(timer)
            Taro.redirectTo({
              url: `/pages/gameInvitation/detail/index?invitationId=${result._id}`,
            })
          }, 1000)
        }
      })
    }
  }, 300)

  const chooseLocation = () => {
    wx.chooseLocation({
      success: res => {
        setLocationInfo(res)
      },
    })
  }

  if (userInfo?.hasCreatePerm) {
    return (
      <View className="new-invitation">
        <View className="form-title">发起约球</View>
        <AtList hasBorder>
          <Picker mode="date" onChange={onDateChange} value={targetDate}>
            <AtListItem
              title="约球日期"
              arrow="right"
              iconInfo={{ size: 25, color: '#05f', value: 'calendar' }}
              note={targetDate}
            />
          </Picker>
          <Picker mode="time" onChange={onTimeChange} value={targetTime}>
            <AtListItem
              title="约球时间"
              arrow="right"
              iconInfo={{ size: 25, color: '#05f', value: 'clock' }}
              note={targetTime}
            />
          </Picker>
          <AtListItem
            title="约球地点"
            arrow="right"
            iconInfo={{ size: 25, color: '#05f', value: 'map-pin' }}
            onClick={chooseLocation}
            note={`${locationInfo ? locationInfo.name : ''}`}
          />
          <AtListItem
            title="描述信息"
            iconInfo={{ size: 25, color: '#05f', value: 'message' }}
            onClick={() => setShowRemark(true)}
            note={remark}
          />
        </AtList>
        <AtFloatLayout isOpened={showRemark} title="描述信息" onClose={() => setShowRemark(false)}>
          <AtTextarea
            value={remark}
            onChange={handleRemarkChange}
            maxLength={100}
            showConfirmBar
            onConfirm={() => setShowRemark(false)}
          />
        </AtFloatLayout>
        <View className="fixed-btn">
          <AtButton type="primary" circle onClick={onSubmit}>
            发起约球
          </AtButton>
        </View>
      </View>
    )
  } else {
    return null
  }
}

export default memo(InvitationCreate)
