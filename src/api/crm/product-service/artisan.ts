import { PowerModel } from '@/api/common';
import axios from 'axios';
import { UriProduct } from '@/api/crm/product-service/product';
import { Pagination } from '@/types/global';
import { PrefixUriAdmin } from '@/api';
import { MediaSet } from '@/api/media-resource';

const UriArtisan = '/artisans';

export interface Artisan extends PowerModel, MediaSet {
  userId?: number;
  name: string;
  level?: number;
  gender: boolean;
  birthday: Date;
  phoneNumber: string;
  coverURL: string;
  workNo: string;
  email: string;
  experience: string;
  specialty: string;
  certificate: string;
  address: string;
  storeIds: number[];
}

export interface ListArtisanPageRequest extends Pagination {
  ids?: number[];
  likeName?: string;
  storeIds?: number[];
}

export interface ListArtisanPageReply extends Pagination {
  list: Artisan[];
}

export function listArtisans(request: ListArtisanPageRequest) {
  return axios.get<ListArtisanPageReply>(
    `${PrefixUriAdmin + UriProduct + UriArtisan}/page-list`,
    {
      params: request,
    },
  );
}

export function createArtisan(request: Artisan) {
  return axios.post<Artisan>(
    `${PrefixUriAdmin + UriProduct + UriArtisan}`,
    request,
  );
}

export function updateArtisan(request: Artisan) {
  return axios.put<Artisan>(
    `${PrefixUriAdmin + UriProduct + UriArtisan}/${request.id}`,
    request,
  );
}

export interface DeleteArtisanRequest {
  id: number;
}

export interface DeleteArtisanReply {
  id: number;
}

export function deleteArtisan(request: DeleteArtisanRequest) {
  return axios.delete<DeleteArtisanReply>(
    `${PrefixUriAdmin + UriProduct + UriArtisan}/${request.id}`,
  );
}

export interface BindArtisanToStoreRequest {
  artisanIds: number[];
  storeIds: number[];
}

export interface BindArtisanToStoreReply {
  pivotIds: number[];
}

export function bindArtisanToStore(request: BindArtisanToStoreRequest) {
  return axios.post<BindArtisanToStoreReply>(
    `${PrefixUriAdmin + UriProduct + UriArtisan}/bind/stores`,
    request,
  );
}
