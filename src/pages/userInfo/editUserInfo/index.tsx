import * as React from 'react'
import { memo, useState } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtButton, AtInput } from 'taro-ui'
import { chooseImg, uploadImg } from '@/utils'
import { UseRequest } from '@/hooks'
import dayjs from 'dayjs'
import debounce from 'lodash/debounce'
import { UserInfo } from '@/typings'
import '../index.less'

interface UserNameAndAvatorProps {}

const UserNameAndAvator: React.FC<UserNameAndAvatorProps> = () => {
  const userInfo: UserInfo = Taro.getStorageSync('userInfo')
  const { type } = useRouter().params

  const [nameVal, setNameVal] = useState<string>(() => userInfo?.nickName || '')
  const [avatarVal, setAvatarVal] = useState<string>(
    userInfo?.avatarUrl
      ? userInfo?.avatarUrl
      : 'https://mp-1323a910-dca2-4115-8f03-bb5a391ab617.cdn.bspapp.com/cloudstorage/5365db08-3858-4ea9-8c1d-3132f399d06f.png',
  )

  const setUserName = debounce(val => {
    console.log(val, 'setUserName')
    setNameVal(val)
    return val
  }, 50)

  // 上传头像
  const uploadFunc = async (tempFilePaths: string[]) => {
    console.log(tempFilePaths, 'tempFilePaths')
    let fileRes = await uploadImg(tempFilePaths)
    console.log(fileRes, 'fileList')
    setAvatarVal(fileRes[0])
  }

  const onComfirm = () => {
    Taro.showModal({
      content: '请确定头像及昵称，确认注册/修改后7天内不可变更',
      success: res => {
        if (res.confirm) {
          type === 'edit' ? onComfirmUpdate() : onComfirmLogin()
        }
      },
    })
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

  const onComfirmUpdate = () => {
    let hasEdit: Boolean = false
    if (nameVal !== userInfo?.nickName || avatarVal !== userInfo?.avatarUrl) {
      hasEdit = true
    }
    console.log(hasEdit, '是否编辑')
    if (hasEdit) {
      UseRequest('login', {
        type: 'updateUserInfo',
        targetId: userInfo?.userOpenId,
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
            console.log(result, ' login result')
            Taro.hideLoading()
            Taro.setStorage({
              data: result,
              key: 'userInfo',
              complete: () => Taro.redirectTo({ url: '/pages/index/index?defaultKey=1' }),
            })
          })
        }
      })
    } else {
      Taro.navigateBack()
    }
  }

  return (
    <View className="name-avator">
      <View className="avatar-btn">
        <Image src={avatarVal} onClick={() => chooseImg(uploadFunc)} mode="aspectFill" />
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
        <AtButton type="primary" size="normal" circle disabled={!nameVal} onClick={onComfirm}>
          {type === 'edit' ? '确定' : '注册'}
        </AtButton>
      </View>
    </View>
  )
}

export default memo(UserNameAndAvator)
