module.exports = async ctx => {
  let type = ctx.args.type
  switch (type) {
    // 获取openId
    case 'get': {
      return getUserInfo(ctx)
    }
  }
}

const getUserInfo = async ctx => {
  const res = await ctx.mpserverless.user.getInfo()
  let userOpenId = res.user.oAuthUserId
  if (!userOpenId) {
    return null
  } else {
    const info = await ctx.mpserverless.db.collection('login_users').findOne({
      userOpenId,
    })
    return info
  }
}
