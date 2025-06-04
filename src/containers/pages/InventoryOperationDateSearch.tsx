import { useEffect, useMemo, useReducer, useState } from 'react';
import ReactModal from 'react-modal';
import * as RV from 'react-virtualized';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import dayjs from 'dayjs';

import * as appConstants from '../../constants/app';
import { AuthorityTypes, Jurisdiction } from '../../types';
import { SecurityUtil } from '../../utils';
import { useAppDispatch } from '../../app/hooks';

import { appModule } from '../../modules';
import {
  useEditMapVersion,
  useInventoryOperationDates,
  useInventoryOperationDateTotalHits,
  useUser,
} from '../../selectors';
import {
  actionHelper,
  searchInventoryOperationDates,
  searchJurisdictions,
  verifyAuthentication,
} from '../../actions';

import { RadioButton } from '../../components/atoms';
import {
  InventoryOperationDateSearch as Component,
  PageCondition,
  PageEvent,
  SearchCondition,
} from '../../components/pages/InventoryOperationDateSearch';

const RadioCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

// 初期状態
const initialState: SearchCondition = {
  jurisdictionClass: '',
  companyCode: '',
  companyName: '',
  storeCode: '',
  storeName: '',
  inventoryDateFrom: undefined,
  inventoryDateTo: undefined,
};

type SelectedRow = {
  jurisdictionClass: string;
  companyCode: string;
  storeCode: string;
  inventoryDate: Date;
};

interface Props extends ReactModal.Props {
  onClickSelect: (value: any) => void;
}

/**
 * ロケーション比較用データ検索.
 *
 * @param props プロパティ
 * @returns {React.ReactElement} ReactElement
 */
