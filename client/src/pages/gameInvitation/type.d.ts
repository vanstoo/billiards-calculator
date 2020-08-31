import { MapLocationInfo } from "../../typings";

// 邀请状态 进行中｜完成｜取消
export type InvitationStatus = "OPENING" | "FINISHED" | "CANCELLED";

// 邀请列表
export interface InvitationItem {
  _id: string; // 唯一id
  locationInfo: MapLocationInfo; // 地址信息
  targetTime: string; // 约球时间
  remark: string; //  约球备注
  creatorName: string; // 约球人
  creatorAvatarUrl: string; // 约球人头像
  createTime: string; // 发起时间
  status: InvitationStatus; // 邀请状态
  participants: ParticipantItem[]; // 参与人员
}

export interface ParticipantItem {
  name: string; // 参与人姓名
  avatarUrl: string; // 参与人头像
  userOpenId: string; // 参与人openid
  startTime: string; // 开始时间
  endTime: string; // 结束时间
}
