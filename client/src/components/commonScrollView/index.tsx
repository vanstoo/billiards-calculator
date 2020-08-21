import * as React from "react";
import { FC, memo, useEffect, useState } from "react";
import { ScrollView, View } from "@tarojs/components";

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
  }, [listLoding]);

  const onRefresherRefresh = (e: any) => {
    setIsRefreshing(true);
    onRefresh(e);
  };

  return (
    <ScrollView
      className="list-card-box"
      enableBackToTop
      scrollY
      refresherEnabled
      refresherTriggered={isRefreshing}
      onRefresherRefresh={onRefresherRefresh}
      lowerThreshold={10}
      onScrollToLower={onScrollToLower}
    >
      {children}
      {hasReachBottom && <View className="no-more-list">我是有底线的哦</View>}
      <View className="list-last-view" />
    </ScrollView>
  );
};

export default memo(CommonScrollView);
