import axios from 'axios';
import { Pagination } from '@/types/global';

/**
 * 通用接口
 * @author Northseadl
 * @email northseadl@outlook.com
 * @version v1
 */

export interface UserOption {
  id: number;
  avatar: string;
  account: string;
  name: string;
  email: string;
  phoneNumber: string;
}

export interface GetUserOptionsRequest extends Pagination {
  likeName?: string;
  likeEmail?: string;
  likePhoneNumber?: string;
}

export interface GetUserOptionsReply extends Pagination {
  list: UserOption[];
}

export function getUserOptions(request: GetUserOptionsRequest) {
  return axios.get<GetUserOptionsReply>('/api/v1/admin/common/options/users', {
    params: request,
  });
}

export interface UserQueryRoleOption {
  roleCode: string;
  roleName: string;
}

export interface UserQueryDepartmentOption {
  departmentId: number;
  departmentName: string;
}

export interface GetUserQueryOptionsReply {
  roles: UserQueryRoleOption[];
  departments: UserQueryDepartmentOption[];
}

export function getUserQueryOptions() {
  return axios.get<GetUserQueryOptionsReply>(
    '/api/v1/admin/common/options/user-query',
  );
}

export interface ParentOption {
  id: number;
  name: string;
}

export interface DepartmentOption {
  id: number;
  name: string;
}

export interface GetDepartmentOptionsRequest extends Pagination {
  ids?: number[];
  likeName?: string;
}

export interface GetDepartmentOptionsReply extends Pagination {
  list: DepartmentOption[];
}

export function getDepartmentOptions(request: GetDepartmentOptionsRequest) {
  return axios.get<GetDepartmentOptionsReply>(
    '/api/v1/admin/common/options/departments',
    {
      params: request,
    },
  );
}

export interface PowerModel {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface imageAbleInfo {
  icon?: string;
  backgroundColor?: string;
  imageURL?: string;
}

export interface GetOptionsRequest {
  type: string;
  search?: string;
}
export interface GetOptionsReply {
  options: { [key: string]: any }[];
}

export function getOptions(request: GetOptionsRequest) {
  return axios.get<GetOptionsReply>('/api/v1/admin/common/options', {
    params: request,
  });
}
