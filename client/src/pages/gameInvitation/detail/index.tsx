import * as React from "react";
import { memo, useEffect, useState, Fragment } from "react";
import Taro, {
  useRouter,
  usePullDownRefresh,
  useShareAppMessage
} from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { AtButton, AtAvatar } from "taro-ui";
import { SectionItem } from "../../../components";
import { UseRequest } from "../../../service";
import {
  formatDate,
  returnStatusName,
  isValidArray,
  returnStyleByStatus
} from "../../../utils";
import { dateFormatToMin } from "../../../constant";
import { InvitationItem, InvitationStatus } from "../type";
import { UserInfo } from "../../../typings";
export interface InvitationDetailProps {}

const EmptyData: InvitationItem = {
  _id: "",
  locationInfo: undefined as any,
  targetTime: "",
  remark: "",
  creatorName: "",
  creatorAvatarUrl: "",
  createTime: "",
  status: "CANCELLED",
  participants: [],
  creatorOpenId: ""
};

const userInfo: UserInfo = Taro.getStorageSync("userInfo");
const InvitationDetailView: React.FC<InvitationDetailProps> = () => {
  const { invitationId } = useRouter().params;
  const [detail, setDetail] = useState<InvitationItem>(EmptyData);
  const getDetails = () => {
    Taro.showLoading({
      title: "加载详情中...",
      mask: true
    });
    if (invitationId) {
      UseRequest("invitation", {
        type: "getDetail",
        id: invitationId
      }).then(res => {
        console.log(res);
        Taro.hideLoading();
        Taro.stopPullDownRefresh();
        if (res._id) {
          setDetail(res);
        }
      });
    }
  };

  useEffect(() => {
    getDetails();
  }, [invitationId]);

  // 下拉刷新
  usePullDownRefresh(() => {
    console.log("onPullDownRefresh");
    getDetails();
  });

  // 分享
  useShareAppMessage(res => {
    if (res.from === "button") {
      // 来自页面内转发按钮
      console.log(res.target);
    }
    return {
      title: `${detail.creatorName}向你发起了🎱邀请`,
      path: `/pages/gameInvitation/detail/index?invitationId=${invitationId}`
    };
  });

  const goToMapDetail = () => {
    console.log(detail.locationInfo, "chooseLocation.getLocation()");
    if (detail.locationInfo) {
      Taro.openLocation(detail.locationInfo);
    } else {
      Taro.showToast({
        title: "地址有误，请重试或联系管理员",
        mask: true,
        icon: "none"
      });
    }
  };

  const cancelInvitation = () => {
    UseRequest("invitation", {
      type: "cancel",
      id: invitationId
    }).then(res => {
      console.log(res);
      if (res) {
        Taro.showToast({
          title: "取消成功",
          mask: true,
          duration: 3000
        });
        setTimeout(() => {
          getDetails();
        }, 2000);
      }
    });
  };

  return (
    <Fragment>
      <View className="detail">
        <View
          className="detail-panel"
          style={returnStyleByStatus(detail.status)}
        >
          <Text>
            发起时间：{formatDate(detail.createTime, dateFormatToMin)}
          </Text>
          <Text>{returnStatusName(detail.status)}</Text>
        </View>
        <View className="detail-card">
          <View className="title">
            基本信息
            {/* <View className="link-col">编辑</View> */}
          </View>
          <View className="divider" />
          <SectionItem label="发起人：" content={detail.creatorName} />
          <SectionItem label="约球时间：" content={detail.targetTime} />
          <SectionItem
            label="约球地址："
            content={`${detail?.locationInfo?.name}（点击查看）`}
            isLinkCol
            contentClick={goToMapDetail}
          />
          <SectionItem label="描述：" content={detail.remark} />
        </View>
        <View className="detail-card">
          <View className="title">参与人员</View>
          {isValidArray(detail.participants) && (
            <Fragment>
              <View className="divider" />
              {detail.participants.map((item, index) => {
                return (
                  <View className="participant-info" key={index.toString()}>
                    <View className="user-info">
                      <AtAvatar circle text="头" image={item?.avatarUrl} />
                      <Text>{item?.name}</Text>
                    </View>
                    <SectionItem label="起始时间：" content={item?.startTime} />
                    <SectionItem label="结束时间：" content={item?.endTime} />
                  </View>
                );
              })}
            </Fragment>
          )}
        </View>
      </View>
      <View className="fixed-btn">
        {/* 约球发起者才可取消或结束 */}
        {detail.creatorOpenId === userInfo.userOpenId &&
          detail.status === "OPENING" && (
            <Fragment>
              <AtButton
                type="secondary"
                size="small"
                circle
                onClick={cancelInvitation}
              >
                取消
              </AtButton>

              <AtButton
                type="primary"
                size="small"
                circle
                onClick={() => console.log(1)}
              >
                结束
              </AtButton>
            </Fragment>
          )}
        {/* 非参与人员才可加入 */}
        {detail.participants.some(
          x => x.userOpenId !== userInfo.userOpenId
        ) && (
          <AtButton
            type="primary"
            size="small"
            circle
            onClick={() => console.log(1)}
          >
            加我一个
          </AtButton>
        )}
      </View>
    </Fragment>
  );
};

export default memo(InvitationDetailView);
