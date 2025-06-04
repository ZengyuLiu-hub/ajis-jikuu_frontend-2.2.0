import * as httpConstants from '../../constants/http';
import { AuthorityTypes } from '../../types';

import { SecurityUtil } from '../../utils/SecurityUtil';

describe('SecurityUtil.isAuthenticated', () => {
  it('認証済み', () => {
    window.localStorage.setItem(httpConstants.JWT_TOKEN_NAME, 'abc');

    const expected = true;
    const actual = SecurityUtil.isAuthenticated();

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });

  it('未認証', () => {
    window.localStorage.removeItem(httpConstants.JWT_TOKEN_NAME);

    const expected = false;
    const actual = SecurityUtil.isAuthenticated();

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });
});

describe('SecurityUtil.hasAnyAuthority', () => {
  it('未認証', () => {
    const user = {
      loginId: '1',
      userId: 'user001',
      userName: 'いち',
      lang: 'ja',
      timeZone: 'Asia/Tokyo',
      homePage: '/',
      authorities: [
        AuthorityTypes.COMPANY_SEARCH,
        AuthorityTypes.STORE_SEARCH,
        AuthorityTypes.MAP_SEARCH,
      ],
      employee: {
        jurisdictionClass: '1',
        zoneCode: '2',
        doCode: '3',
        employeeCode: '4',
        employeeName: 'よん',
      },
    };

    const expected = false;
    const actual = SecurityUtil.hasAnyAuthority(user, [
      AuthorityTypes.COMPANY_SEARCH,
    ]);

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });

  it('認証済み, 権限指定なし', () => {
    window.localStorage.setItem(httpConstants.JWT_TOKEN_NAME, 'abc');

    const user = {
      loginId: '1',
      userId: 'user001',
      userName: 'いち',
      lang: 'ja',
      timeZone: 'Asia/Tokyo',
      homePage: '/',
      authorities: [
        AuthorityTypes.COMPANY_SEARCH,
        AuthorityTypes.STORE_SEARCH,
        AuthorityTypes.MAP_SEARCH,
      ],
      employee: {
        jurisdictionClass: '1',
        zoneCode: '2',
        doCode: '3',
        employeeCode: '4',
        employeeName: 'よん',
      },
    };

    const expected = true;
    const actual = SecurityUtil.hasAnyAuthority(user, []);

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });

  it('認証済み, 権限指定あり, 権限なし', () => {
    window.localStorage.setItem(httpConstants.JWT_TOKEN_NAME, 'abc');

    const user = {
      loginId: '1',
      userId: 'user001',
      userName: 'いち',
      lang: 'ja',
      timeZone: 'Asia/Tokyo',
      homePage: '/',
      authorities: [
        AuthorityTypes.COMPANY_SEARCH,
        AuthorityTypes.STORE_SEARCH,
        AuthorityTypes.MAP_SEARCH,
      ],
      employee: {
        jurisdictionClass: '1',
        zoneCode: '2',
        doCode: '3',
        employeeCode: '4',
        employeeName: 'よん',
      },
    };

    const expected = false;
    const actual = SecurityUtil.hasAnyAuthority(user, [
      AuthorityTypes.INVENTORY_SCHEDULE_SEARCH,
    ]);

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });

  it('認証済み, 権限指定あり, 権限あり', () => {
    window.localStorage.setItem(httpConstants.JWT_TOKEN_NAME, 'abc');

    const user = {
      loginId: '1',
      userId: 'user001',
      userName: 'いち',
      lang: 'ja',
      timeZone: 'Asia/Tokyo',
      homePage: '/',
      authorities: [
        AuthorityTypes.COMPANY_SEARCH,
        AuthorityTypes.STORE_SEARCH,
        AuthorityTypes.MAP_SEARCH,
      ],
      employee: {
        jurisdictionClass: '1',
        zoneCode: '2',
        doCode: '3',
        employeeCode: '4',
        employeeName: 'よん',
      },
    };

    const expected = true;
    const actual = SecurityUtil.hasAnyAuthority(user, [
      AuthorityTypes.COMPANY_SEARCH,
    ]);

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });
});
