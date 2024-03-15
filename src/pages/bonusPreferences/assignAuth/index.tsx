import * as React from 'react'
import { useState, memo } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton, AtInput, AtAvatar, AtNoticebar } from 'taro-ui'
import { UseRequest } from '@/hooks'
import { UserInfo } from '@/typings'
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'
import { isValidArray } from '@/utils'
import '../index.less'

export interface AssignAuthProps {}

const AssignAuth: React.FC<AssignAuthProps> = () => {
  const [inputval, setInputval] = useState<any>(null)
  const [userList, setUserList] = useState<UserInfo[]>([])
  const [selectedUser, setSelectedUser] = useState<UserInfo>()

  const fuzzySearchUsers = debounce(val => {
    console.log(val, 'fuzzySearchUsers')
    setInputval(val)
    return val
  }, 300)

  const onSelect = (item: UserInfo) => {
    setInputval(null) // 清除输入框
    setSelectedUser(item) // 选中项
    setUserList([]) // 清除列表
  }

  const onSearchUser = throttle(() => {
    if (inputval) {
      Taro.showLoading({
        mask: true,
        title: '搜索中',
      })
      // 模糊搜索用户信息
      UseRequest('login', {
        type: 'searchNoPermissionUsers',
        fuzzyName: inputval,
      }).then(result => {
        if (result) {
          Taro.hideLoading()
          setUserList(isValidArray(result) ? result : [])
        }
      })
    } else {
      setUserList([])
    }
  }, 300)

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
      <AtInput
        name="value1"
        title="待授权用户"
        type="text"
        placeholder="微信昵称关键字"
        value={inputval}
        onChange={value => fuzzySearchUsers(value)}
        placeholderClass="color999"
      >
        <AtButton size="small" type="secondary" customStyle={{ marginRight: '8px' }} onClick={onSearchUser}>
          搜索
        </AtButton>
      </AtInput>
      <View className={isValidArray(userList) ? 'dropdown-content' : 'dropdown-content '}>
        {userList.map(item => (
          <View key={item.userOpenId} onClick={() => onSelect(item)} className="search-item">
            {item.nickName}
          </View>
        ))}
      </View>
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
