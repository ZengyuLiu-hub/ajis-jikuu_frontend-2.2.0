import React, { useCallback, useEffect, useState } from 'react';

import * as editorConstants from '../../constants/editor';

import { useAppDispatch } from '../../app/hooks';
import {
  Directions,
  GondolaPlacements,
  RGBA,
  ShapeOperations,
  SideMenuTypes,
} from '../../types';

import {
  useAreaIdLength,
  useBranchNumLength,
  useCustomFormats,
  useEditNodeList,
  useLatticeHeight,
  useLatticeWidth,
  useLocationDisplayFormatType,
  useNodeConfigList,
  useSelectedMenu,
  useSelectedNodeList,
  useStageHeight,
  useStageWidth,
  useTableIdLength,
} from '../../selectors';

import { EditorItemProperties as Component } from '../../components/organisms';
import {
  editorNodeModule,
  editorOpModule,
  editorShapeModule,
} from '../../modules';
import { EditorUtil } from '../../utils/EditorUtil';
import { Group } from 'konva/lib/Group';
import Konva from 'konva';
import { Stage } from 'konva/lib/Stage';
import { useTranslation } from 'react-i18next';

interface Props {
  editLayer: React.RefObject<Konva.Layer>;
  transformer: React.RefObject<Konva.Transformer>;
}

/**
 * マップエディタ：シェイププロパティ
 */
