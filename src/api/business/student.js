import request from '@/utils/request'

// 获取用户列表
export function getStudents(params) {
  console.log(params)
  return request({
    url: '/api/student/list',
    method: 'get',
    params
  })
}

// 创建用户
export function createStudent(data) {
  console.log(data)
  return request({
    url: '/api/student/create',
    method: 'post',
    data
  })
}

// 更新用户
export function updateStudent(data) {
  console.log(data)
  return request({
    url: '/api/student/update',
    method: 'patch',
    data
  })
}

// 批量删除用户
export function batchDeleteStudentByIds(data) {
  console.log(data)
  return request({
    url: '/api/student/delete/batch',
    method: 'delete',
    data
  })
}

