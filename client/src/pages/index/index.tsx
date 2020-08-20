import * as React from 'react'
import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

import Login from '../../components/login'

export default class Index extends Component {

  componentWillMount() {
  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }


  render() {
    return (
      <View className='index'>
        <Login />
      </View>
    )
  }
}
