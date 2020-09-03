import * as React from "react";
import { memo, Fragment } from "react";
import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";


export interface ImgUploadProps {
  uploadList: string[]; // 附件列表
  uploadFile: (tempFilePaths: string[]) => Promise<void>; // 上传图片
  delFileItem: (file: string) => void; // 删除图片
}

const ImgUpload: React.FC<ImgUploadProps> = ({
  uploadList,
  delFileItem,
  uploadFile
}) => {
  // 预览图片
  const previewImage = (index: number) => {
      let previewList = uploadList;
      Taro.previewImage({
        current: previewList[index], // 当前显示图片的http链接
        urls: previewList // 需要预览的图片http链接列表
      });
    }
  };

  return <View className="img-upload"></View>;
};

export default memo(ImgUpload);
