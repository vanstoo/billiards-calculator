import * as React from 'react'
import { memo, useState, useEffect, Fragment } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { CommonScrollView, EmptyListView, ImgView } from '@/components'
import { UseRequest } from '@/hooks'
import { isValidArray } from '@/utils'
import { SponsorInfoItem } from '../../type'
import '../../../gameInvitation/index.scss'

interface SponsorInfoListProps {}
const pageSize = 10

const SponsorInfoList: React.FC<SponsorInfoListProps> = () => {
  const [current, setCurrent] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasReachBottom, setHasReachBottom] = useState(false)
  const [sponsorInfoList, setSponsorInfoList] = useState<SponsorInfoItem[]>([])

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
    UseRequest('sponsor', {
      type: 'getSponsorInfoList',
      pageNum: pageNum,
      pageSize: pageSize,
    }).then(result => {
      setLoading(false)
      Taro.hideLoading()
      if (result && result.list) {
        if (pageNum === 1) {
          setSponsorInfoList(result.list)
          console.log(result.list.length, 'setHasReachBottom', result.totalCount)
          setHasReachBottom(result.list.length === result.totalCount)
        } else {
          let newList = sponsorInfoList.concat(result.list)
          // console.log(newList, newList.length);
          setSponsorInfoList(sponsorInfoList.concat(result.list))
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
        hasReachBottom={hasReachBottom && isValidArray(sponsorInfoList)}
        onRefresh={onScrollToUpper}
        onScrollToLower={onScrollToLower}
      >
        {isValidArray(sponsorInfoList) ? (
          <Fragment>
            {sponsorInfoList.map(x => (
              <View key={x._id} className="list-card">
                <View className="list-item-header">
                  <View>感谢{x.sponsorUserName}对小程序的大力支持！</View>
                </View>
                <View className="list-item-content">
                  <View>赞助类型：{x.sponsorshipType}</View>
                  <View>
                    赞助日期：{x.startDate}～{x.endDate}
                  </View>
                  <View>赞助金额：{x.sponsorshipAmount}元</View>
                  <View className="list-item-img">
                    赞助凭证:
                    <ImgView uploadList={x.sponsorshipImgs} />
                  </View>
                </View>
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

export default memo(SponsorInfoList)
