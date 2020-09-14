import dayjs from 'dayjs'
import { InvitationStatus } from '../pages/gameInvitation/type'

// 格式化时间
export const formatDate = (
  date: string | dayjs.Dayjs | undefined,
  formatType = 'YYYY-MM-DD',
  emptyStr: string = '',
): string =>
  date
    ? dayjs(date).isValid()
      ? dayjs(date).format(formatType)
      : typeof date === 'string'
      ? date
      : emptyStr
    : emptyStr

// 返回当前时分
export const returnNowTime = (time?: string | dayjs.Dayjs | undefined) => formatDate(time ? time : dayjs(), 'HH:mm')

// 是否非空数组
export const isValidArray = (list: any) => list && Array.isArray(list) && list.length > 0

// 返回状态名称
export const returnStatusName = (status: InvitationStatus) => {
  let obj: { [keys in InvitationStatus]: string } = {
    OPENING: '进行中',
    CANCELLED: '已取消',
    FINISHED: '已结束',
  }
  return obj[status]
}

// 根据状态返回对应颜色
export const returnStyleByStatus = (status: InvitationStatus, isColor = false) => {
  let statusObj: { [keys in InvitationStatus]: string } = {
    OPENING: '#0055FF', // 进行中
    CANCELLED: '#999999', // 已取消
    FINISHED: '#00A186', // 完成
  }
  return { [isColor ? 'color' : 'background']: statusObj[status] || '#d9d9d9' }
}

// 返回精确到某位小数
export const calNum = (num: number, precision?: number): number => Number(num.toFixed(precision ? precision : 2))
