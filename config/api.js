const http = uni.$u.http

const api = {}
// 登录
api.login = (params, config = {}) => http.post('/auth/login', params, config)
// 上传图片
api.updateImage = (params, config = {}) => http.post('/file/upload', params, config)
// 获取会议列表
api.getMeeting = (data) => http.get('/meeting/list', { data })
// 添加会议
api.addMeeting = (params, config = {}) => http.post('/meeting/add', params, config)
// 修改会议
api.updateMeeting = (params, config = {}) => http.post('/meeting/update', params, config)
// 删除会议
api.deleteMeeting = (params, config = {}) => http.post('/meeting/delete', params, config)


export default api