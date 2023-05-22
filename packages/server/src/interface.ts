// import { User } from './entity/admin.entity'
import { Cate } from 'src/modules/cate/cate.entity';
import { Role } from 'src/modules/role/role.entity';
import { File } from 'src/modules/file/file.entity';
import { Article } from 'src/modules/article/article.entity';
import { Resource } from 'src/modules/resource/resource.entity';
import { User } from 'src/modules/user/user.entity';

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

export interface IRes<T> {
  status: HttpStatus;
  payload: {
    data: T;
    total?: number;
    pageSize?: number;
    current?: number;
  };
  message: string;
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