export const InventoryOperationDateSearch = (
  props: Props,
): React.ReactElement => {
  const [t] = useTranslation();
  const dispatch = useAppDispatch();

  const user = useUser();
  const editMapVersion = useEditMapVersion();
  const inventoryOperationDates = useInventoryOperationDates();
  const totalHits = useInventoryOperationDateTotalHits();

  const [errors, setErrors] = useState(new Map<string, string>());
  const resetErrors = (errors = {}) =>
    setErrors(new Map<string, string>(Object.entries(errors)));

  // プルダウン選択肢
  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>([]);

  // 検索条件
  const [searchCondition, searchConditionEvent] = useReducer(
    (prev: SearchCondition, next: any) => {
      return { ...prev, ...next };
    },
    initialState,
  );

  // 1ページの表示件数
  const [pageRecords, setPageRecords] = useState(10);

  // 現在のページ番号
  const [currentPage, setCurrentPage] = useState(1);

  // 選択行
  const [selectedRow, setSelectedRow] = useState<SelectedRow>();

  // 検索
  const executeSearch = async (parameter: {
    condition?: SearchCondition;
    page: number;
    records?: number;
  }) => {
    const {
      condition = searchCondition,
      page,
      records = pageRecords,
    } = parameter;
    await dispatch(
      searchInventoryOperationDates(
        { ...condition, page, pageRecords: records },
        ({ data }) => {
          resetErrors();
          if (data.length === 0) {
            setSelectedRow(undefined);
            dispatch(appModule.actions.updateLoading(false));
            return;
          }
          const [first] = data;
          setSelectedRow(first);

          dispatch(appModule.actions.updateLoading(false));
        },
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

  // 1ページの表示件数
  const handleChangePageRecords = async (records: number) => {
    dispatch(appModule.actions.updateLoading(true));

    await dispatch(
      verifyAuthentication(async () => {
        // ページ番号
        setCurrentPage(1);

        // 1ページの表示件数
        setPageRecords(records);

        // 検索
        await executeSearch({ page: 1, records });
      }),
    );
  };

  // 現在のページ番号
  const handleChangeCurrentPage = async (page: number) => {
    dispatch(appModule.actions.updateLoading(true));

    await dispatch(
      verifyAuthentication(async () => {
        setCurrentPage(page);

        // 検索
        await executeSearch({ page });
      }),
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
        await executeSearch({ page: 1 });
      }),
    );
  };

  // クリアボタン押下
  const handleClickClear = () => {
    searchConditionEvent({
      ...initialState,
      jurisdictionClass: user.employee.jurisdictionClass,
    });
  };

  // キャンセルボタン押下
  const handleClickCancel = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (props.onRequestClose) {
      props.onRequestClose(e);
    }
  };

  // 選択ボタン押下
  const handleClickSubmit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (selectedRow) {
      props.onClickSelect(selectedRow);
    }
  };

  const columns: RV.ColumnProps[] = [
    {
      label: t('pages:InventoryOperationDateSearch.dataTable.operation.label'),
      dataKey: 'operation',
      cellRenderer: ({ rowData }) => (
        <RadioCell>
          <RadioButton
            name="InventoryOperationDateSearch.selection"
            onChange={() => setSelectedRow(rowData)}
            checked={
              rowData.jurisdictionClass === selectedRow?.jurisdictionClass &&
              rowData.companyCode === selectedRow?.companyCode &&
              rowData.storeCode === selectedRow?.storeCode &&
              rowData.inventoryDate === selectedRow?.inventoryDate
            }
          />
        </RadioCell>
      ),
      disableSort: true,
      width: 65,
    },
    {
      label: t(
        'pages:InventoryOperationDateSearch.dataTable.jurisdictionClass.label',
      ),
      dataKey: 'jurisdictionName',
      cellDataGetter: ({ rowData }) => rowData.jurisdictionName,
      width: 80,
    },
    {
      label: t(
        'pages:InventoryOperationDateSearch.dataTable.companyCode.label',
      ),
      dataKey: 'companyCode',
      cellDataGetter: ({ rowData }) => rowData.companyCode,
      width: 100,
    },
    {
      label: t(
        'pages:InventoryOperationDateSearch.dataTable.companyName.label',
      ),
      dataKey: 'companyName',
      cellDataGetter: ({ rowData }) => rowData.companyName,
      width: 100,
      flexGrow: 1,
    },
    {
      label: t('pages:InventoryOperationDateSearch.dataTable.storeCode.label'),
      dataKey: 'storeCode',
      cellDataGetter: ({ rowData }) => rowData.storeCode,
      width: 100,
    },
    {
      label: t('pages:InventoryOperationDateSearch.dataTable.storeName.label'),
      dataKey: 'storeName',
      cellDataGetter: ({ rowData }) => rowData.storeName,
      width: 100,
      flexGrow: 1,
    },
    {
      label: t(
        'pages:InventoryOperationDateSearch.dataTable.inventoryDate.label',
      ),
      dataKey: 'inventoryDate',
      cellDataGetter: ({ rowData }) =>
        dayjs(rowData.inventoryDate).format(
          `${t(
            'pages:MapEditorCompareLocationResult.condition.inventoryDate.format',
          )}`,
        ),
      width: 100,
    },
  ];

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

  const data = useMemo(
    () => inventoryOperationDates,
    [inventoryOperationDates],
  );

  useEffect(() => {
    if (!props.isOpen) {
      return;
    }

    // 初期値
    const initialData: SearchCondition = {
      jurisdictionClass: editMapVersion.jurisdictionClass,
      companyCode: editMapVersion.companyCode,
      companyName: editMapVersion.companyName,
      storeCode: editMapVersion.storeCode,
      storeName: editMapVersion.storeName,
      inventoryDateFrom: undefined,
      inventoryDateTo: undefined,
    };

    searchConditionEvent({ ...initialData });

    (async () => {
      dispatch(appModule.actions.updateLoading(true));

      await dispatch(searchJurisdictions(({ data }) => setJurisdictions(data)));

      await executeSearch({ condition: initialData, page: 1 });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isOpen]);

  return (
    <Component
      {...props}
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
      onClickClear={handleClickClear}
      pageCondition={pageCondition}
      pageEvent={pageEvent}
      onClickCancel={handleClickCancel}
      onChangeSelectedRow={setSelectedRow}
      selectedRow={selectedRow}
      onClickSubmit={handleClickSubmit}
    />
  );
};
