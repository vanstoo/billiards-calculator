import * as React from "react";
import { memo, useState } from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtButton, AtAvatar } from "taro-ui";
import "./index.scss";

export interface UserInfoProps {}

const UserInfo: React.FC<UserInfoProps> = () => {
  const [userInfo, setUserInfo] = useState(Taro.getStorageSync("userInfo"));

  const getUser = ({ detail }) => {
    // console.log(detail);
    Taro.showLoading({ title: "获取用户信息中...", mask: true });
    // 新增/更新用户信息
    Taro.cloud.callFunction({
      name: "login",
      data: {
        type: "create",
        nickName: detail.userInfo.nickName,
        avatarUrl: detail.userInfo.avatarUrl
      },
      success: res => {
        console.log(res, "result");
        Taro.hideLoading();
        if (res.result) {
          // 更新本地用户信息
          Taro.showLoading({ title: "获取用户信息中...", mask: true });
          Taro.cloud.callFunction({
            name: "login",
            data: { type: "get" },
            success: ({ result }) => {
              console.log(result, " login");
              Taro.hideLoading();
              Taro.setStorageSync("userInfo", result);
              setUserInfo(result);
            }
          });
        }
      }
    });
  };

  return (
    <View className="user-info">
      <View className="user-box">
        <AtAvatar circle text="头" image={userInfo?.avatarUrl}></AtAvatar>
        <View className="user-name">{userInfo?.nickName || "—"}</View>
      </View>
      {!userInfo && (
        <AtButton
          type="primary"
          openType="getUserInfo"
          onGetUserInfo={getUser}
          className="user-btn"
        >
          点击授权登录
        </AtButton>
      )}
    </View>
  );
};

export default memo(UserInfo);