export const EditorItemProperties = (props: Props) => {
  // 変更可能なプロパティ一覧
  const CHANGE_PROP_NAME_LIST = [
    editorConstants.SHAPE_PROP_NAME_VISIBLE,
    editorConstants.SHAPE_PROP_NAME_AREA_ID,
    editorConstants.SHAPE_PROP_NAME_TABLE_ID,
    editorConstants.SHAPE_PROP_NAME_BRANCH_NUM,
    editorConstants.SHAPE_PROP_NAME_LOCATION_NUM,
    editorConstants.SHAPE_PROP_NAME_SHOW_FULL_LOCATION_NUM,
    editorConstants.SHAPE_PROP_NAME_MISSING_NUMBER,
    editorConstants.SHAPE_PROP_NAME_EMPTY_NUMBER,
    editorConstants.SHAPE_PROP_NAME_TEXT,
    editorConstants.SHAPE_PROP_NAME_FONT_SIZE,
    editorConstants.SHAPE_PROP_NAME_REMARKS,
    editorConstants.SHAPE_PROP_NAME_X,
    editorConstants.SHAPE_PROP_NAME_Y,
    editorConstants.SHAPE_PROP_NAME_WIDTH,
    editorConstants.SHAPE_PROP_NAME_WIDTH_CELLS,
    editorConstants.SHAPE_PROP_NAME_HEIGHT,
    editorConstants.SHAPE_PROP_NAME_HEIGHT_CELLS,
    editorConstants.SHAPE_PROP_NAME_RADIUS_X,
    editorConstants.SHAPE_PROP_NAME_RADIUS_Y,
    editorConstants.SHAPE_PROP_NAME_STROKE,
    editorConstants.SHAPE_PROP_NAME_STROKE_RGB,
    editorConstants.SHAPE_PROP_NAME_STROKE_TRANSPARENT,
    editorConstants.SHAPE_PROP_NAME_STROKE_WIDTH,
    editorConstants.SHAPE_PROP_NAME_STROKE_DASH,
    editorConstants.SHAPE_PROP_NAME_FILL,
    editorConstants.SHAPE_PROP_NAME_FILL_RGB,
    editorConstants.SHAPE_PROP_NAME_FILL_TRANSPARENT,
    editorConstants.SHAPE_PROP_NAME_ROTATION,
    editorConstants.SHAPE_PROP_NAME_ALL_ROTATION,
    editorConstants.SHAPE_PROP_NAME_DEPTH,
    editorConstants.SHAPE_PROP_NAME_TABLE_TOP_DEPTH,
    editorConstants.SHAPE_PROP_NAME_DIRECTION,
    editorConstants.SHAPE_PROP_NAME_PLACEMENT,
    editorConstants.SHAPE_PROP_NAME_POINTER_AT_BEGIN,
    editorConstants.SHAPE_PROP_NAME_POINTER_AT_END,
    editorConstants.SHAPE_PROP_NAME_ALWAYS_SHOW_ANCHOR_POINT,
    editorConstants.SHAPE_PROP_NAME_FLIP_HORIZONTAL,
  ];

  // 変更できないプロパティ一覧
  const IGNORE_PROP_NAME_LIST = [
    editorConstants.SHAPE_PROP_NAME_UUID,
    editorConstants.SHAPE_PROP_NAME_NAME,
    editorConstants.SHAPE_PROP_NAME_SHAPE,
    editorConstants.SHAPE_PROP_NAME_SELECTABLE,
    editorConstants.SHAPE_PROP_NAME_DISABLED,
    editorConstants.SHAPE_PROP_NAME_LISTENING,
    editorConstants.SHAPE_PROP_NAME_PERFECT_DRAW_ENABLED,
    editorConstants.SHAPE_PROP_NAME_HIT_STROKE_WIDTH,
    editorConstants.SHAPE_PROP_NAME_SHADOW_STROKE_ENABLED,
    editorConstants.SHAPE_PROP_NAME_DRAW,
  ];

  // 単体のシェイプ選択時に変更できないプロパティ一覧
  const IGNORE_SINGLE_PROP_NAME_LIST = [
    editorConstants.SHAPE_PROP_NAME_ALL_ROTATION,
  ];

  // 複数選択時に変更できないプロパティ一覧
  const IGNORE_GROUP_PROP_NAME_LIST = [
    editorConstants.SHAPE_PROP_NAME_BRANCH_NUM,
    editorConstants.SHAPE_PROP_NAME_LOCATION_NUM,
    editorConstants.SHAPE_PROP_NAME_X,
    editorConstants.SHAPE_PROP_NAME_Y,
    editorConstants.SHAPE_PROP_NAME_WIDTH,
    editorConstants.SHAPE_PROP_NAME_WIDTH_CELLS,
    editorConstants.SHAPE_PROP_NAME_RADIUS_X,
    editorConstants.SHAPE_PROP_NAME_RADIUS_Y,
    editorConstants.SHAPE_PROP_NAME_PLACEMENT,
    editorConstants.SHAPE_PROP_NAME_ROTATION,
    editorConstants.SHAPE_PROP_NAME_ALWAYS_SHOW_ANCHOR_POINT,
    editorConstants.SHAPE_PROP_NAME_FLIP_HORIZONTAL,
  ];

  const dispatch = useAppDispatch();

  const nodeConfigList = useNodeConfigList();
  const editNodeList = useEditNodeList();
  const selectedNodeList = useSelectedNodeList();

  const stageWidth = useStageWidth();
  const stageHeight = useStageHeight();
  const latticeWidth = useLatticeWidth();
  const latticeHeight = useLatticeHeight();
  const areaIdLength = useAreaIdLength();
  const tableIdLength = useTableIdLength();
  const branchNumLength = useBranchNumLength();
  const locationDisplayFormatType = useLocationDisplayFormatType();
  const customFormats = useCustomFormats();

  const selectedMenu = useSelectedMenu();

  const [multiSelected, setMultiSelected] = useState(false);

  const [shapeBeforeProperty, setShapeBeforeProperty] = useState<any>({});
  const [shapeAfterProperty, setShapeAfterProperty] = useState<any>({});

  const [singleNodeConfig, setSingleNodeConfig] = useState<any>();

  const [strokeColor, setStrokeColor] = useState<RGBA | undefined>(undefined);
  const [displayStrokeColorPicker, setDisplayStrokeColorPicker] =
    useState<boolean>(false);

  const [fillColor, setFillColor] = useState<RGBA | undefined>(undefined);
  const [displayFillColorPicker, setDisplayFillColorPicker] =
    useState<boolean>(false);

  const [selectedIgnoreLocation, setSelectedIgnoreLocation] = useState<string>(
    editorConstants.IGNORE_LOCATION_ITEM_UNSELECT,
  );

  const [t] = useTranslation();
  // 除外セレクトアイテム
  const ignoreLocationItems = [
    {
      value: editorConstants.IGNORE_LOCATION_ITEM_UNSELECT,
      label: t(
        'organisms:EditorItemProperties.property.ignoreLocationItems.unselect',
      ),
    },
    {
      value: editorConstants.IGNORE_LOCATION_ITEM_MISSING_NUMBER,
      label: t(
        'organisms:EditorItemProperties.property.ignoreLocationItems.missingNumber',
      ),
    },
    {
      value: editorConstants.IGNORE_LOCATION_ITEM_EMPTY_NUMBER,
      label: t(
        'organisms:EditorItemProperties.property.ignoreLocationItems.emptyNumber',
      ),
    },
  ];

  /**
   * 単一のシェイプを選択した場合に変更可能なプロパティを構築します.
   */
  const singleSelectProperties = () => {
    setMultiSelected(false);

    const properties: any = {};

    const firstNode = editNodeList[0];
    const firstNodeConfig = { ...firstNode.attrs.config };

    setSingleNodeConfig(firstNodeConfig);

    const ignoreList = IGNORE_PROP_NAME_LIST.concat(
      IGNORE_SINGLE_PROP_NAME_LIST,
    )
      .concat(
        firstNodeConfig.shape !== SideMenuTypes.PEN &&
          firstNodeConfig.shape !== SideMenuTypes.AREA &&
          firstNodeConfig.shape !== SideMenuTypes.POLYGON &&
          firstNodeConfig.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_X) &&
          firstNodeConfig.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_Y)
          ? []
          : [
              editorConstants.SHAPE_PROP_NAME_X,
              editorConstants.SHAPE_PROP_NAME_Y,
            ],
      )
      .concat(
        // 編目エンドの場合は線幅と線色を除外
        firstNodeConfig.shape === SideMenuTypes.MESH_END
          ? [
              editorConstants.SHAPE_PROP_NAME_STROKE,
              editorConstants.SHAPE_PROP_NAME_STROKE_WIDTH,
            ]
          : [],
      )
      .concat(
        // ゴンドラの場合は向きを除外
        firstNodeConfig.shape === SideMenuTypes.GONDOLA
          ? [editorConstants.SHAPE_PROP_NAME_DIRECTION]
          : [],
      )
      .concat(
        // 線の場合は幅、高さを除外
        firstNodeConfig.shape === SideMenuTypes.LINE
          ? [
              editorConstants.SHAPE_PROP_NAME_WIDTH,
              editorConstants.SHAPE_PROP_NAME_HEIGHT,
            ]
          : [],
      )
      .concat(
        // ペンの場合は点線を除外
        firstNodeConfig.shape === SideMenuTypes.PEN
          ? [editorConstants.SHAPE_PROP_NAME_STROKE_DASH]
          : [],
      )
      .concat(
        // 回転矢印以外は左右反転を除外
        firstNodeConfig.shape !== SideMenuTypes.CIRCLE_ARROW
          ? [editorConstants.SHAPE_PROP_NAME_FLIP_HORIZONTAL]
          : [],
      )
      .concat(
        // ロケーションを持つシェイプの場合は、塗色を除外
        firstNodeConfig.hasOwnProperty(
          editorConstants.SHAPE_PROP_NAME_LOCATION_NUM,
        )
          ? [
              editorConstants.SHAPE_PROP_NAME_FILL,
              editorConstants.SHAPE_PROP_NAME_FILL_RGB,
              editorConstants.SHAPE_PROP_NAME_FILL_TRANSPARENT,
            ]
          : [],
      )
      .concat(
        // フォントサイズを持つシェイプ以外の場合は、フォントサイズを除外
        !firstNodeConfig.hasOwnProperty(
          editorConstants.SHAPE_PROP_NAME_FONT_SIZE,
        )
          ? [editorConstants.SHAPE_PROP_NAME_FONT_SIZE]
          : [],
      );

    CHANGE_PROP_NAME_LIST.forEach((name) => {
      if (ignoreList.includes(name) || !firstNodeConfig.hasOwnProperty(name)) {
        return;
      }

      properties[name] = firstNodeConfig[name];

      // 線色
      if (
        name === editorConstants.SHAPE_PROP_NAME_STROKE &&
        firstNodeConfig.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_STROKE)
      ) {
        properties.strokeTransparent = firstNodeConfig.strokeRgb.a === 0;
      }

      // 塗色
      if (
        name === editorConstants.SHAPE_PROP_NAME_FILL &&
        firstNodeConfig.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_FILL)
      ) {
        properties.fillTransparent = firstNodeConfig.fillRgb.a === 0;
      }

      // 表示
      if (name === editorConstants.SHAPE_PROP_NAME_VISIBLE) {
        properties[name] = firstNodeConfig.visible;
      }
    });

    // 結果返却
    return properties;
  };

  /**
   * 複数のシェイプを選択した場合に変更可能なプロパティを構築します.
   */
  const multipleSelectProperties = () => {
    setMultiSelected(true);

    const properties: any = {};

    // 選択シェイプ数が一括操作の最大数を超えている場合、プロパティ操作を無効化
    if (editNodeList.length > editorConstants.EDITABLE_MAX_SELECTION_SHAPES) {
      return properties;
    }

    const x = editNodeList.filter((node: any) => {
      const config = node?.config ?? node.attrs.config;

      return (
        !(config.shape === SideMenuTypes.PEN) &&
        config.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_X) &&
        config.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_Y)
      );
    });

    // 表示（全て有効か）
    const visible = editNodeList.filter(
      (node: any) => (node?.config ?? node.attrs.config).visible,
    );
    const isAllVisible = visible.length === editNodeList.length;

    // エリア（全て同じ値か）
    const onlyOneAriaId = new Set(
      editNodeList.map(
        (node: any) => (node?.config ?? node.attrs.config).areaId,
      ),
    );
    const isAllSameAreaId = onlyOneAriaId.size === 1;

    // テーブルID（全て同じ値か）
    const onlyOneTableId = new Set(
      editNodeList.map(
        (node: any) => (node?.config ?? node.attrs.config).tableId,
      ),
    );
    const isAllSameTableId = onlyOneTableId.size === 1;

    // ロケーション番号
    const location = editNodeList.filter((node: any) => {
      const config = node?.config ?? node.attrs.config;
      return config.hasOwnProperty(
        editorConstants.SHAPE_PROP_NAME_LOCATION_NUM,
      );
    });

    // テキスト
    const text = editNodeList.filter((node: any) =>
      (node?.config ?? node.attrs.config).hasOwnProperty(
        editorConstants.SHAPE_PROP_NAME_TEXT,
      ),
    );

    // テキスト（全て同じ値か）
    const onlyOneText = new Set(
      editNodeList.map((node: any) => (node?.config ?? node.attrs.config).text),
    );
    const isAllSameText = onlyOneText.size === 1;

    // フォントサイズ（全て同じ値か）
    const onlyOneFontSize = new Set(
      editNodeList.map(
        (node: any) => (node?.config ?? node.attrs.config).fontSize,
      ),
    );
    const isAllSameFontSize = onlyOneFontSize.size === 1;

    // メモ（全て同じ値か）
    const onlyOneNote = new Set(
      editNodeList.map(
        (node: any) => (node?.config ?? node.attrs.config).remarks,
      ),
    );
    const isAllSameNote = onlyOneNote.size === 1;

    // 除外
    // 欠番（全て同じ値か）
    const missingNumber = editNodeList.filter(
      (node: any) => (node?.config ?? node.attrs.config).missingNumber,
    );
    const isAllMissingNumber = missingNumber.length === editNodeList.length;
    // 空白（全て同じ値か）
    const emptyNumber = editNodeList.filter(
      (node: any) => (node?.config ?? node.attrs.config).emptyNumber,
    );
    const isAllEmptyNumber = emptyNumber.length === editNodeList.length;

    // 線幅（全て同じ値か）
    const onlyOneStrokeWidth = new Set(
      editNodeList.map(
        (node: any) => (node?.config ?? node.attrs.config).strokeWidth,
      ),
    );
    const isAllSameStrokeWidth = onlyOneStrokeWidth.size === 1;

    // 複数シェイプの回転（全て同じ角度か）
    const onlyRotation = new Set(editNodeList.map((node) => node.rotation()));
    const isAllSameRotation = onlyRotation.size === 1;

    // 点線（全て有効か）
    const strokeDash = editNodeList.filter(
      (node: any) => (node?.config ?? node.attrs.config).strokeDash,
    );
    const isAllStrokeDash = strokeDash.length === editNodeList.length;

    // 点線（全てに含まれているか）
    const includedInAllStrokeDash =
      editNodeList.filter((node: any) => {
        const config = node?.config ?? node.attrs.config;
        if (config.shape === SideMenuTypes.PEN) {
          return false;
        }
        return config.hasOwnProperty(
          editorConstants.SHAPE_PROP_NAME_STROKE_DASH,
        );
      }).length === editNodeList.length;

    // 線色
    const stroke = editNodeList.filter((node: any) =>
      (node?.config ?? node.attrs.config).hasOwnProperty(
        editorConstants.SHAPE_PROP_NAME_STROKE_WIDTH,
      ),
    );

    // 線色透過（全て有効か）
    const strokeTransparent = editNodeList.filter(
      (node: any) => (node?.config ?? node.attrs.config).strokeTransparent,
    );
    const isAllStrokeTransparent =
      strokeTransparent.length === editNodeList.length;

    // 塗色
    const fill = editNodeList.filter((node: any) => {
      const config = node?.config ?? node.attrs.config;

      // ロケーションを持つシェイプの場合は、塗色を除外
      if (config.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_LOCATION_NUM)) {
        return false;
      }
      return config.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_FILL);
    });

    // 塗色透過（全て有効か）
    const fillTransparent = editNodeList.filter((node: any) => {
      const config = node?.config ?? node.attrs.config;

      // ロケーションを持つシェイプの場合は、塗色を除外
      if (config.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_LOCATION_NUM)) {
        return false;
      }
      return config.fillTransparent;
    });
    const isAllFillTransparent = fillTransparent.length === editNodeList.length;

    // 始点、終点の矢印の表現
    const pointerAtBeginning = editNodeList.filter((node: any) => {
      const config = node?.config ?? node.attrs.config;
      return (
        config.hasOwnProperty(
          editorConstants.SHAPE_PROP_NAME_POINTER_AT_BEGIN,
        ) &&
        config.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_POINTER_AT_END)
      );
    });

    // 全体の奥行き（全て同じ値か）
    const onlyOneDepth = new Set(
      editNodeList.map(
        (node: any) => (node?.config ?? node.attrs.config).depth,
      ),
    );
    const isAllDepth = onlyOneDepth.size === 1;

    // 天板の奥行き（全て同じ値か）
    const onlyOneTableTopDepth = new Set(
      editNodeList.map(
        (node: any) => (node?.config ?? node.attrs.config).tableTopDepth,
      ),
    );
    const isAllTableTopDepth = onlyOneTableTopDepth.size === 1;

    // 全体の奥行き、天板の奥行き
    const depth = editNodeList.filter((node: any) => {
      const config = node?.config ?? node.attrs.config;
      return (
        config.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_DEPTH) &&
        config.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_TABLE_TOP_DEPTH)
      );
    });

    // 向き
    const direction = editNodeList.filter((node: any) =>
      (node?.config ?? node.attrs.config).hasOwnProperty(
        editorConstants.SHAPE_PROP_NAME_DIRECTION,
      ),
    );

    // 配置
    const placement = editNodeList
      .filter((node: any) => (node?.config ?? node.attrs.config).placement)
      .map((node: any) => (node?.config ?? node.attrs.config).placement)
      .reduce((result: string[], current: string) => {
        if (result.length === 0 || !result.includes(current)) {
          result.push(current);
        }
        return result;
      }, [] as string[]);

    // 除外リスト生成
    const ignoreList = IGNORE_PROP_NAME_LIST.concat(IGNORE_GROUP_PROP_NAME_LIST)
      .concat(
        location.length !== editNodeList.length
          ? [
              editorConstants.SHAPE_PROP_NAME_BRANCH_NUM,
              editorConstants.SHAPE_PROP_NAME_LOCATION_NUM,
              editorConstants.SHAPE_PROP_NAME_SHOW_FULL_LOCATION_NUM,
              editorConstants.SHAPE_PROP_NAME_MISSING_NUMBER,
              editorConstants.SHAPE_PROP_NAME_EMPTY_NUMBER,
              editorConstants.SHAPE_PROP_NAME_REMARKS,
            ]
          : [],
      )
      .concat(
        !editNodeList.some(({ config, attrs }) =>
          (config ?? attrs.config).hasOwnProperty(
            editorConstants.SHAPE_PROP_NAME_TABLE_ID,
          ),
        )
          ? [editorConstants.SHAPE_PROP_NAME_TABLE_ID]
          : [],
      )
      .concat(
        !editNodeList.some(({ config, attrs }) =>
          (config ?? attrs.config).hasOwnProperty(
            editorConstants.SHAPE_PROP_NAME_AREA_ID,
          ),
        )
          ? [editorConstants.SHAPE_PROP_NAME_AREA_ID]
          : [],
      )
      .concat(
        x.length !== editNodeList.length
          ? [
              editorConstants.SHAPE_PROP_NAME_X,
              editorConstants.SHAPE_PROP_NAME_Y,
            ]
          : [],
      )
      .concat(
        text.length !== editNodeList.length
          ? [editorConstants.SHAPE_PROP_NAME_TEXT]
          : [],
      )
      .concat(
        !editNodeList.some(({ config, attrs }) =>
          (config ?? attrs.config).hasOwnProperty(
            editorConstants.SHAPE_PROP_NAME_FONT_SIZE,
          ),
        )
          ? [editorConstants.SHAPE_PROP_NAME_FONT_SIZE]
          : [],
      )
      .concat(
        stroke.length !== editNodeList.length
          ? [
              editorConstants.SHAPE_PROP_NAME_STROKE_WIDTH,
              editorConstants.SHAPE_PROP_NAME_STROKE_DASH,
              editorConstants.SHAPE_PROP_NAME_STROKE,
              editorConstants.SHAPE_PROP_NAME_STROKE_RGB,
            ]
          : [],
      )
      .concat(
        !includedInAllStrokeDash
          ? [editorConstants.SHAPE_PROP_NAME_STROKE_DASH]
          : [],
      )
      .concat(
        fill.length !== editNodeList.length
          ? [
              editorConstants.SHAPE_PROP_NAME_FILL,
              editorConstants.SHAPE_PROP_NAME_FILL_RGB,
            ]
          : [],
      )
      .concat(
        pointerAtBeginning.length !== editNodeList.length
          ? [
              editorConstants.SHAPE_PROP_NAME_POINTER_AT_BEGIN,
              editorConstants.SHAPE_PROP_NAME_POINTER_AT_END,
            ]
          : [],
      )
      .concat(
        depth.length !== editNodeList.length
          ? [
              editorConstants.SHAPE_PROP_NAME_DEPTH,
              editorConstants.SHAPE_PROP_NAME_TABLE_TOP_DEPTH,
            ]
          : [],
      )
      .concat(
        direction.length !== editNodeList.length
          ? [editorConstants.SHAPE_PROP_NAME_DIRECTION]
          : [],
      )
      .concat(
        placement.length > 1
          ? [
              editorConstants.SHAPE_PROP_NAME_WIDTH,
              editorConstants.SHAPE_PROP_NAME_HEIGHT,
            ]
          : [],
      );

    // 対象プロパティの値を設定
    CHANGE_PROP_NAME_LIST.forEach((name) => {
      if (!ignoreList.includes(name)) {
        if (
          name === editorConstants.SHAPE_PROP_NAME_WIDTH ||
          name === editorConstants.SHAPE_PROP_NAME_HEIGHT ||
          name === editorConstants.SHAPE_PROP_NAME_ROTATION ||
          name === editorConstants.SHAPE_PROP_NAME_WIDTH_CELLS ||
          name === editorConstants.SHAPE_PROP_NAME_HEIGHT_CELLS
        ) {
          properties[name] = 0;
        } else if (name === editorConstants.SHAPE_PROP_NAME_VISIBLE) {
          // 表示
          properties[name] = isAllVisible;
        } else if (name === editorConstants.SHAPE_PROP_NAME_AREA_ID) {
          // エリアID
          properties[name] = isAllSameAreaId
            ? onlyOneAriaId.values().next().value
            : '';
        } else if (name === editorConstants.SHAPE_PROP_NAME_TABLE_ID) {
          // テーブルID
          properties[name] = isAllSameTableId
            ? onlyOneTableId.values().next().value
            : '';
        } else if (name === editorConstants.SHAPE_PROP_NAME_TEXT) {
          // テキスト
          properties[name] = isAllSameText
            ? onlyOneText.values().next().value
            : '';
        } else if (name === editorConstants.SHAPE_PROP_NAME_FONT_SIZE) {
          // フォントサイズ
          properties[name] = isAllSameFontSize
            ? onlyOneFontSize.values().next().value
            : '';
        } else if (name === editorConstants.SHAPE_PROP_NAME_REMARKS) {
          // メモ
          properties[name] = isAllSameNote
            ? onlyOneNote.values().next().value
            : '';
        } else if (name === editorConstants.SHAPE_PROP_NAME_MISSING_NUMBER) {
          // 欠番
          properties[name] = isAllMissingNumber;
        } else if (name === editorConstants.SHAPE_PROP_NAME_EMPTY_NUMBER) {
          // 空白
          properties[name] = isAllEmptyNumber;
        } else if (name === editorConstants.SHAPE_PROP_NAME_DEPTH) {
          // 全体の奥行き
          properties[name] = isAllDepth
            ? onlyOneDepth.values().next().value
            : '';
        } else if (name === editorConstants.SHAPE_PROP_NAME_TABLE_TOP_DEPTH) {
          // 天板の奥行き
          properties[name] = isAllTableTopDepth
            ? onlyOneTableTopDepth.values().next().value
            : '';
        } else if (name === editorConstants.SHAPE_PROP_NAME_STROKE_WIDTH) {
          // 線幅
          properties[name] = isAllSameStrokeWidth
            ? onlyOneStrokeWidth.values().next().value
            : '';
        } else if (name === editorConstants.SHAPE_PROP_NAME_ALL_ROTATION) {
          // 複数シェイプの回転
          properties[name] = isAllSameRotation
            ? Math.round(onlyRotation.values().next().value)
            : '';
        } else if (name === editorConstants.SHAPE_PROP_NAME_STROKE_DASH) {
          // 点線
          properties[name] = isAllStrokeDash;
        } else if (name === editorConstants.SHAPE_PROP_NAME_STROKE) {
          // 線色
          properties[name] = 'rgba(0, 0, 0, 1)';
        } else if (name === editorConstants.SHAPE_PROP_NAME_STROKE_RGB) {
          // 線色（RGB）
          properties[name] = { r: 0, g: 0, b: 0, a: 1 };
        } else if (
          name === editorConstants.SHAPE_PROP_NAME_STROKE_TRANSPARENT
        ) {
          // 線色透過
          properties[name] = isAllStrokeTransparent;
        } else if (name === editorConstants.SHAPE_PROP_NAME_FILL) {
          // 塗色
          properties[name] = 'rgba(255, 255, 255, 1)';
        } else if (name === editorConstants.SHAPE_PROP_NAME_FILL_RGB) {
          // 塗色（RGB）
          properties[name] = { r: 255, g: 255, b: 255, a: 1 };
        } else if (name === editorConstants.SHAPE_PROP_NAME_FILL_TRANSPARENT) {
          // 塗色透過
          properties[name] = isAllFillTransparent;
        } else {
          properties[name] = '';
        }
      }
    });

    // 結果返却
    return properties;
  };

  /**
   * 中心点からの角度に対応する座標を取得する
   *
   * @param x X座標
   * @param y Y座標
   * @param rad アングル
   * @returns 座標
   */
  const rotatePoint = (x: number, y: number, rad: number) => {
    const rcos = Math.cos(rad);
    const rsin = Math.sin(rad);
    return { x: x * rcos - y * rsin, y: y * rcos + x * rsin };
  };

  /**
   * 三角関数を用いて、中心点に対する基準点を再計算する
   *
   * @param node グループ
   * @param rotation 回転角度
   * @param scaleX X軸拡大率
   * @param scaleY Y軸拡大率
   */
  const rotateAroundCenter = (
    node: Group,
    rotation: number,
    scaleX: number,
    scaleY: number,
  ) => {
    const topLeftX = -node.width() / 2;
    const topLeftY = -node.height() / 2;
    const current = rotatePoint(
      topLeftX,
      topLeftY,
      Konva.getAngle(node.rotation()),
    );
    const rotated = rotatePoint(topLeftX, topLeftY, Konva.getAngle(rotation));
    const dx = rotated.x - current.x,
      dy = rotated.y - current.y;

    node.rotation(rotation);
    node.x(node.x() + dx / scaleX);
    node.y(node.y() + dy / scaleY);
  };

  /**
   * 変更内容を反映します.
   */
  const handleClickApply = () => {
    const shapeProperty: any = {};
    Object.keys(shapeAfterProperty).forEach((key) => {
      if (shapeAfterProperty[key] !== shapeBeforeProperty[key]) {
        shapeProperty[key] = shapeAfterProperty[key];
      }
    });

    // 変更がない場合は何もしない
    if (Object.keys(shapeProperty).length === 0) {
      return;
    }

    const past: any[] = [];
    const present: any[] = [];
    selectedNodeList.forEach((node: any) => {
      const orgConfig = { ...node.config };

      // 変更内容を取得
      const newConfig: any = {};
      Object.keys(shapeProperty).forEach((key) => {
        if (orgConfig.hasOwnProperty(key)) {
          newConfig[key] = shapeProperty[key];
        }
      });

      // テーブルID、枝番
      if (
        [
          editorConstants.SHAPE_PROP_NAME_TABLE_ID,
          editorConstants.SHAPE_PROP_NAME_BRANCH_NUM,
        ].some(
          (name) =>
            orgConfig.hasOwnProperty(name) &&
            shapeProperty.hasOwnProperty(name),
        )
      ) {
        var tableId = shapeProperty.tableId ?? orgConfig.tableId;
        var branchNum = shapeProperty.branchNum ?? orgConfig.branchNum;
        if (!tableId) {
          tableId = orgConfig.tableId;
          newConfig.tableId = orgConfig.tableId;
          shapeAfterProperty.tableId = orgConfig.tableId;
        }

        if (!branchNum) {
          branchNum = orgConfig.branchNum;
          newConfig.branchNum = orgConfig.branchNum;
          shapeAfterProperty.branchNum = orgConfig.branchNum;
        }
        const locationNum = `${tableId}${branchNum}`;

        newConfig.locationNum = locationNum;
        newConfig.displayLocationNum = EditorUtil.generateDisplayLocationNum(
          locationNum,
          locationDisplayFormatType,
          customFormats,
        );
      }

      // フォントサイズ
      if (
        orgConfig.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_FONT_SIZE) &&
        shapeProperty.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_FONT_SIZE)
      ) {
        // 空値で更新された場合、元の値を復元
        newConfig.fontSize = shapeProperty.fontSize
          ? shapeProperty.fontSize
          : orgConfig.fontSize;
      }

      // 幅
      if (
        shapeProperty.hasOwnProperty(
          editorConstants.SHAPE_PROP_NAME_WIDTH_CELLS,
        )
      ) {
        const widthCells = shapeProperty.widthCells ?? orgConfig.widthCells;
        newConfig.width = widthCells * latticeWidth;
      }

      // 高さ
      if (
        shapeProperty.hasOwnProperty(
          editorConstants.SHAPE_PROP_NAME_HEIGHT_CELLS,
        )
      ) {
        const heightCells = shapeProperty.heightCells ?? orgConfig.heightCells;
        newConfig.height = heightCells * latticeHeight;
      }

      // 線幅
      if (
        shapeProperty.hasOwnProperty(
          editorConstants.SHAPE_PROP_NAME_STROKE_WIDTH,
        )
      ) {
        // 空値で更新された場合、元の値を復元
        // 0 を許容している為、0 を有効な値として判定
        newConfig.strokeWidth =
          shapeProperty.strokeWidth === 0 || shapeProperty.strokeWidth
            ? shapeProperty.strokeWidth
            : orgConfig.strokeWidth;
      }

      // 対象シェイプが特殊型の場合
      if (orgConfig.shape === SideMenuTypes.SPECIAL_SHAPE) {
        newConfig.direction = shapeProperty.direction ?? orgConfig.direction;
        newConfig.width = shapeProperty.width ?? orgConfig.width;
        newConfig.depth = shapeProperty.depth
          ? shapeProperty.depth
          : orgConfig.depth;
        newConfig.tableTopDepth = shapeProperty.tableTopDepth
          ? shapeProperty.tableTopDepth
          : orgConfig.tableTopDepth;
      }

      // 対象シェイプが編目エンドで、向きの変更があった場合
      if (
        orgConfig.shape === SideMenuTypes.MESH_END &&
        shapeProperty.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_DIRECTION)
      ) {
        // 向きによって配置（縦、横）を切り替える
        if (
          newConfig.direction === Directions.TOP ||
          newConfig.direction === Directions.BOTTOM
        ) {
          // 上、下の場合は横
          newConfig.placement = GondolaPlacements.HORIZONTAL;
        } else if (
          newConfig.direction === Directions.RIGHT ||
          newConfig.direction === Directions.LEFT
        ) {
          // 右、左の場合は縦
          newConfig.placement = GondolaPlacements.VERTICAL;
        }

        // 配置（縦、横）に変更が合った場合、幅、高さを入替える
        if (newConfig.placement !== orgConfig.placement) {
          const width = newConfig.width ?? orgConfig.width;
          const height = newConfig.height ?? orgConfig.height;

          newConfig.width = height;
          newConfig.height = width;

          newConfig.widthCells =
            shapeProperty.heightCells ?? orgConfig.heightCells;
          newConfig.heightCells =
            shapeProperty.widthCells ?? orgConfig.widthCells;
        }
      }

      // 除外
      if (
        shapeProperty.hasOwnProperty(
          editorConstants.SHAPE_PROP_NAME_MISSING_NUMBER,
        ) ||
        shapeProperty.hasOwnProperty(
          editorConstants.SHAPE_PROP_NAME_EMPTY_NUMBER,
        )
      ) {
        newConfig.missingNumber = shapeProperty.hasOwnProperty(
          editorConstants.SHAPE_PROP_NAME_MISSING_NUMBER,
        )
          ? shapeProperty.missingNumber
          : false;
        newConfig.emptyNumber = shapeProperty.hasOwnProperty(
          editorConstants.SHAPE_PROP_NAME_EMPTY_NUMBER,
        )
          ? shapeProperty.emptyNumber
          : false;
      }

      // 変更内容を反映
      node.config = { ...orgConfig, ...newConfig };
      node.fire('changeConfig');

      past.push({ id: orgConfig.uuid, config: { ...orgConfig } });
      present.push({
        id: orgConfig.uuid,
        config: { ...orgConfig, ...newConfig },
      });
    });

    // 複数シェイプの回転
    if (
      shapeProperty.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_ALL_ROTATION)
    ) {
      // 選択範囲の基準値を取得
      const currentTransformer = props.transformer.current as Group;
      const baseX = currentTransformer.absolutePosition().x;
      const baseY = currentTransformer.absolutePosition().y;
      const baseHeight = currentTransformer.height();
      const baseWidth = currentTransformer.width();
      const baseStage = currentTransformer.getStage() as Stage;
      const baseScaleX = baseStage.scaleX();
      const baseScaleY = baseStage.scaleY();

      // 選択したシェイプを親グループの起点に合わせる
      // ステージ上の座標からtransformerの起点を引いた値で座標を決める
      editNodeList.forEach((d: Group) => {
        const orgConfig = { ...d.attrs };
        const newConfig: any = {};
        newConfig.x = orgConfig.x - baseX / baseScaleX;
        newConfig.y = orgConfig.y - baseY / baseScaleY;
        newConfig.rotation = d.getAbsoluteRotation();
        d.attrs.config = { ...orgConfig, ...newConfig };
        d.fire('changeConfig');
      });

      // 親グループをトランスフォーマーの選択範囲を元に作成
      const parentGroup = new Group({
        x: baseX / baseScaleX,
        y: baseY / baseScaleY,
        width: baseWidth,
        height: baseHeight,
        rotation: 0,
      });
      // 親グループの座標に調整済みのシェイプを追加
      parentGroup.add(...editNodeList);

      // 親グループに対して角度の設定、および中心点で回転するように描画位置の再計算を行う
      rotateAroundCenter(
        parentGroup,
        shapeProperty.allRotation - shapeBeforeProperty.allRotation,
        baseScaleX,
        baseScaleY,
      );

      // 親グループを破棄し、各シェイプの位置、角度をステージ上の絶対値で更新し、編集レイヤーへ移動する
      parentGroup
        .getChildren()
        .map((d) => d as Group)
        .forEach((d) => {
          const orgConfig = { ...d.attrs };
          const newConfig: any = {};
          newConfig.x = d.absolutePosition().x;
          newConfig.y = d.absolutePosition().y;
          newConfig.rotation = d.getAbsoluteRotation();
          d.attrs.config = { ...orgConfig, ...newConfig };
          d.fire('changeConfig');
          d.moveTo(props.editLayer.current);

          present.push({
            id: orgConfig.uuid,
            config: { ...orgConfig, ...newConfig },
          });
        });

      // 回転したゴンドラが含まれていた場合、サイズ変更を不可にする
      props.transformer.current?.resizeEnabled(
        !editNodeList.find(
          (node: any) =>
            (node.config ?? node.attrs.config).shape ===
              SideMenuTypes.GONDOLA && node.rotation() !== 0,
        ),
      );
    }

    // 変更前のプロパティ内容を更新
    setShapeBeforeProperty({ ...shapeAfterProperty });

    // 選択中のシェイプを再選択
    // Undo リストに追加依頼
    dispatch(
      editorShapeModule.actions.updateMapPresent({
        operation: ShapeOperations.CHANGE,
        past,
        present,
      }),
    );

    dispatch(editorNodeModule.actions.updateChangeNodeList());
    dispatch(editorNodeModule.actions.reselectEditNodeList());

    // メニュー選択状態リセット
    if (selectedMenu !== SideMenuTypes.SELECT_TOOL) {
      dispatch(
        editorOpModule.actions.updateOp({
          selectedMenu: SideMenuTypes.SELECT_TOOL,
          opHoldItems: [],
          finishOpHold: false,
        }),
      );
    }
  };

  /**
   * 線色、塗色の選択色変更イベント.
   */
  const handleChangeShapeProperty = useCallback((prop: any) => {
    setStrokeColor(prop.stroke);
    setFillColor(prop.fill);
    setShapeAfterProperty(prop);
  }, []);

  /**
   * 線色用のパレットを表示します.
   */
  const handleShowSketchPicker = useCallback((rgba?: RGBA) => {
    if (!rgba) {
      return;
    }

    setStrokeColor(rgba);
    setDisplayStrokeColorPicker(true);
  }, []);

  /**
   * 塗色用のパレットを表示します.
   */
  const handleShowFillSketchPicker = useCallback((rgba?: RGBA) => {
    if (!rgba) {
      return;
    }

    setFillColor(rgba);
    setDisplayFillColorPicker(true);
  }, []);

  /**
   * パレットを閉じます.
   */
  const handleCloseSketchPicker = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    e.stopPropagation();

    if (e.target === e.currentTarget) {
      if (displayStrokeColorPicker) {
        setDisplayStrokeColorPicker(false);
      }
      if (displayFillColorPicker) {
        setDisplayFillColorPicker(false);
      }
    }
  };

  /**
   * 除外ロケーションタイプの選択イベント.
   */
  const handleChangeIgnoreLocation = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    e.stopPropagation();

    if (
      e.target.value === editorConstants.IGNORE_LOCATION_ITEM_MISSING_NUMBER
    ) {
      handleChangeShapeProperty({
        ...shapeAfterProperty,
        missingNumber: true,
        emptyNumber: false,
      });
    } else if (
      e.target.value === editorConstants.IGNORE_LOCATION_ITEM_EMPTY_NUMBER
    ) {
      handleChangeShapeProperty({
        ...shapeAfterProperty,
        missingNumber: false,
        emptyNumber: true,
      });
    } else {
      handleChangeShapeProperty({
        ...shapeAfterProperty,
        missingNumber: false,
        emptyNumber: false,
      });
    }
    setSelectedIgnoreLocation(e.target.value);
  };

  const initIgnoreLocation = (properties: any) => {
    if (properties.missingNumber) {
      return editorConstants.IGNORE_LOCATION_ITEM_MISSING_NUMBER;
    } else if (properties.emptyNumber) {
      return editorConstants.IGNORE_LOCATION_ITEM_EMPTY_NUMBER;
    }
    return editorConstants.IGNORE_LOCATION_ITEM_UNSELECT;
  };

  /**
   * 選択されたシェイプで変更可能なプロパティ情報を構築します.
   */
  useEffect(() => {
    // 何も選択されていない場合
    if (editNodeList.length === 0) {
      setShapeBeforeProperty({});
      setShapeAfterProperty({});
      return;
    }
    setSingleNodeConfig(undefined);

    // 変更可能なプロパティを取得
    const properties: any =
      editNodeList.length === 1
        ? singleSelectProperties()
        : multipleSelectProperties();

    // 変更前プロパティを初期化
    setShapeBeforeProperty(properties);

    // 変更後プロパティを初期化
    setShapeAfterProperty(properties);

    // 除外ドロップダウンの選択肢を初期化
    setSelectedIgnoreLocation(initIgnoreLocation(properties));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editNodeList, nodeConfigList]);

  /**
   * シェイプ選択状態から未選択状態に変更した場合に、シェイププロパティをクリアする.
   */
  useEffect(() => {
    if (
      Object.keys(shapeAfterProperty).length !== 0 &&
      editNodeList.length === 0
    ) {
      setShapeBeforeProperty({});
      setShapeAfterProperty({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shapeAfterProperty]);

  return (
    <Component
      multiSelected={multiSelected}
      stageWidth={stageWidth}
      stageHeight={stageHeight}
      latticeWidth={latticeWidth}
      latticeHeight={latticeHeight}
      areaIdLength={areaIdLength}
      tableIdLength={tableIdLength}
      branchNumLength={branchNumLength}
      disableApplyButton={Object.keys(shapeAfterProperty).length === 0}
      onClickApply={handleClickApply}
      singleNodeConfig={singleNodeConfig}
      shapeProperty={shapeAfterProperty}
      onChangeShapeProperty={handleChangeShapeProperty}
      strokeColor={strokeColor}
      displayStrokeColorPicker={displayStrokeColorPicker}
      onShowSketchPicker={handleShowSketchPicker}
      fillColor={fillColor}
      displayFillColorPicker={displayFillColorPicker}
      onShowFillSketchPicker={handleShowFillSketchPicker}
      onCloseSketchPicker={handleCloseSketchPicker}
      selectedIgnoreLocation={selectedIgnoreLocation}
      ignoreLocationItems={ignoreLocationItems}
      onChangeIgnoreLocation={handleChangeIgnoreLocation}
    />
  );
};
