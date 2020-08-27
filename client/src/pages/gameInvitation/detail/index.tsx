import * as React from "react";
import { memo } from "react";
import Taro, { useRouter } from "@tarojs/taro";
import { View } from "@tarojs/components";

export interface InvitationDetailProps {}

const InvitationDetail: React.FC<InvitationDetailProps> = () => {
  const { invitationId } = useRouter().params;

  return <View>{invitationId}</View>;
};

export default memo(InvitationDetail);
