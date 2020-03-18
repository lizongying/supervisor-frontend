import request from '@/utils/request'

import defaultSettings from '@/settings'
const HOST = defaultSettings.backendUrl

export function login(data) {
  return request({
    url: HOST + '/api/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: HOST + '/api/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: HOST + '/api/user/logout',
    method: 'post'
  })
}
