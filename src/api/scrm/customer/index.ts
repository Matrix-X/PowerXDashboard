/*
 * @Description:
 * @Author: George
 * @Date: 2023-06-30 14:00:31
 * @LastEditors: George
 * @LastEditTime: 2023-07-16 01:48:33
 */
import axios from 'axios';

/**
 * customer
 * @description scrm客户管理
 */

export interface UserDepartment {
  depId: number;
  depName: string;
}

export interface Customers {
  list: any[];
}

export interface GetCustomersRequest {
  userId?: string;
  name?: string;
  unionid?: string;
  pageIndex?: number;
  pageSize?: number;
}

export type GetCustomersReply = Customers;

/**
 * customer
 * @description 客户列表
 */
export function getCustomers(request: GetCustomersRequest) {
  return axios.post<GetCustomersReply>(
    `/api/v1/admin/scrm/customer/wechat/page`,
    request,
  );
}

export interface GetCustomersGroupsRequest {
  status_filter?: number;
  cursor?: string;
  limit?: number;
  name?: string;
}
export type GetCustomersGroupsReReply = Customers;
/**
 * customer
 * @description 客户群列表
 */
export function getCustomersGroups(request: GetCustomersGroupsRequest) {
  return axios.post<GetCustomersGroupsReReply>(
    `/api/v1/admin/scrm/customer/wechat/group/list`,
    request,
  );
}
export interface GetCustomersGroupsDetailRequest {
  chatId: string;
}
export function getCustomersGroupsDetail(
  request: GetCustomersGroupsDetailRequest,
) {
  return axios.get<GetCustomersGroupsReReply>(
    `/api/v1/admin/scrm/app/wechat/group/list`,
    {
      params: request,
    },
  );
}

/**
 * customer
 * @description 应用管理
 */
export type GetWechatAppReReply = Customers;

export function wechatAppList(request: any) {
  return axios.get<GetWechatAppReReply>(
    '/api/v1/admin/scrm/app/wechat/options',
    {
      params: request,
    },
  );
}

/**
 * customer
 * @description 应用详情
 */
export interface GetWechatAppDetailRequest {
  agentId: number;
}

export function wechatAppDetail(request: GetWechatAppDetailRequest) {
  return axios.get<any>('/api/v1/admin/scrm/app/wechat/detail', {
    params: request,
  });
}
export interface GetWechatGroup {
  name?: string;
  owner?: string;
  chatid?: string;
  userlist?: string[];
}
export interface GetWechatGroupRequest {
  chatId?: string;
}
export interface GetWechatGroupReReply {
  list?: GetWechatGroup[];
}
export function wechatGroup(request: any) {
  return axios.get<GetWechatGroupReReply>(
    '/api/v1/admin/scrm/app/wechat/group/list',
    request,
  );
}

export function getWechatSync(request: any) {
  return axios.get<GetCustomersReply>(
    '/api/v1/admin/scrm/organization/wechat/sync',
    request,
  );
}
/**
 * customer
 * @description 群聊信息发送
 */
export interface GetWechatGroupArticlesRequest {
  chatIds: string[];
  title: string;
  description: string;
  url: string;
  picUrl: string;
  appid?: string;
  pagepath?: string;
  sendTime?: any;
  sender?: string;
}
export function wechatGroupArticles(request: GetWechatGroupArticlesRequest) {
  return axios.post<GetCustomersReply>(
    '/api/v1/admin/scrm/app/wechat/group/message/articles',
    request,
  );
}

/**
 * customer
 * @description 创建群聊
 */
export interface CreateWechatGroupRequest {
  name: string;
  owner: string;
  userlist: string[];
  chatid?: string;
}
export interface CreateWechatGroupReply {
  chatid: string;
}
export function createWechatGroup(request: CreateWechatGroupRequest) {
  return axios.post<CreateWechatGroupReply>(
    '/api/v1/admin/scrm/app/wechat/group/create',
    request,
  );
}

/**
 * customer
 * @description 应用信息发送
 */
export interface Articles {
  title: string;
  description: string;
  url: string;
  picurl: string;
  appid: string;
  pagepath: string;
  touser?: string[];
  sendTime?: any;
}
export interface ArticlesNews {
  articles: Articles[];
}
export interface GetMessageArticlesRequest {
  agentid?: number;
  msgtype: string;
  news: ArticlesNews;
  pagepath?: string;
  sendTime?: any;
  toparty?: string;
  touser?: string;
  appid?: string;
}

export function wechatMessageArticles(request: GetMessageArticlesRequest) {
  return axios.post<GetCustomersReply>(
    '/api/v1/admin/scrm/app/wechat/message/articles',
    request,
  );
}

export interface GetMessageTemplateRequest {
  text: any;
  externalUserid: string[];
  chatType: string;
  attachments: any;
  sender: string;
  sendTime: any;
}
export function wechatMessageTemplate(request: GetMessageTemplateRequest) {
  return axios.post<GetCustomersReply>(
    '/api/v1/admin/scrm/customer/wechat/group/message/template',
    request,
  );
}
