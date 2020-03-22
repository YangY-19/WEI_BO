/**
 * 判断数据类型
 * @param {*} 传入参数 
 * @param Object.prototype.toString.call(data) 准确的判断类
 */
function dataType(data) {
    let dataType = Object.prototype.toString.call(data).replace(/\[object\s(.+)\]/, "$1").toLowerCase()
    return dataType
}


/**
 * 判断是否为空值
 * @param {*} 传入参数
 * @param Object.prototype.toString.call(data) 准确的判断类型
 * @param Object.getOwnPropertyNames(data) 对象转化为数组, 获取key变成数组
 */
function isNull(data) {
    let dataType = Object.prototype.toString.call(data).replace(/\[object\s(.+)\]/, "$1").toLowerCase()
    if (dataType === "array") {
        let result = data.length > 0 ? false : true
        return result
    }
    if (dataType === "object") {
         let result = Object.getOwnPropertyNames(data).length === 0 ? true : false
         return result
    }
    if (dataType === "string") {
        let result = data === '' ? true : false
        return result
    }
}

/**
 * 深拷贝
 * @param {obj} 传入参数
 */
function deepClone(obj = {}) {
   if ( typeof obj !== 'object' || obj == null) {
       return obj
   }
   let result
   if (obj instanceof Array) {
      result = []
   } else {
      result = {}
   }
   for (let key in  obj) {
       if (obj.hasOwnProperty(key)) {
           result[key] = deepClone(obj[key])
       }
   }
   return result
}
