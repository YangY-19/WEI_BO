/**
 *  登录注册模块接口列表
 */
import axios from '../utils/http'; // 导入http中创建的axios实例
import qs from 'qs'; // 根据需求是否导入qs模块

const users = {    
    getuserInfo(params) {
         return axios.get(`/weibo/user/getUserInfo/${params.userId}`)
    },
    // 验证用户名,昵称是否重复   
    isExist (params) {     
        return axios.post('/weibo/user/isExist', qs.stringify(params));    
    },
    register(params) {
        return axios.post('/weibo/user/register', qs.stringify(params))
    },
    login(params) {
        return axios.post('/weibo/user/login', qs.stringify(params))
    },
    verifyLogin() {
        return axios.post('/weibo/user/verifyLogin')
    },
    changeInfo(params) {
        return axios.patch('/weibo/user/changeInfo', qs.stringify(params))
    },
    changePassword(params) {
        return axios.patch('/weibo/user/changePassword', qs.stringify(params))
    },
    logout() {
        return axios.post('/weibo/user/logout')
    }
}

export default users;