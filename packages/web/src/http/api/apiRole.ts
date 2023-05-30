/* eslint-disable */
import { IRole, IRoleList, QueryOption, IRes } from 'src/interface'
import { get, post, del, put } from 'src/http/restful'

/** 获取角色详情 GET /api/role/:id */
export const getRole = (id: number) => get<IRes<IRole>>(`/api/role/${id}`)

/** 获取角色列表 GET /api/role */
export const getRoleList = (params?: QueryOption) =>
  get<IRes<IRoleList>>('/api/role', { params })

export const postRole = (data: IRole) =>
  post<IRes<IRole>>('/api/role', { data })

/** 更新角色 PUT /api/role */
export const putRole = (data: any) =>
  put<IRes<IRole>>(`/api/role/${data.id}`, { data })

/** 删除角色 DELETE /api/role */
export const delRole = (id: number | string) =>
  del<IRes<IRole>>(`/api/role/${id}`)
