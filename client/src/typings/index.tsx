import { iteratee } from "lodash";

export interface UserInfo {
  createTime: string; // 创建时间
  updateTime: string; // 更新时间
  userOpenId: string; // 用户openId
  nickName: string; // 用户昵称
  avatarUrl: string; // 用户头像
}
