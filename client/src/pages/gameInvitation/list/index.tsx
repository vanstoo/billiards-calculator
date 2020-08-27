import * as React from "react";
import { memo, useState, useEffect, Fragment } from "react";
import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { AtButton, AtAvatar } from "taro-ui";
import { CommonScrollView, EmptyListView } from "../../../components";
import { isValidArray, formatDate } from "../../../utils";
import { InvitationListItem } from "../type";
import "../index.scss";
export interface HomePageProps {}

const InvitationList: React.FC<HomePageProps> = () => {
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasReachBottom, setHasReachBottom] = useState(false);
  const [invitationList, setInvitationList] = useState<InvitationListItem[]>(
    []
  );

  useEffect(() => {
    console.log(pageNum, "useEffect");
    setLoading(true);
    Taro.showLoading({ title: "获取数据中...", mask: true });
    Taro.cloud.callFunction({
      name: "invitation",
      data: {
        type: "getList",
        pageNum: pageNum,
        pageSize: 10
      },
      success: ({ result }: { result: any }) => {
        console.log(result, "result");
        Taro.hideLoading();
        setLoading(false);
        if (result && isValidArray(result.list)) {
          if (pageNum === 1) {
            setInvitationList(result.list);
            setHasReachBottom(result.list.length === result.totalCount);
          } else {
            let newList = invitationList.concat(result.list);
            setInvitationList(invitationList.concat(result.list));
            setHasReachBottom(newList.length === result.totalCount);
          }
        } else {
          Taro.showToast({
            title: "获取失败，请稍后尝试或联系管理员",
            mask: true,
            icon: "none"
          });
        }
      }
    });
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
        {isValidArray(invitationList) ? (
          <Fragment>
            {invitationList.map(x => (
              <View
                key={x._id}
                className="list-card"
                onClick={() =>
                  Taro.navigateTo({
                    url: `/pages/gameInvitation/detail/index?invitationId=${x._id}`
                  })
                }
              >
                <View className="list-item-header">
                  <AtAvatar circle text="头" image={x?.creatorAvatarUrl} />
                  <Text>{x.creatorName}发起的约球</Text>
                </View>
                <View className="list-item-content">
                  <View>地址：{x?.locationInfo?.address}</View>
                  <View>描述：{x.remark ? x.remark : "—"}</View>
                </View>
                <View className="list-item-footer">
                  {/* {formatDate(x.createTime, "YYYY-MM-DD HH:mm")} */}
                  {x.targetTime}
                </View>
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

export default memo(InvitationList);
