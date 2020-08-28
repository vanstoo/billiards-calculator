import dayjs from "dayjs";
import { InvitationStatus } from "../pages/gameInvitation/type";

// 格式化时间
export const formatDate = (
  date: string | dayjs.Dayjs | Date | number,
  formatType = "YYYY-MM-DD",
  emptyStr: string = ""
): string => (date ? dayjs(date).format(formatType) : emptyStr);

// 是否非空数组
export const isValidArray = (list: any) =>
  list && Array.isArray(list) && list.length > 0;

// 返回状态名称
export const returnStatusName = (status: InvitationStatus) => {
  let obj: { [keys in InvitationStatus]: string } = {
    OPENING: "进行中",
    CANCELLED: "已取消",
    FINISHED: "已结束"
  };
  return obj[status];
};
