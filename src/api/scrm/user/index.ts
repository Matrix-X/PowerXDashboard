import axios from 'axios';

/**
 * User
 * @description 员工管理
 */

export interface UserDepartment {
  depId: number;
  depName: string;
}

export interface User {
  id: number;
  account: string;
  name: string;
  email: string;
  mobilePhone: string;
  gender: string;
  nickName?: string;
  desc?: string;
  avatar?: string;
  externalEmail?: string;
  roles: string[];
  department?: UserDepartment;
  position: string;
  jobTitle: string;
  isEnabled: boolean;
  createdAt: string;
}

export interface GetUserRequest {
  id: string;
}

export type GetUserReply = User;
export function getUser(request: GetUserRequest) {
  return axios.get<GetUserReply>(`/api/v1/admin/user/users/${request.id}`);
}

export interface ListUsersRequest {
  id?: any;
  name?: string;
  email?: string;
  alias?: number[];
  status?: string[];
  weWorkUserId?: string | number | null;
  weWorkMainDepartmentId?: any;
  roleCodes?: string[];
  isEnable?: any;
  pageIndex?: number;
  pageSize?: number;
  likeName?: string;
}

export interface ListUsersReply {
  list: User[];
  pageIndex: number;
  pageSize: number;
  total: number;
  children?: any[];
}

export function listUsers(request: ListUsersRequest) {
  return axios.post<ListUsersReply>(
    '/api/v1/admin/scrm/organization/wechat/user/page',
    request,
  );
}

export interface SyncUsersRequest {
  source: string;
  target: string;
}

export interface SyncUsersReply {
  status: boolean;
}

export function syncUsers(request: SyncUsersRequest) {
  return axios.post<SyncUsersReply>(
    '/api/v1/admin/user/users/actions/sync',
    request,
  );
}
