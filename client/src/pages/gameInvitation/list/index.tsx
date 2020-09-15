import * as React from 'react'
import { memo, useState, useEffect, Fragment } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton, AtAvatar } from 'taro-ui'
import { CommonScrollView, EmptyListView } from '../../../components'
import { UseRequest } from '../../../service'
import { isValidArray, returnStatusName, returnStyleByStatus } from '../../../utils'
import { InvitationItem } from '../type'
import { UserInfo } from '../../../typings'
import '../index.scss'

export interface HomePageProps {
  goToLogin: (key: number) => void // 跳转登陆
}
const pageSize = 10
const InvitationList: React.FC<HomePageProps> = ({ goToLogin }) => {
  const [current, setCurrent] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasReachBottom, setHasReachBottom] = useState(false)
  const [invitationList, setInvitationList] = useState<InvitationItem[]>([])

  const getListByPage = (pageNum: number) => {
    setLoading(true)
    Taro.showLoading({
      title: '获取数据中...',
      mask: true,
    })
    UseRequest('invitation', {
      type: 'getList',
      pageNum: pageNum,
      pageSize: pageSize,
    }).then(result => {
      // console.log(result, "UseRequest");
      setLoading(false)
      Taro.hideLoading()
      if (pageNum === 1) {
        setInvitationList(result.list)
        setHasReachBottom(result.list.length === result.totalCount)
      } else {
        let newList = invitationList.concat(result.list)
        // console.log(newList, newList.length);
        setInvitationList(invitationList.concat(result.list))
        setHasReachBottom(newList.length === result.totalCount)
      }
    })
  }

  useEffect(() => {
    // console.log(current, "useEffect");
    getListByPage(current)
  }, [current])

  // 下拉刷新
  const onScrollToUpper = e => {
    // console.log(e, "到顶了", current);
    if (current === 1) {
      getListByPage(1)
    }
    setCurrent(1)
  }

  // 底部滚动刷新
  const onScrollToLower = () => {
    // console.log("到底了");
    if (!hasReachBottom) {
      Taro.showLoading({
        title: '获取数据中...',
        mask: true,
      })
      setCurrent(current + 1)
    } else {
      // console.log("数据已经没了");
    }
  }

  // 创建约球
  const goToCreateInvitation = () => {
    let userInfo: UserInfo = Taro.getStorageSync('userInfo')
    // console.log(userInfo);
    if (userInfo && userInfo.userOpenId) {
      Taro.navigateTo({ url: '/pages/gameInvitation/create/index' })
    } else {
      Taro.showToast({
        title: '请先授权登陆',
        icon: 'none',
        mask: true,
      })
      let timer = setTimeout(() => {
        goToLogin(2)
        clearTimeout(timer)
      }, 2000)
    }
  }
  return (
    <View className="list-card-box">
      <CommonScrollView
        listLoding={loading}
        hasReachBottom={hasReachBottom}
        onRefresh={onScrollToUpper}
        onScrollToLower={onScrollToLower}
      >
        {isValidArray(invitationList) ? (
          <Fragment>
            {invitationList.map(x => (
              <View
                key={x._id}
                className="list-card"
                onClick={() =>
                  Taro.navigateTo({
                    url: `/pages/gameInvitation/detail/index?invitationId=${x._id}`,
                  })
                }
              >
                <View className="list-item-header">
                  <AtAvatar circle text="头" image={x?.creatorAvatarUrl} />
                  <Text>{x.creatorName}发起的约球</Text>
                  <View className="status" style={returnStyleByStatus(x.status, true)}>
                    {returnStatusName(x.status)}
                  </View>
                </View>
                <View className="list-item-content">
                  <View>地址：{x?.locationInfo?.address}</View>
                  <View>描述：{x.remark ? x.remark : '—'}</View>
                </View>
                <View className="list-item-footer">{x.targetTime}</View>
              </View>
            ))}
            <View className="list-last-view" />
          </Fragment>
        ) : (
          <EmptyListView />
        )}
      </CommonScrollView>
      )
      <View className="fixed-btn" style={{ paddingBottom: '170rpx' }}>
        <AtButton type="primary" circle onClick={goToCreateInvitation}>
          发起约球
        </AtButton>
      </View>
    </View>
  )
}

export default memo(InvitationList)
