import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  AlertDialogData,
  AuthorityTypes,
  CountData,
  CountLocation,
  DialogTypes,
  Planogram,
  RGBA,
  ViewLocationColorType,
  ViewLocationColorTypes,
} from '../../types';
import { CollectionUtil, DateTimeUtil, SecurityUtil } from '../../utils';

import { actionHelper, searchCountData, searchPlanogram } from '../../actions';
import { useAppDispatch } from '../../app/hooks';
import {
  useIsPlanogramData,
  useUser,
  useViewLocationColorType,
  useViewProductLocations,
} from '../../selectors';

import { MapViewerPlanogram as Component } from '../../components/pages';
import { PlanogramFace } from '../../components/pages/MapViewerPlanogram';
import * as viewerConstants from '../../constants/viewer';
import { appModule, viewerModule } from '../../modules';

interface Props extends ReactModal.Props {
  /** エリア */
  areaId: string;
  /** ロケーション番号 */
  locationNum: string;
  /** 管轄区分 */
  jurisdictionClass: string;
  /** 企業コード */
  companyCode: string;
  /** 店舗コード */
  storeCode: string;
  /** 棚卸日 */
  inventoryDates: Date[];
  /** 欠番 */
  missingNumber: boolean;
  /** 空白 */
  emptyNumber: boolean;
  /** 棚割色付け取得処理 */
  getViewLocationColor(
    loc: CountLocation | PlanogramFace,
    colorType?: ViewLocationColorType,
  ): { fillRgb: RGBA; fill: string };
}

/**
 * マップビューア：棚割
 */
