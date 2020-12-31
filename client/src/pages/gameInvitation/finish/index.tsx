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
  billImgs: [],
  adminUsers: [],
  lastUpdateTime: '',
}

// 结束活动
const FinishInvitation: React.SFC<FinishInvitationProps> = () => {
  const { invitationId } = useRouter().params
  const [detail, setDetail] = useState<InvitationItem>(EmptyData)
  const [totalFee, setTotalFee] = useState(undefined) // 费用总计
  const [uploadList, setUploadList] = useState<string[]>([]) // 费用凭证
  const userInfo: UserInfo = Taro.getStorageSync('userInfo')

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
          setTotalFee(res.totalFee)
          setUploadList(res.billImgs)
        }
      })
    }
  }
  // 获取详情
  useEffect(() => {
    getDetails()
  }, [invitationId])

  // 返回详情
  const goToDetail = () => {
    Taro.redirectTo({
      url: `/pages/gameInvitation/detail/index?invitationId=${invitationId}`,
    })
  }

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
    if (!totalFee || isNaN(Number(totalFee)) || totalFee > 99999 || totalFee <= 0) {
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
    } else if (isValidArray(uploadList) && uploadList.length > 9) {
      Taro.showToast({
        title: '最多上传9张活动费用凭证',
        mask: true,
        icon: 'none',
      })
    } else {
      let param = {
        totalFee: Number(totalFee),
        billImgs: uploadList,
        id: invitationId,
        type: 'finish',
      }
      Taro.showLoading({
        title: '结束活动中...',
        mask: true,
      })
      if (invitationId) {
        UseRequest('invitation', param).then(res => {
          if (res) {
            Taro.hideLoading()
            goToDetail()
          }
        })
      }
      console.log(param)
    }
  }

  if (userInfo.hasCreatePerm) {
    return (
      <View className="finish-invitation">
        {/* 参与人员 */}
        <ParticipantsView
          participants={detail.participants}
          adminUsers={detail.adminUsers}
          status={detail.status}
          hideEditbtn
          totalFee={isNaN(Number(totalFee)) ? 0 : Number(totalFee)}
        />
        <View className="detail-card finish-form">
          <AtInput
            name="sum"
            title="总费用"
            type="digit"
            placeholder="请输入总费用"
            value={totalFee}
            onChange={onSumChange}
            required
          />
        </View>
        <View className="fake-title">活动费用凭证</View>
        <ImgUpload uploadList={uploadList} uploadFile={uploadFunc} delFileItem={delFileFunc} />
        <View className="fixed-btn">
          <AtButton type="secondary" circle onClick={goToDetail}>
            取 消
          </AtButton>
          <AtButton type="primary" circle onClick={onComfirm}>
            确 认
          </AtButton>
        </View>
      </View>
    )
  } else {
    return null
  }
}

export default memo(FinishInvitation)
