import Vue from 'vue';
import axios from 'axios';
 let myaxios={}
myaxios.install = function (Vue) {
  axios.defaults.baseURL="http://localhost:8888/api/private/v1/"
  axios.interceptors.request.use( (config)=> {
    if(config.url!=='login'){
      config.headers.common['Authorization'] = localStorage.getItem('token');
    }
    // Do something before request is sent
    return config;
  });
    // 4. 添加实例方法
    Vue.prototype.$http = axios;
  }
export default myaxios