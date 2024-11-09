import {
  ICreateVariant,
  IProduct,
  IUpdateVariant,
  IVariant,
} from '@/modules/types/product';
import { AxiosResponse } from 'axios';
import { IApiResponse } from '../types';
import { CrudClient } from './templates/CrudClient';

export class ProductClient extends CrudClient<IProduct> {
  constructor() {
    super('admin/product');
  }

  getVariantById(
    variantId: string,
  ): Promise<AxiosResponse<IApiResponse<IVariant>>> {
    return this.get(`/variant/${variantId}`);
  }

  createVariant(productId: string, data: ICreateVariant) {
    return this.post(`/${productId}/variant`, data);
  }

  updateVariant(productId: string, variantId: string, data: IUpdateVariant) {
    return this.patch(`/${productId}/variant/${variantId}`, data);
  }

  deleteVariantById(variantId: string) {
    return this.delete(`/variant/${variantId}`);
  }
}
