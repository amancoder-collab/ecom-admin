import { BaseClient } from './templates/BaseClient';
import { LoginFormSchema } from '@/modules/auth/login/form/schema';

export class AuthClient extends BaseClient {
  constructor() {
    super('admin/auth');
  }

  async login(data: LoginFormSchema) {
    return await this.post('/login', data);
  }

  async session() {
    return await this.get('/session');
  }

  async logout() {
    return await this.post('/logout');
  }
}
