import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import * as RV from 'react-virtualized';
import styled from 'styled-components';

import * as appConstants from '../../constants/app';
import * as routerConstants from '../../constants/router';

import {
  AlertDialogData,
  AuthorityTypes,
  DialogTypes,
  InventoryDatesData,
  MapStore,
} from '../../types';
import { DateTimeUtil, SecurityUtil } from '../../utils';

import {
  actionHelper,
  copyMapVersion,
  deleteMapVersion,
  searchInventories,
  searchStore,
  verifyAuthentication,
} from '../../actions';
import { useAppDispatch } from '../../app/hooks';
import { AuthenticationError, ExpiredAccessTokenError } from '../../app/http';
import { appModule, authModule, mapVersionModule } from '../../modules';
import {
  useMapVersionData,
  useMapVersionTotalHits,
  useUser,
} from '../../selectors';

import { Button } from '../../components/atoms';
import {
  DestinationData as MapVersionCopyDestination,
  SourceData as MapVersionCopySource,
} from '../../components/pages/MapVersionCopy';
import {
  MapVersionSearch as Component,
  PageCondition,
  PageEvent,
  SearchCondition,
  SearchConditionEvent,
} from '../../components/pages/MapVersionSearch';
import { MapVersionCopy, MapVersionCreate } from '../pages';
import { MapCreateVersion } from './MapVersionCreate';

const VersionCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  text-decoration: underline;
  cursor: pointer;
`;

const TextCell = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const OperationCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  > a + Button,
  Button + Button {
    margin-left: 5px;
  }
`;

const EditButton = styled(Button)`
  background-color: rgba(230, 230, 230, 1);
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='48' viewBox='0 -960 960 960' width='48'%3E%3Cpath d='M180-180h44l443-443-44-44-443 443v44Zm614-486L666-794l42-42q17-17 42-17t42 17l44 44q17 17 17 42t-17 42l-42 42Zm-42 42L248-120H120v-128l504-504 128 128Zm-107-21-22-22 44 44-22-22Z'/%3E%3C/svg%3E");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 24px 24px;
  width: 28px;
  height: 28px;

  &:hover {
    background-color: rgba(183, 183, 183, 1);
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='48' viewBox='0 -960 960 960' width='48'%3E%3Cpath d='M180-180h44l443-443-44-44-443 443v44Zm614-486L666-794l42-42q17-17 42-17t42 17l44 44q17 17 17 42t-17 42l-42 42Zm-42 42L248-120H120v-128l504-504 128 128Zm-107-21-22-22 44 44-22-22Z'/%3E%3C/svg%3E");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 24px 24px;

    &:disabled {
      background-color: rgba(183, 183, 183, 1);
      background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='48' viewBox='0 -960 960 960' width='48'%3E%3Cpath d='M180-180h44l443-443-44-44-443 443v44Zm614-486L666-794l42-42q17-17 42-17t42 17l44 44q17 17 17 42t-17 42l-42 42Zm-42 42L248-120H120v-128l504-504 128 128Zm-107-21-22-22 44 44-22-22Z'/%3E%3C/svg%3E");
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 24px 24px;
    }
  }
`;

const CopyButton = styled(Button)`
  background-color: rgba(230, 230, 230, 1);
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='48' viewBox='0 -960 960 960' width='48'%3E%3Cpath d='M180-81q-24 0-42-18t-18-42v-603h60v603h474v60H180Zm120-120q-24 0-42-18t-18-42v-560q0-24 18-42t42-18h440q24 0 42 18t18 42v560q0 24-18 42t-42 18H300Zm0-60h440v-560H300v560Zm0 0v-560 560Z'/%3E%3C/svg%3E");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 24px 24px;
  width: 28px;
  height: 28px;

  &:hover {
    background-color: rgba(183, 183, 183, 1);
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='48' viewBox='0 -960 960 960' width='48'%3E%3Cpath d='M180-81q-24 0-42-18t-18-42v-603h60v603h474v60H180Zm120-120q-24 0-42-18t-18-42v-560q0-24 18-42t42-18h440q24 0 42 18t18 42v560q0 24-18 42t-42 18H300Zm0-60h440v-560H300v560Zm0 0v-560 560Z'/%3E%3C/svg%3E");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 24px 24px;

    &:disabled {
      background-color: rgba(183, 183, 183, 1);
      background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='48' viewBox='0 -960 960 960' width='48'%3E%3Cpath d='M180-81q-24 0-42-18t-18-42v-603h60v603h474v60H180Zm120-120q-24 0-42-18t-18-42v-560q0-24 18-42t42-18h440q24 0 42 18t18 42v560q0 24-18 42t-42 18H300Zm0-60h440v-560H300v560Zm0 0v-560 560Z'/%3E%3C/svg%3E");
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 24px 24px;
    }
  }
`;

