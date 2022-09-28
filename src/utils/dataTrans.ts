import dayjs from 'dayjs'
import { InvitationStatus } from '../pages/gameInvitation/type'
import { dateFormatToMin } from '../constant'
import { ParticipantItem } from '../pages/gameInvitation/type'

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

// 两个时间间隔是否在X天内
export const compareDateRange = (targeTime: string | dayjs.Dayjs | undefined, range: number = 1) => {
  if (targeTime) {
    return dayjs(targeTime)
      .add(range, 'day')
      .isAfter(dayjs(), 'second')
  }
  return false
}

// 返回每条参与信息的时长及总时长
export const calDurationByParticipants = (participants: ParticipantItem[]) => {
  let durationSum = 0 // 总时间
  let newList = participants.map(({ startTime, endTime, ...val }) => {
    // 处理起始时间
    let newStartTime = startTime
    if (newStartTime) {
      newStartTime = formatDate(dayjs(`${formatDate(dayjs())} ${startTime}`), dateFormatToMin)
    }
    let newEndTime = endTime
    if (newEndTime) {
      newEndTime = formatDate(dayjs(`${formatDate(dayjs())} ${endTime}`), dateFormatToMin)
      // 若起始时间都存在 判断结束时间是否为第二天
      if (newStartTime && dayjs(newEndTime).isBefore(dayjs(newStartTime))) {
        newEndTime = formatDate(dayjs(newEndTime).add(1, 'd'), dateFormatToMin)
      }
    }
    // 起始时间都存在时计算时间差
    let timeDuration = newEndTime && newStartTime ? dayjs(newEndTime).diff(dayjs(newStartTime), 'm') : 0
    return {
      startTime: newStartTime,
      endTime: newEndTime,
      duration: timeDuration, // 分钟数
      ...val,
    }
  })
  newList.forEach(x => {
    durationSum += x.duration
  })
  return {
    newList,
    durationSum,
  }
}
