import * as React from "react";
import { memo } from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";

export interface InvitationCreateProps {}

const InvitationCreate: React.FC<InvitationCreateProps> = () => {
  return <View>三大咖时代发生的</View>;
};

export default memo(InvitationCreate);
