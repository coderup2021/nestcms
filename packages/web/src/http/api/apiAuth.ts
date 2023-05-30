/* eslint-disable */
import { ICate, ICateList, QueryOption, IRes, Me } from 'src/interface'
import { get, post, del, put } from 'src/http/restful'

/** 获取分类详情 GET /api/cate/:id */
export const login = ({username, password}:{username:string, password:string}) => post<IRes<{token:string}>>(`/api/admin/login`, {data:{username, password}})
export const me = () => get<IRes<Me>>(`/api/me`)

/** 获取分类列表 GET /api/cate */
