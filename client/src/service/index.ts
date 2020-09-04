import Taro from "@tarojs/taro";
import { RequestApi } from "../typings";

// 默认POST请求
export const UseRequest = async (name: RequestApi, data: any) => {
  const option = {
    name: name,
    data: data
  };
  return Taro.cloud
    .callFunction(option)
    .then((res: any) => {
      // console.log(name, "apiResponse", res);
      if (res?.result?.errMsg) {
        Taro.showToast({
          title: `获取失败，请稍后尝试或联系管理员，异常信息：${res.result.errMsg}`,
          icon: "none",
          duration: 3000
        });
        let timer = setTimeout(() => {
          Taro.hideLoading();
          clearTimeout(timer);
          return null;
        }, 3000);
      } else {
        return res.result;
      }
    })
    .catch(err => {
      console.log(err, "catctError");
      Taro.showToast({
        title: `获取失败，请稍后尝试或联系管理员`,
        icon: "none",
        duration: 3000
      });
      let timer = setTimeout(() => {
        Taro.hideLoading();
        clearTimeout(timer);
        return null;
      }, 3000);
    });
};