export const MapViewerPlanogram = (props: Props) => {
  const {
    isOpen,
    jurisdictionClass,
    companyCode,
    storeCode,
    inventoryDates,
    areaId,
    locationNum,
  } = props;

  const [t] = useTranslation();

  const user = useUser();

  const viewLocationColorType = useViewLocationColorType();

  const productLocations = useViewProductLocations();
  const dispatch = useAppDispatch();
  const isPlanogramData = useIsPlanogramData();

  const [selectedItem, setSelectedItem] = useState<PlanogramFace>();

  const [data, setData] = useState<PlanogramFace[]>([]);

  const getViewLocationColor = (
    loc: PlanogramFace,
    colorType?: ViewLocationColorType,
  ) => {
    var fill = viewerConstants.VIEWER_LOCATION_FILL_WHITE;
    // ステータスがカウント進捗の場合は色付け不要
    if (colorType !== ViewLocationColorTypes.COUNT_PROGRESS) {
      fill = props.getViewLocationColor(loc, colorType)?.fill;
    }
    return { fill };
  };

  const handleClickChangeSearchTarget = (isPlanogramData: boolean) => {
    dispatch(viewerModule.actions.updateIsPlanogramData(isPlanogramData));
  };

  // 棚割データ検索の権限有無
  const canSearchPlanogramData = SecurityUtil.hasAnyAuthority(user, [
    AuthorityTypes.PLANOGRAM_SEARCH,
  ]);

  // 現在作業中カウントデータ検索の権限有無
  const hasCurrentCountDataSearch = SecurityUtil.hasAnyAuthority(user, [
    AuthorityTypes.CURRENT_COUNT_DATA_SEARCH,
  ]);

  // フェイス選択
  const handleClickFace = (item: PlanogramFace) => {
    if (item === selectedItem) {
      setSelectedItem(undefined);
    } else {
      setSelectedItem(item);
    }
  };

  // とじるボタン押下処理
  const executeClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (props.onRequestClose) {
      props.onRequestClose(e);
    }
  };

  // シェルフ毎フェイス一覧
  const shelves = useMemo(() => {
    // シェルフ毎にグループ化
    const groupItems = Object.entries(
      CollectionUtil.groupBy(data, (item) => item.shelf),
    );

    return groupItems.map(([k, v]) =>
      v.sort((a, b) => {
        if (a.face > b.face) {
          return 1;
        }
        if (a.face < b.face) {
          return -1;
        }
        return 0;
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // 商品フェイス一覧
  const productFaces = useMemo(() => {
    // レイアウト種類が「商品ロケーション」以外の場合は、色付けしない
    if (viewLocationColorType !== ViewLocationColorTypes.PRODUCT_LOCATION) {
      return [];
    }
    return productLocations
      .filter((d) => {
        // エリアIDが未入力の場合
        if (d.areaId === undefined) {
          return areaId === '' && d.locationNum === locationNum;
        }
        return d.areaId === areaId && d.locationNum === locationNum;
      })
      .map((d) => `${d.shelf}_${d.face}`);
  }, [viewLocationColorType, areaId, locationNum, productLocations]);

  useEffect(() => {
    setData([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationNum, isPlanogramData]);

  useEffect(() => {
    setSelectedItem(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const buildPlanogramFaceByPlanogram = (
    planograms: Planogram[],
  ): PlanogramFace[] => {
    const planogramFaces: PlanogramFace[] = planograms.map(
      ({ updatedAt, ...d }) => ({
        ...d,
        quantity: 0,
        updatedAt:
          DateTimeUtil.parseDateToDayjs(updatedAt, user.timeZone)?.format(
            t('pages:MapViewerPlanogram.details.updatedAt.format'),
          ) ?? '',
      }),
    );

    return planogramFaces.map((d) => {
      const item = { ...d };

      delete item.dumpNo;
      delete item.countTime;
      delete item.employeeCode;

      return item;
    });
  };

  const buildPlanogramFaceByCountData = (
    countDatas: CountData[],
  ): PlanogramFace[] => {
    const planogramFaces: PlanogramFace[] = countDatas.map(
      ({ updatedAt, ...d }) => ({
        ...d,
        updatedAt:
          DateTimeUtil.parseDateToDayjs(updatedAt, user.timeZone)?.format(
            t('pages:MapViewerPlanogram.details.updatedAt.format'),
          ) ?? '',
      }),
    );
    return hasCurrentCountDataSearch
      ? planogramFaces
      : planogramFaces.map((d) => {
          const item = { ...d };

          delete item.dumpNo;
          delete item.countTime;
          delete item.employeeCode;
          item.intensiveCheckStatus = '0';
          item.samplingStatus = '0';
          item.auditStatus = '0';
          item.allProgressStatus = '0';

          return item;
        });
  };

  useEffect(() => {
    if (
      isOpen &&
      jurisdictionClass &&
      companyCode &&
      storeCode &&
      locationNum
    ) {
      (async () => {
        dispatch(appModule.actions.updateLoading(true));

        if (isPlanogramData) {
          await dispatch(
            searchPlanogram(
              {
                jurisdictionClass,
                companyCode,
                storeCode,
                locationNum,
                areaId,
              },
              async (result) => {
                if (result && result.data.length === 0) {
                  const alertDialogData: AlertDialogData = {
                    type: DialogTypes.INFORMATION,
                    message: t('messages:error.dataNotFound'),
                    positiveAction: (e) => executeClose(e),
                  };
                  dispatch(
                    appModule.actions.updateAlertDialog(alertDialogData),
                  );

                  dispatch(appModule.actions.updateLoading(false));
                  return;
                }

                setData(buildPlanogramFaceByPlanogram(result.data));

                dispatch(appModule.actions.updateLoading(false));
              },
              ({ e }) => actionHelper.showErrorDialog(e, dispatch),
            ),
          );
        } else {
          await dispatch(
            searchCountData(
              {
                jurisdictionClass,
                companyCode,
                storeCode,
                locationNum,
                inventoryDates: inventoryDates ?? [],
                areaId,
              },
              async (result) => {
                if (result && result.data.length === 0) {
                  const alertDialogData: AlertDialogData = {
                    type: DialogTypes.INFORMATION,
                    message: t('messages:error.dataNotFound'),
                    positiveAction: (e) => executeClose(e),
                  };
                  dispatch(
                    appModule.actions.updateAlertDialog(alertDialogData),
                  );

                  dispatch(appModule.actions.updateLoading(false));
                  return;
                }

                setData(buildPlanogramFaceByCountData(result.data));

                dispatch(appModule.actions.updateLoading(false));
              },
              ({ e }) => actionHelper.showErrorDialog(e, dispatch),
            ),
          );
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isPlanogramData]);

  return (
    <>
      <Component
        {...props}
        title={locationNum}
        shelves={shelves}
        selectedItem={selectedItem}
        productFaces={productFaces}
        viewLocationColorType={viewLocationColorType}
        canSearchPlanogramData={canSearchPlanogramData}
        isPlanogramData={isPlanogramData}
        onChangeSearchTarget={handleClickChangeSearchTarget}
        onClickFace={handleClickFace}
        onClickClose={executeClose}
        getViewLocationColor={getViewLocationColor}
      />
    </>
  );
};
