import * as React from 'react'
import { memo } from 'react'
import { View } from '@tarojs/components'
import '../index.less'

interface UserLevelProps {}

const UserLevel: React.FC<UserLevelProps> = () => {
  return (
    <View className="article">
      <View className="article-h1">关于档位</View>
      <View className="article-p">一共7个等级：S+、S级、A+、A级、B级、C级、D级</View>
      <View className="at-article__content">
        <View className="at-article__section">
          <View className="article-h3">D级</View>
          <View className="article-p">
            初学者，姿势、杆法、线路、力度、准度都做不到位，没有具体思路，在局势较好的局面下，偶尔能连续打进两、三颗球。
          </View>
          <View className="article-h3">C级</View>
          <View className="article-p">
            在杆法、线路、力度、准度、节奏方面都有所欠缺，思路混乱，处理球顺序不当，即使局面简单，也很难做到清台。
          </View>
          <View className="article-h3">B级</View>
          <View className="article-p">
            在杆法、线路、力度、准度、节奏方面不能合理组合，具备一定的准度，能控制主球的大概走向，但思路模糊，处理球顺序不当，偶尔有清台记录。
          </View>
          <View className="article-h3">A级</View>
          <View className="article-p">
            在杆法、线路、力度、准度、节奏掌控均具备一定能力，有清台思路，但不够清晰，稳定性稍差，经常需要纠错，简单局面有清台能力。
          </View>
          <View className="article-h3">A+</View>
          <View className="article-p">
            思路较为清晰、杆法、线路、力度、准度、节奏掌控比较熟练，稳定性一般，具备一定的纠销能力，普通局面有不错的清台能力。
          </View>
          <View className="article-h3">S级</View>
          <View className="article-p">
            思路清晰、杆法、线路、力度、准度、节奏掌控熟练，有掌控局面的能力，稳定性比孩高，具备较强的纠错能力，清台成功率比较高。
          </View>
          <View className="article-h3">S+</View>
          <View className="article-p">
            顶级选手，心理素质出众，思路非常清晰、杆法、线路、力度、准度、节奏掌控非常熟练，掌握局面能力超强，稳定性极高，具备超强的清台能力。
          </View>
        </View>
      </View>
    </View>
  )
}

export default memo(UserLevel)
