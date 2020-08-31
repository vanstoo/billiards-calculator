const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV,
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event, 'event')
  switch (event.type) {
    case 'create': {
      return createInvitation(event, context)
    }
    case 'getDetail': {
      return getInvitationDetail(event, context)
    }
    case 'getList': {
      return getInvitationList(event, context)
    }
    case 'update': {
      return updateInvitation(event, context)
    }
    case 'cancel': {
      return cancelInvitation(event, context)
    }
    case 'finish': {
      return finishInvitation(event, context)
    }
    default: {
      return null
    }
  }
}

// 发起约球
async function createInvitation(event, context) {
  const { OPENID } = cloud.getWXContext()
  console.log(event)
  const { creatorName, creatorAvatarUrl, locationInfo, remark, targetTime } = event
  try {
    let res = await db.collection('invitation_groups').add({
      data: {
        createTime: db.serverDate(), // 创建时间
        creatorName: creatorName, // 创建人姓名
        creatorOpenId: OPENID, // 创建人openid
        creatorAvatarUrl: creatorAvatarUrl, // 创建人头像
        locationInfo: locationInfo, // 地址信息
        remark: remark, // 备注
        targetTime: targetTime, // 约球时间
        status: 'OPENING', // 邀请状态
        participants: [
          {
            name: creatorName, // 参与人姓名
            avatarUrl: creatorAvatarUrl, // 参与人头像
            userOpenId: OPENID, // 参与人openid
            startTime: '', // 开始时间
            endTime: '', // 结束时间
          },
        ],
      },
    })
    return res
  } catch (error) {
    console.error(error)
    return null
  }
}

// 根据id获取邀请详情
async function getInvitationDetail(event, context) {
  const { id } = event
  try {
    const res = await db
      .collection('invitation_groups')
      .where({
        _id: id,
      })
      .get()
    return {
      ...res.data[0],
    }
  } catch (error) {
    console.error(error)
    return null
  }
}

// 更新约球
async function updateInvitation(event, context) {
  const { OPENID } = cloud.getWXContext()
  console.log(event)
  console.log(context)
  return {
    event: event,
    context: context,
  }
}

// 取消约球
async function cancelInvitation(event, context) {
  const { id } = event
  console.log(event)
  try {
    await db
      .collection('invitation_groups')
      .where({
        _id: id,
      })
      .update({
        data: {
          status: 'CANCELLED',
        },
      })
    return true
  } catch (error) {
    console.error(error)
    return null
  }
}

// 结束约球
async function finishInvitation(event, context) {
  const { OPENID } = cloud.getWXContext()
  console.log(event)
  console.log(context)
  return {
    event: event,
    context: context,
  }
}

// 约球列表
async function getInvitationList(event, context) {
  const { pageNum, pageSize } = event
  const totolCount = await db.collection('invitation_groups').count()
  if (totolCount && totolCount.total) {
    try {
      // 分页查询
      let pageCount = pageSize * (pageNum - 1)
      const groups = await db
        .collection('invitation_groups')
        .orderBy('createTime', 'desc')
        .skip(pageCount)
        .limit(pageSize)
        .get()
      return {
        list: groups.data,
        totalCount: totolCount.total,
        pageNum,
        pageSize,
      }
    } catch (error) {
      console.error(error)
      return null
    }
  } else {
    return null
  }
}
