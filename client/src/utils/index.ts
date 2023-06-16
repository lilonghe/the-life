import Taro from '@tarojs/taro'

export function showLoading () {
  Taro.showLoading({
    title: '加载中'
  })
}

export function hideLoading () {
  Taro.hideLoading()
}

export function showToast(message: string) {
  Taro.showToast({
    title: message,
    icon: 'none'
  })
}

export function showModal({ title, content, onOk }) {
  Taro.showModal({
    title,
    content,
    success: function (res) {
      if (res.confirm) {
        onOk()
      }
    }
  })
}