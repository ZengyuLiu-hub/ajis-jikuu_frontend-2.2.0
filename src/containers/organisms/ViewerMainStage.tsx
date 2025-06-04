import dayjs from 'dayjs';
import Konva from 'konva';
import { useEffect, useRef, useState } from 'react';

import * as editorConstants from '../../constants/editor';
import * as mapConstants from '../../constants/map';
import * as viewerConstants from '../../constants/viewer';

import { useAppDispatch } from '../../app/hooks';
import {
  CountLocation,
  MapPdfOrientations,
  MapPdfOutputModes,
  MapPdfPrintSettings,
  MapPdfRotations,
  RGBA,
  ScreenCaptureRanges,
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
  useCountLocations,
  useLanguage,
  useUser,
  useViewAreaLayerData,
  useViewCurrentLayout,
  useViewInventoryNote,
  useViewLatticeHeight,
  useViewLatticeWidth,
  useViewLocationAggregateDataType,
  useViewLocationColorType,
  useViewMapVersion,
  useViewProductLocations,
  useViewScrollPosition,
  useViewSelectedNodeIds,
  useViewSelectedNodeList,
  useViewStageHeight,
  useViewStageScale,
  useViewStageWidth,
  useViewerPdfOutputSettings,
} from '../../selectors';

import { ShapeFreeText } from '../../components/molecules';
import {
  ViewerMainStage as Component,
  MapPdf,
  MapPdfInventory,
  MapPdfStatementOfDelivery,
} from '../../components/organisms';
import { MapPdfProps } from '../../components/organisms/MapPdf';
import { MapPdfData } from '../../components/organisms/MapPdfStatementOfDelivery';
import { useViewNeedsPrintPdf } from '../../selectors/viewerLayout';

Konva.pixelRatio = 1;

interface Props {
  areaLayerRef: React.RefObject<Konva.Layer>;
  mapLayerRef: React.RefObject<Konva.Layer>;
}

/**
 * マップビューア：ステージ
 */
