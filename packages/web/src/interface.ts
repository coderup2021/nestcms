
interface File{
  id: number
  name: string
  alt: string
  url: string
  storage: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date
}


interface User {
  id: number;
  name: string; //姓名
  userName: string; //用户名
  password: string;
  email: string;
  phoneNum: string;
  countryCode: string;
  comments: string;
  avator: string;
  enable: boolean;
  groupId: number;
  editorId: number;
  salt: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  roles: Role[];
}

interface Resource{
  id: number;
  name: string;
  langKey: string;
  url: string;
  method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';
  parentId: number;
  path: string;
  type: number; // 1:目录 2:操作和功能
  order: number; // 1:目录 2:操作和功能
  show: boolean; // 1:目录 2:操作和功能
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  admins: Role[];
}

interface Role{
    id: number;
    name: string;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    admins: User[];
    resources: Resource[];
}

interface Article {
  id: number;
  title: string;
  content: string;
  description: string;
  picture: string;
  editorType: number; //编辑器类型，1:markdown, 2:WangEditor
  cateId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  cate: Cate;
}

interface Cate{
  id: number;
  name: string;
  parentId: number;
  path: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  articles: Article[];
}

export type Id = number;

export enum HttpStatus {
  OK = 0,
  ERROR = -1,
}
export interface QueryOption {
  current?: number;
  pageSize?: number;
  order?: 'asc' | 'dsc';
}

export interface PaginateData<T> {
  data: T;
  total?: number;
  pageSize?: number;
  current?: number;
}

export interface IRes<T> {
  status: HttpStatus;
  payload: PaginateData<T> | T;
  message: string;
}

export interface AuthResponse {
  token: string
}
export interface UploadRes {
  status: HttpStatus;
  filename: string;
}

export interface IArticle extends Partial<Article> {
  cateId?: number;
}
export type IArticleList = IArticle[];

export type ICate = Partial<Cate>;
export type ICateList = ICate[];

export interface IUser extends Partial<User> {
  roleIds?: Id[];
}
export type IUserList = IUser[];

export interface IRole extends Partial<Role> {
  resourceIds?: number[];
}
export type IRoleList = IRole[];

export type IResource = Partial<Resource>;

export type IFile = Partial<File>;

export interface ILogin {
  username: string;
  password: string;
}

export interface Me {
  username: string;
}

export interface UrlQueryParam {
  oper?: OPER;
  id?: Id;
}

export enum OPER {
  ADD = 'add',
  EDIT = 'edit',
  NONE = 'none',
  EDIT_1 = 'edit_1',
}

export interface IdNameMapProps {
  [prop: string]: string;
}

export interface IStoragePath {
  filename: string;
  relativePath: string;
  absolutePath: string;
}
