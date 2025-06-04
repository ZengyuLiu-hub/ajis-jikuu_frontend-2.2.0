// src/containers/pages/CompanySearch.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../app/hooks';
import {  Jurisdiction } from '../../types';
import { useCompanyData, useCompanyTotalHits } from '../../selectors/company';
import { appModule } from '../../modules';
import {
  PageCondition,
  PageEvent,
  SearchCondition,
  SearchConditionEvent,
  CompanySearch as Component,
} from '../../components/pages/CompanySearch';
import {
  actionHelper,
  searchJurisdictions,
  verifyAuthentication,
} from '../../actions';
import { useUser } from '../../selectors';
import * as RV from 'react-virtualized';
import * as appConstants from '../../constants/app';
import { SearchCompaniesCondition } from '../../api/company';
import { searchCompanies } from '../../actions/company';
export const CompanySearch = () => {
  const dispatch = useAppDispatch();
  const [t] = useTranslation();
  const user = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const totalHits = useCompanyTotalHits();

  const companyData = useCompanyData();
  const [stateHistories, setStateHistories] = useState<any[]>([]);
  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>([]);
// 初期値
  const initialData: SearchCondition = {
    // jurisdictionClass: user.employee.jurisdictionClass,
    jurisdictionClass: '',
    companyCode: '',
    companyName: '',
  };
  const [errors, setErrors] = useState(new Map<string, string>());
  const resetErrors = (errors = {}) =>
    setErrors(new Map<string, string>(Object.entries(errors)));

  // 搜索条件状态
  const [jurisdictionClass, setJurisdictionClass] = useState(
      initialData.jurisdictionClass,
    );
  const [companyCode, setCompanyCode] = useState(initialData.companyCode);
  const [companyName, setCompanyName] = useState(initialData.companyName);
  // 1ページの表示件数
  const [pageRecords, setPageRecords] = useState(10);
  // 現在のページ番号
  const [currentPage, setCurrentPage] = useState(1);
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
    const condition: SearchCompaniesCondition = {
      jurisdictionClass,
      companyCode,
      companyName,
      page,
      pageRecords,
    };
    await dispatch(
      searchCompanies(
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

  const columns: RV.ColumnProps[] = [
    {
      label: t('pages:CompanySearch.dataTable.jurisdictionClass.label'),
      dataKey: 'jurisdictionName',
      cellDataGetter: ({ rowData }: any) => rowData.jurisdictionName,
      width: 300,
    },
    {
      label: t('pages:CompanySearch.dataTable.companyCode.label'),
      dataKey: 'companyCode',
      cellDataGetter: ({ rowData }: any) => rowData.companyCode,
      width: 300,
    },
    {
      label: t('pages:CompanySearch.dataTable.companyName.label'),
      dataKey: 'companyName',
      cellDataGetter: ({ rowData }: any) => rowData.companyName,
      width: 300,
      flexGrow: 1,
    },
  ];


  const searchCondition: SearchCondition = {
    jurisdictionClass,
    companyCode,
    companyName,
  };

  const searchConditionEvent: SearchConditionEvent = {
    onBlurCompanyCode: setCompanyCode,
    onChangeCompanyName: setCompanyName,
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

  const data = useMemo(() => companyData, [companyData]);

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
          pageRecords = 10,
          currentPage: page = 1,
        } = payload.condition;

        setJurisdictionClass(jurisdictionClass);
        setCompanyCode(companyCode);
        setCompanyName(companyName);
        setPageRecords(pageRecords);
        setCurrentPage(page);

        // 検索
        await dispatch(
          searchCompanies({
            jurisdictionClass,
            companyCode,
            companyName,
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
        title={t('pages:CompanySearch.title')}
        columns={columns}
        data={data}
        searchCondition={searchCondition}
        searchConditionEvent={searchConditionEvent}
        errors={errors}
        onClickSearch={handleClickSearch}
        onClickClearSearchCondition={handleClickClearSearchCondition}
        pageCondition={pageCondition}
        pageEvent={pageEvent}
      />
    </>
  );
};