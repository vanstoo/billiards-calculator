import * as React from 'react'
import { memo } from 'react'
import Taro from '@tarojs/taro'
import { AtList, AtListItem } from 'taro-ui'

interface IssueListProps {}

const listInfo = [
  {
    title: '关于档位',
    extraText: '档位介绍',
    note: '约个球8群内档位设定详细说明',
    path: 'userLevel',
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
