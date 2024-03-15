import * as React from 'react'
import { memo } from 'react'
import { AtTag } from 'taro-ui'
import { AtTagProps } from 'taro-ui/types/tag'

export interface TagInfo {
  name: string
  active: boolean
}

interface LevelTagProps extends AtTagProps {
  level: string
}

const LevelTag: React.FC<LevelTagProps> = ({ onClick, active = true, circle = true, type, level }) => {
  return (
    <AtTag name={level} type={type} active={active} circle={circle} onClick={onClick} size="small">
      {level}级
    </AtTag>
  )
}

export default memo(LevelTag)
