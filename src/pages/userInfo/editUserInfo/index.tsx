import * as React from 'react'
import { memo, useState, useEffect } from 'react'
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
  const [avatarVal, setAvatarVal] = useState<string>(() => userInfo?.avatarUrl || '')

  useEffect(() => {
    if (type === 'edit') {
      Taro.setNavigationBarTitle({
        title: '更新用户信息',
      })
    }
  }, [type])

  const setUserName = debounce(val => {
    console.log(val, 'setUserName')
    setNameVal(val)
    return val
  }, 100)

  // 上传头像
  const uploadFunc = async (tempFilePaths: string[]) => {
    console.log(tempFilePaths, 'tempFilePaths')
    let fileRes = await uploadImg(tempFilePaths)
    console.log(fileRes, 'fileList')
    setAvatarVal(fileRes[0])
  }

  const onComfirm = () => {
    Taro.showModal({
      content: '请确定头像及昵称',
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
    } else {
      if (!avatarVal) {
        Taro.showModal({
          content: '未上传头像，将使用默认黑八头像展示，请注意是否确定不上传',
          success: res => {
            if (res.cancel) {
              Taro.showToast({
                title: '请先上传头像再注册',
                icon: 'none',
                mask: true,
              })
              return
            } else {
              registerUser()
            }
          },
        })
      } else {
        registerUser()
      }
    }
  }

  // 注册用户
  const registerUser = () => {
    console.log(avatarVal, '注册用户')
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
              complete: () => Taro.redirectTo({ url: '/pages/index/index?defaultKey=2' }),
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
        <Image
          src={
            avatarVal ||
            'https://mp-1323a910-dca2-4115-8f03-bb5a391ab617.cdn.bspapp.com/cloudstorage/d1cc0c5e-2077-48ff-96e0-494ff9cc5531.png'
          }
          onClick={() => chooseImg(uploadFunc)}
          mode="aspectFill"
        />
      </View>

      <AtInput
        name="value1"
        title="昵称"
        type="nickname"
        placeholder="建议直接使用微信昵称"
        value={nameVal}
        onChange={setUserName}
        maxLength={10}
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
