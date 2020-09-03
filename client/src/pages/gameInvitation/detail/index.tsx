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
import { EditSignDate } from "../components";
import { UseRequest } from "../../../service";
import {
  formatDate,
  returnStatusName,
  isValidArray,
  returnStyleByStatus,
  subscribeInfo
} from "../../../utils";
import { dateFormatToMin } from "../../../constant";
import { InvitationItem, ParticipantItem } from "../type";
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
  const [editRecord, setEditRecord] = useState<ParticipantItem>();

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
        // console.log(res);
        Taro.stopPullDownRefresh();
        if (res._id) {
          Taro.hideLoading();
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
  useShareAppMessage(() => {
    return {
      title: `${detail.creatorName}向你发起了🎱邀请`,
      path: `/pages/gameInvitation/detail/index?invitationId=${invitationId}`
    };
  });

  // 查看地图
  const goToMapDetail = () => {
    // console.log(detail.locationInfo, "chooseLocation.getLocation()");
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

  // 取消邀请
  const cancelInvitation = () => {
    Taro.showLoading({
      title: "取消活动中...",
      mask: true
    });
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
        let timer = setTimeout(() => {
          getDetails();
          clearTimeout(timer);
        }, 2000);
      }
    });
  };

  // 确认取消弹窗
  const showCancelModal = () => {
    Taro.showModal({
      content: "确认取消约球吗？",
      success: res => {
        if (res.confirm) {
          cancelInvitation();
        }
      }
    });
  };

  // 展示编辑时间
  const showEditTime = (item: ParticipantItem) => {
    setEditRecord(item);
  };

  // 增加参与者
  const addPartcapant = () => {
    let param = {
      type: "addParticipantInfo",
      id: invitationId,
      nickName: userInfo.nickName,
      avatarUrl: userInfo.avatarUrl,
      startTime: "",
      endTime: ""
    };
    Taro.showLoading({
      title: "参与活动中...",
      mask: true
    });
    UseRequest("invitation", param).then(res => {
      console.log(res);
      if (res) {
        Taro.hideLoading();
        Taro.showToast({
          title: "参与成功",
          mask: true,
          duration: 3000
        });
        getDetails();
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
            content={
              detail.locationInfo?.name &&
              `${detail.locationInfo?.name}（点击查看）`
            }
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
              {detail.participants.map((item, index) => (
                <View key={index}>
                  <View className="participant-info">
                    <View className="participant-header">
                      <View className="user-info">
                        <AtAvatar circle text="头" image={item?.avatarUrl} />
                        <Text>{item?.name}</Text>
                      </View>
                      {/* 状态为进行中且发起人或当前参与人才可编辑自己的时间 */}
                      {detail.status === "OPENING" &&
                        (item.userOpenId === userInfo.userOpenId ||
                          detail.creatorOpenId === userInfo.userOpenId) && (
                          <View
                            className="link-col edit-btn"
                            onClick={() => showEditTime(item)}
                          >
                            编辑
                          </View>
                        )}
                    </View>
                    <SectionItem label="起始时间：" content={item?.startTime} />
                    <SectionItem label="结束时间：" content={item?.endTime} />
                  </View>
                  {detail.participants.length - 1 > index && (
                    <View className="divider" />
                  )}
                </View>
              ))}
            </Fragment>
          )}
        </View>
      </View>
      {/* 编辑签到、结束时间 */}
      {editRecord && (
        <EditSignDate
          editRecord={editRecord}
          invitationId={invitationId}
          setEditRecord={setEditRecord}
          participants={detail.participants}
          refreshAndGetdetail={getDetails}
        />
      )}
      {/* 状态为进行中才可键操作按钮 */}
      {detail.status === "OPENING" && (
        <View className="fixed-btn">
          <AtButton type="secondary" size="small" circle openType="share">
            分享
          </AtButton>
          {/* 约球发起者才可取消或结束 */}
          {detail.creatorOpenId === userInfo.userOpenId && (
            <Fragment>
              <AtButton
                type="primary"
                size="small"
                circle
                onClick={() => console.log(1)}
              >
                结束活动
              </AtButton>
              <AtButton
                type="secondary"
                size="small"
                circle
                onClick={showCancelModal}
              >
                取消活动
              </AtButton>
            </Fragment>
          )}
          {/* 非参与人员才可加入 */}
          {!detail.participants.some(
            x => x.userOpenId === userInfo.userOpenId
          ) && (
            <AtButton
              type="primary"
              size="small"
              circle
              onClick={addPartcapant}
            >
              加我一个
            </AtButton>
          )}
        </View>
      )}
    </Fragment>
  );
};

export default memo(InvitationDetailView);
