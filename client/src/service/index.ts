import Taro from "@tarojs/taro";
import { RequestApi } from "../typings";

// 默认POST请求
export const UseRequest = async (name: RequestApi, data: any) => {
  const option = {
    name: name,
    data: data
  };
  return Taro.cloud.callFunction(option).then((res: any) => {
    // console.log(url, "apiResponse", res);
    if (!res.result) {
      Taro.showToast({
        title: `获取失败，请稍后尝试或联系管理员，异常信息：${res.errMsg}`,
        icon: "none"
      });
      setTimeout(() => {
        Taro.hideLoading();
        return null;
      }, 1500);
    } else {
      return res.result;
    }
  });
};
