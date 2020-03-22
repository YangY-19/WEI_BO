import instance from './http'

export default function request(url, data,) {
    // console.log(QS.stringify(params))
    debugger
    if (data.method === 'POST' || data.method === 'post') {
      /**
       * post方法，对应post请求
       * @param {String} url [请求的url地址]
       * @param {Object} params [请求时携带的参数]
       */
      return new Promise((resolve, reject) => {
        instance
          .post(url, data.params)
          .then(res => {
            resolve(res.data)
          })
          .catch(err => {
            reject(err.data)
          })
      })
    } else if (data.method === 'GET' || data.method === 'get') {
      /**
       * get方法，对应get请求
       * @param {String} url [请求的url地址]
       * @param {Object} params [请求时携带的参数]
       */
      return new Promise((resolve, reject) => {
        instance
          .get(url, {
            params: data.params
          })
          .then(res => {
            resolve(res.data)
          })
          .catch(err => {
            reject(err.data)
          })
      })
    }
  }

