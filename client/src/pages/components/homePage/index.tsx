import * as React from "react";
import { memo, useState, useEffect, Fragment } from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtButton } from "taro-ui";
import { CommonScrollView, EmptyListView } from "../../../components";
import { isValidArray } from "../../../utils";
import "./index.scss";
export interface HomePageProps {}

const dataList = [
  { label: 1 },
  { label: 1212112 },
  { label: 112112 },
  { label: 11212 },
  { label: 1121212121212121212 }
];

const HomePage: React.FC<HomePageProps> = () => {
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasReachBottom, setHasReachBottom] = useState(false);

  useEffect(() => {
    console.log(pageNum, "useEffect");
  }, [pageNum]);

  // 下拉刷新
  const onScrollToUpper = e => {
    console.log(e, "到顶了");
    setPageNum(1);
  };

  // 底部滚动刷新
  const onScrollToLower = () => {
    console.log("到底了");
    if (!hasReachBottom) {
      setPageNum(pageNum + 1);
    } else {
      console.log("数据已经没了");
    }
  };

  const searchListByPage = () => {
    console.log(pageNum, "searchListByPage");
  };

  return (
    <View className="list-card-box">
      <CommonScrollView
        listLoding={loading}
        hasReachBottom={hasReachBottom}
        onRefresh={onScrollToUpper}
        onScrollToLower={onScrollToLower}
      >
        {isValidArray(dataList) ? (
          <Fragment>
            {dataList.map(x => (
              <View
                key={x.label}
                className="list-card"
                onClick={() => console.log(1)}
              >
                <View> {x.label}</View>
                <View>阿斯顿撒开多久阿三开的阿斯顿</View>
              </View>
            ))}
            <View className="list-last-view" />
          </Fragment>
        ) : (
          <EmptyListView />
        )}
      </CommonScrollView>
      )
      <View className="fixed-btn" style={{ paddingBottom: "170rpx" }}>
        <AtButton
          type="primary"
          circle
          onClick={() =>
            Taro.navigateTo({ url: "/pages/gameInvitation/create/index" })
          }
        >
          发起约球
        </AtButton>
      </View>
    </View>
  );
};

export default memo(HomePage);
