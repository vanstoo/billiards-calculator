import * as React from "react";
import { memo, useState } from "react";
import Taro, { useDidShow } from "@tarojs/taro";
import { View, Picker } from "@tarojs/components";
import { AtList, AtListItem, AtTextarea, AtFloatLayout } from "taro-ui";
import { formatDate, goToMapPage } from "../../../utils";
import { MapLocationInfo } from "../../../typings";
import debounce from "lodash.debounce";
import dayjs from "dayjs";
import "../index.scss";

export interface InvitationCreateProps {}

const EmptyLocation: MapLocationInfo = {
  address: "",
  city: "",
  district: "",
  latitude: 0,
  longitude: 0,
  name: "",
  province: ""
};
const chooseLocation = Taro.requirePlugin("chooseLocation");

const InvitationCreate: React.FC<InvitationCreateProps> = () => {
  const [targetTime, setTargetTime] = useState(formatDate(dayjs(), "HH:mm"));
  const [locationInfo, setLocationInfo] = useState<MapLocationInfo>(
    EmptyLocation
  );
  const [showRemark, setShowRemark] = useState(false);

  const [remark, setRemark] = useState("");

  const onTimeChange = e => {
    console.log(e.detail);
    setTargetTime(e.detail.value);
  };

  useDidShow(() => {
    console.log(chooseLocation.getLocation(), "const location");
    let info: MapLocationInfo = chooseLocation.getLocation();
    if (info) {
      setLocationInfo(info);
    }
  });

  const handleRemarkChange = debounce(value => {
    setRemark(value);
  }, 300);

  return (
    <View>
      <View className="form-title">发起约球</View>
      <AtList hasBorder>
        <Picker mode="time" onChange={onTimeChange} value={targetTime}>
          <AtListItem
            title="约球时间"
            arrow="right"
            iconInfo={{ size: 25, color: "#05f", value: "calendar" }}
            note={`${formatDate(dayjs())} ${targetTime}`}
          />
        </Picker>
        <AtListItem
          title="约球地点"
          arrow="right"
          iconInfo={{ size: 25, color: "#05f", value: "map-pin" }}
          onClick={goToMapPage}
          note={`${locationInfo ? locationInfo.name : ""}`}
        />
        <AtListItem
          title="描述信息"
          iconInfo={{ size: 25, color: "#05f", value: "message" }}
          onClick={() => setShowRemark(true)}
          note={remark}
        />
      </AtList>
      <AtFloatLayout
        isOpened={showRemark}
        title="描述信息"
        onClose={() => setShowRemark(false)}
      >
        <AtTextarea
          value={remark}
          onChange={handleRemarkChange}
          maxLength={100}
        />
      </AtFloatLayout>
    </View>
  );
};

export default memo(InvitationCreate);
