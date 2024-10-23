import { IProduct } from '@/modules/types/product';
import { CrudClient } from './templates/CrudClient';

export class ProductClient extends CrudClient<IProduct> {
  constructor() {
    super('admin/product');
  }
}
