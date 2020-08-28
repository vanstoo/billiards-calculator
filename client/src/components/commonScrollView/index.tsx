import * as React from "react";
import { FC, memo, useEffect, useState } from "react";
import { ScrollView, View } from "@tarojs/components";
import "./index.scss";
import debounce from "lodash/debounce";

export interface CommonScrollViewProps {
  listLoding: boolean; // 列表加载状态
  hasReachBottom: boolean; // 数据已全部获取
  onRefresh: (e: any) => void; // 下拉刷新
  onScrollToLower: (e: any) => void; // 触底刷新
  children: React.ReactNode;
}

const CommonScrollView: FC<CommonScrollViewProps> = ({
  children,
  listLoding,
  hasReachBottom,
  onRefresh,
  onScrollToLower
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 根据listLoding取消下拉刷新状态
  useEffect(() => {
    if (listLoding === false) {
      setIsRefreshing(false);
    }
    console.log("listLoding", listLoding);
  }, [listLoding]);

  const onRefresherRefresh = debounce((e: any) => {
    setIsRefreshing(true);
    onRefresh(e);
  }, 50);

  const onScrollToLowerFunc = debounce((e: any) => {
    onScrollToLower(e);
  }, 100);

  return (
    <ScrollView
      className="list-card-box"
      enableBackToTop
      scrollY
      refresherEnabled
      refresherTriggered={isRefreshing}
      onRefresherRefresh={onRefresherRefresh}
      lowerThreshold={10}
      onScrollToLower={onScrollToLowerFunc}
    >
      {children}
      {hasReachBottom && (
        <View className="no-more-list">数据到底了，别拉了</View>
      )}
      <View className="list-last-view" />
    </ScrollView>
  );
};

export default memo(CommonScrollView);
