/* eslint-disable */
import {
  IArticle,
  IArticleList,
  QueryOption,
  IRes,
} from 'src/interface'
import { get, post, del, put } from 'src/http/restful'

/** 获取文章详情 GET /api/article/:id */
export const getArticle = (id: number) =>
  get<IRes<IArticle>>(`/api/article/${id}`)

/** 获取文章列表 GET /api/article */
export const getArticleList = (params?: QueryOption) =>
  get<IRes<IArticleList>>('/api/article', { params })

export const postArticle = (data: IArticle) =>
  post<IRes<IArticle>>('/api/article', { data })

/** 更新文章 PUT /api/article */
export const putArticle = (data: any) =>
  put<IRes<IArticle>>(`/api/article/${data.id}`, { data })

/** 删除文章 DELETE /api/article */
export const delArticle = (id: number | string) =>
  del<IRes<IArticle>>(`/api/article/${id}`)
