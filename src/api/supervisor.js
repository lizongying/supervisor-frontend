import request from '@/utils/request'

import defaultSettings from '@/settings'
const HOST = defaultSettings.backendUrl

export function getList(params) {
  return request({
    url: HOST + '/api/supervisor/list',
    method: 'get'
  })
}

export function stop(params) {
  return request({
    url: HOST + '/api/supervisor/stop',
    method: 'post',
    data: params
  })
}

export function status(params) {
  return request({
    url: HOST + '/api/supervisor/status',
    method: 'post',
    data: params
  })
}

export function restart(params) {
  return request({
    url: HOST + '/api/supervisor/restart',
    method: 'post',
    data: params
  })
}

export function start(params) {
  return request({
    url: HOST + '/api/supervisor/start',
    method: 'post',
    data: params
  })
}
