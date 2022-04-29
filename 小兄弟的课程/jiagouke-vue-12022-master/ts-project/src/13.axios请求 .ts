import axios, { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios'
// 用axios 进行二次封装在使用  目的就是添加一些默认的配置和拦截器 

// 限制用户传递的参数类型 ： 返回值的类型 . 一般后端返回的类型都是固定的 

export interface ResponseData<T> {
    code: number,
    data?: T,
    msg?: string
}
class HttpRequest {
    public baseURL = 'http://localhost:3000/api'
    public timeout = 3000;
    public request(options: AxiosRequestConfig) {
        // 能自动推导就不要自己写
        const instance = axios.create();
        options = this.mergeOptions(options); // 合并后的选项
        this.setInterceptors(instance);

        return instance(options); // 可以发请求了
    }
    public setInterceptors(instance: AxiosInstance) {
        instance.interceptors.request.use((config) => {
            config.headers!['token'] = 'xxx';
            return config
        }, (err) => {
            return Promise.reject(err)
        })
        instance.interceptors.response.use((res) => {
            // res.data.data
            let { data: { code } } = res.data;
            if (code !== 0) {
                return Promise.reject(res)
            }
            return res;
        }, (err) => {
            return Promise.reject(err)
        })
    }
    mergeOptions(options: AxiosRequestConfig) {
        return Object.assign({ baseURL: this.baseURL, timeout: this.timeout }, options)
    }
    public get<T = any>(url: string, data: any): Promise<ResponseData<T>> {
        return this.request({
            method: 'get',
            url,
            params: data
        }).then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err)
        })
    }

    public post<T = any>(url: string, data: any): Promise<ResponseData<T>> {
        return this.request({
            method: 'post',
            url,
            data
        }).then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err)
        })
    }
}

const http = new HttpRequest()
http.post<{ token: number, username: string }>('/login', { username: '123', password: '45' }).then((res) => {
    res.data?.username
})
export { }