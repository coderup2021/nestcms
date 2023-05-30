/* eslint-disable */
import { IResource, QueryOption, IRes } from 'src/interface'
import { get, post, del, put } from 'src/http/restful'

/** 获取资源详情 GET /api/resource/:id */
export const getResource = (id: number) =>
  get<IRes<IResource>>(`/api/resource/${id}`)

/** 获取资源列表 GET /api/resource */
export const getResourceList = (params?: QueryOption) =>
  get<IRes<IResource[]>>('/api/resource', { params })

export const postResource = (data: IResource) =>
  post<IRes<IResource>>('/api/resource', { data })

/** 更新资源 PUT /api/resource */
export const putResource = (data: any) =>
  put<IRes<IResource>>(`/api/resource/${data.id}`, { data })

/** 删除资源 DELETE /api/resource */
export const delResource = (id: number | string) =>
  del<IRes<IResource>>(`/api/resource/${id}`)
