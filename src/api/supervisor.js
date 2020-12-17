import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/api/supervisor/list',
    method: 'get'
  })
}

export function stop(params) {
  return request({
    url: '/api/supervisor/stop',
    method: 'post',
    data: params
  })
}

export function status(params) {
  return request({
    url: '/api/supervisor/status',
    method: 'post',
    data: params
  })
}

export function restart(params) {
  return request({
    url: '/api/supervisor/restart',
    method: 'post',
    data: params
  })
}

export function start(params) {
  return request({
    url: '/api/supervisor/start',
    method: 'post',
    data: params
  })
}

export function stdOut(params) {
  return request({
    url: '/api/supervisor/std_out',
    method: 'post',
    data: params
  })
}

export function stdErr(params) {
  return request({
    url: '/api/supervisor/std_err',
    method: 'post',
    data: params
  })
}

export function getConfig() {
  return request({
    url: '/api/supervisor/config',
    method: 'get'
  })
}