const DeleteButton = styled(Button)`
  background-color: rgba(230, 230, 230, 1);
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='48' viewBox='0 -960 960 960' width='48'%3E%3Cpath d='M261-120q-24.75 0-42.375-17.625T201-180v-570h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm438-630H261v570h438v-570ZM367-266h60v-399h-60v399Zm166 0h60v-399h-60v399ZM261-750v570-570Z'/%3E%3C/svg%3E");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 24px 24px;
  width: 28px;
  height: 28px;

  &:hover {
    background-color: rgba(183, 183, 183, 1);
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='48' viewBox='0 -960 960 960' width='48'%3E%3Cpath d='M261-120q-24.75 0-42.375-17.625T201-180v-570h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm438-630H261v570h438v-570ZM367-266h60v-399h-60v399Zm166 0h60v-399h-60v399ZM261-750v570-570Z'/%3E%3C/svg%3E");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 24px 24px;

    &:disabled {
      background-color: rgba(183, 183, 183, 1);
      background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='48' viewBox='0 -960 960 960' width='48'%3E%3Cpath d='M261-120q-24.75 0-42.375-17.625T201-180v-570h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm438-630H261v570h438v-570ZM367-266h60v-399h-60v399Zm166 0h60v-399h-60v399ZM261-750v570-570Z'/%3E%3C/svg%3E");
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 24px 24px;
    }
  }
`;

const initialMapStore = {
  jurisdictionClass: '',
  jurisdictionName: '',
  companyCode: '',
  companyName: '',
  storeCode: '',
  storeName: '',
  zipCode: '',
  address1: '',
  address2: '',
  addressDetail: '',
  tel: '',
  fax: '',
};

type MapDeleteVersion = {
  mapId: string;
  version: number;
  rowVersion: number;
};

/**
 * 版数一覧
 *
 * @returns {React.ReactElement} ReactElement
 */
