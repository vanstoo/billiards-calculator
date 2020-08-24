import dayjs from "dayjs";

// 格式化时间
export const formatDate = (
  date: string | dayjs.Dayjs | Date | number,
  formatType = "YYYY-MM-DD",
  emptyStr: string = ""
): string => (date ? dayjs(date).format(formatType) : emptyStr);

// 是否非空数组
export const isValidArray = (list: any) =>
  list && Array.isArray(list) && list.length > 0;
