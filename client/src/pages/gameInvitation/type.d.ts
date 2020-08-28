import { MapLocationInfo } from "../../typings";

// 邀请状态 进行中｜完成｜取消
export type InvitationStatus = "OPENING" | "FINISHED" | "CANCELLED";

// 邀请列表
export interface InvitationListItem {
  _id: string; // 唯一id
  locationInfo: MapLocationInfo; // 地址信息
  targetTime: string; // 约球时间
  remark: string; //  约球备注
  creatorName: string; // 约球人
  creatorAvatarUrl: string; // 约球人头像
  status: InvitationStatus; // 邀请状态
}

// 邀请详情
export interface InvitationDetail extends InvitationListItem {}
