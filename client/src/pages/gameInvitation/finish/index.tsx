import * as React from "react";
import { memo, useEffect, useState } from "react";
import Taro, { useRouter } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtInput, AtButton } from "taro-ui";
import { ParticipantsView } from "../components";
import { UseRequest } from "../../../service";
import { returnNowTime, formatDate } from "../../../utils";
import { dateFormatToMin } from "../../../constant";
import { InvitationItem } from "../type";
import { UserInfo } from "../../../typings";
import dayjs from "dayjs";

export interface FinishInvitationProps {}
const userInfo: UserInfo = Taro.getStorageSync("userInfo");

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
  creatorOpenId: "",
  totalFee: 0
};

// 结束活动
const FinishInvitation: React.SFC<FinishInvitationProps> = () => {
  const { invitationId } = useRouter().params;
  const [detail, setDetail] = useState<InvitationItem>(EmptyData);
  const [totalFee, setTotalFee] = useState(); // 费用总计

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
        if (res._id) {
          Taro.hideLoading();
          setDetail(res);
        }
      });
    }
  };
  // 获取详情
  useEffect(() => {
    getDetails();
  }, [invitationId]);

  // 处理时间及占比
  useEffect(() => {
    // console.log(detail.participants, "detail.participants");
    // let startTimeArr: string[] = [];
    // let endTimeArr: string[] = [];
    // let newList = detail.participants.map(({ startTime, endTime, ...val }) => {
    //   //
    //   let newStartTime = formatDate(
    //     dayjs(`${formatDate(detail.createTime)} ${startTime}`),
    //     dateFormatToMin
    //   );
    //   let newEndTime = formatDate(
    //     dayjs(`${formatDate(detail.createTime)} ${endTime}`),
    //     dateFormatToMin
    //   );
    //   if (dayjs(newEndTime).isBefore(dayjs(newStartTime))) {
    //     newEndTime = formatDate(dayjs(newEndTime).add(1, "d"), dateFormatToMin);
    //   }
    //   startTimeArr.push(newStartTime);
    //   endTimeArr.push(newEndTime);
    //   return {
    //     startTime: newStartTime,
    //     endTime: newEndTime,
    //     ...val
    //   };
    // });
    // // 开始时间从小到大排序 结束时间从大到小排序
    // startTimeArr.sort((a, b) => dayjs(a).unix() - dayjs(b).unix());
    // endTimeArr.sort((a, b) => dayjs(b).unix() - dayjs(a).unix());
    // console.log(startTimeArr, "startTimeArr");
    // console.log(endTimeArr, "endTimeArr");
    // setFinishTime(endTimeArr[0]);
    // console.log(
    //   dayjs(endTimeArr[0]).diff(dayjs(startTimeArr[0]), "m"),
    //   "总分钟"
    // );
    // console.log(newList, "detail.participants");
  }, [detail]);

  // 修改总费用
  const onSumChange = val => {
    console.log(val);
    setTotalFee(val);
  };

  const onComfirm = () => {
    if (!totalFee) {
      Taro.showToast({
        title: "请输入正确的总费用",
        mask: true,
        icon: "none"
      });
    } else {
      let param = {
        totalFee: totalFee
      };
      console.log(param);
    }
  };
  return (
    <View className="finish-invitation">
      {/* 参与人员 */}
      <ParticipantsView
        participants={detail.participants}
        creatorOpenId={detail.creatorOpenId}
        status={detail.status}
        hideEditbtn
        totalFee={isNaN(Number(totalFee)) ? 0 : Number(totalFee)}
      />
      <View className="detail-card finish-form">
        <AtInput
          name="sum"
          title="总费用"
          type="number"
          placeholder="请输入总费用"
          value={totalFee}
          onChange={onSumChange}
          required
        />
      </View>
      <View className="fixed-btn">
        <AtButton
          type="secondary"
          circle
          onClick={() =>
            Taro.redirectTo({
              url: `/pages/gameInvitation/detail/index?invitationId=${invitationId}`
            })
          }
        >
          取 消
        </AtButton>
        <AtButton type="primary" circle onClick={onComfirm}>
          确 认
        </AtButton>
      </View>
    </View>
  );
};

export default memo(FinishInvitation);
