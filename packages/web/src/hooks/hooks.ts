import {
  UrlQueryParam,
  Id,
  OPER,
  IRes,
  IResource,
  IRole,
} from '@cms/server/src/interface'
import { useRouter } from 'next/router'
import { ParsedUrlQueryInput } from 'node:querystring'

export const useSearch = (): UrlQueryParam => {
  const { query } = useRouter()

  const { id = 0, oper = OPER.NONE } = query
  return { id, oper } as UrlQueryParam
}

export const push = (oper: OPER, id?: Id) => {
  const router = useRouter()

  let obj: UrlQueryParam = {}
  if (oper !== OPER.NONE) {
    obj.oper = oper
    if (id) obj.id = id
  }

  router.push({ query: obj as ParsedUrlQueryInput })
}

// export const useGetResource = () => {
//   const { setResourceList, setResourceTree, setResourceIdNameMap } =
//     useModel('resource')
//   useEffect(() => {
//     getResourceList().then(({ data }: IRes<IResource>) => {
//       setResourceList(data)
//       setResourceTree(flatToTree(data))
//       setResourceIdNameMap(genIdNameProp(data))
//     })
//   }, [])
// }

// export const useGetRole = () => {
//   const { setRoleList, setRoleIdNameMap } = useModel('role')
//   useEffect(() => {
//     getRoleList().then(({ data }: IRes<IRole>) => {
//       setRoleList(data)
//       setRoleIdNameMap(genIdNameProp(data))
//     })
//   }, [])
// }
