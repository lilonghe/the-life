import { Button, Overlay, Form, Input, DatePicker } from '@nutui/nutui-react-taro';
import { View } from '@tarojs/components';
import { useState } from 'react';

const WrapperStyle = {
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center'
}
const ContentStyle = {
  display: 'flex',
  width: '300px',
  padding: '20px',
  minHeight: '150px',
  background: '#fff',
  borderRadius: '4px',
}

const FormStyle = {
  width: '100%'
}

const FooterWrapperStyle = {
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  gap: '10px'
}

const AddEvent = ({ visible = false, onCancel, onOk }) => {
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [form] = Form.useForm()

  const handleSubmit = (values) => {
    console.log(values)
    form.resetFields()
    onOk()
  }

  return <Overlay visible={visible}>
    <div style={WrapperStyle}>
      <div style={ContentStyle}>
        <Form form={form} onFinish={handleSubmit} labelPosition={'top'} style={FormStyle}
          footer={
            <View style={FooterWrapperStyle}>
              <Button formType="submit" type="primary" style={{ flex: 1 }}>
                提交
              </Button>
              <Button style={{ flex: 1 }} onClick={onCancel}>
                取消
              </Button>
            </View>
          }>
          <Form.Item label="事件" name="title" required
            rules={[{ required: true, message: "请输入事件信息" }]}>
            <Input
              className="nut-input-text"
              placeholder="请输入事件信息"
              type="text"
            />
          </Form.Item>
          <Form.Item
            label="发生时间"
            name="happenTime"
            required
            rules={[{ required: true, message: "请选择事件发生时间" }]}>
            <View onClick={() => setShowTimePicker(true)}>{form.getFieldValue('happenTime') || <View style={{ color: '#757575' }}>请选择发生时间</View>}</View>
          </Form.Item>
          <DatePicker
            title="日期选择"
            visible={showTimePicker}
            type="datetime"
            placeholder='选择发生时间'
            onClose={() => setShowTimePicker(false)}
            onConfirm={(values) => {
              const date = values.slice(0, 3).map(item => item.value).join('-');
              const time = values.slice(3).map(item => item.value).join(':');
              const happenTime = `${date} ${time}`
              form.setFieldsValue({ happenTime })
            }}
          />
          <Form.Item label="备注" name="description">
            <Input
              className="nut-input-text"
              placeholder="请输入备注信息"
              type="text"
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  </Overlay>
}

export default AddEvent