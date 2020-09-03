import * as React from "react";
import { memo, Fragment } from "react";
import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { AtAvatar } from "taro-ui";
import { SectionItem } from "../../../../components";
import { isValidArray } from "../../../../utils";
import { ParticipantItem, InvitationStatus } from "../../type";
import { UserInfo } from "../../../../typings";

const userInfo: UserInfo = Taro.getStorageSync("userInfo");

export interface ParticipantsViewProps {
  participants: ParticipantItem[];
  creatorOpenId: string; // 发起者openid
  status: InvitationStatus; // 状态
  hideEditbtn?: boolean; // 不展示编辑按钮
  showEditTime?: (item: ParticipantItem) => void; // 编辑时间
}

// 活动参与人
const ParticipantsView: React.FC<ParticipantsViewProps> = ({
  participants = [],
  creatorOpenId,
  showEditTime = () => console.log(1),
  status,
  hideEditbtn = false
}) => {
  return (
    <View className="finish-invitation">
      <View className="detail-card">
        <View className="title">参与人员</View>
        {isValidArray(participants) && (
          <Fragment>
            <View className="divider" />
            {participants.map((item, index) => (
              <View key={index}>
                <View className="participant-info">
                  <View className="participant-header">
                    <View className="user-info">
                      <AtAvatar circle text="头" image={item?.avatarUrl} />
                      <Text>{item?.name}</Text>
                    </View>
                    {/* 状态为进行中且发起人或当前参与人才可编辑自己的时间 */}
                    {!hideEditbtn &&
                      status === "OPENING" &&
                      (item.userOpenId === userInfo.userOpenId ||
                        creatorOpenId === userInfo.userOpenId) && (
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
                {participants.length - 1 > index && (
                  <View className="divider" />
                )}
              </View>
            ))}
          </Fragment>
        )}
      </View>
    </View>
  );
};

export default memo(ParticipantsView);
