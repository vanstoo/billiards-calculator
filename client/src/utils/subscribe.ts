import Taro from "@tarojs/taro";

// 订阅消息模版
export const subscribeInfo = (callback: Function) => {
  console.log("subscribeInfo订阅消息模版");
  Taro.requestSubscribeMessage({
    tmplIds: ["n24N4bkTc7DoA9fIEr_Ozv5QdY5Ivy7NSCztni7ImR4"],
    success(res) {
      console.log("requestSubscribeMessage", res);
    },
    complete() {
      callback();
    }
  });
};
