import * as React from "react";
import { memo } from "react";
import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";

export interface SectionItemProps {
  label: string;
  content?: string | number; // 普通content 自带判断是否为空展示“-”
  copyable?: boolean; // 是否可复制
  isLinkCol?: boolean; // 是否链接式content
  contentClick?: () => void; // 点击内容
  prefix?: string; // 前缀符号
  suffix?: string; // 后缀内容
}

const SectionItem: React.FC<SectionItemProps> = ({
  label,
  content,
  copyable = false,
  isLinkCol = false,
  contentClick = () => console.log("点击content"),
  prefix,
  suffix
}) => {
  return (
    <View className="at-row">
      <View className="at-col at-col-3 at-col--wrap">{label}</View>
      <View className="at-col at-col-9 at-col--wrap">
        {prefix && <Text>{prefix} </Text>}
        <Text
          className={isLinkCol ? "link-col section-content" : "section-content"}
          onClick={() => contentClick()}
        >
          {content ? content : "-"}
        </Text>
        {copyable && content && (
          <Text
            onClick={() => Taro.setClipboardData({ data: content.toString() })}
            className="link-col margin-left-16"
          >
            复制
          </Text>
        )}
        {suffix && <Text className="margin-left-16">{suffix}</Text>}
      </View>
    </View>
  );
};

export default memo(SectionItem);
