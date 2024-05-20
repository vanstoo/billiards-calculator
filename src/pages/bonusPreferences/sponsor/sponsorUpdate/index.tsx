import * as React from 'react'
import { useState, memo } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import { AtList, AtListItem, AtButton, AtAvatar, AtInput } from 'taro-ui'
import { UseRequest } from '@/hooks'
import { SelectUser, ImgUpload } from '@/components'
import { UserInfo } from '@/typings'
import { formatDate, uploadImg, isValidArray } from '@/utils'
import debounce from 'lodash/debounce'
import dayjs from 'dayjs'

const SponsorTypeList = ['小程序云数据', '小程序认证']

interface SponsorUpdateProps {}

const SponsorUpdate: React.FC<SponsorUpdateProps> = () => {
  const [selectedUser, setSelectedUser] = useState<UserInfo>()
  const [startDate, setStartDate] = useState(formatDate(dayjs()))
  const [endDate, setEndDate] = useState(formatDate(dayjs().add(1, 'year')))
  const [uploadList, setUploadList] = useState<string[]>([]) // 费用凭证
  const [sponsorTypeIdx, setSponsorTypeIdx] = useState('0')
  const [sponsorshipAmount, setSponsorshipAmount] = useState()

  const onStartDateChange = e => {
    console.log(e.detail, 'onStartDateChange')
    setStartDate(e.detail.value)
  }

  const onEndDateChange = e => {
    console.log(e.detail, 'onEndDateChange')
    setEndDate(e.detail.value)
  }

  const onChangeSponsorType = e => {
    console.log(e.detail, 'onChangeSponsorType')
    setSponsorTypeIdx(e.detail.value)
  }

  //多张图片上传
  const uploadFunc = async (tempFiles: Taro.chooseMedia.ChooseMedia[]) => {
    console.log(tempFiles, 'tempFilePaths')
    let fileRes = await uploadImg(tempFiles, 'sponsorImg')
    console.log(fileRes, 'fileList')
    if (isValidArray(fileRes)) {
      setUploadList(uploadList.concat(fileRes))
    }
  }

  //  删除图片
  const delFileFunc = (fileId: string) => {
    setUploadList(uploadList.filter(x => x !== fileId))
  }

  const onComfirm = () => {
    if (!sponsorshipAmount || sponsorshipAmount > 99999 || sponsorshipAmount <= 0) {
      Taro.showToast({
        title: '请输入正确的赞助金额',
        mask: true,
        icon: 'none',
      })
    } else if (dayjs(startDate).isAfter(dayjs(endDate))) {
      Taro.showToast({
        title: '结束时间需要大于开始时间',
        mask: true,
        icon: 'none',
      })
    } else if (!isValidArray(uploadList)) {
      Taro.showToast({
        title: '请上传活动费用凭证',
        mask: true,
        icon: 'none',
      })
    } else if (isValidArray(uploadList) && uploadList.length > 3) {
      Taro.showToast({
        title: '最多上传3张凭证',
        mask: true,
        icon: 'none',
      })
    } else {
      let param = {
        type: 'addSponsorInfo',
        targetId: selectedUser?.userOpenId,
        sponsorshipAmount,
        startDate,
        endDate,
        sponsorshipType: SponsorTypeList[sponsorTypeIdx],
        sponsorshipImgs: uploadList,
        updateTime: new Date(dayjs().valueOf()),
      }
      console.log(param, 'param')
      Taro.showLoading({
        mask: true,
        title: '更新中',
      })
      UseRequest('sponsor', param).then(result => {
        if (result) {
          Taro.hideLoading()
          Taro.showToast({
            title: '修改成功',
            mask: true,
            icon: 'success',
          })
          Taro.navigateBack()
        }
      })
    }
  }

  const onChangeSponsorFee = debounce(val => {
    console.log(val, typeof val)
    setSponsorshipAmount(val)
  }, 200)

  return (
    <View className="bonus-preferences">
      <AtList hasBorder>
        <SelectUser label="赞助人" searchUserType="searchUserByName" onSelect={setSelectedUser} />
        {selectedUser?.userOpenId && (
          <View>
            <View className="user-info">
              <AtAvatar circle text={selectedUser?.nickName || '头像'} image={selectedUser?.avatarUrl} />
              <Text space="nbsp">{selectedUser?.nickName}</Text>
            </View>
          </View>
        )}
        <AtInput
          name="sum"
          title="赞助金额"
          type="digit"
          placeholder="请输入赞助金额"
          value={sponsorshipAmount}
          onChange={onChangeSponsorFee}
        />
        <Picker mode="selector" range={SponsorTypeList} onChange={onChangeSponsorType}>
          <View className="level-picker sponsor-type-picker">
            <Text className="pick-label">赞助类型</Text>
            <Text className="target-level"> {SponsorTypeList[sponsorTypeIdx]} </Text>
          </View>
        </Picker>
        <Picker mode="date" onChange={onStartDateChange} value={startDate}>
          <AtListItem
            title="开始日期"
            arrow="right"
            iconInfo={{ size: 25, color: '#05f', value: 'calendar' }}
            note={startDate}
          />
        </Picker>
        <Picker mode="date" onChange={onEndDateChange} value={endDate}>
          <AtListItem
            title="结束日期"
            arrow="right"
            iconInfo={{ size: 25, color: '#05f', value: 'calendar' }}
            note={endDate}
          />
        </Picker>
        <View className="fake-title">赞助信息凭证</View>
        <ImgUpload uploadList={uploadList} uploadFile={uploadFunc} delFileItem={delFileFunc} />
      </AtList>
      <View className="fixed-btns">
        <AtButton type="secondary" size="normal" circle onClick={() => Taro.navigateBack()}>
          返回
        </AtButton>
        <AtButton type="primary" size="normal" circle disabled={!selectedUser?.userOpenId} onClick={onComfirm}>
          确认
        </AtButton>
      </View>
    </View>
  )
}

export default memo(SponsorUpdate)
