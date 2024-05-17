import * as React from 'react'
import { useState, memo } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton, AtAvatar, AtNoticebar } from 'taro-ui'
import { UseRequest } from '@/hooks'
import { UserInfo } from '@/typings'
import { SelectUser } from '@/components'
import '../index.less'

export interface AssignAuthProps {}

const AssignAuth: React.FC<AssignAuthProps> = () => {
  const [selectedUser, setSelectedUser] = useState<UserInfo>()

  const comfirmUpdateUserAuth = () => {
    Taro.showLoading({
      mask: true,
      title: '更新中',
    })
    // 更新用户权限
    UseRequest('login', {
      type: 'updateAuth',
      targetId: selectedUser?.userOpenId,
    }).then(result => {
      if (result) {
        Taro.hideLoading()
        Taro.showToast({
          title: '修改成功',
          mask: true,
          icon: 'success',
        })
        setSelectedUser(undefined)
      }
    })
  }

  return (
    <View className="bonus-preferences">
      <AtNoticebar>
        此页面用于给没有发起约球权限的用户开通权限，输入对应用户名后再点击搜索按钮即可搜索用户，选中后点击确认提交即可
      </AtNoticebar>
      <SelectUser label="待授权用户" searchUserType="searchNoPermissionUsers" onSelect={setSelectedUser} />
      {selectedUser?.userOpenId && (
        <View>
          <View className="user-info">
            <AtAvatar circle text={selectedUser?.nickName || '头像'} image={selectedUser?.avatarUrl} />
            <Text space="nbsp">
              {selectedUser?.nickName}
              {selectedUser.hasCreatePerm ? '（已有权限，无需更新）' : '（暂无权限）'}
            </Text>
          </View>
        </View>
      )}
      <View className="fixed-btns">
        <AtButton type="secondary" size="normal" circle onClick={() => Taro.navigateBack()}>
          返回
        </AtButton>
        <AtButton
          type="primary"
          size="normal"
          circle
          disabled={!selectedUser?.userOpenId || selectedUser.hasCreatePerm}
          onClick={comfirmUpdateUserAuth}
        >
          确认
        </AtButton>
      </View>
    </View>
  )
}

export default memo(AssignAuth)
