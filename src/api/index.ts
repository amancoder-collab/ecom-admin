import { AuthClient } from './clients/AuthClient';
import { ProductClient } from './clients/ProductClient';

export const api = {
  auth: new AuthClient(),
  product: new ProductClient(),
};
