import * as React from "react";
import { memo, useEffect, useState } from "react";
import Taro, { useRouter } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { UseRequest } from "../../../service";
import { InvitationDetail } from "../type";

export interface InvitationDetailProps {}
const EmptyData: InvitationDetail = {
  _id: "",
  locationInfo: undefined as any,
  targetTime: "",
  remark: "",
  creatorName: "",
  creatorAvatarUrl: "",
  status: "CANCELLED"
};
const InvitationDetailView: React.FC<InvitationDetailProps> = () => {
  const { invitationId } = useRouter().params;
  const [detail, setDetail] = useState<InvitationDetail>(EmptyData);

  useEffect(() => {
    Taro.showLoading({ title: "加载详情中...", mask: true });
    if (invitationId) {
      UseRequest("invitation", {
        type: "getDetail",
        id: invitationId
      }).then(res => {
        console.log(res);
        Taro.hideLoading();
        if (res._id) {
          setDetail(res);
        }
      });
    }
  }, [invitationId]);

  return <View>{invitationId}</View>;
};

export default memo(InvitationDetailView);
