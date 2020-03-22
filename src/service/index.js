/** 
 * api接口的统一出口
 */
// 文章模块接口
import users from './user';
import blogs from './blog'
import userRelation from './userRelation'
// 其他模块的接口……

// 导出接口
export default {    
    users,
    blogs,
    userRelation
}