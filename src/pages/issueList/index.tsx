import * as React from 'react'
import { memo } from 'react'
import Taro from '@tarojs/taro'
import { AtList, AtListItem } from 'taro-ui'

interface IssueListProps {}

const listInfo = [
  {
    title: '关于档位',
    note: '约个球8群内档位设定详细说明',
    path: 'userLevel',
  },
  {
    title: '关于小程序云数据赞助说明',
    note: '小程序云数据存储方案及相关费用详细说明',
    path: 'aliyunData',
  },
  {
    title: '关于小程序认证赞助说明',
    note: '小程序年审认证及相关费用详细说明',
    path: 'weChatVerify',
  },
]

const IssueList: React.FC<IssueListProps> = () => {
  const goToIssueDetail = (path: string) => {
    Taro.navigateTo({ url: `/pages/issueList/${path}/index` })
  }
  return (
    <AtList>
      {listInfo.map(({ title, path, note }) => {
        return <AtListItem key={path} title={title} note={note} arrow="right" onClick={() => goToIssueDetail(path)} />
      })}
    </AtList>
  )
}

export default memo(IssueList)
