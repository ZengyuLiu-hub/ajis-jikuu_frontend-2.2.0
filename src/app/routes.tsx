import { RouteProps, Routes, Route, BrowserRouter } from 'react-router-dom';

import { RouteAuthGuard } from '../containers/organisms';
import {
  PageNotFound,
  Login,
  MapVersionSearch,
  MapEditor,
  MapViewer,
  StoreSearch,
  MapEditorCompareLocationResult,
} from '../containers/pages';

import * as routerConstants from '../constants/router';
import { AuthorityTypes } from '../types';
import { CompanySearch } from '../containers/pages/CompanySearch';
const routeData: RouteProps[] = [
  //  トップ
  {
    path: '/',
    element: (
      <RouteAuthGuard
        component={<CompanySearch />}
        redirect="/login"
        allowAuthorities={[AuthorityTypes.COMPANY_SEARCH]}
      />
    ),
  },
  // 添加企业信息检索路由
  {
    path: routerConstants.PATH_COMPANIES,
    element: (
      <RouteAuthGuard
        component={<CompanySearch />}
        redirect="/login"
        allowAuthorities={[AuthorityTypes.COMPANY_SEARCH]}
      />
    ),
  },
 
  // ログイン
  {
    path: routerConstants.PATH_LOGIN,
    element: <Login />,
  },
  // 店舗一覧
  {
    path: routerConstants.PATH_STORES,
    element: (
      <RouteAuthGuard
        component={<StoreSearch />}
        redirect="/login"
        allowAuthorities={[AuthorityTypes.STORE_SEARCH]}
      />
    ),
  },
  // マップ版数一覧
  {
    path: `${routerConstants.PATH_COMPANIES}/:companyCode/stores/:storeCode`,
    element: (
      <RouteAuthGuard
        component={<MapVersionSearch />}
        redirect="/login"
        allowAuthorities={[AuthorityTypes.MAP_SEARCH]}
      />
    ),
  },
  // マップエディター
  {
    path: `${routerConstants.PATH_MAPS}/:mapId/versions/:version`,
    element: (
      <RouteAuthGuard
        component={<MapEditor />}
        redirect="/login"
        allowAuthorities={[AuthorityTypes.MAP_VIEW]}
      />
    ),
  },
  // マップビューア
  {
    path: `${routerConstants.PATH_VIEWS}/:mapId/versions/:version`,
    element: (
      <RouteAuthGuard
        component={<MapViewer />}
        redirect="/login"
        allowAuthorities={[AuthorityTypes.MAP_VIEW]}
      />
    ),
  },
  // ロケーション比較結果一覧
  {
    path: `${routerConstants.PATH_COMPARE_LOCATIONS}/:token`,
    element: (
      <RouteAuthGuard
        component={<MapEditorCompareLocationResult />}
        redirect="/login"
        allowAuthorities={[]}
      />
    ),
  },
  {
    path: '*',
    element: <PageNotFound />,
  },
 ];

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {routeData.map((route, i) => {
          return <Route key={i} {...route} />;
        })}
      </Routes>
    </BrowserRouter>
  );
};
