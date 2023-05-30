import { IdNameMapProps } from "@/interface"

interface FlatTreeProps {
  id: string
  parentId: string
  children: string
}

export const flatToTree = <T>(
  flatArray: T[],
  options: FlatTreeProps = {
    id: 'id',
    parentId: 'parentId',
    children: 'children',
  },
) => {
  const dictionary: { [prop: string | number]: T } = {} // a hash table mapping to the specific array objects with their ids as key
  const tree: T[] = []
  const children = options.children
  flatArray.forEach((node: any) => {
    const nodeId = node[options.id] as number
    const nodeParentId = node[options.parentId] as number
    // set up current node data in dictionary
    dictionary[nodeId] = {
      [children]: [], // init a children property
      ...node, // add other propertys
      ...dictionary[nodeId], // children will be replaced if this node already has children property which was set below
    }
    dictionary[nodeParentId] =
      dictionary[nodeParentId] || ({ [children]: [] } as unknown as T) // if it's not exist in dictionary, init an object with children property
    ;(dictionary[nodeParentId] as any)[children].push(dictionary[nodeId] as T) // add reference to current node object in parent node object
  })
  // find root nodes
  Object.values(dictionary).forEach((obj: any) => {
    if (typeof obj[options.id] === 'undefined') {
      tree.push(...obj[children])
    }
  })
  return tree
}

export function removeEmptyChildren<T>(data: T[]): T[] {
  return data.map((item: any) => {
    if (item.children && item.children.length > 0) {
      item.children = removeEmptyChildren(item.children)
    } else {
      delete item.children
    }
    return item
  })
}

// export function flatToTree<T>(data: T[]): T[] {
//   function getTop(data: T[]) {
//     return data.filter((item: any) => item.parentId === 0)
//   }
//   function getChildren(items: T[], originData: T[]) {
//     items.forEach((item: any) => {
//       item.children = originData.filter((o: any) => o.parentId === item.id)
//       getChildren(item.children, originData)
//     })
//     return items
//   }
//   const top = getTop(data)
//   return getChildren(top, data)
// }

export function genIdNameProp(
  data: { id: number; name: string }[],
): IdNameMapProps {
  const obj: IdNameMapProps = {}

  data.forEach((d) => {
    obj[d.id] = d.name
  })
  return obj
}

export function getIdPath<T>(id: number, cateTree: T[]): string {
  const paths: number[] = []
  let flag = false
  let end = false
  function _handle(id: number, cateTree: T[]) {
    for (let i = 0; i < cateTree.length; i++) {
      if (flag) return
      const cate = cateTree[i] as any
      if (cate.id === id) {
        paths.unshift(cate.id)
        flag = true
        return
      } else {
        if (cate.children) _handle(id, cate.children)
        if (end === true) return
        console.log('cate.name', cate.name)
        if (flag) {
          paths.unshift(cate.id)
        }
        if (flag && cate.parentId === 0) {
          end = true
        }
      }
    }
  }
  _handle(id, cateTree)
  paths.unshift(0)
  return `/${paths.join('/')}/`
}

export function addRootNode<T>(cateTree: T[]): T[] {
  const root: any = {
    id: 0,
    name: '根目录',
    parentId: 0,
    path: '/',
    children: cateTree,
  } as unknown as T
  return [root]
}
