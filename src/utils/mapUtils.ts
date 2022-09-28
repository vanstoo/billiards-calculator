import Taro from '@tarojs/taro'
import { MapKey } from '../constant'

// 跳转地图选点
export const goToMapPage = () => {
  Taro.navigateTo({
    url: `plugin://chooseLocation/index?key=${MapKey}&referer=billiards-calculator`,
  })
}
