import * as httpConstants from '../constants/http';

import { AuthorityType, User } from '../types';

/**
 * セキュリティユーティリティ.
 */
export class SecurityUtil {
  /**
   * 認証済みであることを判定します.
   *
   * @return 認証済みである場合は true を、それ以外の場合は false を返します.
   */
  static isAuthenticated = () => {
    const token = window.localStorage.getItem(httpConstants.JWT_TOKEN_NAME);
    return !!token;
  };

  /**
   * 指定した権限のいずれかを有しているいるかを判定します.
   *
   * @param user ログインユーザー情報
   * @param allowAuthorities 判定対象の権限
   * @return ログインユーザーが指定の権限を有してした場合は true を、それ以外の場合は false を返します
   */
  static hasAnyAuthority = (user: User, allowAuthorities: AuthorityType[]) => {
    // 認証していない場合
    if (!this.isAuthenticated()) {
      return false;
    }
    // 権限指定がない場合
    if (allowAuthorities.length === 0) {
      return true;
    }
    // 権限チェック
    return !!allowAuthorities.some((authority) =>
      user.authorities.includes(authority)
    );
  };
}
