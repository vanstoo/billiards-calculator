import * as React from 'react'
import { useState, memo } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import { AtButton, AtInput, AtAvatar, AtNoticebar, AtMessage } from 'taro-ui'
import { UseRequest, useUserInfo } from '@/hooks'
import { UserInfo } from '@/typings'
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'
import { isValidArray, compareDateRange, formatDate } from '@/utils'
import { LevelTag } from '@/components'
import dayjs from 'dayjs'
import '../index.less'

interface EditUserLevelProps {}

const EditUserLevel: React.FC<EditUserLevelProps> = () => {
  const [inputval, setInputval] = useState<any>(null)
  const [userList, setUserList] = useState<UserInfo[]>([])
  const [selectedUser, setSelectedUser] = useState<UserInfo>()
  const [targetLevelIdx, setTargetLevelIdx] = useState('')
  const levelList = ['D', 'C', 'B', 'A', 'A+', 'S', 'S+']
  const { userInfo, getUserInfo } = useUserInfo()

  const fuzzySearchUsers = debounce(val => {
    console.log(val, 'fuzzySearchUsers')
    setInputval(val)
    return val
  }, 300)

  const onSelect = (item: UserInfo) => {
    setInputval(null) // 清除输入框
    setSelectedUser(item) // 选中项
    setUserList([]) // 清除列表
    let idx = levelList.indexOf(item.level)
    setTargetLevelIdx(idx + '')
  }

  const onSearchUser = throttle(() => {
    if (inputval) {
      Taro.showLoading({
        mask: true,
        title: '搜索中',
      })
      // 模糊搜索用户信息
      UseRequest('login', {
        type: 'searchUserByName',
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

  const onChangeLevel = e => {
    setTargetLevelIdx(e.detail.value)
  }

  const comfirmEditUserLevel = () => {
    if (selectedUser?.level === levelList[targetLevelIdx]) {
      Taro.atMessage({
        message: '前后档位一致，请确认后再修改！',
        type: 'error',
      })
      return
    }
    if (!userInfo?.isManager) {
      if (selectedUser?.userOpenId !== userInfo?.userOpenId) {
        Taro.atMessage({
          message: '只能修改自己的档位，不可修改其他用户档位！',
          type: 'error',
        })
        return
      } else if (compareDateRange(userInfo.lastUpdateLevelDate, 180)) {
        Taro.atMessage({
          message: `${formatDate(
            dayjs(userInfo.lastUpdateLevelDate).add(180, 'D'),
            'YYYY-MM-DD HH:mm:ss',
          )}之后才可修改自己的档位！`,
          type: 'error',
        })
        return
      }
    }
    Taro.showLoading({
      mask: true,
      title: '更新中',
    })
    // 更新用户权限
    UseRequest('login', {
      type: 'updateLevel',
      updatedUserOpenID: selectedUser?.userOpenId, // 目标用户id
      level: levelList[targetLevelIdx], // 目标档位
      lastUpdateLevelDate: new Date(dayjs().valueOf()), // 更新时间
      oldLevel: selectedUser?.level, // 原档位
      updaterOpenId: userInfo.userOpenId, // 修改人id
    }).then(result => {
      if (result) {
        Taro.hideLoading()
        Taro.showToast({
          title: '修改成功',
          mask: true,
          icon: 'success',
        })
        setSelectedUser(undefined)
        setTargetLevelIdx('')
        // 需要更新用户信息
        if (selectedUser?.userOpenId === userInfo.userOpenId) {
          getUserInfo(() => {
            Taro.hideLoading()
            Taro.redirectTo({ url: '/pages/index/index?defaultKey=2' })
          })
        }
      }
    })
  }

  const goToIssueDetail = () => {
    Taro.navigateTo({ url: `/pages/issueList/userLevel/index` })
  }

  return (
    <View className="bonus-preferences">
      <AtMessage />
      <AtNoticebar single showMore moreText="关于档位" onGotoMore={goToIssueDetail}>
        档位半年才可更新一次，有问题请联系群管理。
      </AtNoticebar>
      <AtInput
        name="value1"
        title="待更新用户"
        type="text"
        placeholder="小程序内用户名关键字"
        value={inputval}
        onChange={value => fuzzySearchUsers(value)}
        placeholderClass="color999"
      >
        <AtButton size="small" type="secondary" customStyle={{ marginRight: '8px' }} onClick={onSearchUser}>
          搜索
        </AtButton>
      </AtInput>
      <View className="dropdown-content">
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
            <Text space="nbsp">{selectedUser?.nickName}</Text>
            <LevelTag level={selectedUser.level} />
          </View>
        </View>
      )}
      <Picker mode="selector" range={levelList} onChange={onChangeLevel}>
        <View className="level-picker">
          <Text className="pick-label">目标档位</Text>
          {targetLevelIdx ? (
            <Text className="target-level"> {levelList[targetLevelIdx]} </Text>
          ) : (
            <Text className="color999">未选择目标档位</Text>
          )}
        </View>
      </Picker>

      <View className="fixed-btns">
        <AtButton type="secondary" size="normal" circle onClick={() => Taro.navigateBack()}>
          返回
        </AtButton>
        <AtButton
          type="primary"
          size="normal"
          circle
          disabled={!selectedUser?.userOpenId || !targetLevelIdx}
          onClick={comfirmEditUserLevel}
        >
          确认
        </AtButton>
      </View>
    </View>
  )
}

export default memo(EditUserLevel)
