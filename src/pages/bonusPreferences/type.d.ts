export interface LevelLogItem {
  _id: string // 唯一id
  oldLevel: string // 原等级
  level: string // 新等级
  updateTime: string // 更新等级时间
  updatedUserName: string // 被更新人姓名
  updatedUserAvatarUrl: string // 被更新人头像
  updaterName: string // 更新人姓名
  updaterAvatarUrl: string // 更新人头像
}

export interface SponsorInfoItem {
  _id: string // 唯一id
  sponsorUserOpenId: string
  sponsorUserName: string
  sponsorUserAvatarUrl: string
  startDate: string
  endDate: string
  sponsorshipType: string
  sponsorshipImgs: string[]
  updateTime: string
  sponsorshipAmount: string
}
