import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactModal from 'react-modal';
import * as RV from 'react-virtualized';
import styled from 'styled-components';

import { useAppDispatch } from '../../app/hooks';
import { DialogTypes, ViewLocationColorTypes } from '../../types';

import { actionHelper, searchProductLocations } from '../../actions';
import {
  appModule,
  viewerModule,
  viewerProductLocationModule,
} from '../../modules';
import { useViewMapVersion, useViewProductLocations } from '../../selectors';

import {
  MapViewerProductLocationSearch as Component,
  Condition,
  ConditionEvent,
} from '../../components/pages/MapViewerProductLocationSearch';

const CellMeasurer =
  RV.CellMeasurer as unknown as React.FC<RV.CellMeasurerProps>;

const TextCell = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
`;

const TextOverflowCell = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-start;

  > span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

interface Props extends ReactModal.Props {
  /** 棚割データ検索可否 */
  canSearchPlanogramData: boolean;
  /** 棚割データ検索対象 */
  isPlanogramData: boolean;
  /** 検索対象切替 */
  onChangeSearchTarget(isCountData: boolean): void;
}

/**
 * 商品ロケーション検索.
 *
 * @param props プロパティ
 * @returns {React.ReactElement} ReactElement
 */
export const MapViewerProductLocationSearch = (
  props: Props,
): React.ReactElement => {
  const { isOpen, canSearchPlanogramData, isPlanogramData } = props;

  const [t] = useTranslation();

  const dispatch = useAppDispatch();

  const mapVersion = useViewMapVersion();
  const productLocations = useViewProductLocations();

  const [isResultChanged, setResultChanged] = useState(false);

  const [productName, setProductName] = useState('');
  const [sku, setSku] = useState('');
  const [twoGradeBarcode, setTwoGradeBarcode] = useState('');

  // セルキャッシュ
  const cellCache = new RV.CellMeasurerCache({
    defaultWidth: 80,
    minWidth: 60,
    fixedHeight: true,
  });

  const textRenderer = (cellData: RV.TableCellProps) => {
    const { dataKey, parent, columnIndex, rowIndex, rowData } = cellData;

    const value = rowData[dataKey];
    const child = parent.props.children[columnIndex];

    return (
      <CellMeasurer
        cache={cellCache}
        columnIndex={columnIndex}
        key={dataKey}
        parent={parent}
        rowIndex={rowIndex}
      >
        <TextCell style={{ width: `${child.width}px` }}>
          <span title={value}>{value}</span>
        </TextCell>
      </CellMeasurer>
    );
  };

  // テキストオーバーフローレンダラー
  const textOverflowRenderer = (cellData: RV.TableCellProps) => {
    const { dataKey, parent, columnIndex, rowIndex, rowData } = cellData;

    const value = rowData[dataKey];
    const child = parent.props.children[columnIndex];

    return (
      <CellMeasurer
        cache={cellCache}
        columnIndex={columnIndex}
        key={dataKey}
        parent={parent}
        rowIndex={rowIndex}
      >
        <TextOverflowCell style={{ width: `${child.width}px` }}>
          <span title={value}>{value}</span>
        </TextOverflowCell>
      </CellMeasurer>
    );
  };

  const columns: RV.ColumnProps[] = [
    {
      // 商品名
      label: t('pages:MapViewerProductLocationSearch.dataTable.productName'),
      dataKey: 'productName',
      cellRenderer: textOverflowRenderer,
      width: 320,
    },
    {
      // SKU コード
      label: t('pages:MapViewerProductLocationSearch.dataTable.sku'),
      dataKey: 'sku',
      cellRenderer: textRenderer,
      width: 120,
    },
    {
      // 2段バーコード
      label: t(
        'pages:MapViewerProductLocationSearch.dataTable.twoGradeBarcode',
      ),
      dataKey: 'twoGradeBarcode',
      cellRenderer: textRenderer,
      width: 120,
    },
    {
      // エリアID
      label: t('pages:MapViewerProductLocationSearch.dataTable.areaId'),
      dataKey: 'areaId',
      cellRenderer: textRenderer,
      width: 65,
    },
    {
      // ロケーション番号
      label: t('pages:MapViewerProductLocationSearch.dataTable.locationNum'),
      dataKey: 'locationNum',
      cellRenderer: textRenderer,
      width: 100,
    },
    {
      // 棚
      label: t('pages:MapViewerProductLocationSearch.dataTable.shelf'),
      dataKey: 'shelf',
      cellRenderer: textRenderer,
      width: 65,
    },
    {
      // フェイス
      label: t('pages:MapViewerProductLocationSearch.dataTable.face'),
      dataKey: 'face',
      cellRenderer: textRenderer,
      width: 65,
    },
    {
      // シート名
      label: t('pages:MapViewerProductLocationSearch.dataTable.layoutName'),
      dataKey: 'layoutName',
      cellRenderer: textOverflowRenderer,
      width: 180,
      flexGrow: 1,
    },
  ];

  // 検索結果クリアボタン押下
  const handleClickSearchResultClear = () => {
    dispatch(viewerProductLocationModule.actions.updateLocations([]));
    setResultChanged(false);
  };

  // とじるボタン押下
  const handleClickClose = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    // 画面表示時から結果に変更があった場合
    if (isResultChanged) {
      // レイアウト種類を切り替え
      dispatch(
        viewerModule.actions.updateViewLocationColorType(
          ViewLocationColorTypes.PRODUCT_LOCATION,
        ),
      );
    }

    if (props.onRequestClose) {
      props.onRequestClose(e);
    }
  };

  // 検索条件変更：商品名
  const handleChangeProductName = (value: string) => setProductName(value);

  // 検索条件変更：SKU
  const handleChangeSku = (value: string) => setSku(value);

  // 検索条件変更：2段バーコード
  const handleChangeTwoGradeBarcode = (value: string) =>
    setTwoGradeBarcode(value);

  // 指定の条件で検索を実行します
  const executeSearch = async () => {
    dispatch(appModule.actions.updateLoading(true));

    const {
      jurisdictionClass,
      companyCode,
      storeCode,
      inventorySchedule,
      mapId,
      version,
    } = mapVersion;

    const condition = isPlanogramData
      ? {
          mapId,
          version,
          sku,
        }
      : {
          jurisdictionClass,
          companyCode,
          storeCode,
          inventoryDates: inventorySchedule?.inventoryDates ?? [],
          productName,
          sku,
          twoGradeBarcode,
        };

    await dispatch(
      searchProductLocations(
        condition,
        ({ data }) => {
          dispatch(viewerProductLocationModule.actions.updateLocations(data));

          // 検索結果の件数が1件以上であった場合
          if (data.length > 0) {
            setResultChanged(true);
          }

          dispatch(appModule.actions.updateLoading(false));
        },
        ({ e, result }) => {
          if (result) {
            dispatch(
              appModule.actions.updateAlertDialog({
                type: DialogTypes.ERROR,
                message: `${result?.error}`,
              }),
            );

            dispatch(appModule.actions.updateLoading(false));
          } else {
            actionHelper.showErrorDialog(e, dispatch);
          }
        },
      ),
    );
  };

  // 検索条件を初期化します
  const clearCondition = () => {
    setProductName('');
    setSku('');
    setTwoGradeBarcode('');
  };

  // 検索ボタン押下処理
  const handleClickSearch = async () => {
    // 検索条件入力必須チェック
    if (!productName && !sku && !twoGradeBarcode) {
      dispatch(
        appModule.actions.updateAlertDialog({
          type: DialogTypes.ERROR,
          message: t(
            'pages:MapViewerProductLocationSearch.condition.message.notSet',
          ),
        }),
      );
      return;
    }

    // 検索
    executeSearch();
  };

  // 条件クリアボタン押下処理
  const handleClickClearSearchCondition = () => clearCondition();

  // 商品ロケーション検索結果
  const result = useMemo(() => productLocations, [productLocations]);

  // 検索対象切替時
  useEffect(() => {
    // 検索条件をクリア
    clearCondition();

    // 検索結果をクリア
    if (isResultChanged) {
      dispatch(viewerProductLocationModule.actions.updateLocations([]));
      setResultChanged(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlanogramData]);

  // 初期表示処理
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    setResultChanged(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const condition: Condition = {
    productName,
    sku,
    twoGradeBarcode,
  };

  const conditionEvent: ConditionEvent = {
    onChangeProductName: handleChangeProductName,
    onChangeSku: handleChangeSku,
    onChangeTwoGradeBarcode: handleChangeTwoGradeBarcode,
    onClickSearch: handleClickSearch,
    onClickClearSearchCondition: handleClickClearSearchCondition,
  };

  return (
    <Component
      isOpen={isOpen}
      condition={condition}
      conditionEvent={conditionEvent}
      columns={columns}
      result={result}
      canSearchPlanogramData={canSearchPlanogramData}
      isPlanogramData={isPlanogramData}
      onChangeSearchTarget={props.onChangeSearchTarget}
      onClickSearchResultClear={handleClickSearchResultClear}
      onClickClose={handleClickClose}
    />
  );
};
