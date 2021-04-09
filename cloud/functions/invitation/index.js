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
    // 增加管理员
    case 'addAdminUser': {
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
    // 获取自己发起的活动数量
    case 'getListCountByCreator': {
      return getInvitationListByCreatorCount(event, context)
    }
    // 获取自己参与的活动数量
    case 'getListCountByParticipants': {
      return getInvitationListByParticipants(event, context)
    }
    // 获取状态为结束并组合了参与人信息的活动列表
    case 'getCombineList': {
      return getInvitationListCombineParticipants(event, context)
    }
    default: {
      return null
    }
  }
}

// 发起约球
async function createInvitation(event, context) {
  const { OPENID } = cloud.getWXContext()
  const { creatorName, creatorAvatarUrl, locationInfo, remark, targetTime } = event
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
          totalFee: null, // 总费用
          billImgs: [], // 活动费用凭证
          adminUsers: [OPENID], // 有操作权限的用户集合
          lastUpdateTime: db.serverDate(), // 最后更新时间
        },
      })
      await db.collection('participants_info').add({
        data: {
          createTime: db.serverDate(), // 创建时间
          invitationId: res._id,
          name: creatorName, // 参与人姓名
          avatarUrl: creatorAvatarUrl, // 参与人头像
          userOpenId: OPENID, // 参与人openid
          startTime: '', // 开始时间
          endTime: '', // 结束时间
        },
      })
      return {
        _id: res._id,
      }
    } catch (error) {
      console.error(error)
      return error
    }
  } else {
    return {
      errMsg: '暂无权限，请联系管理员',
    }
  }
}

// 根据id获取邀请详情
async function getInvitationDetail(event, context) {
  const { id } = event
  try {
    const res = await db.collection('invitation_groups').doc(id).get()
    const participants = await db
      .collection('participants_info')
      .orderBy('createTime', 'desc')
      .where({ invitationId: id })
      .get()
    res.data.participants = participants ? participants.data : []
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
  const { OPENID } = cloud.getWXContext()
  const { pageNum, pageSize, searchByCreator, searchByParticipants } = event
  const _ = db.command
  let searchParam = {}
  let res = {}
  // 根据参与人搜索
  if (searchByParticipants) {
    // 获取匹配的活动id
    let partRes = await db.collection('participants_info').where({ userOpenId: OPENID }).get()
    if (partRes && partRes.data) {
      // 列表长度则为参与的活动长度
      res.total = partRes.data.length
      let arr = partRes.data.map((x) => x.invitationId)
      // console.warn('searchByParticipants', partRes.data.length, 'arr====', arr)
      searchParam._id = _.in(arr) // 根据invitationId搜索匹配的活动列表
    }
  } else {
    // 根据创建人搜索
    if (searchByCreator) {
      searchParam.creatorOpenId = OPENID
    }
    res = await db.collection('invitation_groups').where(searchParam).count()
  }
  if (res && res.total) {
    try {
      // 分页查询
      let pageCount = pageSize * (pageNum - 1)
      const groups = await db
        .collection('invitation_groups')
        .where(searchParam)
        .orderBy('createTime', 'desc')
        .skip(pageCount)
        .limit(pageSize)
        .get()
      return {
        list: groups.data,
        totalCount: res.total,
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
  const { id } = event
  console.log(event)
  let res = await db
    .collection('invitation_groups')
    .where({
      _id: id,
    })
    .get()
  console.info(res, 'res')
  if (res.data && res.data[0] && res.data[0].status === 'OPENING') {
    try {
      await db
        .collection('invitation_groups')
        .doc(id)
        .update({
          data: {
            status: 'CANCELLED',
            lastUpdateTime: db.serverDate(), // 最后更新时间
          },
        })
      return true
    } catch (error) {
      console.error(error)
      return error
    }
  } else {
    return {
      errMsg: '当前活动状态有变更，请返回详情页面查看',
    }
  }
}

// 更新约球基础信息
async function updateInvitationBaseInfo(event, context) {
  const { id } = event
  return {
    event: event,
    context: context,
  }
}

// 结束约球
async function finishInvitation(event, context) {
  const { id, totalFee, billImgs } = event
  let res = await db
    .collection('invitation_groups')
    .where({
      _id: id,
    })
    .get()
  console.info(res, 'res')
  if (res.data && res.data[0] && ['OPENING', 'FINISHED'].includes(res.data[0].status)) {
    try {
      await db
        .collection('invitation_groups')
        .doc(id)
        .update({
          data: {
            status: 'FINISHED',
            totalFee: totalFee,
            billImgs: billImgs,
            lastUpdateTime: db.serverDate(), // 最后更新时间
          },
        })
      return true
    } catch (error) {
      console.error(error)
      return error
    }
  } else {
    return {
      errMsg: '当前活动状态有变更，请返回详情页面查看',
    }
  }
}

// 增加当前活动管理员
async function addAdminUser(event, context) {
  const { id, userId } = event
  const _ = db.command
  try {
    await db
      .collection('invitation_groups')
      .doc(id)
      .update({
        data: {
          adminUsers: _.push([userId]),
        },
      })
    return true
  } catch (error) {
    console.error(error)
    return error
  }
}

async function getInvitationListByCreatorCount(event, context) {
  const { OPENID } = cloud.getWXContext()
  const res = await db.collection('invitation_groups').where({ creatorOpenId: OPENID }).count()
  return {
    total: res.total,
  }
}

async function getInvitationListByParticipants(event, context) {
  const { OPENID } = cloud.getWXContext()
  const res = await db.collection('participants_info').where({ userOpenId: OPENID }).count()
  return {
    total: res.total,
  }
}

async function getInvitationListCombineParticipants(event, context) {
  const { OPENID } = cloud.getWXContext()
  const _ = db.command
  const $ = db.command.aggregate
  try {
    let res = await db
      .collection('participants_info') // 所有参与人信息
      .aggregate() // 聚合
      .match({ userOpenId: OPENID }) // 过滤当前人的参加信息
      .lookup({
        from: 'invitation_groups', // 联合活动表
        localField: 'invitationId',
        foreignField: '_id',
        as: 'details', // 将活动数据塞进details数组
      })
      .unwind('$details') // 拍平details（正常一条参加信息对应就一个活动
      .match({ [`details.status`]: 'FINISHED' }) // 过滤非完结状态的活动
      .limit(100000)
      .end()
      .then((reuslt) => reuslt)
    return {
      list: res.list,
    }
  } catch (error) {
    console.warn(error)
    return {
      errMsg: '查询失败',
    }
  }
}
