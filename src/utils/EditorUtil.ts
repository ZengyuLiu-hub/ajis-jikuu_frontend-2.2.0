import {
  LocationCustomFormat,
  LocationDisplayFormatType,
  LocationDisplayFormatTypes,
  PaperSize,
  PaperSizes,
  StageRegulationSize,
  StageRegulationSizes,
} from '../types';
import { LocalStore } from '../app/LocalStore';

export class EditorUtil {
  static calcGuideGridSize = (
    pos: number,
    latticeSize: number,
    round?: 'floor' | 'ceil' | 'round'
  ) => {
    if (latticeSize > 0) {
      if (round === 'floor') {
        return Math.floor(Math.floor(pos) / latticeSize) * latticeSize;
      } else if (round === 'ceil') {
        return Math.ceil(Math.floor(pos) / latticeSize) * latticeSize;
      } else {
        return Math.round(Math.floor(pos) / latticeSize) * latticeSize;
      }
    }
    return pos;
  };

  static pageSizeToPixel = (size?: PaperSize) => {
    if (size === PaperSizes.A4) {
      return {
        width: 842,
        height: 595,
      };
    }
    if (size === PaperSizes.B4) {
      return {
        width: 1032,
        height: 729,
      };
    }
    if (size === PaperSizes.A3) {
      return {
        width: 1191,
        height: 842,
      };
    }
    if (size === PaperSizes.B3) {
      return {
        width: 1460,
        height: 1032,
      };
    }
    if (size === PaperSizes.A2) {
      return {
        width: 1684,
        height: 1191,
      };
    }
    if (size === PaperSizes.B2) {
      return {
        width: 2064,
        height: 1460,
      };
    }
    if (size === PaperSizes.A1) {
      return {
        width: 2384,
        height: 1684,
      };
    }
    if (size === PaperSizes.B1) {
      return {
        width: 2920,
        height: 2064,
      };
    }
    if (size === PaperSizes.A0) {
      return {
        width: 3370,
        height: 2384,
      };
    }
    if (size === PaperSizes.B0) {
      return {
        width: 4127,
        height: 2920,
      };
    }
    return {
      width: 842,
      height: 595,
    };
  };

  static downloadFile = (uri: any, filename: string) => {
    const link = document.createElement('a');
    link.href = uri;
    link.download = filename;
    link.click();
    link.remove();
  };

  static getStoreItem = async (storeKey: string) => {
    const store = LocalStore.newInstance;
    try {
      const value = await store.getItem(storeKey);
      if (typeof value === 'string' || value instanceof String) {
        try {
          return JSON.parse(value as string);
        } catch {
          return value;
        }
      }
      return value;
    } catch (err) {
      console.error(err);
    }
  };

  static updateStoreItem = async (storeKey: string, data: any) => {
    const store = LocalStore.newInstance;
    try {
      if (data instanceof Object) {
        const json = JSON.stringify(data);
        await store.setItem(storeKey, json);
      } else {
        await store.setItem(storeKey, data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  static removeStoreItem = async (storeKey: string) => {
    const store = LocalStore.newInstance;
    try {
      await store.removeItem(storeKey);
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * ロケーション番号から表示用ロケーション番号を生成します.
   *
   * @param locationNum ロケーション番号
   * @param formatType ロケーション表示形式種別
   * @param customFormats カスタム書式
   */
  static generateDisplayLocationNum = (
    locationNum: string,
    formatType: LocationDisplayFormatType,
    customFormats: LocationCustomFormat[]
  ) => {
    if (formatType === LocationDisplayFormatTypes.STANDARD) {
      return locationNum;
    }

    if (customFormats.length > 0) {
      const locationDigit: string[] = [];
      customFormats.forEach((format) =>
        locationDigit.push(
          locationNum.substring(format.startIndex, format.endIndex)
        )
      );
      return locationDigit.join('');
    }
    return locationNum;
  };

  /**
   * ステージ規定サイズをピクセルに変換します.
   *
   * @param size 規定サイズ
   */
  static stageRegulationSizeToPixel = (size?: StageRegulationSize) => {
    // 極小
    if (size === StageRegulationSizes.VERY_SMALL) {
      return {
        width: 1270,
        height: 730,
      };
    }
    // 小
    if (size === StageRegulationSizes.SMALL) {
      return {
        width: 1524,
        height: 876,
      };
    }
    // 中
    if (size === StageRegulationSizes.MEDIUM) {
      return {
        width: 2438,
        height: 1400,
      };
    }
    // 大
    if (size === StageRegulationSizes.LARGE) {
      return {
        width: 3200,
        height: 1835,
      };
    }
    // 特大
    if (size === StageRegulationSizes.EXTRA_LARGE) {
      return {
        width: 3810,
        height: 2190,
      };
    }
    return {
      width: 1270,
      height: 730,
    };
  };
}
