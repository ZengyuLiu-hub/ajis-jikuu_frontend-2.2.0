import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import * as editorConstants from '../../constants/editor';
import * as viewerConstants from '../../constants/viewer';

import {
  ViewerShapeProperty as Component,
  DisplayPosition,
} from '../../components/organisms/ViewerShapeProperty';
import { useViewLocationColorType, useViewStageScale } from '../../selectors';
import { CountLocation, RGBA, ViewLocationColorType } from '../../types';
import { MapViewerPlanogram } from '../pages';

type DisplayPositionProps = {
  parentWidth: number;
  parentHeight: number;
  parentScrollTop: number;
  parentScrollLeft: number;
  propertyWidth: number;
  propertyHeight: number;
};

interface Props {
  canvasContainerRef: React.RefObject<HTMLDivElement>;
  selectedShapeConfig: any;
  selectedShapeCountLocation: any;
  jurisdictionClass: string;
  companyCode: string;
  storeCode: string;
  inventoryDates: Date[];
  getViewLocationColor(
    loc: CountLocation,
    colorType?: ViewLocationColorType,
  ): { fillRgb: RGBA; fill: string };
}

/**
 * マップビューア：シェイププロパティ
 */
export const ViewerShapeProperty = (props: Props) => {
  const {
    canvasContainerRef,
    selectedShapeConfig,
    selectedShapeCountLocation,
  } = props;

  const POSITION_OFFSET = 50;

  const stageScale = useViewStageScale();

  const viewLocationColorType = useViewLocationColorType();

  const propertyContainer = useRef<HTMLDivElement>(null);

  const [displayPosition, setDisplayPosition] = useState<DisplayPosition>({
    top: 0,
    left: 0,
  });
  const [shapeAfterProperty, setShapeAfterProperty] = useState<any>({});

  const [currentAreaId, setCurrentAreaId] = useState<string>('');
  const [currentLocationNum, setCurrentLocationNum] = useState<string>('');
  const [currentMissingNumber, setCurrentMissingNumber] =
    useState<boolean>(false);
  const [currentEmptyNumber, setCurrentEmptyNumber] = useState<boolean>(false);
  const [isMapViewerPlanogramOpen, setMapViewerPlanogramOpen] = useState(false);

  // ロケーションフェイス：モーダル画面クローズ.
  const openMapViewerPlanogram = useCallback(
    () => setMapViewerPlanogramOpen(true),
    [],
  );

  // ロケーションフェイス：モーダル画面クローズ.
  const closeMapViewerPlanogram = useCallback(
    () => setMapViewerPlanogramOpen(false),
    [],
  );

  // 表示位置計算
  const getDisplayPosition = useCallback(
    (props: DisplayPositionProps) => {
      const scaledShapeConfig = (({
        x,
        y,
        width,
        height,
        radiusX,
        radiusY,
      }) => {
        const scale = stageScale / 100;
        return {
          x: x * scale,
          y: y * scale,
          width: width * scale,
          height: height * scale,
          radiusX: radiusX * scale,
          radiusY: radiusY * scale,
        };
      })(selectedShapeConfig);

      // シェイプの X、Y 座標を取得
      const nodeX = selectedShapeConfig.hasOwnProperty('radiusX')
        ? scaledShapeConfig.x - scaledShapeConfig.radiusX
        : scaledShapeConfig.x;
      const nodeY = selectedShapeConfig.hasOwnProperty('radiusY')
        ? scaledShapeConfig.y - scaledShapeConfig.radiusY
        : scaledShapeConfig.y;

      // シェイプの幅、高さを取得
      const nodeWidth = selectedShapeConfig.hasOwnProperty('radiusX')
        ? Math.round(scaledShapeConfig.radiusX * 2)
        : scaledShapeConfig.width;
      const nodeHeight = selectedShapeConfig.hasOwnProperty('radiusY')
        ? Math.round(scaledShapeConfig.radiusY * 2)
        : scaledShapeConfig.height;

      // シェイプの右端、下端を取得
      const rightEnd = nodeX + nodeWidth;
      const bottomEnd = nodeY + nodeHeight;

      // デフォルトの戻り値
      const result = {
        top: bottomEnd - Math.round(props.propertyHeight / 2),
        left: rightEnd + POSITION_OFFSET,
      };

      // 配置すると右側がスクロールに隠れるような位置の場合に横位置を訂正
      const propertyRightEnd = rightEnd + POSITION_OFFSET + props.propertyWidth;
      if (propertyRightEnd > props.parentWidth + props.parentScrollLeft) {
        result.left = nodeX - POSITION_OFFSET - props.propertyWidth;
      }

      // 配置すると上側がスクロールに隠れるような位置の場合に縦位置を訂正
      const propertyBottomStart = nodeY - Math.round(props.propertyHeight / 2);
      if (propertyBottomStart < props.parentScrollTop) {
        result.top = bottomEnd;
      }
      // 配置すると下側がスクロールに隠れるような位置の場合に縦位置を訂正
      const propertyBottomEnd =
        bottomEnd + props.propertyHeight - Math.round(props.propertyHeight / 2);
      if (propertyBottomEnd > props.parentHeight + props.parentScrollTop) {
        result.top = nodeY - props.propertyHeight;
      }

      return result;
    },
    [selectedShapeConfig, stageScale],
  );

  // 表示プロパティ名一覧
  const INCLUDE_PROP_NAMES = useMemo(
    () => [
      editorConstants.SHAPE_PROP_NAME_LOCATION_NUM,
      editorConstants.SHAPE_PROP_NAME_AREA_ID,
      editorConstants.SHAPE_PROP_NAME_TABLE_ID,
      editorConstants.SHAPE_PROP_NAME_BRANCH_NUM,
      viewerConstants.SHAPE_PROP_NAME_DEPARTMENT_NAME,
      viewerConstants.SHAPE_PROP_NAME_QUANTITY,
      viewerConstants.SHAPE_PROP_NAME_EMPLOYEE_NUM,
      viewerConstants.SHAPE_PROP_NAME_COUNT_TIME,
      viewerConstants.SHAPE_PROP_NAME_EDITOR_TEXT,
      editorConstants.SHAPE_PROP_NAME_REMARKS,
      editorConstants.SHAPE_PROP_NAME_CREATED_AT,
      editorConstants.SHAPE_PROP_NAME_COUNT_PROGRESS_STATUS,
      editorConstants.SHAPE_PROP_NAME_INTENSIVE_CHECK_STATUS,
      editorConstants.SHAPE_PROP_NAME_SAMPLING_STATUS,
      editorConstants.SHAPE_PROP_NAME_AUDIT_STATUS,
      editorConstants.SHAPE_PROP_NAME_ALL_PROGRESS_STATUS,
    ],
    [],
  );

  // シェイプ選択
  useEffect(() => {
    if (!selectedShapeCountLocation) {
      setShapeAfterProperty({});
      return;
    }

    // 選択シェイプの表示プロパティを設定
    const properties: any = {};
    INCLUDE_PROP_NAMES.forEach((name) => {
      if (!selectedShapeCountLocation.hasOwnProperty(name)) {
        return;
      }
      properties[name] = selectedShapeCountLocation[name];

      // エリアID
      if (name === editorConstants.SHAPE_PROP_NAME_AREA_ID) {
        setCurrentAreaId(selectedShapeConfig[name]);
      }

      // ロケーション番号
      if (name === editorConstants.SHAPE_PROP_NAME_LOCATION_NUM) {
        setCurrentLocationNum(selectedShapeConfig[name]);
      }
    });

    // 欠番
    if (
      selectedShapeCountLocation.hasOwnProperty(
        editorConstants.SHAPE_PROP_NAME_MISSING_NUMBER,
      )
    ) {
      setCurrentMissingNumber(
        selectedShapeConfig[editorConstants.SHAPE_PROP_NAME_MISSING_NUMBER],
      );
    }
    // 空白
    if (
      selectedShapeCountLocation.hasOwnProperty(
        editorConstants.SHAPE_PROP_NAME_EMPTY_NUMBER,
      )
    ) {
      setCurrentEmptyNumber(
        selectedShapeConfig[editorConstants.SHAPE_PROP_NAME_EMPTY_NUMBER],
      );
    }
    setShapeAfterProperty(properties);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedShapeCountLocation, INCLUDE_PROP_NAMES]);

  // 表示位置調整
  useEffect(() => {
    if (Object.keys(shapeAfterProperty).length === 0) {
      return;
    }
    if (!canvasContainerRef.current || !propertyContainer.current) {
      return;
    }

    const displayPositionProps = {
      parentWidth: canvasContainerRef.current.clientWidth,
      parentHeight: canvasContainerRef.current.clientHeight,
      parentScrollTop: canvasContainerRef.current.scrollTop,
      parentScrollLeft: canvasContainerRef.current.scrollLeft,
      propertyWidth: propertyContainer.current.clientWidth,
      propertyHeight: propertyContainer.current.clientHeight,
    };
    setDisplayPosition(getDisplayPosition(displayPositionProps));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shapeAfterProperty]);

  return (
    <>
      <Component
        propertyContainerRef={propertyContainer}
        displayPosition={displayPosition}
        shapeProperty={shapeAfterProperty}
        locationColorType={viewLocationColorType}
        onClickShowPlanogramButton={openMapViewerPlanogram}
      />
      <MapViewerPlanogram
        isOpen={isMapViewerPlanogramOpen}
        onRequestClose={closeMapViewerPlanogram}
        areaId={currentAreaId}
        locationNum={currentLocationNum}
        jurisdictionClass={props.jurisdictionClass}
        companyCode={props.companyCode}
        storeCode={props.storeCode}
        inventoryDates={props.inventoryDates}
        missingNumber={currentMissingNumber}
        emptyNumber={currentEmptyNumber}
        getViewLocationColor={props.getViewLocationColor}
      />
    </>
  );
};
