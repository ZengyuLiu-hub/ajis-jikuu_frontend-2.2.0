import Konva from 'konva';
import React, { useCallback, useEffect, useReducer, useState } from 'react';

import { useAppDispatch } from '../../app/hooks';
import {
  MapPdfPrintSettings,
  ShapeOperations,
  StageRegulationSizes,
} from '../../types';

import {
  editorLayoutModule,
  editorNodeModule,
  editorPreferenceModule,
  editorShapeModule,
  editorViewModule,
} from '../../modules';
import {
  useAreaIds,
  useEditorPreferenceState,
  useLocationNodes,
  useShapeControlExpand,
  useTableIds,
} from '../../selectors';

import { EditorLocationInfo as Component } from '../../components/organisms';
import { EditorUtil } from '../../utils/EditorUtil';
import { MapEditorLocationList, MapEditorMapPdfOutput } from '../pages';

const initialStageCellSize = (() => {
  const { width: pixelWidth, height: pixelHeight } =
    EditorUtil.stageRegulationSizeToPixel(StageRegulationSizes.VERY_SMALL);
  const width = Math.round(pixelWidth / 5);
  const height = Math.round(pixelHeight / 5);

  return { width, height };
})();

interface Props {
  mapLayerRef: React.RefObject<Konva.Layer>;
}

/**
 * マップエディタ：ロケーション情報
 */
export const EditorLocationInfo = (props: Props) => {
  const dispatch = useAppDispatch();

  const areaIds = useAreaIds();
  const tableIds = useTableIds();

  const locationNodes = useLocationNodes();
  const shapeControlExpand = useShapeControlExpand();

  const preferences = useEditorPreferenceState();

  const [stageCellSize, stageCellSizeEvent] = useReducer(
    (prev: typeof initialStageCellSize, next: any) => ({ ...prev, ...next }),
    initialStageCellSize,
  );

  const [latticeSize, setLatticeSize] = useState({ width: 5, height: 5 });

  const [isLocationListOpen, setLocationListOpen] = useState(false);
  const [isMapPdfOutputOpen, setMapPdfOutputOpen] = useState(false);

  const [countOfLocations, setCountOfLocations] = useState(0);
  const [countOfMissingNumber, setCountOfMissingNumber] = useState(0);
  const [countOfEmptyNumber, setCountOfEmptyNumber] = useState(0);

  /**
   * ロケーション一覧：モーダル画面オープン.
   */
  const showLocationList = useCallback(
    () => {
      dispatch(editorNodeModule.actions.clearSelectedNodeIds());

      setLocationListOpen(true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  /**
   * ロケーション一覧：モーダル画面クローズ.
   */
  const closeLocationList = useCallback(() => setLocationListOpen(false), []);

  /**
   * ロケーション一覧からの更新一覧の受け取り処理.
   */
  const handleSuccessLocationList = useCallback((newConfigList: any[]) => {
    if (!props.mapLayerRef?.current || newConfigList.length === 0) {
      return;
    }
    const nodes = props.mapLayerRef?.current?.children ?? [];

    const past: any[] = [];
    const present: any[] = [];
    newConfigList.forEach((config: any) => {
      const node: any = nodes.find((d: any) => d.uuid === config.uuid);
      if (!node) {
        return;
      }
      past.push({ id: node.config.uuid, config: { ...node.config } });

      const newConfig = { ...node.config, ...config };
      node.config = newConfig;

      present.push({ id: node.config.uuid, config: newConfig });
    });

    // Undo リストに追加依頼
    dispatch(
      editorShapeModule.actions.updateMapPresent({
        operation: ShapeOperations.CHANGE,
        past,
        present,
      }),
    );

    dispatch(editorNodeModule.actions.updateChangeNodeList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * PDF 出力：モーダル画面オープン.
   */
  const showMapPdfOutput = () => {
    // シェイプ選択状態を解除
    dispatch(editorNodeModule.actions.clearSelectedNodeIds());

    // 出力モード画面表示
    setMapPdfOutputOpen(true);
  };

  /**
   * PDF 出力：モーダル画面クローズ.
   */
  const closeMapPdfOutput = useCallback(() => setMapPdfOutputOpen(false), []);

  /**
   * PDF 出力：出力モード画面からモード指示受け取り.
   */
  const handleSuccessMapPdfOutput = useCallback(
    (settings: MapPdfPrintSettings) => {
      dispatch(editorLayoutModule.actions.updatePrintPdf(settings));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  /**
   * 右ペイン展開.
   */
  const handleClickShapeControlExpand = () => {
    dispatch(
      editorViewModule.actions.updateShapeControlExpand(!shapeControlExpand),
    );
  };

  /**
   * 右ペイン縮小.
   */
  const handleChangeMinimizeStatus = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    dispatch(
      editorViewModule.actions.updateShapeControlExpand(e.target.checked),
    );
  };

  /**
   * @returns ステージサイズが変更されていない場合は true
   */
  const hasNotChangedStageSize = () => {
    const { stageWidth, stageHeight, latticeWidth, latticeHeight } =
      preferences;

    // ピクセルサイズ変換
    const width = stageCellSize.width * latticeWidth;
    const height = stageCellSize.height * latticeHeight;

    return width === stageWidth && height === stageHeight;
  };

  /**
   * ステージサイズ反映.
   */
  const handleClickSubmitStageCellSize = () => {
    if (hasNotChangedStageSize()) {
      return;
    }

    const { latticeWidth, latticeHeight } = preferences;

    // ピクセルサイズ変換
    const stageWidth = stageCellSize.width * latticeWidth;
    const stageHeight = stageCellSize.height * latticeHeight;

    dispatch(
      editorPreferenceModule.actions.updatePreference({
        ...preferences,
        stageWidth,
        stageHeight,
      }),
    );
    dispatch(editorShapeModule.actions.updateUnsavedData(true));
  };

  // 環境設定変更検知
  useEffect(() => {
    if (hasNotChangedStageSize()) {
      return;
    }

    const { stageWidth, stageHeight, latticeWidth, latticeHeight } =
      preferences;

    setLatticeSize({ width: latticeWidth, height: latticeHeight });

    // セルサイズ変換（四捨五入）
    const width = Math.round(stageWidth / latticeWidth);
    const height = Math.round(stageHeight / latticeHeight);

    stageCellSizeEvent({ width, height });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferences]);

  /**
   * ロケーション情報変更検知.
   */
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
        latticeSize={latticeSize}
        stageCellSize={stageCellSize}
        stageCellSizeEvent={stageCellSizeEvent}
        onClickSubmitStageCellSize={handleClickSubmitStageCellSize}
        onClickShowLocationList={showLocationList}
        onClickPrintMapPdf={showMapPdfOutput}
        shapeControlExpand={shapeControlExpand}
        onClickShapeControlExpand={handleClickShapeControlExpand}
        onChangeMinimizeStatus={handleChangeMinimizeStatus}
      />
      <MapEditorLocationList
        isOpen={isLocationListOpen}
        nodeConfigList={locationNodes}
        onRequestClose={closeLocationList}
        onSuccess={handleSuccessLocationList}
      />
      <MapEditorMapPdfOutput
        isOpen={isMapPdfOutputOpen}
        onRequestClose={closeMapPdfOutput}
        onSuccess={handleSuccessMapPdfOutput}
      />
    </>
  );
};
