import * as React from 'react'
import { memo, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtButton, AtInput } from 'taro-ui'
import { chooseImg, uploadImg } from '@/utils'
import { UseRequest } from '@/hooks'
import dayjs from 'dayjs'
import debounce from 'lodash/debounce'
import '../index.less'

interface UserNameAndAvatorProps {}

const UserNameAndAvator: React.FC<UserNameAndAvatorProps> = () => {
  const [nameVal, setInputval] = useState<string>('')
  const [avatarVal, setAvatarVal] = useState<string[]>([
    'https://mp-1323a910-dca2-4115-8f03-bb5a391ab617.cdn.bspapp.com/cloudstorage/5365db08-3858-4ea9-8c1d-3132f399d06f.png',
  ])

  const setUserName = debounce(val => {
    console.log(val, 'setUserName')
    setInputval(val)
    return val
  }, 50)

  // 上传头像
  const uploadFunc = async (tempFilePaths: string[]) => {
    console.log(tempFilePaths, 'tempFilePaths')
    let fileRes = await uploadImg(tempFilePaths)
    console.log(fileRes, 'fileList')
    setAvatarVal(fileRes)
  }

  const onComfirmLogin = () => {
    console.log(nameVal, 'onComfirmLogin')
    if (!nameVal) {
      Taro.showToast({
        title: '请输入昵称',
        icon: 'none',
        mask: true,
      })
      return
    }
    console.log(avatarVal, 'avatarVal')
    Taro.showLoading({
      title: '更新用户信息中...',
      mask: true,
    })
    UseRequest('login', {
      type: 'create',
      nickName: nameVal,
      avatarUrl: avatarVal,
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
          Taro.redirectTo({ url: '/pages/index/index?defaultKey=0' })
        })
      }
    })
  }

  return (
    <View className="name-avator">
      <View className="avatar-btn">
        <Image src={avatarVal[0]} onClick={() => chooseImg(uploadFunc)} mode="aspectFill" />
      </View>

      <AtInput
        name="value1"
        title="昵称"
        type="nickname"
        placeholder="建议直接使用微信昵称"
        value={nameVal}
        onChange={setUserName}
        maxLength={15}
      />

      <View className="fixed-btns">
        <AtButton type="secondary" size="normal" circle onClick={() => Taro.navigateBack()}>
          取消
        </AtButton>
        <AtButton type="primary" size="normal" circle disabled={!nameVal} onClick={onComfirmLogin}>
          注册
        </AtButton>
      </View>
    </View>
  )
}

export default memo(UserNameAndAvator)
