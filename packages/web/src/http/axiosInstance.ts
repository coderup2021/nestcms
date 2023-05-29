import { getAuthToken } from '@/utils/store'
import Axios, { AxiosRequestConfig } from 'axios'

const axios = Axios.create({
  baseURL: '/',
  timeout: 1000 * 120,
  headers: { 'Content-Type': 'application/json' },
})

axios.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    config.headers.Authorization = getAuthToken() 
    return config
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error)
  },
)

axios.interceptors.response.use(
  (response) => {
    // Do something before response is sent
    return response
  },
  (error) => {
    // Do something with response error
    return Promise.reject(error)
  },
)

export default axios
