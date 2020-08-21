import * as React from "react";
import { memo } from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";

export interface HelpInfoProps {}

const HelpInfo: React.FC<HelpInfoProps> = () => {
  return <View>sss</View>;
};

export default memo(HelpInfo);
