import { PowerModel, PrefixUriAdminApi } from '@/api/common';
import axios from 'axios';
import type { ProductCategory } from '@/api/crm/product-service/category';

export const UriProductApi = '/product';

export interface DetailImage {
  id: number;
  url: string;
  name: string;
  sort: string;
}

export interface ProductSpecific {
  inventory: number;
  soldAmount: number;
  weight: number;
  volume: number;
  encode: string;
  barCode: string;
  extra: string;
}

export interface Product extends PowerModel, ProductSpecific {
  name: string;
  type: number;
  plan: number;
  accountingCategory: string;
  canSellOnline: boolean;
  canUseForDeduct: boolean;
  approvalStatus: number;
  isActivated: boolean;
  description: string;
  coverImage: DetailImage;
  detailImages: DetailImage[];
  allowedSellQuantity: number;
  validityPeriodDays: number;
  salesChannelsItemIds: number[];
  promoteChannelsItemIds: number[];
  saleStartDate: Date;
  saleEndDate: Date;
  productCategories: ProductCategory[];
  categoryIds: number[];
  coverImageId: number;
  detailImageIds: number[];
}

export interface ListProductPageRequest {
  ids?: number[];
  likeName?: string;
  storeIds?: number[];
  pageIndex?: number;
  pageSize?: number;
}

export interface ListProductPageReply {
  list: Product[];
  pageIndex: number;
  pageSize: number;
  total: number;
}

export function listProducts(request: ListProductPageRequest) {
  return axios.get<ListProductPageReply>(
    `${PrefixUriAdminApi + UriProductApi}/products/page-list`,
    {
      params: request,
    }
  );
}

export function createProduct(request: Product) {
  return axios.post<Product>(
    `${PrefixUriAdminApi + UriProductApi}/products`,
    request
  );
}

export function updateProduct(request: Product) {
  return axios.put<Product>(
    `${PrefixUriAdminApi + UriProductApi}/products/${request.id}`,
    request
  );
}

export interface DeleteProductRequest {
  id: number;
}

export interface DeleteProductReply {
  id: number;
}

export function deleteProduct(request: DeleteProductRequest) {
  return axios.delete<DeleteProductReply>(
    `${PrefixUriAdminApi + UriProductApi}/products/${request.id}`
  );
}
