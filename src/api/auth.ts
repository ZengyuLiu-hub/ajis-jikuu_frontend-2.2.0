import { AuthorityType, Employee } from '../types';
import { http, RestRequest, Result } from '../app/http';

export type AuthenticationCondition = {
  loginId: string;
  password: string;
};

export type LoginResult = {
  loginId: string;
  userId: string;
  userName: string;
  lang: string;
  timeZone: string;
  homePage: string;
  authorities: AuthorityType[];
  token: string;
  activeProfiles: string[];
  employee: Employee;
} & Result;

class Auth {
  /**
   *
   * @param payload
   * @returns
   */
  login = async (payload: RestRequest<AuthenticationCondition>) => {
    console.log('Auth.login called with payload:', payload); // 新增日志
    const formData = new URLSearchParams();
    formData.set('loginId', payload.parameters?.loginId ?? '');
    formData.set('password', payload.parameters?.password ?? '');

    return await http.postForm('authenticate', formData);
  };

  /**
   *
   */
  logout = async () => {
    console.log('Auth.logout called'); // 新增日志
    return await http.get('logout');
  };
}

export const auth = new Auth();
