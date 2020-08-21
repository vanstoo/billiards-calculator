import * as React from "react";
import { memo } from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";

export interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = () => {
  return <View>HomePage</View>;
};

export default memo(HomePage);
