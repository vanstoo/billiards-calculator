import * as React from 'react'
import { memo, useState, useEffect, Fragment } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { CommonScrollView, EmptyListView } from '@/components'
import { UseRequest } from '@/hooks'
import { isValidArray, formatDate } from '@/utils'
import { LevelLogItem } from '../type'
import '../../gameInvitation/index.scss'

interface LevelLogListProps {}
const pageSize = 10

const LevelLogList: React.FC<LevelLogListProps> = () => {
  const [current, setCurrent] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasReachBottom, setHasReachBottom] = useState(false)
  const [levelLogList, setLevelLogList] = useState<LevelLogItem[]>([])
  const { userOpenId, userName } = useRouter().params

  useEffect(() => {
    if (userName) {
      Taro.setNavigationBarTitle({
        title: `${userName}的档位更新记录`,
      })
    }
  }, [userName])

  useEffect(() => {
    console.log(current, 'useEffect')
    getListByPage(current)
  }, [current])

  const getListByPage = (pageNum: number) => {
    setLoading(true)
    Taro.showLoading({
      title: '获取数据中...',
      mask: true,
    })
    UseRequest('login', {
      type: 'getUpdateLevelLogList',
      pageNum: pageNum,
      pageSize: pageSize,
      updaterOpenId: userOpenId,
    }).then(result => {
      // console.log(result, "UseRequest");
      setLoading(false)
      Taro.hideLoading()
      if (result && result.list) {
        if (pageNum === 1) {
          setLevelLogList(result.list)
          console.log(result.list.length, 'setHasReachBottom', result.totalCount)
          setHasReachBottom(result.list.length === result.totalCount)
        } else {
          let newList = levelLogList.concat(result.list)
          // console.log(newList, newList.length);
          setLevelLogList(levelLogList.concat(result.list))
          console.log(newList.length, 'setHasReachBottom', result.totalCount)
          setHasReachBottom(newList.length === result.totalCount)
        }
      }
    })
  }
  // 下拉刷新
  const onScrollToUpper = e => {
    console.log(e, '到顶了', current)
    if (current === 1) {
      getListByPage(1)
    }
    setCurrent(1)
  }

  // 底部滚动刷新
  const onScrollToLower = () => {
    console.log('到底了')
    if (!hasReachBottom) {
      Taro.showLoading({
        title: '获取数据中...',
        mask: true,
      })
      setCurrent(current + 1)
    } else {
      console.log('数据已经没了')
    }
  }

  return (
    <Fragment>
      <CommonScrollView
        listLoding={loading}
        hasReachBottom={hasReachBottom && isValidArray(levelLogList)}
        onRefresh={onScrollToUpper}
        onScrollToLower={onScrollToLower}
      >
        {isValidArray(levelLogList) ? (
          <Fragment>
            {levelLogList.map(x => (
              <View key={x._id} className="list-card">
                <View className="list-item-content">
                  <View>被修改人姓名：{x.updatedUserName}</View>
                  <View>原档位：{x.oldLevel}</View>
                  <View>修改人姓名：{x.updaterName}</View>
                  <View>新档位：{x.level}</View>
                </View>
                <View className="list-item-footer">{formatDate(x.updateTime, 'YYYY-MM-DD HH:mm:ss')}</View>
              </View>
            ))}
            <View className="list-last-view" />
          </Fragment>
        ) : (
          <EmptyListView />
        )}
      </CommonScrollView>
    </Fragment>
  )
}

export default memo(LevelLogList)
