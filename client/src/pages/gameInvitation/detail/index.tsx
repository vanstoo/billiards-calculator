import * as React from "react";
import { memo, useEffect, useState, Fragment } from "react";
import Taro, {
  useRouter,
  usePullDownRefresh,
  useShareAppMessage
} from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { SectionItem } from "../../../components";
import { UseRequest } from "../../../service";
import { formatDate, returnStatusName, isValidArray } from "../../../utils";
import { dateFormatToMin } from "../../../constant";
import { InvitationItem, InvitationStatus } from "../type";
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
  participants: []
};
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

  // 根据状态返回对应颜色
  const returnStyleByStatus = () => {
    let statusObj: { [keys in InvitationStatus]: string } = {
      OPENING: "#0055FF", // 进行中
      CANCELLED: "#999999", // 已取消
      FINISHED: "#00A186" // 完成
    };
    return { background: statusObj[detail.status] || "#d9d9d9" };
  };

  return (
    <View className="detail">
      <View className="detail-panel" style={returnStyleByStatus()}>
        <Text>发起时间：{formatDate(detail.createTime, dateFormatToMin)}</Text>
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
          </Fragment>
        )}
      </View>
    </View>
  );
};

export default memo(InvitationDetailView);
