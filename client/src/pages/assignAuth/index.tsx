import * as React from 'react'
import { useState, memo } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton, AtInput, AtAvatar } from 'taro-ui'
import { UseRequest } from '../../service'
import { UserInfo } from '../../typings'
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'
import './index.scss'
import { isValidArray } from '../../utils'

export interface AssignAuthProps {}

const AssignAuth: React.FC<AssignAuthProps> = () => {
  const [inputval, setInputval] = useState<any>(null)
  const [userList, setuUserList] = useState<UserInfo[]>([])
  const [selectedUser, setSelectedUser] = useState<UserInfo>()

  const fuzzySearchUsers = debounce(val => {
    console.log(val, 'fuzzySearchUsers')
    setInputval(val)
    return val
  }, 300)

  const onSelect = (item: UserInfo) => {
    setInputval(null) // 清除输入框
    setSelectedUser(item) // 选中项
    setuUserList([]) // 清除列表
  }

  const onSearchUser = throttle(() => {
    if (inputval) {
      Taro.showLoading({
        mask: true,
        title: '搜索中',
      })
      // 模糊搜索用户信息
      UseRequest('login', {
        type: 'search',
        fuzzyName: inputval,
      }).then(result => {
        if (result) {
          Taro.hideLoading()
          setuUserList(isValidArray(result) ? result : [])
        }
      })
    } else {
      setuUserList([])
    }
  }, 300)

  const comfirmUpdateUserAuth = () => {
    Taro.showLoading({
      mask: true,
      title: '搜索中',
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
    <View className="assign-auth">
      <AtInput
        name="value1"
        title="待授权用户"
        type="text"
        placeholder="微信昵称关键字"
        value={inputval}
        onChange={value => fuzzySearchUsers(value)}
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
            <AtAvatar circle text="头" image={selectedUser?.avatarUrl} />
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
