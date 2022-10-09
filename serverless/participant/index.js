// 云函数入口函数
module.exports = async ctx => {
  switch (ctx.args.type) {
    // 增加参与者
    case 'addParticipantInfo': {
      return addParticipantInfo(ctx)
    }
    // 更新参与者信息
    case 'updateParticipant': {
      return updateParticipantInfo(ctx)
    }
    default: {
      return null
    }
  }
}

// 新增参与人
const addParticipantInfo = async ctx => {
  const { invitationId, startTime, endTime, updateTime, OPENID } = ctx.args
  // 查询活动是否存在
  const inviRes = await ctx.mpserverless.db.collection('invitation_groups').findOne({ _id: invitationId })
  ctx.logger.info('inviRes', inviRes)
  const partRes = await ctx.mpserverless.db.collection('participants_info').find({ invitationId: invitationId })
  ctx.logger.info('partRes', partRes)
  if (inviRes.result && inviRes.result._id && partRes.result && !partRes.result.some(x => x.userOpenId === OPENID)) {
    try {
      await ctx.mpserverless.db.collection('participants_info').insertOne({
        invitationId: invitationId, // 活动id
        createTime: updateTime, // 创建时间
        userOpenId: OPENID, // 参与人openid
        startTime: startTime, // 开始时间
        endTime: endTime, // 结束时间
      })
      return true
    } catch (error) {
      console.error(error)
      return error
    }
  } else {
    return {
      errMsg: '当前参与人有变更，请刷新页面后重试',
    }
  }
}

// 更新参与人开始、结束时间
const updateParticipantInfo = async ctx => {
  const { id, startTime, endTime, updateTime } = ctx.args
  try {
    await ctx.mpserverless.db.collection('participants_info').findOneAndUpdate(
      { _id: id },
      {
        $set: {
          startTime: startTime,
          endTime: endTime,
          updateTime: updateTime,
        },
      },
    )
    return true
  } catch (error) {
    console.error(error)
    return error
  }
}
