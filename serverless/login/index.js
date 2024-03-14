module.exports = async ctx => {
  let type = ctx.args.type
  switch (type) {
    // 获取openId
    case 'get':
    case 'create': {
      const userOpenId = await getUserOpenId(ctx)
      return userOpenId
        ? type == 'get'
          ? getUserInfo(ctx, userOpenId)
          : createUser(ctx, userOpenId)
        : '不存在openId,出错了'
    }
    case 'search':
    case 'searchNoPermissionUsers': {
      return searchNoPermissionUsers(ctx)
    }
    case 'searchUserByName': {
      return searchUserByName(ctx)
    }
    case 'updateAuth': {
      return updateUserAuth(ctx)
    }
    case 'updateUserInfo': {
      return updateUserInfo(ctx)
    }
    case 'updateLevel': {
      return updateUserLevelInfo(ctx)
    }
    default: {
      return null
    }
  }
}

/* 用户的支付宝/钉钉/微信身份ID。
 ** 详细可见https://help.aliyun.com/document_detail/435928.html
 */
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

const searchNoPermissionUsers = async ctx => {
  const { fuzzyName } = ctx.args
  try {
    // 根据fuzzyName获取login_users下未开通权限用户
    let loginUsers = await ctx.mpserverless.db.collection('login_users').find(
      {
        nickName: {
          $regex: '.*' + fuzzyName + '.*',
          $options: 'i',
        },
        hasCreatePerm: false,
      },
      { limit: 5 },
    )
    return (loginUsers && loginUsers.result) || []
  } catch (error) {
    return error
  }
}

// 更新用户创建权限
const updateUserAuth = async ctx => {
  const { targetId } = ctx.args
  try {
    await ctx.mpserverless.db.collection('login_users').findOneAndUpdate(
      {
        userOpenId: targetId,
      },
      {
        $set: {
          hasCreatePerm: true,
        },
      },
    )
    return true
  } catch (error) {
    return error
  }
}

// 根据userOpenId是否存在判断是否新增用户
const createUser = async (ctx, userOpenId) => {
  const { nickName, avatarUrl, updateTime } = ctx.args
  let userCount = await ctx.mpserverless.db.collection('login_users').count({
    userOpenId: userOpenId,
  })
  ctx.logger.info('userCount', userCount)
  try {
    if (userCount) {
      if (userCount.result === 0) {
        await ctx.mpserverless.db.collection('login_users').insertOne({
          createTime: updateTime, // 创建时间
          updateTime: updateTime, // 更新时间
          userOpenId, // openID
          nickName, // 昵称
          avatarUrl, // 头像
          hasCreatePerm: false, // 默认无创建权限
          level: 'D', // 默认等级D
          lastUpdateLevelDate: '', // 更新默认等级时间
        })
        return true
      } else {
        await ctx.mpserverless.db.collection('login_users').findOneAndUpdate(
          {
            userOpenId: userOpenId,
          },
          {
            $set: {
              nickName: nickName,
              avatarUrl: avatarUrl,
              updateTime: updateTime,
            },
          },
        )
        return true
      }
    } else {
      return {
        errMsg: '获取用户count失败，请刷新小程序后重试',
      }
    }
  } catch (error) {
    ctx.logger.info(error)
    return error
  }
}
// 更新用户信息
const updateUserInfo = async ctx => {
  const { nickName, avatarUrl, targetId, updateTime } = ctx.args
  try {
    await ctx.mpserverless.db.collection('login_users').findOneAndUpdate(
      {
        userOpenId: targetId,
      },
      {
        $set: {
          nickName: nickName,
          avatarUrl: avatarUrl,
          updateTime: updateTime,
        },
      },
    )
    return true
  } catch (error) {
    ctx.logger.info('updateUserInfo', error)
    return error
  }
}

// 更新用户等级
const updateUserLevelInfo = async ctx => {
  const { targetId, level, lastUpdateLevelDate } = ctx.args
  try {
    await ctx.mpserverless.db.collection('login_users').findOneAndUpdate(
      {
        userOpenId: targetId,
      },
      {
        $set: {
          level: level,
          lastUpdateLevelDate: lastUpdateLevelDate,
        },
      },
    )
    return true
  } catch (error) {
    ctx.logger.info(error)
    return error
  }
}

// 模糊搜索用户名
const searchUserByName = async ctx => {
  const { fuzzyName } = ctx.args
  try {
    // 根据fuzzyName获取login_users下未开通权限用户
    let loginUsers = await ctx.mpserverless.db.collection('login_users').find(
      {
        nickName: {
          $regex: '.*' + fuzzyName + '.*', // 使用 $regex 进行模糊搜索，
          $options: 'i', // $options: "i" 表示不区分大小写
        },
      },
      { limit: 5 }, // 限制返回结果为五条
    )
    return (loginUsers && loginUsers.result) || []
  } catch (error) {
    return error
  }
}
