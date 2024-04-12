import { useState, useEffect } from 'react'
import { UseRequest } from '@/hooks'
import { UserInfo } from '@/typings'

let globalUserInfo: UserInfo

export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>(globalUserInfo)

  const getUserInfo = (callback?: () => void) => {
    UseRequest('login', {
      type: 'get',
    }).then(result => {
      if (result?.userOpenId) {
        console.log(result, ' getUserInfo result')
        globalUserInfo = result
        setUserInfo(result)
        typeof callback === 'function' && callback()
      }
    })
  }

  useEffect(() => {
    if (!userInfo?.userOpenId) {
      getUserInfo()
    }
  }, [])

  return { userInfo: userInfo || {}, getUserInfo }
}
