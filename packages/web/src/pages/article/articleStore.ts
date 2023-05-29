import { getArticle, getArticleList } from '@/http/api'
import {
  IArticle,
  IArticleList,
  ICate,
  ICateList,
  PaginateData,
  QueryOption,
} from '@cms/server/src/interface'
import { create } from 'zustand'

interface IState {
  total: number
  data: IArticleList
  dataMap: { [key: string]: ICate }
  current?: number
  pageSize?: number
  order?: 'asc' | 'dsc'
  article: IArticle | null
  loading: boolean
}

interface IAction {
  fetchData: (param?: QueryOption) => Promise<void>
  fetchArticle: (id: number) => Promise<void>
  setCurrent: (current?: number) => void
  setPageSize: (pageSize?: number) => void
  setOrder: (order?: 'asc' | 'dsc') => void
  resetArticle: () => void
}

export const useArticleStore = create<IState & IAction>((set, get) => {
  return {
    total: 0,
    data: [],
    dataMap: {},
    current: 1,
    pageSize: 10,
    order: 'dsc',
    article: null,
    loading: false,

    fetchArticle: async (id: number) => {
      set({ loading: true })
      try {
        const { payload } = await getArticle(id)

        if (payload) {
          set({ article: payload as IArticle })
        }
      } finally {
        set({ loading: false })
      }
    },
    resetArticle: () => set({ article: null }),
    fetchData: async () => {
      const param = {
        current: get().current,
        pageSize: get().pageSize,
        order: get().order,
      }
      const { payload } = await getArticleList(param)

      const { data, total } = payload as PaginateData<IArticleList>

      if (data) {
        set({
          data: data,
          dataMap: data.reduce((i: any, j: IArticle) => {
            i[j.id] = j
            return i
          }, {}),
        })
      }
      if (total) set({ total })
    },
    setCurrent: (current = 0) => {
      set({ current: current || 1 })
    },
    setPageSize: (pageSize = 0) => {
      set({ pageSize: pageSize || 10 })
    },
    setOrder: (order = 'dsc') => {
      set({ order })
    },
  }
})
