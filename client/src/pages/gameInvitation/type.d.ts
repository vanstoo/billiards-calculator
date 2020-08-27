import { MapLocationInfo } from "../../typings";

export interface InvitationListItem {
  _id: string; // 唯一id
  locationInfo: MapLocationInfo; // 地址信息
  targetTime: string; // 约球时间
  remark: string; //  约球备注
  creatorName: string; // 约球人
  creatorAvatarUrl: string; // 约球人头像
}
