import axios from "axios";
import {Message} from 'element-ui';

var Axios = axios.create();
Axios.defaults.baseURL = "http://localhost:8081";
// 请求拦截
Axios.interceptors.request.use(
    (config) => {
        // token认证写在这里
        return config;
    },
    (err) => {
        Promise.reject(err);
    }
);
// 响应拦截
Axios.interceptors.response.use(
    (res) => {
        if (res.data.code === 200) {
            Message({
                showClose: true,
                message: res.data.msg,
                type: 'success'
            });
        } else if (res.data.code === 201) {
            console.log(res.data)
        } else if (res.data.code === 400) {
            Message({
                showClose: true,
                message: res.data.msg,
                type: 'error'
            });
        } else {
            Message({
                showClose: true,
                message: config.data.msg,
                type: 'error'
            });
            Promise.reject(err);
        }
        return res.data ;
    },
    (err) => {
        Message({
            showClose: true,
            message: "网络异常，请稍后再试",
            type: 'error'
        });
        Promise.reject(err);
    }
);

// get封装
export function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        Axios({
            url,
            params,
            method: "get",
        })
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

// post封装
export function post(url, data = {}, params = {}) {
    return new Promise((resolve, reject) => {
        Axios({
            url,
            method: "post",
            params,
            data,
        })
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

// delete封装
export function del(url, params = {}, data = {}) {
    return new Promise((resolve, reject) => {
        Axios({
            url,
            method: "delete",
            params,
            data,
        })
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

//   Blob封装,resopnseType:Blob一般是用于文件下载
export function getBlob(url, params = {}) {
    return new Promise((resolve, reject) => {
        Axios({
            url,
            method: "get",
            params,
            responseType: 'blob'
        })
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export default {
    get,
    post,
    del,
    getBlob
}