import { getCateList } from '@/http/api'
import { flatToTree } from '@/utils'
import { ICate, ICateList, QueryOption } from 'src/interface'
import { create } from 'zustand'

export type Order = 'asc' | 'dsc'
interface IState {
  total: number
  data: ICateList
  treeData: ICateList
  dataMap: { [key: string]: ICate }
  current?: number
  pageSize?: number
  order?: Order
}

interface IAction {
  fetchData: (param?: QueryOption) => Promise<void>
  setCurrent: (current?: number) => void
  setPageSize: (pageSize?: number) => void
  setOrder: (order?: Order) => void
}

export const useCateStore = create<IState & IAction>((set, get) => {
  return {
    total: 0,
    data: [],
    dataMap: {},
    treeData: [],
    current: 1,
    pageSize: 10,
    order: 'dsc',

    fetchData: async () => {
      const param = {
        current: get().current,
        pageSize: get().pageSize,
        order: get().order,
      }
      const { payload } = await getCateList(param)

      const { data, total } = payload

      if (data) {
        const cdata = data as ICateList
        const originData:{[p:string]:any} = {}
        set({
          data: cdata ,
          treeData: flatToTree(cdata), 
          dataMap: cdata.reduce((i, j) => {
            i[String(j.id)] = j
            return i
          }, originData),
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
    setOrder: (order:Order = 'dsc') => {
      set({ order })
    },
  }
})
