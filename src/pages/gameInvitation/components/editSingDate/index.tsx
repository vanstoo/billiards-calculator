import * as React from 'react'
import { memo, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import { AtButton, AtFloatLayout, AtList, AtListItem } from 'taro-ui'
import { returnNowTime } from '@/utils'
import { UseRequest } from '@/hooks'
import { ParticipantItem } from '../../type'
import cloneDeep from 'lodash/cloneDeep'
import dayjs from 'dayjs'
export interface EditSignDateProps {
  editRecord: ParticipantItem // 正在编辑的信息
  setEditRecord: (val: any) => void // 修改父层信息
  participants: ParticipantItem[] // 全部数据
  refreshAndGetdetail: () => void // 刷新页面获取详情
}

// 编辑开始、结束时间
const EditSignDate: React.FC<EditSignDateProps> = ({
  editRecord,
  setEditRecord,
  participants,
  refreshAndGetdetail,
}) => {
  const [record, setRecord] = useState<ParticipantItem>(editRecord)
  const onTimeChange = (time: string, type: 'start' | 'end') => {
    let newRecord = cloneDeep(record)
    if (type === 'start') {
      newRecord.startTime = time
    } else {
      newRecord.endTime = time
    }
    // console.log(newRecord);
    setRecord(newRecord)
  }

  const comfirmUpdate = () => {
    Taro.showLoading({
      title: '更新时间中...',
      mask: true,
    })
    let param = {
      type: 'updateParticipant',
      id: record._id,
      // 将时间格式化成 时:分
      startTime:
        record.startTime && record.startTime.length > 5
          ? record.startTime.substring(record.startTime.length - 5)
          : record.startTime,
      endTime:
        record.endTime && record.endTime.length > 5
          ? record.endTime.substring(record.endTime.length - 5)
          : record.endTime,
      index: participants.findIndex(x => x.userOpenId === record.userOpenId),
      updateTime: new Date(dayjs().valueOf()),
    }
    UseRequest('participant', param).then(res => {
      // console.log(param, "comfirmUpdate", res);
      if (res) {
        Taro.showToast({
          title: '更新成功',
          mask: true,
          duration: 2000,
        })
        let timer = setTimeout(() => {
          setEditRecord(undefined)
          clearTimeout(timer)
          Taro.hideLoading()
          refreshAndGetdetail()
        }, 1500)
      }
    })
  }

  return (
    <AtFloatLayout
      isOpened={Boolean(record?.userOpenId)}
      title="编辑签到/离开时间"
      onClose={() => setEditRecord(undefined)}
    >
      <AtList hasBorder={false}>
        <Picker
          mode="time"
          onChange={e => onTimeChange(e.detail.value, 'start')}
          value={returnNowTime(record?.startTime)}
        >
          <AtListItem
            title="开始时间"
            arrow="right"
            iconInfo={{ size: 25, color: '#05f', value: 'calendar' }}
            note={record?.startTime}
          />
        </Picker>
        <Picker mode="time" onChange={e => onTimeChange(e.detail.value, 'end')} value={returnNowTime(record?.endTime)}>
          <AtListItem
            title="结束时间"
            arrow="right"
            iconInfo={{ size: 25, color: '#05f', value: 'calendar' }}
            note={record?.endTime}
          />
        </Picker>
      </AtList>
      <View className="fixed-btn">
        <AtButton type="secondary" size="small" circle onClick={() => setEditRecord(undefined)}>
          取消
        </AtButton>
        <AtButton type="primary" size="small" circle onClick={comfirmUpdate}>
          确认
        </AtButton>
      </View>
    </AtFloatLayout>
  )
}

export default memo(EditSignDate)
