import * as React from 'react'
import { memo, useEffect, useState } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtInput, AtButton } from 'taro-ui'
import { ImgUpload } from '../../../components'
import { ParticipantsView } from '../components'
import { UseRequest } from '../../../service'
import { isValidArray, uploadImg } from '../../../utils'
import { InvitationItem } from '../type'
import { UserInfo } from '../../../typings'

export interface FinishInvitationProps {}

const userInfo: UserInfo = Taro.getStorageSync('userInfo')

const EmptyData: InvitationItem = {
  _id: '',
  locationInfo: undefined as any,
  targetTime: '',
  remark: '',
  creatorName: '',
  creatorAvatarUrl: '',
  createTime: '',
  status: 'CANCELLED',
  participants: [],
  creatorOpenId: '',
  totalFee: 0,
}

// 结束活动
const FinishInvitation: React.SFC<FinishInvitationProps> = () => {
  const { invitationId } = useRouter().params
  const [detail, setDetail] = useState<InvitationItem>(EmptyData)
  const [totalFee, setTotalFee] = useState(undefined) // 费用总计
  const [uploadList, setUploadList] = useState<string[]>([]) // 费用凭证

  const getDetails = () => {
    Taro.showLoading({
      title: '加载详情中...',
      mask: true,
    })
    if (invitationId) {
      UseRequest('invitation', {
        type: 'getDetail',
        id: invitationId,
      }).then(res => {
        if (res._id) {
          Taro.hideLoading()
          setDetail(res)
        }
      })
    }
  }
  // 获取详情
  useEffect(() => {
    getDetails()
  }, [invitationId])

  // 处理时间及占比
  useEffect(() => {
    // console.log(detail.participants, "detail.participants");
    // let startTimeArr: string[] = [];
    // let endTimeArr: string[] = [];
    // let newList = detail.participants.map(({ startTime, endTime, ...val }) => {
    //   //
    //   let newStartTime = formatDate(
    //     dayjs(`${formatDate(detail.createTime)} ${startTime}`),
    //     dateFormatToMin
    //   );
    //   let newEndTime = formatDate(
    //     dayjs(`${formatDate(detail.createTime)} ${endTime}`),
    //     dateFormatToMin
    //   );
    //   if (dayjs(newEndTime).isBefore(dayjs(newStartTime))) {
    //     newEndTime = formatDate(dayjs(newEndTime).add(1, "d"), dateFormatToMin);
    //   }
    //   startTimeArr.push(newStartTime);
    //   endTimeArr.push(newEndTime);
    //   return {
    //     startTime: newStartTime,
    //     endTime: newEndTime,
    //     ...val
    //   };
    // });
    // // 开始时间从小到大排序 结束时间从大到小排序
    // startTimeArr.sort((a, b) => dayjs(a).unix() - dayjs(b).unix());
    // endTimeArr.sort((a, b) => dayjs(b).unix() - dayjs(a).unix());
    // console.log(startTimeArr, "startTimeArr");
    // console.log(endTimeArr, "endTimeArr");
    // setFinishTime(endTimeArr[0]);
    // console.log(
    //   dayjs(endTimeArr[0]).diff(dayjs(startTimeArr[0]), "m"),
    //   "总分钟"
    // );
    // console.log(newList, "detail.participants");
  }, [detail])

  // 修改总费用
  const onSumChange = val => {
    setTotalFee(val)
  }

  //多张图片上传
  const uploadFunc = async (tempFilePaths: string[]) => {
    console.log(tempFilePaths, 'tempFilePaths')
    let fileRes = await uploadImg(tempFilePaths, 'billImg')
    console.log(fileRes, 'fileList')
    if (fileRes) {
      setUploadList(uploadList.concat([fileRes]))
    }
  }

  //  删除图片
  const delFileFunc = (fileId: string) => {
    setUploadList(uploadList.filter(x => x !== fileId))
  }

  const onComfirm = () => {
    if (!totalFee || totalFee > 99999 || totalFee <= 0) {
      Taro.showToast({
        title: '请输入正确的总费用',
        mask: true,
        icon: 'none',
      })
    } else if (!isValidArray(uploadList)) {
      Taro.showToast({
        title: '请上传活动费用凭证',
        mask: true,
        icon: 'none',
      })
    } else {
      let param = {
        totalFee: totalFee,
        billImgs: uploadList,
      }
      console.log(param)
    }
  }
  return (
    <View className="finish-invitation">
      {/* 参与人员 */}
      <ParticipantsView
        participants={detail.participants}
        creatorOpenId={detail.creatorOpenId}
        status={detail.status}
        hideEditbtn
        totalFee={isNaN(Number(totalFee)) ? 0 : Number(totalFee)}
      />
      <View className="detail-card finish-form">
        <AtInput
          name="sum"
          title="总费用"
          type="number"
          placeholder="请输入总费用"
          value={totalFee}
          onChange={onSumChange}
          required
        />
      </View>
      <View className="fake-title">活动费用凭证</View>
      <ImgUpload uploadList={uploadList} uploadFile={uploadFunc} delFileItem={delFileFunc} />
      <View className="fixed-btn">
        <AtButton
          type="secondary"
          circle
          onClick={() =>
            Taro.redirectTo({
              url: `/pages/gameInvitation/detail/index?invitationId=${invitationId}`,
            })
          }
        >
          取 消
        </AtButton>
        <AtButton type="primary" circle onClick={onComfirm}>
          确 认
        </AtButton>
      </View>
    </View>
  )
}

export default memo(FinishInvitation)
