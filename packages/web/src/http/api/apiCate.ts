/* eslint-disable */
import { ICate, ICateList, QueryOption, IRes, PaginateData } from 'src/interface'
import { get, post, del, put } from 'src/http/restful'

/** 获取分类详情 GET /api/cate/:id */
export const getCate = (id: number) => get<IRes<ICate>>(`/api/cate/${id}`)

/** 获取分类列表 GET /api/cate */
export const getCateList = (params?: QueryOption) =>
  get<IRes<PaginateData<ICateList>>>('/api/cate', { params })

export const postCate = (data: ICate) =>
  post<IRes<ICate>>('/api/cate', { data })

/** 更新分类 PUT /api/cate */
export const putCate = (data: any) =>
  put<IRes<ICate>>(`/api/cate/${data.id}`, { data })

/** 删除分类 DELETE /api/cate */
export const delCate = (id: number | string) =>
  del<IRes<ICate>>(`/api/cate/${id}`)
