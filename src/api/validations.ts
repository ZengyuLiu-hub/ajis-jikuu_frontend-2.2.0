import { http, Result } from '../app/http';

export type ValidateAccessTokenResult = {
  data: string;
} & Result;

class Validations {
  /**
   * 認証トークンの有効性を確認します.
   *
   * @returns Promise<Response> リクエスト結果
   */
  validAccessToken = async () => {
    return await http.get(`api/validations/access-token`);
  };
}

export const validations = new Validations();
