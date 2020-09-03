import * as React from "react";
import { memo, useEffect, useState, Fragment } from "react";
import Taro, { useRouter } from "@tarojs/taro";
import { View, Picker } from "@tarojs/components";
import { AtInput, AtListItem, AtButton, AtAvatar } from "taro-ui";
import { SectionItem } from "../../../components";
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
  creatorOpenId: ""
};

// 结束活动
const FinishInvitation: React.SFC<FinishInvitationProps> = () => {
  const { invitationId } = useRouter().params;
  const [detail, setDetail] = useState<InvitationItem>(EmptyData);

  const [totalSum, setTotalSum] = useState();
  const [finishTime, setFinishTime] = useState(returnNowTime());
  const displayDate = `${formatDate(dayjs())} ${finishTime}`; // 展示时间

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

  useEffect(() => {
    getDetails();
  }, [invitationId]);

  const handleChange = val => {
    console.log(val);
  };

  const onTimeChange = e => {
    console.log(e.detail);
    setFinishTime(e.detail.value);
  };

  return (
    <View className="finish-invitation">
      <View className="detail-card finish-form">
        <AtInput
          name="sum"
          title="总费用"
          type="number"
          placeholder="请输入总费用"
          value={totalSum}
          onChange={handleChange}
          required
        />
        <Picker mode="time" onChange={onTimeChange} value={finishTime}>
          <AtInput
            name="endDate"
            title="结束时间"
            value={displayDate}
            onChange={() => console.log(1)}
            required
            editable={false}
          />
        </Picker>
      </View>

      {/* 参与人员 */}
      <ParticipantsView
        participants={detail.participants}
        creatorOpenId={detail.creatorOpenId}
        status={detail.status}
        hideEditbtn
      />
      <View className="fixed-btn">
        <AtButton type="secondary" circle>
          取 消
        </AtButton>
        <AtButton type="primary" circle>
          确 认
        </AtButton>
      </View>
    </View>
  );
};

export default memo(FinishInvitation);
