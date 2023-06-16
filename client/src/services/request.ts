import Taro from "@tarojs/taro"
import { showToast } from "../utils"

export interface IRequestOptions {
  method?: keyof Taro.request.Method
  data?: any
}

const baseUrl = 'https://admin.service.lilonghe.net/api/the-life'

export default async function request (url: string, options?: IRequestOptions) {
  const res = await Taro.request({
    url: baseUrl + url,
    data: options?.data,
    method: options?.method || 'GET',
    header: {
      'content-type': 'application/json',
      token: Taro.getApp().token,
    }
  }).then(res => {
    if (res.data?.message) {
      showToast(res.data.message)
      return res.data
    } else {
      return res
    }
  }).catch(err => {
    console.log(err)
    showToast('请求失败')
    return { message: '请求失败', data: undefined }
  })
  return res
}
