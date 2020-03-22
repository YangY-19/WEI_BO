/**
 *  登录注册模块接口列表
 */
import axios from '../utils/http'; // 导入http中创建的axios实例
import qs from 'qs'; // 根据需求是否导入qs模块

const blogs = {
    createBlog(params) {
        return axios.post('/weibo/blog/create', qs.stringify(params))
    },
    //个人中心
    profile(params) {
        return axios.get(`/weibo/blog/profile/${params.userId}`) 
    },
    loadMore(params) {
        return axios.get(`/weibo/blog/profile/loadMore/${params.userId}/${params.pageIndex}`)
    },
    //广场
    square() {
        return axios.get(`/weibo/blog/square`) 
    }, 
    squareLoadMore(params) {
        return axios.get(`/weibo/blog/square/loadMore/${params.pageIndex}`)
    },
    //首页
    getHomeBlogList() {
        return axios.get('/weibo/blog/followerBlog')
    },
    homeBlogLoadMore(params) {
        return axios.get(`/weibo/blog/followerBlog/loadMore/${params.pageIndex}`)
    }
}

export default blogs