import * as React from 'react'
import { useState, memo } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton, AtInput } from 'taro-ui'
import { UseRequest } from '@/hooks'
import { UserInfo } from '@/typings'
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'
import { isValidArray } from '@/utils'

interface SelectUserProps {
  label: string
  searchUserType: 'searchUserByName' | 'searchNoPermissionUsers'
  onSelect: (user: UserInfo | undefined) => void
}

const SelectUser: React.FC<SelectUserProps> = ({ label, searchUserType, onSelect }) => {
  const [inputval, setInputval] = useState<any>(null)
  const [userList, setUserList] = useState<UserInfo[]>([])

  const fuzzySearchUsers = debounce(val => {
    console.log(val, 'fuzzySearchUsers')
    setInputval(val)
    return val
  }, 300)

  const onSelectUser = (item: UserInfo) => {
    setInputval(null) // 清除输入框
    setUserList([]) // 清除列表
    typeof onSelect === 'function' && onSelect(item) // 选中用户回调
  }

  const onSearchUser = throttle(() => {
    if (inputval) {
      Taro.showLoading({
        mask: true,
        title: '搜索中',
      })
      // 模糊搜索用户信息
      UseRequest('login', {
        type: searchUserType,
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

  return (
    <>
      <AtInput
        name="value1"
        title={label}
        type="text"
        placeholder="小程序内用户名关键字"
        value={inputval}
        onChange={value => fuzzySearchUsers(value)}
        placeholderClass="color999"
        style={{ marginLeft: '24px' }}
      >
        <AtButton size="small" type="secondary" customStyle={{ marginRight: '8px' }} onClick={onSearchUser}>
          搜索
        </AtButton>
      </AtInput>
      <View className={isValidArray(userList) ? 'dropdown-content' : 'dropdown-content '}>
        {userList.map(item => (
          <View key={item.userOpenId} onClick={() => onSelectUser(item)} className="search-item">
            {item.nickName}
          </View>
        ))}
      </View>
    </>
  )
}

export default memo(SelectUser)