export const MapVersionSearch = (): React.ReactElement => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const jurisdictionClass = searchParams.get('jc') ?? '';
  const { companyCode = '', storeCode = '' } = useParams<{
    companyCode: string;
    storeCode: string;
  }>();
  const [t] = useTranslation();

  const user = useUser();

  const searchData = useMapVersionData();
  const totalHits = useMapVersionTotalHits();

  const [stateHistories, setStateHistories] = useState<any[]>([]);
  const [enableBackButton, setEnableBackButton] = useState<boolean>(false);
  const [errors, setErrors] = useState(new Map<string, string>());
  const resetErrors = (errors = {}) =>
    setErrors(new Map<string, string>(Object.entries(errors)));

  // マップ作成モーダルに関する状態
  const [createMapVersionOpen, setCreateMapVersionOpen] = useState(false);
  const closeCreateMapVersion = useCallback(
    () => setCreateMapVersionOpen(false),
    [],
  );

  const [copyMapVersionOpen, setCopyMapVersionOpen] = useState(false);
  const closeCopyMapVersionOpen = useCallback(() => {
    setCopyMapVersionOpen(false);
    setErrors(new Map<string, string>());
  }, []);

  const [selectedMapVersion, setSelectedMapVersion] =
    useState<MapCreateVersion>({});
  const [mapVersionCopySource, setMapVersionCopySource] =
    useState<MapVersionCopySource>({
      mapId: '',
      version: 0,
      jurisdictionClass,
      jurisdictionName: '',
      companyCode: companyCode,
      companyName: '',
      storeCode: storeCode,
      storeName: '',
      zoneCode: '',
      zoneName: '',
      doCode: '',
      doName: '',
    });

  // マップ店舗に関する情報
  const [mapStore, setMapStore] = useState<MapStore>({
    ...initialMapStore,
    jurisdictionClass,
    companyCode,
    storeCode,
  });
  const buildMapStore = ({
    jurisdictionClass,
    jurisdictionName = '',
    companyCode,
    companyName = '',
    storeCode,
    storeName = '',
    zipCode = '',
    address1 = '',
    address2 = '',
    addressDetail = '',
    tel = '',
    fax = '',
  }: MapStore = initialMapStore) => ({
    jurisdictionClass,
    jurisdictionName,
    companyCode,
    companyName,
    storeCode,
    storeName,
    zipCode,
    address1,
    address2,
    addressDetail,
    tel,
    fax,
  });

  // 検索条件
  const [inventoryDateFrom, setInventoryDateFrom] = useState<Date>();
  const [inventoryDateTo, setInventoryDateTo] = useState<Date>();
  const [linkedSchedule, setLinkedSchedule] = useState<boolean>(false);

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

  // 戻るボタン押下
  const handleClickBackButton = async () => {
    dispatch(appModule.actions.updateLoading(true));

    await dispatch(
      verifyAuthentication(() => {
        // キャッシュクリア
        dispatch(mapVersionModule.actions.setData([]));
        dispatch(mapVersionModule.actions.setHits(0));

        if (stateHistories.length > 0) {
          const { referer } = stateHistories.slice(-1)[0];
          navigate(referer, { state: { stateHistories }, replace: true });
          return;
        }
        navigate(-1);
      }),
    );
  };

  // マップ作成
  const handleClickCreate = (mapVersion: MapCreateVersion) => {
    setSelectedMapVersion(mapVersion);
    setCreateMapVersionOpen(true);
  };

  // マップコピー
  const handleClickCopy = (source: MapVersionCopySource) => {
    setMapVersionCopySource(source);
    setCopyMapVersionOpen(true);
  };

  // マップ版数削除処理
  const executeDelete = async (mapVersion: MapDeleteVersion) => {
    dispatch(appModule.actions.updateLoading(true));

    await dispatch(
      deleteMapVersion(
        { ...mapVersion },
        ({ data }) => {
          dispatch(appModule.actions.updateLoading(false));

          if (!data.mapId || !data.version) {
            console.error('Incorrect result.');
            return;
          }
          dispatch(
            appModule.actions.updateAlertDialog({
              type: DialogTypes.INFORMATION,
              message: t('pages:MapVersions.message.information.delete'),
              positiveAction: async () => await handleChangeCurrentPage(1),
            }),
          );
        },
        ({ e, result }) => {
          if (!result) {
            actionHelper.showErrorDialog(e, dispatch);
            return;
          }

          const { error } = result;
          dispatch(
            appModule.actions.updateAlertDialog({
              type: DialogTypes.ERROR,
              message: `${error}`,
            }),
          );

          dispatch(appModule.actions.updateLoading(false));
        },
      ),
    );
  };

  // マップ版数削除
  const handleClickDelete = (mapVersion: MapDeleteVersion) => {
    dispatch(
      appModule.actions.updateAlertDialog({
        type: DialogTypes.CONFIRM,
        message: t('pages:MapVersions.message.confirm.delete', {
          version: mapVersion.version,
        }),
        positiveAction: async () => await executeDelete(mapVersion),
      }),
    );
  };

  // マップ作成モーダルクローズ及び再検索
  const closeCreateMapVersionAndResearch = async () => {
    // マップ作成モーダルクローズ
    closeCreateMapVersion();

    dispatch(appModule.actions.updateLoading(true));

    // 再検索
    await executeSearch(currentPage, pageRecords);

    dispatch(appModule.actions.updateLoading(false));
  };

  // コピー実行
  const handleExecuteCopy = async (destination: MapVersionCopyDestination) => {
    dispatch(appModule.actions.updateLoading(true));

    await dispatch(
      copyMapVersion(
        { ...destination },
        async () => {
          // コピー先が他店舗の場合は、表示切替
          if (
            destination.jurisdictionClass === mapStore.jurisdictionClass &&
            destination.companyCode === mapStore.companyCode &&
            destination.storeCode === mapStore.storeCode
          ) {
            // 自店舗の場合は、表示を更新
            await executeSearch(currentPage, pageRecords);

            dispatch(appModule.actions.updateLoading(false));
          } else {
            // コピー先が他店舗（他企業含む）の場合は、表示切替
            navigate(
              `${routerConstants.PATH_COMPANIES}/${destination.companyCode}/stores/${destination.storeCode}?jc=${destination.jurisdictionClass}`,
              {
                state: {
                  currentRoute: true,
                  jurisdictionClass: destination.jurisdictionClass,
                  companyCode: destination.companyCode,
                  storeCode: destination.storeCode,
                },
              },
            );
          }
          closeCopyMapVersionOpen();
        },
        ({ e, result }) => {
          if (result) {
            const { error, errors } = result;
            if (errors) {
              resetErrors(errors);
            } else {
              dispatch(
                appModule.actions.updateAlertDialog({
                  type: DialogTypes.ERROR,
                  message: `${error}`,
                }),
              );
            }

            dispatch(appModule.actions.updateLoading(false));
          } else {
            actionHelper.showErrorDialog(e, dispatch);
          }
        },
      ),
    );
  };

  // 画面移動
  const navigateTo = (to: string) => {
    dispatch(appModule.actions.updateLoading(true));

    dispatch(
      verifyAuthentication(() => {
        navigate(to, {
          state: {
            stateHistories: [
              ...stateHistories,
              {
                referer: `${location.pathname}${location.search}`,
                payload: {
                  condition: {
                    ...mapStore,
                    inventoryDateFrom,
                    inventoryDateTo,
                    linkedSchedule,
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

  // エディタ表示
  const handleViewEditor = ({ mapId, version }: MapCreateVersion) => {
    navigateTo(`${routerConstants.PATH_MAPS}/${mapId}/versions/${version}`);
  };

  // ビューア表示
  const handleViewViewer = ({ mapId, version }: MapCreateVersion) => {
    navigateTo(`${routerConstants.PATH_VIEWS}/${mapId}/versions/${version}`);
  };

  // 検索
  const executeSearch = async (page: number, pageRecords: number) => {
    await dispatch(
      searchInventories({
        ...mapStore,
        inventoryDateFrom,
        inventoryDateTo,
        linkedSchedule,
        page,
        pageRecords,
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
        await executeSearch(1, pageRecords);

        dispatch(appModule.actions.updateLoading(false));
      }),
    );
  };

  // 検索条件クリアボタン押下
  const handleClickClearSearchCondition = () => {
    setInventoryDateFrom(undefined);
    setInventoryDateTo(undefined);
    setLinkedSchedule(false);
  };

  const operationRenderer: RV.TableCellRenderer = ({ rowData }) => {
    const { mapId, version, inventoryDates, rowVersion } = rowData;

    return (
      <OperationCell>
        <EditButton
          title={`${t('pages:MapVersions.dataTable.operation.edit')}`}
          onClick={() => handleClickCreate({ mapId, version })}
          disabled={
            !SecurityUtil.hasAnyAuthority(user, [AuthorityTypes.MAP_EDIT])
          }
        />
        <CopyButton
          title={`${t('pages:MapVersions.dataTable.operation.copy')}`}
          onClick={() =>
            handleClickCopy({
              ...mapStore,
              ...rowData,
              mapId,
              version,
              inventoryDate: inventoryDates?.length > 0 && inventoryDates[0],
            })
          }
          disabled={
            !SecurityUtil.hasAnyAuthority(user, [AuthorityTypes.MAP_COPY])
          }
        />
        <DeleteButton
          title={`${t('pages:MapVersions.dataTable.operation.delete')}`}
          onClick={() => handleClickDelete({ mapId, version, rowVersion })}
          disabled={
            !SecurityUtil.hasAnyAuthority(user, [AuthorityTypes.MAP_DELETE])
          }
        />
      </OperationCell>
    );
  };

  const columns: RV.ColumnProps[] = [
    {
      label: t('pages:MapVersions.dataTable.version.label'),
      dataKey: 'version',
      cellRenderer: ({
        rowData: { mapId, version },
      }: {
        rowData: InventoryDatesData;
      }) => (
        <VersionCell onClick={() => handleViewViewer({ mapId, version })}>
          {version}
        </VersionCell>
      ),
      width: 75,
    },
    {
      label: t('pages:MapVersions.dataTable.zoneCode.label'),
      dataKey: 'zoneCode',
      cellDataGetter: ({ rowData }: any) => rowData.zoneCode,
      width: 100,
    },
    {
      label: t('pages:MapVersions.dataTable.zoneName.label'),
      dataKey: 'zoneName',
      cellDataGetter: ({ rowData }: any) => rowData.zoneName,
      width: 150,
      flexGrow: 1,
    },
    {
      label: t('pages:MapVersions.dataTable.doCode.label'),
      dataKey: 'doCode',
      cellDataGetter: ({ rowData }: any) => rowData.doCode,
      width: 100,
    },
    {
      label: t('pages:MapVersions.dataTable.doName.label'),
      dataKey: 'doName',
      cellDataGetter: ({ rowData }: any) => rowData.doName,
      width: 200,
      flexGrow: 1,
    },
    {
      label: t('pages:MapVersions.dataTable.inventoryDate.label'),
      dataKey: 'firstInventoryDate',
      cellDataGetter: ({ rowData }: any) =>
        rowData.inventoryDates
          ?.map((inventoryDate: Date) =>
            dayjs(inventoryDate).format(
              `${t('pages:MapVersions.dataTable.inventoryDate.format')}`,
            ),
          )
          .join(', '),
      width: 300,
    },
    {
      label: t('pages:MapVersions.dataTable.note.label'),
      dataKey: 'note',
      cellRenderer: ({ rowData }: any) => (
        <TextCell title={rowData.note}>{rowData.note}</TextCell>
      ),
      disableSort: true,
      width: 350,
    },
    {
      label: t('pages:MapVersions.dataTable.updatedById.label'),
      dataKey: 'updatedById',
      cellDataGetter: ({ rowData }: any) => rowData.updatedByName,
      width: 120,
    },
    {
      label: t('pages:MapVersions.dataTable.updatedAt.label'),
      dataKey: 'updatedAt',
      cellDataGetter: ({ rowData }: any) =>
        DateTimeUtil.parseDateToDayjs(rowData.updatedAt, user.timeZone)?.format(
          `${t('pages:MapVersions.dataTable.updatedAt.format')}`,
        ) ?? '',
      width: 150,
    },
    {
      label: t('pages:MapVersions.dataTable.operation.label'),
      dataKey: 'operation',
      cellRenderer: operationRenderer,
      disableSort: true,
      width: 110,
    },
  ];

  const searchCondition: SearchCondition = {
    ...mapStore,
    inventoryDateFrom,
    inventoryDateTo,
    linkedSchedule,
  };

  const searchConditionEvent: SearchConditionEvent = {
    onChangeInventoryDateFrom: setInventoryDateFrom,
    onChangeInventoryDateTo: setInventoryDateTo,
    onChangeLinkedSchedule: setLinkedSchedule,
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

  const data = useMemo(() => searchData, [searchData]);

  /*
   * 自画面で URL が変更された場合
   */
  useEffect(() => {
    const { currentRoute, jurisdictionClass, companyCode, storeCode } =
      location.state ?? {};

    if (!currentRoute) {
      return;
    }

    (async () => {
      dispatch(appModule.actions.updateLoading(true));

      await dispatch(
        searchStore(
          { jurisdictionClass, companyCode, storeCode },
          async ({ data }) => {
            const mapStore = buildMapStore({
              ...data,
              jurisdictionClass,
              companyCode,
              storeCode,
            });
            setMapStore(mapStore);

            // 検索条件初期化
            setInventoryDateFrom(undefined);
            setInventoryDateTo(undefined);
            setLinkedSchedule(false);
            setPageRecords(10);
            setCurrentPage(1);

            // 再検索
            await dispatch(
              searchInventories({
                ...mapStore,
                inventoryDateFrom: undefined,
                inventoryDateTo: undefined,
                linkedSchedule: false,
                page: 1,
                pageRecords: 10,
              }),
            );

            dispatch(appModule.actions.updateLoading(false));
          },
        ),
      );
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // Load, Unload 処理
  useEffect(() => {
    (async () => {
      dispatch(appModule.actions.updateLoading(true));

      await dispatch(
        searchStore({ ...mapStore }, ({ data }) => {
          setMapStore(({ jurisdictionClass, companyCode, storeCode }) =>
            buildMapStore({
              ...data,
              jurisdictionClass,
              companyCode,
              storeCode,
            }),
          );
        }),
      );

      const histories = location?.state?.stateHistories ?? [];
      if (histories.length === 0) {
        await dispatch(
          verifyAuthentication(
            async () => {
              await executeSearch(currentPage, pageRecords);
              dispatch(appModule.actions.updateLoading(false));
            },
            ({ e }) => {
              // 未認証または認証トークンが期限切れの場合は、ログイン画面へ移動
              if (
                e instanceof AuthenticationError ||
                e instanceof ExpiredAccessTokenError
              ) {
                const alertDialogData: AlertDialogData = {
                  type: DialogTypes.ERROR,
                  message: t('messages:error.HTTP401.authenticationFailed'),
                  positiveAction: () =>
                    dispatch(authModule.actions.updateDoLogout(true)),
                };
                dispatch(appModule.actions.updateAlertDialog(alertDialogData));
                dispatch(appModule.actions.updateLoading(false));
              } else {
                actionHelper.showErrorDialog(e, dispatch);
              }
            },
          ),
        );
        return;
      }

      const { referer, payload } = histories.slice(-1)[0];
      setEnableBackButton(!!referer);

      if (payload?.condition && referer.startsWith(location.pathname)) {
        const prevHistories = histories.slice(0, -1);
        setEnableBackButton(prevHistories.length !== 0);

        setStateHistories(prevHistories);

        const {
          inventoryDateFrom,
          inventoryDateTo,
          linkedSchedule,
          pageRecords = 10,
          currentPage: page = 1,
        } = payload.condition;

        setInventoryDateFrom(inventoryDateFrom);
        setInventoryDateTo(inventoryDateTo);
        setLinkedSchedule(linkedSchedule);
        setPageRecords(pageRecords);
        setCurrentPage(page);

        // 検索
        await dispatch(
          searchInventories({
            ...mapStore,
            inventoryDateFrom,
            inventoryDateTo,
            linkedSchedule,
            page,
            pageRecords,
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
        title={t('pages:MapVersions.title')}
        mapStore={mapStore}
        searchCondition={searchCondition}
        searchConditionEvent={searchConditionEvent}
        data={data}
        columns={columns}
        enableBackButton={enableBackButton}
        canCreate={SecurityUtil.hasAnyAuthority(user, [AuthorityTypes.MAP_ADD])}
        onClickBackButton={handleClickBackButton}
        onClickCreate={() => handleClickCreate({})}
        onClickSearch={handleClickSearch}
        onClickClearSearchCondition={handleClickClearSearchCondition}
        pageCondition={pageCondition}
        pageEvent={pageEvent}
      />
      <MapVersionCreate
        isOpen={createMapVersionOpen}
        onRequestClose={closeCreateMapVersion}
        onRequestCloseResearch={closeCreateMapVersionAndResearch}
        mapStore={mapStore}
        mapCreateVersion={() => selectedMapVersion}
        onViewEditor={handleViewEditor}
      />
      <MapVersionCopy
        isOpen={copyMapVersionOpen}
        onRequestClose={closeCopyMapVersionOpen}
        source={mapVersionCopySource}
        onExecuteCopy={handleExecuteCopy}
        errors={errors}
      />
    </>
  );
};
