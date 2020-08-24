import * as React from "react";
import { memo } from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";

export interface InvitationDetailProps {}

const InvitationDetail: React.FC<InvitationDetailProps> = () => {
  return <View>InvitationDetail</View>;
};

export default memo(InvitationDetail);