export const ViewerMainStage = (props: Props) => {
  const { areaLayerRef, mapLayerRef } = props;

  const dispatch = useAppDispatch();

  const user = useUser();
  const language = useLanguage();

  const mapVersion = useViewMapVersion();
  const scrollPosition = useViewScrollPosition();

  const stageScale = useViewStageScale();
  const stageWidth = useViewStageWidth();
  const stageHeight = useViewStageHeight();
  const latticeWidth = useViewLatticeWidth();
  const latticeHeight = useViewLatticeHeight();

  const note = useViewInventoryNote();
  const pdfOutputSettings = useViewerPdfOutputSettings();

  const areaLayerData = useViewAreaLayerData();

  const currentLayout = useViewCurrentLayout();
  const needsPrintPdf = useViewNeedsPrintPdf();

  const selectedNodeIds = useViewSelectedNodeIds();
  const selectedNodeList = useViewSelectedNodeList();

  const viewLocationColorType = useViewLocationColorType();
  const viewLocationAggregateDataType = useViewLocationAggregateDataType();
  const countLocations = useCountLocations();
  const productLocations = useViewProductLocations();

  const canvasContainer = useRef<HTMLDivElement>(null);
  const stage = useRef<Konva.Stage>(null);
  const operationLayer = useRef<Konva.Layer>(null);
  const transformer = useRef<Konva.Transformer>(null);

  const [selectedShapeConfig, setSelectedShapeConfig] = useState<any>();
  const [selectedShapeCountLocation, setSelectedShapeCountLocation] =
    useState<any>();
  const [jurisdictionClass, setJurisdictionClass] = useState<string>('');
  const [companyCode, setCompanyCode] = useState<string>('');
  const [storeCode, setStoreCode] = useState<string>('');
  const [inventoryDates, setInventoryDatesCode] = useState<Date[]>([]);
  const [selectedShapeCountLocations, setSelectedShapeCountLocations] =
    useState<any[]>([]);

  // ノードリスト更新
  const refreshNodeList = () => {
    const maps =
      mapLayerRef.current?.children?.map((node: any) => node.config) ?? [];
    const areas =
      areaLayerRef.current?.children?.map((node: any) => node.config) ?? [];

    dispatch(viewerNodeModule.actions.updateNodeConfigList(maps.concat(areas)));
  };

  // マップの PDF 帳票を作成します
  const printPdf = (settings: MapPdfPrintSettings) => {
    if (!canvasContainer.current || !stage.current) {
      return;
    }

    const mimeType = 'image/jpeg';
    const quality = 0;
    const pixelRatio = 2;

    const wrapperRect = canvasContainer.current?.getClientRects()[0];
    const { stageWidth, stageHeight } = pdfOutputSettings;

    const width =
      pdfOutputSettings.screenCaptureRange === ScreenCaptureRanges.STAGE
        ? stageWidth
        : (wrapperRect?.width ?? 0) > stageWidth
          ? stageWidth
          : wrapperRect?.width ?? 0;

    const height =
      pdfOutputSettings.screenCaptureRange === ScreenCaptureRanges.STAGE
        ? stageHeight
        : (wrapperRect?.height ?? 0) > stageHeight
          ? stageHeight
          : wrapperRect?.height ?? 0;

    // 画面の幅を取得
    const clientWidth = () => {
      const scaledStage = stageWidth * (stageScale / 100);
      if (scaledStage < (wrapperRect?.width ?? 0)) {
        return Math.max(
          scaledStage - (canvasContainer.current?.scrollLeft ?? 0),
          1,
        );
      }

      // スクロール分を除いた幅を返却
      return (wrapperRect?.width ?? 0) - 20;
    };

    // 画面の高さを取得
    const clientHeight = () => {
      const scaledStage = stageHeight * (stageScale / 100);
      if (scaledStage < (wrapperRect?.height ?? 0)) {
        return Math.max(
          scaledStage - (canvasContainer.current?.scrollTop ?? 0),
          1,
        );
      }

      // スクロール分を除いた高さを返却
      return (wrapperRect?.height ?? 0) - 20;
    };

    const option =
      pdfOutputSettings.screenCaptureRange === ScreenCaptureRanges.STAGE
        ? {
            mimeType,
            x: 0,
            y: 0,
            width,
            height,
            quality,
            pixelRatio,
          }
        : {
            mimeType,
            x: canvasContainer.current?.scrollLeft,
            y: canvasContainer.current?.scrollTop,
            width: clientWidth(),
            height: clientHeight(),
            quality,
            pixelRatio,
          };

    const imageSize = {
      width: option.width * pixelRatio,
      height: option.height * pixelRatio,
    };

    // キャプチャ用背景
    const background = new Konva.Rect({
      id: 'printBackground',
      listening: false,
      perfectDrawEnabled: false,
      strokeScaleEnabled: false,
      shadowForStrokeEnabled: false,
      hitStrokeWidth: 0,
      x: 0,
      y: 0,
      // ステージサイズ範囲外にズームが小さいほど広い余白を指定
      width:
        stageWidth * mapConstants.MAX_STAGE_SCALE_RATIO * (100 / stageScale),
      height:
        stageHeight * mapConstants.MAX_STAGE_SCALE_RATIO * (100 / stageScale),
      fill: 'rgba(255, 255, 255, 1)',
      strokeWidth: 0,
    });

    const areaLayer = stage.current
      .getLayers()
      .find((d: any) => d.id() === 'areaLayer');
    if (areaLayer && areaLayer.visible()) {
      // キャプチャ用背景追加
      areaLayer.add(background);
      background.moveToBottom();
    }

    // 印刷から除外するシェイプを非表示
    let excludeNodes: any[] = [];
    if (settings.outputMode === MapPdfOutputModes.STATEMENT_OF_DELIVERY) {
      const nodes =
        stage.current
          .getLayers()
          .find((d) => d.id() === 'mapLayer')
          ?.children?.filter(
            (node: any) => node.excludesPdfOutput() && node.getAttr('visible'),
          ) ?? [];
      excludeNodes.push(...nodes);
      excludeNodes.forEach((node: any) => node.setAttr('visible', false));
    }

    const { jurisdictionClass, companyCode, storeCode } = mapVersion;

    const layoutName = currentLayout.layoutName.replace(/[\s　]+/g, '');

    const mapPdfData: MapPdfData = {
      ...(({
        jurisdictionClass,
        companyName,
        storeName,
        zipCode,
        address1,
        address2,
        addressDetail,
        tel,
        fax,
        inventorySchedule: { inventoryDates } = { inventoryDates: [] },
      }) => ({
        jurisdictionClass,
        companyName,
        storeName,
        zipCode,
        address1,
        address2,
        addressDetail,
        tel,
        fax,
        inventoryDates,
      }))(mapVersion),
      layoutName: currentLayout.layoutName,
    };

    // 最新の日付けを取得する
    let latestDate = '';
    if (mapPdfData.inventoryDates.length > 0) {
      latestDate = mapPdfData.inventoryDates
        .reduce((latest, current) => (current > latest ? current : latest))
        .toString();
    }

    // ファイル名
    const filename =
      settings.outputMode === MapPdfOutputModes.STATEMENT_OF_DELIVERY
        ? `${latestDate}_${jurisdictionClass}_${companyCode}_${storeCode}_${layoutName}_layoutmap.pdf`
        : `${latestDate}_${jurisdictionClass}_${companyCode}_${storeCode}_${layoutName}_layoutmap_inv.pdf`;

    // PDF 化
    const createMapPdf = (props: MapPdfProps) => {
      // ヘッダー・フッターなし
      if (!settings.outputHeaderFooter) {
        return new MapPdf(props);
      }

      // ヘッダー・フッターあり
      if (settings.outputMode === MapPdfOutputModes.STATEMENT_OF_DELIVERY) {
        return new MapPdfStatementOfDelivery({ ...props, data: mapPdfData });
      } else if (settings.outputMode === MapPdfOutputModes.INVENTORY) {
        return new MapPdfInventory({ ...props, note });
      }
      return new MapPdf(props);
    };

    if (settings.rotation !== MapPdfRotations.NONE) {
      const degree = settings.rotation === MapPdfRotations.RIGHT ? 90 : -90;

      const canvas = document.createElement('canvas');
      canvas.width = option.height;
      canvas.height = option.width;

      const context = canvas.getContext('2d');

      // 印刷範囲のイメージをキャンバスに書き出してから回転して PDF 出力
      const image = new Image();
      image.src = stage.current.toDataURL(option);
      image
        .decode()
        .then(() => {
          if (!context) {
            return;
          }

          context.translate(canvas.width / 2, canvas.height / 2);
          context.rotate(degree * (Math.PI / 180));
          context.drawImage(
            image,
            -(canvas.height / 2),
            -(canvas.width / 2),
            canvas.height,
            canvas.width,
          );

          const pdf = createMapPdf({
            orientation: MapPdfOrientations.landscape,
            paperSize: pdfOutputSettings.printSize,
            imageData: canvas.toDataURL(mimeType),
            imageSize: { width: imageSize.height, height: imageSize.width },
            filename,
            language,
            timezone: user.timeZone,
          });
          pdf.build();
        })
        .finally(() => {
          canvas.remove();
        });
    } else {
      const pdf = createMapPdf({
        orientation: MapPdfOrientations.landscape,
        paperSize: pdfOutputSettings.printSize,
        imageData: stage.current.toDataURL(option),
        imageSize,
        filename,
        language,
        timezone: user.timeZone,
      });
      pdf.build();
    }

    // 印刷から除外するシェイプを復元
    excludeNodes.forEach((node: any) => node.setAttr('visible', true));

    // キャプチャ用背景削除
    if (areaLayer && areaLayer.visible()) {
      const printBackground = areaLayer.findOne('#printBackground');
      if (printBackground) {
        printBackground.destroy();
      }
    }
  };

  /**
   * ステータス毎のロケーション背景色を取得します.
   *
   * @param {CountLocation} loc カウントロケーションデータ
   * @param {ViewLocationColorType} colorType ビューアロケーション色種別
   */
  const getViewLocationColor: (
    loc: CountLocation,
    colorType?: ViewLocationColorType,
  ) => { fillRgb: RGBA; fill: string } = (
    loc: CountLocation,
    colorType?: ViewLocationColorType,
  ) => {
    // カウント進捗
    if (colorType === ViewLocationColorTypes.COUNT_PROGRESS) {
      // カウント済み
      return {
        fillRgb: viewerConstants.VIEWER_LOCATION_FILL_RGB_LIGHT_BLUE,
        fill: viewerConstants.VIEWER_LOCATION_FILL_LIGHT_BLUE,
      };
    }

    // 集中チェック
    if (colorType === ViewLocationColorTypes.INTENSIVE_CHECK) {
      if (loc.intensiveCheckStatus === '1') {
        // ロケ重複
        return {
          fillRgb: viewerConstants.VIEWER_LOCATION_FILL_RGB_GREEN,
          fill: viewerConstants.VIEWER_LOCATION_FILL_GREEN,
        };
      } else if (loc.intensiveCheckStatus === '2') {
        // 要チェック
        return {
          fillRgb: viewerConstants.VIEWER_LOCATION_FILL_RGB_RED,
          fill: viewerConstants.VIEWER_LOCATION_FILL_RED,
        };
      } else if (loc.intensiveCheckStatus === '5') {
        // チェックOK
        return {
          fillRgb: viewerConstants.VIEWER_LOCATION_FILL_RGB_BLUE,
          fill: viewerConstants.VIEWER_LOCATION_FILL_BLUE,
        };
      } else if (loc.intensiveCheckStatus === '6') {
        // データ OK (問題無し)
        return {
          fillRgb: viewerConstants.VIEWER_LOCATION_FILL_RGB_LIGHT_BLUE,
          fill: viewerConstants.VIEWER_LOCATION_FILL_LIGHT_BLUE,
        };
      }
    }

    // サンプリング
    if (colorType === ViewLocationColorTypes.SAMPLING) {
      if (loc.samplingStatus === '3') {
        // 指定ロケーション
        return {
          fillRgb: viewerConstants.VIEWER_LOCATION_FILL_RGB_ORANGE,
          fill: viewerConstants.VIEWER_LOCATION_FILL_ORANGE,
        };
      } else if (loc.samplingStatus === '5') {
        // チェック完了
        return {
          fillRgb: viewerConstants.VIEWER_LOCATION_FILL_RGB_BLUE,
          fill: viewerConstants.VIEWER_LOCATION_FILL_BLUE,
        };
      }
    }

    // オーディット
    if (colorType === ViewLocationColorTypes.AUDIT) {
      if (loc.auditStatus === '4') {
        // 指定ロケーション
        return {
          fillRgb: viewerConstants.VIEWER_LOCATION_FILL_RGB_YELLOW,
          fill: viewerConstants.VIEWER_LOCATION_FILL_YELLOW,
        };
      } else if (loc.auditStatus === '5') {
        // チェック完了
        return {
          fillRgb: viewerConstants.VIEWER_LOCATION_FILL_RGB_BLUE,
          fill: viewerConstants.VIEWER_LOCATION_FILL_BLUE,
        };
      }
    }

    // 全体進捗
    if (colorType === ViewLocationColorTypes.ALL_PROGRESS) {
      if (loc.allProgressStatus === '1') {
        // ロケ重複
        return {
          fillRgb: viewerConstants.VIEWER_LOCATION_FILL_RGB_GREEN,
          fill: viewerConstants.VIEWER_LOCATION_FILL_GREEN,
        };
      } else if (loc.allProgressStatus === '2') {
        // 要チェック
        return {
          fillRgb: viewerConstants.VIEWER_LOCATION_FILL_RGB_RED,
          fill: viewerConstants.VIEWER_LOCATION_FILL_RED,
        };
      } else if (loc.allProgressStatus === '3') {
        // サンプリング
        return {
          fillRgb: viewerConstants.VIEWER_LOCATION_FILL_RGB_ORANGE,
          fill: viewerConstants.VIEWER_LOCATION_FILL_ORANGE,
        };
      } else if (loc.allProgressStatus === '4') {
        // オーディット
        return {
          fillRgb: viewerConstants.VIEWER_LOCATION_FILL_RGB_YELLOW,
          fill: viewerConstants.VIEWER_LOCATION_FILL_YELLOW,
        };
      } else if (loc.allProgressStatus === '5') {
        // チェック完了
        return {
          fillRgb: viewerConstants.VIEWER_LOCATION_FILL_RGB_BLUE,
          fill: viewerConstants.VIEWER_LOCATION_FILL_BLUE,
        };
      } else if (loc.allProgressStatus === '6') {
        // カウント済み
        return {
          fillRgb: viewerConstants.VIEWER_LOCATION_FILL_RGB_LIGHT_BLUE,
          fill: viewerConstants.VIEWER_LOCATION_FILL_LIGHT_BLUE,
        };
      }
    }

    return {
      fillRgb: viewerConstants.VIEWER_LOCATION_FILL_RGB_WHITE,
      fill: viewerConstants.VIEWER_LOCATION_FILL_WHITE,
    };
  };

  /**
   * 集計値毎のロケーションテキストを取得します.
   *
   * @param {CountLocation} loc カウントロケーションデータ
   * @param {ViewLocationAggregateDataType} type ビューアロケーション色種別
   * @param {string} editorText エディタテキスト
   */
  const getViewLocationText = (
    type: ViewLocationAggregateDataType,
    editorText: string,
    loc?: CountLocation,
  ) => {
    if (type === ViewLocationAggregateDataTypes.DEPARTMENT_NAME) {
      return loc?.departmentName ?? '';
    } else if (type === ViewLocationAggregateDataTypes.QUANTITY) {
      return loc?.quantity ?? '';
    } else if (type === ViewLocationAggregateDataTypes.EMPLOYEE_NUM) {
      return loc?.employeeCode ?? '';
    } else if (type === ViewLocationAggregateDataTypes.COUNT_TIME) {
      return loc?.countTime ?? '';
    } else if (type === ViewLocationAggregateDataTypes.EDITOR_TEXT) {
      return editorText ?? '';
    }
    return '';
  };

  /**
   * ステータスをロケーション背景色に反映します.
   *
   * @param {ViewLocationColorType} colorType ビューアロケーション色種別
   */
  const applyStatusForLocationFill = (colorType?: ViewLocationColorType) => {
    mapLayerRef.current?.children?.forEach((node: any) => {
      // ロケーション番号が存在しない場合は除外
      if (
        !node.attrs.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_LOCATION_NUM)
      ) {
        return;
      }

      // エディタテキストを退避
      const editorText = node.attrs.hasOwnProperty(
        viewerConstants.SHAPE_PROP_NAME_EDITOR_TEXT,
      )
        ? node.attrs.editorText
        : node.attrs.text;

      if (node.attrs?.missingNumber || node.attrs?.emptyNumber) {
        // 表示テキストを取得
        const text = node instanceof ShapeFreeText ? editorText : '';

        // プロパティ初期化
        const config = {
          ...node.config,
          editorText,
          text,
          fillRgb: viewerConstants.VIEWER_LOCATION_FILL_RGB_WHITE,
          fill: viewerConstants.VIEWER_LOCATION_FILL_WHITE,
        };

        node.config = config;
        return;
      }

      // ロケーションに対応したカウントロケーションデータを取得
      const loc = countLocations.find(
        (d) =>
          d.areaId === node.attrs.areaId &&
          d.locationNum === node.attrs.locationNum,
      );

      // 表示テキストを取得
      const text =
        node instanceof ShapeFreeText
          ? editorText
          : getViewLocationText(viewLocationAggregateDataType, editorText, loc);

      // プロパティ初期化
      const config = {
        ...node.config,
        editorText,
        text,
        fillRgb: viewerConstants.VIEWER_LOCATION_FILL_RGB_WHITE,
        fill: viewerConstants.VIEWER_LOCATION_FILL_WHITE,
      };

      // 商品ロケーション判定
      const isProductLocation =
        colorType === ViewLocationColorTypes.PRODUCT_LOCATION &&
        productLocations.some(
          (d) =>
            d.areaId === node.attrs.areaId &&
            d.locationNum === node.attrs.locationNum,
        );
      if (isProductLocation) {
        // ロケーションが商品ロケーションの検索結果に含まれる
        config.fillRgb = viewerConstants.VIEWER_LOCATION_FILL_RGB_YELLOW_GREEN;
        config.fill = viewerConstants.VIEWER_LOCATION_FILL_YELLOW_GREEN;
      } else {
        // 状態別に背景色を反映
        if (loc) {
          const color = getViewLocationColor(loc, colorType);
          config.fillRgb = color.fillRgb;
          config.fill = color.fill;
        }
      }

      // 背景色またはテキストが未反映の場合
      if (node.config.fill !== config.fill || node.config.text !== text) {
        node.config = config;
      }
    });
  };

  /**
   * 修正値をロケーションテキストに反映します.
   *
   * @param {ViewLocationAggregateDataType} type ビューアロケーション集計値種別
   */
  const applyAggregateDataForLocationText = (
    type: ViewLocationAggregateDataType,
  ) => {
    mapLayerRef.current?.children?.forEach((node: any) => {
      // ロケーション番号が存在しない場合は除外
      if (
        !node.attrs.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_LOCATION_NUM)
      ) {
        return;
      }

      // エディタテキストを退避
      const editorText = node.attrs.hasOwnProperty(
        viewerConstants.SHAPE_PROP_NAME_EDITOR_TEXT,
      )
        ? node.attrs.editorText
        : node.attrs.text;

      if (node.attrs?.missingNumber || node.attrs?.emptyNumber) {
        // 表示テキストを取得
        const text = node instanceof ShapeFreeText ? editorText : '';

        node.config = { ...node.config, text };
        return;
      }

      // ロケーションに対応したカウントロケーションデータを取得
      const loc = countLocations.find(
        (d) =>
          d.areaId === node.attrs.areaId &&
          d.locationNum === node.attrs.locationNum,
      );

      // 表示テキストを取得
      const text =
        node instanceof ShapeFreeText
          ? editorText
          : getViewLocationText(type, editorText, loc);

      if (!loc) {
        node.config = { ...node.config, editorText, text };
        return;
      }

      // テキストが反映済みの場合はスキップ
      if (node.config.text !== text) {
        node.config = { ...node.config, text };
      }
    });
  };

  // ロケーションプロパティ生成
  const buildLocationPropertyData = (config: any) => {
    // プロパティ情報を設定（共通）
    const countLocationData: any = {
      areaId: config.areaId,
      tableId: config.tableId,
      branchNum: config.branchNum,
      locationNum: config.locationNum,
      departmentName: '',
      quantity: undefined,
      employeeCode: '',
      countTime: '',
      editorText: config.editorText,
      text: config.text,
      missingNumber: config.missingNumber,
      emptyNumber: config.emptyNumber,
      createdAt: '',
      countProgressStatus: '7',
      intensiveCheckStatus: '7',
      samplingStatus: '7',
      auditStatus: '7',
      allProgressStatus: '7',
    };

    // プロパティ情報を設定（個別）
    if (config.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_REMARKS)) {
      countLocationData.remarks = config.remarks;
    }

    const { jurisdictionClass, companyCode, storeCode, inventorySchedule } =
      mapVersion;

    const targets =
      inventorySchedule?.inventoryDates
        ?.map((date) => {
          const inventoryDate = dayjs(date).format('YYYYMMDD');

          // 選択ロケーションのデータを取得
          return countLocations.find(
            (d: any) =>
              d.jurisdictionClass === jurisdictionClass &&
              d.companyCode === companyCode &&
              d.storeCode === storeCode &&
              d.inventoryDate === inventoryDate &&
              d.areaId === config.areaId &&
              d.locationNum === config.locationNum,
          );
        })
        .filter(Boolean) ?? [];

    // ロケーションデータが取得できた場合は情報を反映
    if (targets.length > 0) {
      const data = targets[0];

      countLocationData.departmentName = data?.departmentName;
      countLocationData.quantity = data?.quantity;
      countLocationData.employeeCode = data?.employeeCode;
      countLocationData.countTime = data?.countTime;
      countLocationData.createdAt = data?.createdAt;
      countLocationData.countProgressStatus = '6';
      countLocationData.intensiveCheckStatus = data?.intensiveCheckStatus;
      countLocationData.samplingStatus = data?.samplingStatus;
      countLocationData.auditStatus = data?.auditStatus;
      countLocationData.allProgressStatus = data?.allProgressStatus;
    }
    return countLocationData;
  };

  // ステージクリック.
  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // 操作レイヤーへ委譲
    operationLayer.current?.dispatchEvent(e);
  };

  // ステージマウスダウン.
  const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // 操作レイヤーへ委譲
    operationLayer.current?.dispatchEvent(e);
  };

  // ステージマウス移動.
  const handleStageMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // 操作レイヤーへ委譲
    operationLayer.current?.dispatchEvent(e);
  };

  // ステージマウスアップ.
  const handleStageMouseUp = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // 操作レイヤーへ委譲
    operationLayer.current?.dispatchEvent(e);
  };

  // ノードリスト更新.
  useEffect(() => {
    refreshNodeList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaLayerData]);

  // PDF 帳票作成.
  useEffect(() => {
    if (!needsPrintPdf) {
      return;
    }

    // 出力モードモードが納品モードの場合
    if (needsPrintPdf.outputMode === MapPdfOutputModes.STATEMENT_OF_DELIVERY) {
      // 背景色を白色に設定
      applyStatusForLocationFill(undefined);

      // 拡大率が 150% 以上の場合は、テキストをなしに設定
      if (stageScale >= 150) {
        applyAggregateDataForLocationText(ViewLocationAggregateDataTypes.NONE);
      }
    }

    // PDF 作成
    printPdf(needsPrintPdf);

    // 出力モードモードが納品モードの場合
    if (needsPrintPdf.outputMode === MapPdfOutputModes.STATEMENT_OF_DELIVERY) {
      // 背景色を戻す
      applyStatusForLocationFill(viewLocationColorType);

      // テキストを戻す
      if (stageScale >= 150) {
        applyAggregateDataForLocationText(viewLocationAggregateDataType);
      }
    }

    // ロケーションメモアイコンを表示にする
    dispatch(viewerViewModule.actions.updateVisibleRemarksIcon(true));

    // 出力モードリセット
    dispatch(viewerLayoutModule.actions.updatePrintPdf(undefined));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needsPrintPdf]);

  // ノード選択.
  useEffect(() => {
    if (!mapLayerRef.current) {
      return;
    }

    if (selectedNodeIds.length === 0) {
      dispatch(viewerNodeModule.actions.updateSelectedNodeList([]));
      return;
    }

    // 選択ノード検索
    const nodes =
      mapLayerRef.current.children?.filter(
        (node) =>
          node.attrs.hasOwnProperty(
            editorConstants.SHAPE_PROP_NAME_LOCATION_NUM,
          ) && selectedNodeIds.includes(node.attrs.uuid),
      ) ?? [];

    // 選択ノードリスト更新
    dispatch(viewerNodeModule.actions.updateSelectedNodeList(nodes));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNodeIds]);

  // スクロール位置変更
  useEffect(() => {
    if (!canvasContainer.current || !scrollPosition) {
      return;
    }

    canvasContainer.current.scrollTop = scrollPosition.top;
    canvasContainer.current.scrollLeft = scrollPosition.left;

    // リセット
    dispatch(viewerModule.actions.updateScrollPosition(undefined));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollPosition]);

  // 選択シェイプ変更
  useEffect(() => {
    // 未選択の場合は除外
    if (selectedNodeList.length === 0) {
      setSelectedShapeConfig(undefined);
      setSelectedShapeCountLocation(undefined);
      setSelectedShapeCountLocations([]);
      setJurisdictionClass('');
      setCompanyCode('');
      setStoreCode('');
      setInventoryDatesCode([]);
      return;
    }

    if (selectedNodeList.length === 1) {
      // 単一選択
      setSelectedShapeCountLocations([]);

      const config = selectedNodeList[0].config;

      // ロケーション以外の場合は除外
      if (
        !config.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_LOCATION_NUM)
      ) {
        setSelectedShapeConfig(undefined);
        setSelectedShapeCountLocation(undefined);
        setJurisdictionClass('');
        setCompanyCode('');
        setStoreCode('');
        setInventoryDatesCode([]);
        return;
      }

      // 結果
      setSelectedShapeConfig(config);
      setSelectedShapeCountLocation(buildLocationPropertyData(config));
      setJurisdictionClass(mapVersion.jurisdictionClass);
      setCompanyCode(mapVersion.companyCode);
      setStoreCode(mapVersion.storeCode);
      setInventoryDatesCode(
        mapVersion.inventorySchedule
          ? mapVersion.inventorySchedule.inventoryDates
          : [],
      );
    } else {
      // 複数選択
      setSelectedShapeConfig(undefined);
      setSelectedShapeCountLocation(undefined);
      setJurisdictionClass('');
      setCompanyCode('');
      setStoreCode('');
      setInventoryDatesCode([]);

      const selectedShapeCountLocations = selectedNodeList
        .filter((d) =>
          d.config.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_LOCATION_NUM),
        )
        .map((d) => buildLocationPropertyData(d.config));

      setSelectedShapeCountLocations(selectedShapeCountLocations);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNodeList, countLocations]);

  // ビューアロケーション色種別変更
  useEffect(() => {
    applyStatusForLocationFill(viewLocationColorType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewLocationColorType, countLocations, currentLayout, productLocations]);

  // ビューアロケーション集計値種別変更
  useEffect(() => {
    // 表示テキスト切替
    applyAggregateDataForLocationText(viewLocationAggregateDataType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewLocationAggregateDataType]);

  return (
    <>
      <Component
        canvasContainerRef={canvasContainer}
        stageRef={stage}
        areaLayerRef={areaLayerRef}
        mapLayerRef={mapLayerRef}
        operationLayerRef={operationLayer}
        transformerRef={transformer}
        latticeWidth={latticeWidth}
        latticeHeight={latticeHeight}
        stageScale={stageScale}
        stageWidth={stageWidth}
        stageHeight={stageHeight}
        selectedShapeConfig={selectedShapeConfig}
        selectedShapeCountLocation={selectedShapeCountLocation}
        jurisdictionClass={jurisdictionClass}
        companyCode={companyCode}
        storeCode={storeCode}
        inventoryDates={inventoryDates}
        selectedShapeCountLocations={selectedShapeCountLocations}
        getViewLocationColor={getViewLocationColor}
        onStageClick={handleStageClick}
        onStageMouseDown={handleStageMouseDown}
        onStageMouseMove={handleStageMouseMove}
        onStageMouseUp={handleStageMouseUp}
      />
    </>
  );
};
