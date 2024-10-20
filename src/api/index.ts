import { AuthClient } from './clients/AuthClient';
import { ProductClient } from './clients/ProductClient';
import { UploadClient } from './clients/UploadClient';

export const api = {
  auth: new AuthClient(),
  product: new ProductClient(),
  upload: new UploadClient(),
};
