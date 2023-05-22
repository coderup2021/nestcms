import axios from './axiosInstance'
import { AxiosRequestConfig } from 'axios'
import { stringify } from 'qs'
import { IFile, IRes } from '@cms/server/src/interface'

export const get = async <T>(
  endPoint: string,
  options?: AxiosRequestConfig,
): Promise<T> => {
  let url = endPoint
  if (options) {
    const { params } = options
    if (params) {
      url += `?${stringify(params)}`
    }
  }
  const { data } = await axios(url)
  return data
}

export const post = async <T>(
  endPoint: string,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const data = options?.data || {}
  return axios(endPoint, {
    method: 'POST',
    data,
  })
}

export const put = async <T>(
  endPoint: string,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const data = options?.data || {}
  return axios(endPoint, {
    method: 'PUT',
    data,
  })
}

export const del = async <T>(
  endPoint: string,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const data = options?.data || {}
  return axios(endPoint, {
    method: 'DELETE',
    data,
  })
}

export const postPictures = async (
  data: File[],
): Promise<PromiseSettledResult<IRes<IFile[]>>[]> => {
  const filenames: string[] = []
  const requests = data
    .filter((item) => item)
    .map((item) => {
      filenames.push(item.name)
      const formData = new FormData()
      formData.append('file', item)
      formData.append('name', item.name)
      const p: Promise<IRes<IFile[]>> = axios<IFile>('/api/upload', {
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return p
    })

  return Promise.allSettled(requests)
}
