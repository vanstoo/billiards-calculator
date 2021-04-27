// 云函数入口文件
const cloud = require('wx-server-sdk')
const dayjs = require('dayjs')
const xlsx = require('node-xlsx')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV,
})

const db = cloud.database({
  throwOnNotFound: false,
})

// 格式化时间
function formatDate(date, formatType = 'YYYY-MM-DD', emptyStr) {
  return date
    ? dayjs(date).isValid()
      ? dayjs(date).format(formatType)
      : typeof date === 'string'
      ? date
      : emptyStr
    : emptyStr
}

// 返回每条参与信息的时长及总时长
function calDurationByParticipants(participants) {
  // 格式化时间
  const dateFormatToMin = 'YYYY-MM-DD HH:mm'
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
  newList.forEach((x) => {
    durationSum += x.duration
  })
  return {
    newList,
    durationSum,
  }
}

// 返回占比
function returnPercent(duration, totalTime) {
  if (totalTime && totalTime > 0) {
    return duration / totalTime
  } else {
    return 0
  }
}

// 返回精确到某位小数
function calNum(num, precision = 2) {
  return Number(num.toFixed(2, precision))
}

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'createExcel': {
      return createParticipantsInfoExcel(event, context)
    }
  }
}

async function createParticipantsInfoExcel(event, context) {
  const {
    id, // 活动id
    totalFee, // 活动费用
  } = event
  try {
    let excelData = []
    // 参与人信息
    const participants = await db
      .collection('participants_info')
      .orderBy('createTime', 'desc')
      .where({ invitationId: id })
      .get()

    if (participants && participants.data) {
      // 处理参与人信息
      let { newList, durationSum } = calDurationByParticipants(participants.data)
      excelData = newList.map((x, index) => {
        let percentNum = returnPercent(x.duration, durationSum) // 时间占比
        let singleFee = Math.round(totalFee * percentNum) //  单人费用
        return [
          index + 1, // 序号
          x.name, // 微信昵称
          singleFee, // 费用 四舍五入
          formatDate(x.startTime, 'HH:mm'), // 开始时间
          formatDate(x.endTime, 'HH:mm'), // 结束时间
          x.duration, // 时长
          calNum(percentNum * 100), // 占比
          totalFee, // 总费用
        ]
      })
      console.log('excelData', excelData)
      // 宽度设置
      const options = {
        '!cols': [{ wch: 5 }, { wch: 20 }, { wch: 8 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }],
        '!merges': [{ s: { r: 1, c: 7 }, e: { r: newList.length, c: 7 } }],
      }
      let buffer = xlsx.build(
        [
          {
            name: 'excel',
            data: [
              ['序号', '微信昵称', '费用', '开始时间', '结束时间', '时长(分钟)', '占比(%)', '总费用'], // 表头
              ...excelData,
            ],
          },
        ],
        options,
      )
      return await cloud.uploadFile({
        cloudPath: `excelInfo/invitation_excel_${formatDate(dayjs(), 'YYYYMMDDHHmmssSSS')}.xlsx`,
        fileContent: buffer, //excel二进制文件
      })
    }
  } catch (error) {
    console.error(error)
    return error
  }
}
