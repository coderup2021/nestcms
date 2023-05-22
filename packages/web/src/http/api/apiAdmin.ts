/* eslint-disable */
import { IUser, IUserList, QueryOption, IRes } from '@cms/server/src/interface'
import { get, post, del, put } from 'src/http/restful'

/** 获取角色详情 GET /api/admin/:id */
export const getAdmin = (id: number) => get<IRes<IUser>>(`/api/admin/${id}`)

/** 获取角色列表 GET /api/admin */
export const getAdminList = (params?: QueryOption) =>
  get<IRes<IUserList>>('/api/admin', { params })

export const postAdmin = (data: IUser) =>
  post<IRes<IUser>>('/api/admin', { data })

/** 更新角色 PUT /api/admin */
export const putAdmin = (data: any) =>
  put<IRes<IUser>>(`/api/admin/${data.id}`, { data })

/** 删除角色 DELETE /api/admin */
export const delAdmin = (id: number | string) =>
  del<IRes<IUser>>(`/api/admin/${id}`)
