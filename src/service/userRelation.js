/**
 *  关注模块接口列表
 */
import axios from '../utils/http'; // 导入http中创建的axios实例
import qs from 'qs'; // 根据需求是否导入qs模块

const userRelation = {
    follow(params) {
        return axios.post('/weibo/userRelation/follow', qs.stringify(params))
    },
    unFollow(params) {
        return axios.post('/weibo/userRelation/unFollow', qs.stringify(params))
    },
    getFans(params) {
        return axios.post('/weibo/userRelation/getFans', qs.stringify(params))
    },
    getFollow(params) {
        return axios.post('/weibo/userRelation/getFollow', qs.stringify(params))
    },
}

export default userRelation