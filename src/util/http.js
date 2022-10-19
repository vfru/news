import axios from "axios";
import {store} from '../redux/store'
axios.defaults.baseURL = `http://localhost:8000/`

//axios.defaults.headers

//axios.interceptors.request.use

//拦截,请求前必走
axios.interceptors.request.use(function (config) {
    //显示loading
    store.dispatch({
        type: "changeLoading",
        value:true
    })
    return config
}, function (error) {
    return Promise.reject(error)
})

//请求后响应
axios.interceptors.response.use(function (response) {
    //隐藏loading
    store.dispatch({
        type: "changeLoading",
        value:false
    })
    return response
}, function (error) {
    //隐藏loading
    store.dispatch({
        type: "changeLoading",
        value:false
    })
    return Promise.reject(error)
})