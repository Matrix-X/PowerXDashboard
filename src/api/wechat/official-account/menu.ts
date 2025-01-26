import axios from 'axios';
import { PrefixUriAdmin } from '@/api';

const UriOAMenu = '/wechat/official-account/menus';

export interface GetOAMenuTreeReply {
  button: any;
  matchrule: any;
}

export function getOAMenuTree() {
  return axios.get<GetOAMenuTreeReply>(`${PrefixUriAdmin + UriOAMenu}-tree`);
}

export interface SyncOAMenuRequest {
  button: any;
}

export interface SyncOAMenuReply {
  success: boolean;
  data: any;
}

export function syncOAMenu(request: SyncOAMenuRequest) {
  return axios.post<SyncOAMenuReply>(
    `${PrefixUriAdmin + UriOAMenu}/sync`,
    request,
  );
}
