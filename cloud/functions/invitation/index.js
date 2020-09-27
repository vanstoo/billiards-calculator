const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV,
})

const db = cloud.database({
  throwOnNotFound: false
})


// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  switch (event.type) {
    // 发起约球
    case 'create': {
      return createInvitation(event, context)
    }
    // 获取详情
    case 'getDetail': {
      return getInvitationDetail(event, context)
    }
    // 获取列表
    case 'getList': {
      return getInvitationList(event, context)
    }
    // 更新基础信息
    case 'updateBaseInfo': {
      return updateInvitationBaseInfo(event, context)
    }
    // 增加参与者
    case "addParticipantInfo": {
      return addParticipantInfo(event, context)
    }
    // 更新参与者信息
    case "updateParticipant": {
      return updateParticipantInfo(event, context)
    }
    // 增加管理员
    case "addAdminUser": {
      return addAdminUser(event, context)
    }
    // 取消活动
    case 'cancel': {
      return cancelInvitation(event, context)
    }
    // 结束活动
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
  const {
    OPENID
  } = cloud.getWXContext()
  const {
    creatorName,
    creatorAvatarUrl,
    locationInfo,
    remark,
    targetTime
  } = event
  let loginUsers = await db
    .collection('login_users')
    .where({
      userOpenId: OPENID,
    })
    .get()
  if (loginUsers.data && loginUsers.data[0] && loginUsers.data[0].hasCreatePerm) {
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
          participants: [{
            name: creatorName, // 参与人姓名
            avatarUrl: creatorAvatarUrl, // 参与人头像
            userOpenId: OPENID, // 参与人openid
            startTime: '', // 开始时间
            endTime: '', // 结束时间
          }, ],
          totalFee: null, // 总费用
          billImgs: [], // 活动费用凭证
          adminUsers: [OPENID] // 有操作权限的用户集合
        },
      })
      return {
        _id: res._id
      }
    } catch (error) {
      console.error(error)
      return error
    }
  } else {
    return {
      errMsg: "暂无权限，请联系管理员"
    }
  }

}

// 根据id获取邀请详情
async function getInvitationDetail(event, context) {
  const {
    id
  } = event
  try {
    const res = await db
      .collection('invitation_groups')
      .doc(id)
      .get()
    return {
      ...res.data,
    }
  } catch (error) {
    console.error(error)
    return error
  }
}

// 约球列表
async function getInvitationList(event, context) {
  const {
    pageNum,
    pageSize
  } = event
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
      return error
    }
  } else {
    return null
  }
}



// 取消约球
async function cancelInvitation(event, context) {
  const {
    id
  } = event
  console.log(event)
  let res = await db
    .collection('invitation_groups')
    .where({
      _id: id
    })
    .get()
  console.info(res, "res")
  if (res.data && res.data[0] && res.data[0].status === "OPENING") {
    try {
      await db
        .collection('invitation_groups')
        .doc(id)
        .update({
          data: {
            status: 'CANCELLED',
          },
        })
      return true
    } catch (error) {
      console.error(error)
      return error
    }
  } else {
    return {
      errMsg: "当前活动状态有变更，请返回详情页面查看"
    }
  }
}


// 更新约球基础信息
async function updateInvitationBaseInfo(event, context) {
  const {
    id
  } = event
  return {
    event: event,
    context: context,
  }
}

// 新增参与人
async function addParticipantInfo(event, context) {
  const {
    id,
    nickName,
    avatarUrl,
    startTime,
    endTime
  } = event
  const {
    OPENID
  } = cloud.getWXContext()
  const _ = db.command
  let res = await db
    .collection('invitation_groups')
    .where({
      _id: id
    })
    .get()
  if (res.data && res.data[0] && res.data[0].participants && !res.data[0].participants.some(x => x.userOpenId === OPENID)) {
    try {
      await db
        .collection('invitation_groups')
        .doc(id)
        .update({
          data: {
            participants: _.push({
              each: [{
                name: nickName, // 参与人姓名
                avatarUrl: avatarUrl, // 参与人头像
                userOpenId: OPENID, // 参与人openid
                startTime: startTime, // 开始时间
                endTime: endTime, // 结束时间
              }]
            })
          }
        })
      return true
    } catch (error) {
      console.error(error)
      return error
    }
  } else {
    return {
      errMsg: "当前参与人有变更，请刷新页面后重试"
    }
  }

}

// 更新参与人开始、结束时间
async function updateParticipantInfo(event, context) {
  const {
    id,
    startTime,
    endTime,
    index
  } = event
  try {
    await db
      .collection('invitation_groups')
      .doc(id)
      .update({
        data: {
          [`participants.${index}.startTime`]: startTime,
          [`participants.${index}.endTime`]: endTime,
        }
      })
    return true
  } catch (error) {
    console.error(error)
    return error
  }
}



// 结束约球
async function finishInvitation(event, context) {
  const {
    id,
    totalFee,
    billImgs,
  } = event
  const {
    OPENID
  } = cloud.getWXContext()
  const _ = db.command
  let res = await db
    .collection('invitation_groups')
    .where({
      _id: id
    })
    .get()
  console.info(res, "res")
  if (res.data && res.data[0] && res.data[0].status === "OPENING") {
    try {
      await db
        .collection('invitation_groups')
        .doc(id)
        .update({
          data: {
            status: "FINISHED",
            totalFee: totalFee,
            billImgs: _.push(billImgs)
          }
        })
      return true
    } catch (error) {
      console.error(error)
      return error
    }
  } else {
    return {
      errMsg: "当前活动状态有变更，请返回详情页面查看"
    }
  }
}

async function addAdminUser(event, context) {
  const {
    id,
    userId,
  } = event
  const _ = db.command
  try {
    await db
      .collection('invitation_groups')
      .doc(id)
      .update({
        data: {
          adminUsers: _.push([userId])
        }
      })
    return true
  } catch (error) {
    console.error(error)
    return error
  }
}