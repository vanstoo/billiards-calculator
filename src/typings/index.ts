// 用户信息
export interface UserInfo {
  createTime: string // 创建时间
  updateTime: string // 更新时间
  userOpenId: string // 用户openId
  nickName: string // 用户昵称
  avatarUrl: string // 用户头像
  hasCreatePerm: boolean // 是否有新增权限
  level:string // 用户等级
  lastUpdateLevelDate: string // 更新默认等级时间
}

// 地址信息
export interface MapLocationInfo {
  name: string // 位置名称
  latitude: number // 维度
  longitude: number // 经度
  address: string // 位置地址
}

// 云函数方法
export type RequestApi = 'login' | 'invitation' | 'participant' | 'excel'
