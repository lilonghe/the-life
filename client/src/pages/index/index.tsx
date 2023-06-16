import './index.less'
import { View, Text } from '@tarojs/components'
import AddEvent from './addEvent';
import { useEffect, useState } from 'react';
import { IEvent, deleteEvent, findAllEvent, login } from '../../services';
import { showLoading, hideLoading, showToast, showModal } from '../../utils';
import Taro from '@tarojs/taro';
import { Skeleton } from '@nutui/nutui-react-taro';

interface IData {
  key: number
  value: IEvent[]
}

const Index = () => {
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [isLogin, setIsLogin] = useState(false)
  const [data, setData] = useState<IData[]>([])

  const handleShowAddEvent = () => {
    setShowAddEvent(true)
  }

  const loadData = async () => {
    showLoading()
    const res = await findAllEvent()
    if (res.data) {
      const data: IData[] = [];
      res.data.forEach((item: IEvent) => {
        const year = new Date(item.happenTime).getFullYear()
        let i = data.findIndex(item => item.key == year)
        if (i === -1) {
          data.push({ key: year, value: [] })
          i = data.length - 1
        }
        data[i].value.push(item)
      })
      setData(data)
    }
    hideLoading()
  }


  useEffect(() => {
    showLoading()
    Taro.login({
      success: async function (res) {
        hideLoading()
        if (res.code) {
          const resu = await login(res.code)
          if (resu.data) {
            Taro.getApp().token = resu.data.token;
            setIsLogin(true)
            loadData()
          }
        } else {
          showToast('登录失败:' + res.errMsg)
        }
      }
    })
  }, [])

  const formatDate = (date: string) => {
    const d = new Date(date)
    return `${d.getMonth() + 1}.${d.getDate()}`
  }

  const handleDelete = (item: IEvent) => {
    showModal({
      title: '删除事件',
      content: `确认删除[${item.title}]事件吗？`,
      onOk: async () => {
        showLoading()
        const res = await deleteEvent(item.id)
        if (res.data) {
          showToast('删除成功')
          loadData()
        }
      }
    })
  }

  return (
    <View className="page-index">
      <View className="timeline-list">
        {!isLogin && <Skeleton rows={5} animated />}
        {isLogin && !data.length && <View className='empty-list'>
          <View>暂未添加事件</View>  
          <View>点击右下角添加</View>
        </View>}
        {data.map(({ key, value }) => 
          <View className="timeline-item">
            <Text className="timeline-year">{key}</Text>
            <View className="event-list">
            {(value as IEvent[]).map(item => <View className="event-item" onLongPress={() => handleDelete(item)}>
                <Text className="event-content">{item.title}</Text>
                <Text className="event-time">{formatDate(item.happenTime)}</Text>
              </View>)}
            </View>
          </View>)}
      </View> 

      <View className="btn-add" onClick={handleShowAddEvent}>+</View>
      <AddEvent 
        visible={showAddEvent} 
        onCancel={() => {
          setShowAddEvent(false)
        }}
        onOk={() => {
          setShowAddEvent(false)
          loadData()
        }} />
    </View>
  );
}
export default Index
