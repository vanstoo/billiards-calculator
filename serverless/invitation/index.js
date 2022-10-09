module.exports = async ctx => {
  let type = ctx.args.type
  switch (type) {
    // 发起约球
    case 'create': {
      return createInvitation(ctx)
    }
    // 获取详情
    case 'getDetail': {
      return getInvitationDetail(ctx)
    }
    // 获取列表
    case 'getList': {
      return getInvitationList(ctx)
    }
    // 增加管理员
    case 'addAdminUser': {
      return addAdminUser(ctx)
    }
    // 取消活动
    case 'cancel': {
      return cancelInvitation(ctx)
    }
    // 结束活动
    case 'finish': {
      return finishInvitation(ctx)
    }
    // 获取自己发起的活动数量
    case 'getListCountByCreator': {
      return getInvitationListByCreatorCount(ctx)
    }
    // 获取自己参与的活动数量
    case 'getListCountByParticipants': {
      return getInvitationListByParticipants(ctx)
    }
    // 获取状态为结束并组合了参与人信息的活动列表
    case 'getCombineList': {
      return getInvitationListCombineParticipants(ctx)
    }
    default: {
      return null
    }
  }
}

// 获取当前用户openid
const getUserOpenId = async ctx => {
  const res = await ctx.mpserverless.user.getInfo()
  return res.user.oAuthUserId
}

// 获取目标用户注册信息
const getUserInfo = async (ctx, userOpenId) => {
  const userInfo = await ctx.mpserverless.db.collection('login_users').findOne({
    userOpenId,
  })
  if (userInfo && userInfo.result) {
    return userInfo.result
  } else {
    return null
  }
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

const findUsrById = (id, usrList) => {
  let tar
  if (Array.isArray(usrList)) {
    tar = usrList.find(z => z.userOpenId === id)
  }
  return tar || {}
}

const createInvitation = async ctx => {
  const { locationInfo, remark, targetTime, updateTime, userOpenId } = ctx.args
  const userInfo = await getUserInfo(ctx, userOpenId)
  ctx.logger.info('createInvitation info', userInfo)
  if (userInfo && userInfo.hasCreatePerm) {
    try {
      let res = await ctx.mpserverless.db.collection('invitation_groups').insertOne({
        createTime: updateTime, // 创建时间
        creatorOpenId: userOpenId, // 创建人openid
        locationInfo: locationInfo, // 地址信息
        remark: remark, // 备注
        targetTime: targetTime, // 约球时间
        status: 'OPENING', // 邀请状态
        totalFee: null, // 总费用
        billImgs: [], // 活动费用凭证
        adminUsers: [userOpenId], // 有操作权限的用户集合
        lastUpdateTime: updateTime, // 最后更新时间
      })
      ctx.logger.info('createInvitation info', res, res.result.insertedId)
      await ctx.mpserverless.db.collection('participants_info').insertOne({
        createTime: updateTime, // 创建时间
        invitationId: res.result.insertedId,
        userOpenId: userOpenId, // 参与人openid
        startTime: '', // 开始时间
        endTime: '', // 结束时间
      })
      return {
        _id: res.result.insertedId,
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
const getInvitationDetail = async ctx => {
  const { id } = ctx.args
  try {
    const res = await ctx.mpserverless.db.collection('invitation_groups').findOne({ _id: id })
    ctx.logger.info('getInvitationDetail info', res)
    if (res) {
      const participantsInfo = await ctx.mpserverless.db.collection('participants_info').find(
        { invitationId: id },
        {
          sort: { createTime: -1 },
        },
      )
      ctx.logger.info('getInvitationDetail participants', participantsInfo)
      let participants = participantsInfo ? participantsInfo.result : []
      let userOpenIds = participants.map(x => x.userOpenId).filter(y => !!y)
      let usrList = await getUserInfoByUserOpenIdList(ctx, userOpenIds)
      res.result.participants = participants.map(item => {
        let usr = findUsrById(item.userOpenId, usrList)
        return {
          ...item,
          name: usr.nickName, // 参与人姓名
          avatarUrl: usr.avatarUrl, // 参与人头像
        }
      })
      ctx.logger.info('getInvitationDetail participants', usrList, res.result)
      res.result.creatorName = findUsrById(res.result.creatorOpenId, usrList).nickName // 返回创建人信息
      return {
        ...res.result,
      }
    }
    return {
      errMsg: '不存在详情,出错了',
    }
  } catch (error) {
    console.error(error)
    return error
  }
}

const getInvitationList = async ctx => {
  const userOpenId = await getUserOpenId(ctx)
  ctx.logger.info('createInvitation userOpenId', userOpenId)
  const { pageNum, pageSize, searchByCreator, searchByParticipants } = ctx.args
  let searchParam = {}
  let res = {}
  // 根据参与人搜索
  if (searchByParticipants) {
    // // 获取匹配的活动id
    // let partRes = await db
    //   .collection('participants_info')
    //   .aggregate()
    //   .match({ userOpenId: userOpenId })
    //   .limit(10000)
    //   .end()
    //   .then(result => result)
    // // console.info(partRes, 'partRes')
    // if (partRes && partRes.list) {
    //   // 列表长度则为参与的活动长度
    //   res.total = partRes.list.length
    //   let arr = partRes.list.map(x => x.invitationId)
    //   // console.info('searchByParticipants', partRes.list.length, 'arr====', arr)
    //   searchParam._id = _.in(arr) // 根据invitationId搜索匹配的活动列表
    // }
  } else {
    // 根据创建人搜索
    if (searchByCreator) {
      searchParam.creatorOpenId = userOpenId
    }
    res = await ctx.mpserverless.db.collection('invitation_groups').count(searchParam)
  }
  ctx.logger.info('getInvitationList res', res)
  if (res && res.result) {
    try {
      // 分页查询
      let pageCount = pageSize * (pageNum - 1)
      // console.info(searchParam, 'searchParam')
      const groups = await ctx.mpserverless.db.collection('invitation_groups').find(searchParam, {
        sort: {
          createTime: -1,
        },
        skip: pageCount,
        limit: pageSize,
      })
      let list = groups.result || []
      let userOpenIds = list.map(x => x.creatorOpenId).filter(y => !!y)
      let usrList = await getUserInfoByUserOpenIdList(ctx, userOpenIds)
      ctx.logger.info('getInvitationDetail usrList', usrList)
      list = list.map(item => {
        let usr = findUsrById(item.creatorOpenId, usrList)
        return {
          ...item,
          creatorName: usr.nickName, // 参与人姓名
          creatorAvatarUrl: usr.avatarUrl, // 参与人头像
        }
      })
      return {
        list: list,
        totalCount: res.result,
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

// 增加当前活动管理员
const addAdminUser = async ctx => {
  const { id, userId } = ctx.args
  try {
    await ctx.mpserverless.db.collection('invitation_groups').updateOne(
      { _id: id },
      {
        $addToSet: { adminUsers: userId },
      },
    )
    return true
  } catch (error) {
    console.error(error)
    return error
  }
}

// 取消约球
const cancelInvitation = async ctx => {
  const { id, updateTime } = ctx.args
  try {
    await ctx.mpserverless.db.collection('invitation_groups').findOneAndUpdate(
      {
        _id: id,
        status: 'OPENING',
      },
      {
        $set: {
          status: 'CANCELLED',
          lastUpdateTime: updateTime, // 最后更新时间
        },
      },
    )
    return true
  } catch (error) {
    console.error(error)
    return error
  }
}
