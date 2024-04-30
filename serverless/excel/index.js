// 云函数入口文件
const dayjs = require('dayjs')
const xlsx = require('node-xlsx')
const fs = require('fs')

// 格式化时间
const formatDate = (date, formatType = 'YYYY-MM-DD', emptyStr) => {
  return date
    ? dayjs(date).isValid()
      ? dayjs(date).format(formatType)
      : typeof date === 'string'
      ? date
      : emptyStr
    : emptyStr
}

// 返回每条参与信息的时长及总时长
const calDurationByParticipants = participants => {
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
  newList.forEach(x => {
    durationSum += x.duration
  })
  return {
    newList,
    durationSum,
  }
}

// 返回占比
const returnPercent = (duration, totalTime) => {
  if (totalTime && totalTime > 0) {
    return duration / totalTime
  } else {
    return 0
  }
}

// 返回精确到某位小数
const calNum = (num, precision = 2) => {
  return Number(num.toFixed(2, precision))
}

const findUsrById = (id, usrList) => {
  let tar
  if (Array.isArray(usrList)) {
    tar = usrList.find(z => z.userOpenId === id)
  }
  return tar || {}
}

// 批量获取用户
const getUserInfoByUserOpenIdList = async (ctx, ids) => {
  let userOpenIds = [...new Set(ids)]
  const userInfoList = await ctx.mpserverless.db.collection('login_users').find({
    userOpenId: {
      $in: userOpenIds,
    },
  })
  if (userInfoList && userInfoList.result) {
    return userInfoList.result
  } else {
    return null
  }
}

// 云函数入口函数
module.exports = async ctx => {
  let type = ctx.args.type
  switch (type) {
    case 'createExcel': {
      return createParticipantsInfoExcel(ctx)
    }
  }
}

const createParticipantsInfoExcel = async ctx => {
  const { id } = ctx.args
  const inviRes = await ctx.mpserverless.db.collection('invitation_groups').findOne({ _id: id })
  const totalFee = inviRes && inviRes.result && inviRes.result.totalFee ? inviRes.result.totalFee : 0
  try {
    let excelData = []
    // 参与人信息
    const participantsInfo = await ctx.mpserverless.db.collection('participants_info').find(
      {
        invitationId: id,
      },
      {
        sort: { createTime: -1 },
      },
    )
    let participants = participantsInfo ? participantsInfo.result : []
    let userOpenIds = participants.map(x => x.userOpenId).filter(y => !!y)
    let usrList = await getUserInfoByUserOpenIdList(ctx, userOpenIds)
    participants = participants.map(item => {
      let usr = findUsrById(item.userOpenId, usrList)
      return {
        ...item,
        name: usr.nickName, // 参与人姓名
      }
    })
    if (participants) {
      // 处理参与人信息
      let { newList, durationSum } = calDurationByParticipants(participants)
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
      let filePath = `invitation_excel_${dayjs().format('YYYYMMDDHHmmssSSS')}.xlsx`
      fs.writeFileSync(filePath, buffer, { flag: 'w' }) // 如果文件存在，覆盖
      let res = await ctx.mpserverless.file.uploadFile({
        filePath: filePath,
        cloudPath: `/excel/${filePath}`, // 云端文件路径
      })
      ctx.logger.info('excelData url', res, filePath)
      await ctx.mpserverless.db.collection('invitation_groups').findOneAndUpdate(
        { _id: id },
        {
          $set: {
            excelFileUrl: res.fileUrl,
          },
        },
      )
      return true
    }
  } catch (error) {
    ctx.logger.error(error, 'excel')
    return error
  }
}
