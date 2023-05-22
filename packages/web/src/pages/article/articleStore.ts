import { getArticleList } from '@/http/api'
import { ICate, ICateList, QueryOption } from '@cms/server/src/interface'
import { create } from 'zustand'

interface IState {
  total: number
  data: ICateList
  dataMap: { [key: string]: ICate }
  current?: number
  pageSize?: number
  order?: 'asc' | 'dsc'
}

interface IAction {
  fetchData: (param?: QueryOption) => Promise<void>
  setCurrent: (current?: number) => void
  setPageSize: (pageSize?: number) => void
  setOrder: (order?: 'asc' | 'dsc') => void
}

export const useArticleStore = create<IState & IAction>((set, get) => {
  return {
    total: 0,
    data: [],
    dataMap: {},
    current: 1,
    pageSize: 10,
    order: 'dsc',

    fetchData: async () => {
      const param = {
        current: get().current,
        pageSize: get().pageSize,
        order: get().order,
      }
      const { payload } = await getArticleList(param)

      const { data, total } = payload

      if (data) {
        set({
          data: data,
          dataMap: data.reduce((i, j) => {
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