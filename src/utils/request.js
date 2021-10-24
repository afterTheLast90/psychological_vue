import axios from "axios";
import {Message} from 'element-ui';
import VueRouter from "vue-router";

// export const baseUrl = "http://serve.psychological.wmgx.top";
// export const baseUrl = "http://192.168.2.28:8081";
export const baseUrl = "http://localhost:8081";
var Axios = axios.create();
Axios.defaults.baseURL =baseUrl;
// Axios.defaults.baseURL = "http://localhost:8081";
// 请求拦截
Axios.interceptors.request.use(
    (config) => {
        if (localStorage.getItem("sa-token")) {
            config.headers["satoken"] = localStorage.getItem("sa-token")
        }
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
        if(res.data instanceof Blob){
            return res;
        }
        if (res.data.code === 200) {
            Message({
                showClose: true,
                message: res.data.msg,
                type: 'success'
            });
        } else if (res.data.code === 201) {
            console.log(res.config.url)
            console.log(res.data)
        } else if (res.data.code === 401) {
            let url = window.location.href;
            if(url.indexOf("topBar")===-1){
                // 后台管理
                window.location.href="http://localhost:8080/"
            }else{
                // 移动端
                window.location.href="http://localhost:8080/LoginAdmin"
            }
            Message({
                showClose: true,
                message: "未登录，请先登录",
                type: 'error'
            });
        } else {
            Message({
                showClose: true,
                message: res.data.msg,
                type: 'error'
            });
            return Promise.reject(res);
        }
        return res.data;
    },
    (err) => {

        Message({
            showClose: true,
            message: "网络异常，请稍后再试",
            type: 'error'
        });
        return Promise.reject(err);
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
export function download (url, data,params, callback, timeout) {
    return  Axios({
        method: 'post',
        url,
        data: data,
        params,
        responseType: 'blob',//设置responseType为blob
        timeout: timeout
    }).then(
        (response) => {
            // if (response.headers['content-type'] === 'APPLICATION/OCTET-STREAM') {
            //     let filename = 'result.zip'
                //response.data为下载的文件数据
                let url = window.URL.createObjectURL(new Blob([response.data]))
                let link = document.createElement('a')
                link.style.display = 'none'
                link.href = url
                link.setAttribute('download', response.headers['filename']);
                document.body.appendChild(link)
                link.click()
            // }
        }
    )
}
export function postForm(url, data = {}, params = {}){
    return new Promise((resolve, reject) => {
        Axios({
            headers: {
                'Content-Type': 'multipart/form-data'
            },
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
export default {
    get,
    post,
    del,
    getBlob,
    download,
    baseUrl
}
