import './index.less'
import { View, Text } from '@tarojs/components'
import AddEvent from './addEvent';
import { useState } from 'react';

const Index = () => {
  const [showAddEvent, setShowAddEvent] = useState(false)

  const handleShowAddEvent = () => {
    setShowAddEvent(true)
  }

  const loadData = () => {

  }

  return (
    <View className="page-index">
      <View className="timeline-list">
        <View className="timeline-item">
          <Text className="timeline-year">2023</Text>
          <View className="event-list">
            <View className="event-item">
              <Text className="event-content">“浮生记”第一版设计稿</Text>
              <Text className="event-time">06.15</Text>
            </View>
            <View className="event-item">
              <Text className="event-content">开启旅居生活</Text>
              <Text className="event-time">03.03</Text>
            </View>
          </View>
        </View>

        <View className="timeline-item">
          <Text className="timeline-year">2022</Text>
          <View className="event-list">
            <View className="event-item">
              <Text className="event-content">结束封控生活</Text>
              <Text className="event-time">07.25</Text>
            </View>
            <View className="event-item">
              <Text className="event-content">开启封控生活</Text>
              <Text className="event-time">03.19</Text>
            </View>
          </View>
        </View>
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
