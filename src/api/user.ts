import axios from 'axios';
import { Position } from '@/api/position';
import { Pagination } from '@/types/global';

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
  position?: Position;
  positionId?: number;
  jobTitle: string;
  isEnabled: boolean;
  createdAt: string;
}

export interface GetUserRequest {
  id: number;
}

export type GetUserReply = User;
export function getUser(request: GetUserRequest) {
  return axios.get<GetUserReply>(`/api/v1/admin/user/users/${request.id}`);
}

export interface ListUsersRequest extends Pagination {
  ids?: number[];
  likeName?: string;
  likeEmail?: string;
  depIds?: number[];
  positionIds?: [];
  likePhoneNumber?: string;
  roleCodes?: string[];
  isEnable?: any;
}

export interface ListUsersReply extends Pagination {
  list: User[];
}

export function listUsers(request: ListUsersRequest) {
  return axios.get<ListUsersReply>('/api/v1/admin/user/users', {
    params: request,
  });
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

export interface CreateUserRequest {
  account: string;
  name: string;
  nickName?: string;
  desc?: string;
  email: string;
  avatar?: string;
  externalEmail?: string;
  mobilePhone?: string;
  gender: string;
  depId: number;
  position?: string;
  jobTitle?: string;
  password?: string;
}

export interface CreateUserReply {
  id: number;
}

export function createUser(request: CreateUserRequest) {
  return axios.post<CreateUserReply>('/api/v1/admin/user/users', request);
}

export interface UpdateUserRequest {
  id: number;
  name?: string;
  nickName?: string;
  desc?: string;
  email?: string;
  avatar?: string;
  externalEmail?: string;
  mobilePhone?: string;
  gender?: string;
  depId?: number;
  positionId?: number;
  jobTitle?: string;
  password?: string;
  status?: string;
}

export type UpdateUserReply = User;

export function updateUser(request: UpdateUserRequest) {
  return axios.patch<UpdateUserReply>(
    `/api/v1/admin/user/users/${request.id}`,
    request,
  );
}

export interface DeleteUserRequest {
  id: number;
}

export interface DeleteUserReply {
  id: number;
}

export function deleteUser(request: DeleteUserRequest) {
  return axios.delete<DeleteUserReply>(
    `/api/v1/admin/user/users/${request.id}`,
  );
}

export interface ResetPasswordReply {
  status: string;
}

export function resetPassword(userId: number) {
  return axios.post<ResetPasswordReply>(
    `/api/v1/admin/user/users/actions/reset-password`,
    {
      userId,
    },
  );
}
