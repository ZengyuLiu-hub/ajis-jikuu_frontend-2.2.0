import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as RV from 'react-virtualized';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import * as appConstants from '../../constants/app';
import * as routerConstants from '../../constants/router';

import { SecurityUtil } from '../../utils/SecurityUtil';

import { useAppDispatch } from '../../app/hooks';
import { AuthorityTypes, Jurisdiction, Store } from '../../types';

import { SearchStoresCondition } from '../../api';
import {
  actionHelper,
  searchJurisdictions,
  searchStores,
  verifyAuthentication,
} from '../../actions';
import { appModule } from '../../modules';
import { useStoreData, useStoreTotalHits, useUser } from '../../selectors';

import { Button } from '../../components/atoms';
import {
  PageCondition,
  PageEvent,
  SearchCondition,
  SearchConditionEvent,
  StoreSearch as Component,
} from '../../components/pages/StoreSearch';

const VersionSizeCell = styled.div`
  display: flex;
  justify-content: right;
  width: 100%;
`;

const OperationCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  > Button + Button {
    margin-left: 5px;
  }
`;

export const StoreSearch = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();
  const [t] = useTranslation();

  const user = useUser();

  const storeData = useStoreData();
  const totalHits = useStoreTotalHits();

  const [errors, setErrors] = useState(new Map<string, string>());
  const resetErrors = (errors = {}) =>
    setErrors(new Map<string, string>(Object.entries(errors)));

  const [stateHistories, setStateHistories] = useState<any[]>([]);
  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>([]);

  // 初期値
  const initialData: SearchCondition = {
    jurisdictionClass: user.employee.jurisdictionClass,
    companyCode: '',
    companyName: '',
    storeCode: '',
    storeName: '',
    storeName2: '',
  };

  // 検索条件
  const [jurisdictionClass, setJurisdictionClass] = useState(
    initialData.jurisdictionClass,
  );
  const [companyCode, setCompanyCode] = useState(initialData.companyCode);
  const [companyName, setCompanyName] = useState(initialData.companyName);
  const [storeCode, setStoreCode] = useState(initialData.storeCode);
  const [storeName, setStoreName] = useState(initialData.storeName);
  const [storeName2, setStoreName2] = useState(initialData.storeName2);
  // 1ページの表示件数
  const [pageRecords, setPageRecords] = useState(10);
  const handleChangePageRecords = async (records: number) => {
    dispatch(appModule.actions.updateLoading(true));

    await dispatch(
      verifyAuthentication(async () => {
        // ページ番号
        setCurrentPage(1);

        // 1ページの表示件数
        setPageRecords(records);

        // 再検索
        await executeSearch(1, records);

        dispatch(appModule.actions.updateLoading(false));
      }),
    );
  };

  // 現在のページ番号
  const [currentPage, setCurrentPage] = useState(1);
  const handleChangeCurrentPage = async (page: number) => {
    dispatch(appModule.actions.updateLoading(true));

    await dispatch(
      verifyAuthentication(async () => {
        // ページ番号
        setCurrentPage(page);

        // 再検索
        await executeSearch(page, pageRecords);

        dispatch(appModule.actions.updateLoading(false));
      }),
    );
  };

  // 検索
  const executeSearch = async (page: number, pageRecords: number) => {
    const condition: SearchStoresCondition = {
      jurisdictionClass,
      companyCode,
      companyName,
      storeCode,
      storeName,
      storeName2,
      page,
      pageRecords,
    };
    await dispatch(
      searchStores(
        condition,
        () => resetErrors(),
        ({ e, result }) => {
          if (result) {
            resetErrors(result?.errors);

            dispatch(appModule.actions.updateLoading(false));
          } else {
            actionHelper.showErrorDialog(e, dispatch);
          }
        },
      ),
    );
  };

  // 検索ボタン押下
  const handleClickSearch = async () => {
    dispatch(appModule.actions.updateLoading(true));

    await dispatch(
      verifyAuthentication(async () => {
        // ページ番号
        setCurrentPage(1);

        // 検索
        await executeSearch(1, pageRecords);

        dispatch(appModule.actions.updateLoading(false));
      }),
    );
  };

  // 検索条件クリアボタン押下
  const handleClickClearSearchCondition = (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setJurisdictionClass(initialData.jurisdictionClass);
    setCompanyCode(initialData.companyCode);
    setCompanyName(initialData.companyName);
    setStoreCode(initialData.storeCode);
    setStoreName(initialData.storeName);
    setStoreName2(initialData.storeName2);
  };

  const navigateTo = async (to: string) => {
    dispatch(appModule.actions.updateLoading(true));

    dispatch(
      verifyAuthentication(() => {
        navigate(to, {
          state: {
            stateHistories: [
              ...stateHistories.slice(0, -1),
              {
                referer: location.pathname,
                payload: {
                  condition: {
                    jurisdictionClass,
                    companyCode,
                    companyName,
                    storeCode,
                    storeName,
                    storeName2,
                    currentPage,
                    pageRecords,
                  },
                },
              },
            ],
          },
        });
      }),
    );
  };

  const versionSizeRenderer: RV.TableCellRenderer = ({ rowData }) => {
    const { versionSize } = rowData as Store;
    return (
      <VersionSizeCell>{numberFormat.format(versionSize)}</VersionSizeCell>
    );
  };

  const operationRenderer: RV.TableCellRenderer = ({ rowData }) => {
    const data = rowData as Store;

    return (
      <OperationCell>
        <Button
          onClick={() =>
            navigateTo(
              `${routerConstants.PATH_COMPANIES}/${data.companyCode}/stores/${data.storeCode}?jc=${data.jurisdictionClass}`,
            )
          }
          disabled={
            !SecurityUtil.hasAnyAuthority(user, [AuthorityTypes.MAP_SEARCH])
          }
        >
          {t('pages:StoreSearch.dataTable.operation.select')}
        </Button>
      </OperationCell>
    );
  };

  const numberFormat: Intl.NumberFormat = new Intl.NumberFormat('ja');

  const columns: RV.ColumnProps[] = [
    {
      label: t('pages:StoreSearch.dataTable.jurisdictionClass.label'),
      dataKey: 'jurisdictionName',
      cellDataGetter: ({ rowData }: any) => rowData.jurisdictionName,
      width: 100,
    },
    {
      label: t('pages:StoreSearch.dataTable.companyCode.label'),
      dataKey: 'companyCode',
      cellDataGetter: ({ rowData }: any) => rowData.companyCode,
      width: 100,
    },
    {
      label: t('pages:StoreSearch.dataTable.companyName.label'),
      dataKey: 'companyName',
      cellDataGetter: ({ rowData }: any) => rowData.companyName,
      width: 150,
      flexGrow: 1,
    },
    {
      label: t('pages:StoreSearch.dataTable.storeCode.label'),
      dataKey: 'storeCode',
      cellDataGetter: ({ rowData }: any) => rowData.storeCode,
      width: 100,
    },
    {
      label: t('pages:StoreSearch.dataTable.storeName.label'),
      dataKey: 'storeName',
      cellDataGetter: ({ rowData }: any) => rowData.storeName,
      width: 150,
      flexGrow: 1,
    },
    {
      label: t('pages:StoreSearch.dataTable.versions.label'),
      dataKey: 'versionSize',
      cellRenderer: versionSizeRenderer,
      width: 100,
    },
    {
      label: t('pages:StoreSearch.dataTable.operation.label'),
      dataKey: 'operation',
      cellRenderer: operationRenderer,
      disableSort: true,
      width: 100,
    },
  ];

  const searchCondition: SearchCondition = {
    jurisdictionClass,
    companyCode,
    companyName,
    storeCode,
    storeName,
    storeName2,
  };

  const searchConditionEvent: SearchConditionEvent = {
    onChangeJurisdictionClass: setJurisdictionClass,
    onBlurCompanyCode: setCompanyCode,
    onChangeCompanyName: setCompanyName,
    onBlurStoreCode: setStoreCode,
    onChangeStoreName: setStoreName,
    onChangeStoreName2: setStoreName2,
  };

  const pageCondition: PageCondition = {
    totalHits,
    pageRecordsList: appConstants.PAGE_RECORDS_LIST,
    pageRecords,
    displayPageSize: 5,
    currentPage,
  };

  const pageEvent: PageEvent = {
    onChangePageRecords: handleChangePageRecords,
    onChangeCurrentPage: handleChangeCurrentPage,
  };

  const data = useMemo(() => storeData, [storeData]);

  // Load, Unload 処理
  useEffect(() => {
    (async () => {
      dispatch(appModule.actions.updateLoading(true));

      await dispatch(
        searchJurisdictions((result) => setJurisdictions(result.data)),
      );

      const histories = location?.state?.stateHistories ?? [];
      if (histories.length === 0) {
        // 検索
        await executeSearch(currentPage, pageRecords);

        dispatch(appModule.actions.updateLoading(false));
        return;
      }

      const { referer, payload } = histories.slice(-1)[0];
      if (payload?.condition && referer === location.pathname) {
        setStateHistories(histories.slice(0, -1));

        const {
          jurisdictionClass,
          companyCode,
          companyName,
          storeCode,
          storeName,
          storeName2,
          pageRecords = 10,
          currentPage: page = 1,
        } = payload.condition;

        setJurisdictionClass(jurisdictionClass);
        setCompanyCode(companyCode);
        setCompanyName(companyName);
        setStoreCode(storeCode);
        setStoreName(storeName);
        setStoreName2(storeName2);
        setPageRecords(pageRecords);
        setCurrentPage(page);

        // 検索
        await dispatch(
          searchStores({
            jurisdictionClass,
            companyCode,
            companyName,
            storeCode,
            storeName,
            storeName2,
            page,
            pageRecords: pageRecords,
          }),
        );
      } else {
        setStateHistories(histories);

        // 検索
        await executeSearch(currentPage, pageRecords);
      }

      dispatch(appModule.actions.updateLoading(false));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Component
        title={t('pages:StoreSearch.title')}
        jurisdictions={jurisdictions}
        columns={columns}
        data={data}
        searchCondition={searchCondition}
        searchConditionEvent={searchConditionEvent}
        errors={errors}
        canJurisdictionSelect={SecurityUtil.hasAnyAuthority(user, [
          AuthorityTypes.JURISDICTION_SELECT,
        ])}
        onClickSearch={handleClickSearch}
        onClickClearSearchCondition={handleClickClearSearchCondition}
        pageCondition={pageCondition}
        pageEvent={pageEvent}
      />
    </>
  );
};
