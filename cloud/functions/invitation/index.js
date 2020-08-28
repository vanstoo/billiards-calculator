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
    case 'update': {
      return updateInvitation(event, context)
    }
    case 'finish': {
      return finishInvitation(event, context)
    }
    case 'getList': {
      return getInvitationList(event, context)
    }
    default: {
      return null
    }
  }
}


// 发起约球
async function createInvitation(event, context) {
  const {
    OPENID
  } = cloud.getWXContext()
  console.log(event)
  const {
    creatorName,
    creatorAvatarUrl,
    locationInfo,
    remark,
    targetTime
  } = event
  try {
    let res = await db.collection('invitation_groups').add({
      data: {
        createTime: db.serverDate(),
        creatorName: creatorName,
        creatorOpenId: OPENID,
        creatorAvatarUrl: creatorAvatarUrl,
        locationInfo: locationInfo,
        remark: remark,
        targetTime: targetTime,
      },
    })
    return res
  } catch (error) {
    console.error(error)
    return null
  }
}

// 更新约球
async function updateInvitation(event, context) {
  const {
    OPENID
  } = cloud.getWXContext()
  console.log(event)
  console.log(context)
  return {
    event: event,
    context: context
  }
}

// 结束约球
async function finishInvitation(event, context) {
  const {
    OPENID
  } = cloud.getWXContext()
  console.log(event)
  console.log(context)
  return {
    event: event,
    context: context
  }
}

// 约球列表
async function getInvitationList(event, context) {
  const {
    OPENID
  } = cloud.getWXContext()
  const {
    pageNum,
    pageSize
  } = event
  const totolCount = await db.collection('invitation_groups').count()
  if (totolCount && totolCount.total) {
    try {
      // 分页查询
      let pageCount = pageSize * (pageNum - 1)
      const groups = await db.collection('invitation_groups').orderBy('createTime', 'desc').skip(pageCount).limit(pageSize).get()
      return {
        list: groups.data,
        totalCount: totolCount.total,
        pageNum,
        pageSize
      }
    } catch (error) {
      console.error(error)
      return null
    }
  } else {
    return null
  }
}