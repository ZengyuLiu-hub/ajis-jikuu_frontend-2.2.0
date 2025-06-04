import { useCallback, useEffect, useState } from 'react';

import { useAppDispatch } from '../../app/hooks';
import {
  MapPdfOutputModes,
  MapPdfPrintSettings,
  ViewLocationAggregateDataType,
  ViewLocationAggregateDataTypes,
  ViewLocationColorType,
  ViewLocationColorTypes,
} from '../../types';

import {
  viewerLayoutModule,
  viewerModule,
  viewerNodeModule,
  viewerViewModule,
} from '../../modules';
import {
  useViewAreaIds,
  useViewLocationAggregateDataType,
  useViewLocationColorType,
  useViewLocationNodes,
  useViewScreenCaptureRange,
  useViewTableIds,
} from '../../selectors';

import { ViewerLocationInfo as Component } from '../../components/organisms';
import { MapViewerMapPdfOutput } from '../pages';

interface Props {}

/**
 * マップビューア：ロケーション情報
 *
 * @param props プロパティ
 * @returns {React.ReactElement} ReactElement
 */
export const ViewerLocationInfo = (props: Props) => {
  const dispatch = useAppDispatch();

  const areaIds = useViewAreaIds();
  const tableIds = useViewTableIds();

  const locationNodes = useViewLocationNodes();
  const screenCaptureRange = useViewScreenCaptureRange();

  const viewLocationColorType = useViewLocationColorType();
  const viewLocationAggregateDataType = useViewLocationAggregateDataType();

  const [countOfLocations, setCountOfLocations] = useState(0);
  const [countOfMissingNumber, setCountOfMissingNumber] = useState(0);
  const [countOfEmptyNumber, setCountOfEmptyNumber] = useState(0);

  const [isMapPdfOutputOpen, setMapPdfOutputOpen] = useState(false);

  // PDF 出力：モーダル画面クローズ.
  const closeMapPdfOutput = useCallback(() => setMapPdfOutputOpen(false), []);

  // PDF 出力：出力モード画面からモード指示受け取り.
  const handleSuccessMapPdfOutput = useCallback(
    (settings: MapPdfPrintSettings) => {
      // 出力モードモードが納品モードの場合
      if (settings.outputMode === MapPdfOutputModes.STATEMENT_OF_DELIVERY) {
        // ロケーションメモアイコンを非表示にする
        dispatch(viewerViewModule.actions.updateVisibleRemarksIcon(false));
      }

      // PDF 帳票の作成を指示
      dispatch(viewerLayoutModule.actions.updatePrintPdf(settings));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [screenCaptureRange],
  );

  // PDF 出力：モーダル画面オープン.
  const showMapPdfOutput = () => {
    // ロケーション選択を解除
    dispatch(viewerNodeModule.actions.updateSelectedNodeIds([]));

    // 出力モード画面表示
    setMapPdfOutputOpen(true);
  };

  // ビューアロケーション色種別を変更
  const handleChangeViewLocationColorType = (type: ViewLocationColorType) => {
    dispatch(viewerModule.actions.updateViewLocationColorType(type));

    // ビューアロケーション集計値種別をリセット
    let aggregateDataType: ViewLocationAggregateDataType =
      ViewLocationAggregateDataTypes.DEPARTMENT_NAME;
    if (
      type === ViewLocationColorTypes.INTENSIVE_CHECK ||
      type === ViewLocationColorTypes.SAMPLING ||
      type === ViewLocationColorTypes.AUDIT
    ) {
      aggregateDataType = ViewLocationAggregateDataTypes.EMPLOYEE_NUM;
    }

    dispatch(
      viewerModule.actions.updateViewLocationAggregateDataType(
        aggregateDataType,
      ),
    );
  };

  // ビューアロケーション集計値種別を変更
  const handleChangeViewLocationAggregateDataType = (
    type: ViewLocationAggregateDataType,
  ) => {
    dispatch(viewerModule.actions.updateViewLocationAggregateDataType(type));
  };

  // ロケーション情報変更検知.
  useEffect(() => {
    setCountOfLocations(
      locationNodes.filter(
        (config) => !config.missingNumber && !config.emptyNumber,
      ).length,
    );
    setCountOfMissingNumber(
      locationNodes.filter((config) => config.missingNumber).length,
    );
    setCountOfEmptyNumber(
      locationNodes.filter((config) => config.emptyNumber).length,
    );
  }, [locationNodes]);

  return (
    <>
      <Component
        countOfAreas={areaIds.length}
        countOfTables={tableIds.length}
        countOfLocations={countOfLocations}
        countOfMissingNumber={countOfMissingNumber}
        countOfEmptyNumber={countOfEmptyNumber}
        selectedViewLocationColorType={viewLocationColorType}
        selectedViewLocationAggregateDataType={viewLocationAggregateDataType}
        onClickPrintMapPdf={showMapPdfOutput}
        onChangeViewLocationColorType={handleChangeViewLocationColorType}
        onChangeViewLocationAggregateDataType={
          handleChangeViewLocationAggregateDataType
        }
      />
      <MapViewerMapPdfOutput
        isOpen={isMapPdfOutputOpen}
        onRequestClose={closeMapPdfOutput}
        onSuccess={handleSuccessMapPdfOutput}
      />
    </>
  );
};
