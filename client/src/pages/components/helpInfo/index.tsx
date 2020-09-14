import * as React from 'react'
import { memo } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { goToMapPage } from '../../../utils'

export interface HelpInfoProps {}

const HelpInfo: React.FC<HelpInfoProps> = () => {
  const chooseLocation = Taro.requirePlugin('chooseLocation')

  useDidShow(() => {
    console.log(chooseLocation.getLocation(), 'const location = chooseLocation.getLocation()')
  })

  const goToMapDetail = () => {
    console.log(chooseLocation.getLocation(), 'chooseLocation.getLocation()')
    Taro.openLocation(chooseLocation.getLocation())
  }

  return (
    <View>
      <AtButton onClick={goToMapPage}>打开地图选点</AtButton>
      <AtButton onClick={goToMapDetail}>跳转详情</AtButton>
    </View>
  )
}

export default memo(HelpInfo)
