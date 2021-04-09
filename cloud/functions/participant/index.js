const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV,
})

const db = cloud.database({
  throwOnNotFound: false,
})

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  switch (event.type) {
    // 增加参与者
    case 'addParticipantInfo': {
      return addParticipantInfo(event, context)
    }
    // 更新参与者信息
    case 'updateParticipant': {
      return updateParticipantInfo(event, context)
    }
    default: {
      return null
    }
  }
}

// 新增参与人
async function addParticipantInfo(event, context) {
  const { invitationId, nickName, avatarUrl, startTime, endTime } = event
  const { OPENID } = cloud.getWXContext()
  const _ = db.command
  // 查询活动是否存在
  const inviRes = await db.collection('invitation_groups').doc(invitationId).get()
  const partRes = await db.collection('participants_info').where({ invitationId: invitationId }).get()
  console.warn(partRes, 'partRes')
  if (inviRes.data && inviRes.data._id && partRes.data && !partRes.data.some((x) => x.userOpenId === OPENID)) {
    try {
      await db.collection('participants_info').add({
        data: {
          invitationId: invitationId, // 活动id
          createTime: db.serverDate(), // 创建时间
          name: nickName, // 参与人姓名
          avatarUrl: avatarUrl, // 参与人头像
          userOpenId: OPENID, // 参与人openid
          startTime: startTime, // 开始时间
          endTime: endTime, // 结束时间
        },
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
async function updateParticipantInfo(event, context) {
  const { id, startTime, endTime } = event
  try {
    await db
      .collection('participants_info')
      .doc(id)
      .update({
        data: {
          startTime: startTime,
          endTime: endTime,
          updateTime: db.serverDate(),
        },
      })
    return true
  } catch (error) {
    console.error(error)
    return error
  }
}
