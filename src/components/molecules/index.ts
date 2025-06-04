import { KonvaNodeComponent } from 'react-konva';

import { StringUtil } from '../../utils/StringUtil';

export { MainMenu } from './MainMenu';
export { Modal, BlueStyles, OrangeStyles } from './Modal';
export { NavigateLinkButton } from './NavigateLinkButton';

export const LocationTypes = StringUtil.toEnum([
  // テーブル：frontend
  'FRONTEND',

  // テーブル：backend
  'BACKEND',

  // テーブル：side
  'SIDE',

  // ウォール：wall
  'WALL',

  // アイランド：island
  'ISLAND',

  // アイランド：register
  'REGISTER',
]);
export type LocationType = keyof typeof LocationTypes;

export interface PerformanceConfig {
  shouldOptimize: boolean;
}

export interface ShapeConfig extends PerformanceConfig {
  uuid: string;
  selectable: boolean;
  selected?: boolean;
  disabled: boolean;
  readOnly?: boolean;
}

export interface LocationConfig extends ShapeConfig {
  defaultFontSize: number;
  locationType?: LocationType;
  areaId: string;
  tableId: string;
  branchNum: string;
  locationNum: string;
  displayLocationNum: string;
  showFullLocationNum: boolean;
  text: string;
  fontSize: number;
  stageScale: number;
  missingNumber: boolean;
  emptyNumber: boolean;
}

export { ShapeGroup } from './ShapeGroup';
export { ShapeLocationGroup } from './ShapeLocationGroup';

export { ShapeArea } from './ShapeArea';
export { ShapeArrow } from './ShapeArrow';
export { ShapeCircle } from './ShapeCircle';
export { ShapeCircleArrow } from './ShapeCircleArrow';
export { ShapeEllipse } from './ShapeEllipse';
export { ShapeEllipseTable } from './ShapeEllipseTable';
export { ShapeFreeText } from './ShapeFreeText';
export { ShapeGondola } from './ShapeGondola';
export { ShapeLine } from './ShapeLine';
export { ShapeOutlet } from './ShapeOutlet';
export { ShapePen } from './ShapePen';
export { ShapePolygon } from './ShapePolygon';
export { ShapeRect } from './ShapeRect';
export { ShapeRectTable } from './ShapeRectTable';
export { ShapeRegister } from './ShapeRegister';
export { ShapeRestArea } from './ShapeRestArea';
export { ShapeSpecial } from './ShapeSpecial';
export { ShapeText } from './ShapeText';
export { ShapeWc } from './ShapeWc';

export type AreaType = import('./ShapeArea').ShapeArea;
export type AreaConfigType = import('./ShapeArea').ShapeAreaConfig;
export var Area: KonvaNodeComponent<AreaType, AreaConfigType>;

export type ArrowType = import('./ShapeArrow').ShapeArrow;
export type ArrowConfigType = import('./ShapeArrow').ShapeArrowConfig;
export var Arrow: KonvaNodeComponent<ArrowType, ArrowConfigType>;

export type CircleType = import('./ShapeCircle').ShapeCircle;
export type CircleConfigType = import('./ShapeCircle').ShapeCircleConfig;
export var Circle: KonvaNodeComponent<CircleType, CircleConfigType>;

export type CircleArrowType = import('./ShapeCircleArrow').ShapeCircleArrow;
export type CircleArrowConfigType =
  import('./ShapeCircleArrow').ShapeCircleArrowConfig;
export var CircleArrow: KonvaNodeComponent<
  CircleArrowType,
  CircleArrowConfigType
>;

export type EllipseType = import('./ShapeEllipse').ShapeEllipse;
export type EllipseConfigType = import('./ShapeEllipse').ShapeEllipseConfig;
export var Ellipse: KonvaNodeComponent<EllipseType, EllipseConfigType>;

export type EllipseTableType = import('./ShapeEllipseTable').ShapeEllipseTable;
export type EllipseTableConfigType =
  import('./ShapeEllipseTable').ShapeEllipseTableConfig;
export var EllipseTable: KonvaNodeComponent<
  EllipseTableType,
  EllipseTableConfigType
>;

export type FreeTextType = import('./ShapeFreeText').ShapeFreeText;
export type FreeTextConfigType = import('./ShapeFreeText').ShapeFreeTextConfig;
export var FreeText: KonvaNodeComponent<FreeTextType, FreeTextConfigType>;

export type GondolaType = import('./ShapeGondola').ShapeGondola;
export type GondolaConfigType = import('./ShapeGondola').ShapeGondolaConfig;
export var Gondola: KonvaNodeComponent<GondolaType, GondolaConfigType>;

export type LineType = import('./ShapeLine').ShapeLine;
export type LineConfigType = import('./ShapeLine').ShapeLineConfig;
export var Line: KonvaNodeComponent<LineType, LineConfigType>;

export type PenType = import('./ShapePen').ShapePen;
export type PenConfigType = import('./ShapePen').ShapePenConfig;
export var Pen: KonvaNodeComponent<PenType, PenConfigType>;

export type PolygonType = import('./ShapePolygon').ShapePolygon;
export type PolygonConfigType = import('./ShapePolygon').ShapePolygonConfig;
export var Polygon: KonvaNodeComponent<PolygonType, PolygonConfigType>;

export type RectType = import('./ShapeRect').ShapeRect;
export type RectConfigType = import('./ShapeRect').ShapeRectConfig;
export var Rect: KonvaNodeComponent<RectType, RectConfigType>;

export type ShapeRectTableType = import('./ShapeRectTable').ShapeRectTable;
export type ShapeRectTableConfigType =
  import('./ShapeRectTable').ShapeRectTableConfig;
export var RectTable: KonvaNodeComponent<
  ShapeRectTableType,
  ShapeRectTableConfigType
>;

export type RegisterType = import('./ShapeRegister').ShapeRegister;
export type RegisterConfigType = import('./ShapeRegister').ShapeRegisterConfig;
export var Register: KonvaNodeComponent<RegisterType, RegisterConfigType>;

export type SpecialType = import('./ShapeSpecial').ShapeSpecial;
export type SpecialConfigType = import('./ShapeSpecial').ShapeSpecialConfig;
export var Special: KonvaNodeComponent<SpecialType, SpecialConfigType>;

export type TextType = import('./ShapeText').ShapeText;
export type TextConfigType = import('./ShapeText').ShapeTextConfig;
export var Text: KonvaNodeComponent<TextType, TextConfigType>;
