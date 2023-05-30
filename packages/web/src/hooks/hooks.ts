import {
  UrlQueryParam,
  Id,
  OPER,
  IRes,
  IResource,
  IRole,
} from 'src/interface'
import { useRouter } from 'next/router'
import { ParsedUrlQueryInput } from 'node:querystring'

export const useSearch = (): UrlQueryParam => {
  const { query } = useRouter()

  const { id = 0, oper = OPER.NONE } = query
  return { id, oper } as UrlQueryParam
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
