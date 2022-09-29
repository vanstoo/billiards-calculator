// ctx.logger.info('invoke args: %j', ctx.args)

module.exports = async ctx => {
  let type = ctx.args.type
  // 获取用户openid
  const userOpenId = await getUserOpenId(ctx)
  if (!userOpenId) {
    return null
  } else {
    switch (type) {
      // 获取openId
      case 'get': {
        return getUserInfo(ctx, userOpenId)
      }
      case 'create': {
        return createUser(ctx, userOpenId)
      }
      case 'search': {
        return searchUsers(ctx, userOpenId)
      }
      case 'updateAuth': {
        return updateUserAuth(ctx, userOpenId)
      }
      default: {
        return null
      }
    }
  }
}

const getUserOpenId = async ctx => {
  const res = await ctx.mpserverless.user.getInfo()
  return res.user.oAuthUserId
}

// 获取当前用户信息
const getUserInfo = async (ctx, userOpenId) => {
  ctx.logger.info('userOpenId', userOpenId)
  const info = await ctx.mpserverless.db.collection('login_users').findOne({
    userOpenId,
  })
  return info
}

const createUser = async (ctx, userOpenId) => {
  let userCount = await ctx.mpserverless.db.collection('login_users').count({ userOpenId })
  ctx.logger.info('userCount', userCount)
  const { nickName, avatarUrl, updateTime } = ctx.args
  if (userCount && userCount.result === 0) {
    try {
      await ctx.mpserverless.db.collection('login_users').insertOne({
        createTime: updateTime, // 创建时间
        updateTime: updateTime, // 更新时间
        userOpenId, // openID
        nickName, // 昵称
        avatarUrl, // 头像
        hasCreatePerm: false, // 默认无创建权限
      })
      return true
    } catch (error) {
      console.info(error)
      return error
    }
  } else {
    try {
      await ctx.mpserverless.db.collection('login_users').findOneAndUpdate(
        { userOpenId },
        {
          $set: {
            updateTime: updateTime,
            nickName,
            avatarUrl,
          },
        },
      )
      return true
    } catch (error) {
      console.info(error)
      return error
    }
  }
}

const searchUsers = async (ctx, userOpenId) => {}

const updateUserAuth = async (ctx, userOpenId) => {}
