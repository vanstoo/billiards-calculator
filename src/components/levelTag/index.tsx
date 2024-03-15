import * as React from 'react'
import { memo } from 'react'
import Taro from '@tarojs/taro'
import { AtTag } from 'taro-ui'
import { UserInfo } from '@/typings'
import { AtTagProps } from 'taro-ui/types/tag'

export interface TagInfo {
  name: string
  active: boolean
}

interface LevelTagProps extends AtTagProps {
  level?: string
}

const LevelTag: React.FC<LevelTagProps> = ({ onClick, active = true, circle = true, type, level }) => {
  const userInfo: UserInfo = Taro.getStorageSync('userInfo')
  return (
    <AtTag name={level || userInfo.level} type={type} active={active} circle={circle} onClick={onClick} size="small">
      {level || userInfo.level}级
    </AtTag>
  )
}

export default memo(LevelTag)
