module.exports = async ctx => {
  let type = ctx.args.type
  switch (type) {
    case 'addSponsorInfo': {
      return addSponsorInfo(ctx)
    }
    case 'getSponsorInfoList': {
      return getSponsorInfoList(ctx)
    }
    case 'getLatestSponsorInfo': {
      return getLatestSponsorInfo(ctx)
    }
    default: {
      return null
    }
  }
}

// 添加赞助人信息
const addSponsorInfo = async ctx => {
  const { targetId, startDate, endDate, sponsorshipType, sponsorshipImgs, updateTime, sponsorshipAmount } = ctx.args
  try {
    await ctx.mpserverless.db.collection('sponsorship_info').insertOne({
      sponsorUserOpenId: targetId,
      startDate, // 赞助开始时间
      endDate, // 赞助结束时间
      sponsorshipType, // 赞助类型
      sponsorshipImgs, // 赞助凭证
      updateTime, // 数据更新时间
      sponsorshipAmount, // 赞助金额
    })
    return true
  } catch (error) {
    ctx.logger.info('addSponsorInfo', error)
    return error
  }
}
// 赞助人信息分页列表
const getSponsorInfoList = async ctx => {
  const { pageNum, pageSize } = ctx.args
  let searchParam = {
    _id: { $exists: true },
  }
  let totalCount = 0
  try {
    let res = await ctx.mpserverless.db.collection('sponsorship_info').count(searchParam)
    totalCount = res.result || 0
    // 分页查询
    let pageCount = pageSize * (pageNum - 1)
    ctx.logger.info(searchParam, 'searchParam')
    const groups = await ctx.mpserverless.db.collection('sponsorship_info').find(searchParam, {
      sort: { updateTime: -1 }, // 更新时间降序
      skip: pageCount,
      limit: pageSize,
    })
    let list = groups.result || []
    let userOpenIds = []
    list.forEach(x => {
      userOpenIds.push(x.sponsorUserOpenId)
    })
    let usrList = await getUserInfoByUserOpenIdList(ctx, userOpenIds)
    ctx.logger.info('sponsorship_info usrList', usrList)
    list = list.map(item => {
      let sponsorUser = findUsrById(item.sponsorUserOpenId, usrList)
      return {
        ...item,
        sponsorUserName: sponsorUser.nickName, // 赞助人姓名
        sponsorUserAvatarUrl: sponsorUser.avatarUrl, // 赞助人头像
      }
    })
    return {
      list: list,
      totalCount: totalCount,
      pageNum,
      pageSize,
    }
  } catch (error) {
    ctx.logger.error(error)
    return error
  }
}

// 返回当前赞助人信息
const getLatestSponsorInfo = async ctx => {
  const { type } = ctx.args
  try {
    // await ctx.mpserverless.db.collection('login_users').findOneAndUpdate({
    //   sponsorshipType: type,
    //   // 根据结束时间搜索小于当前结束时间的数据
    // })
    return true
  } catch (error) {
    ctx.logger.info('updateUserInfo', error)
    return error
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
