import { IProduct } from '@/modules/types/product';
import { CrudClient } from './templates/CrudClient';

export class UploadClient extends CrudClient<IProduct> {
  constructor() {
    super('admin/upload');
  }

  async uploadImage(formData: FormData) {
    return this.postForm('/image', formData);
  }
}
