import { http, RestRequest, Result } from '../app/http';

import { Color } from '../types';

const UPLOAD_PARAM_FILENAME = 'file';

export type ImportExcelApiUploadCondition = {
  sheetName?: string;

  sheetIndex: number;

  startCell: string;

  endCell: string;

  cellWidth: number;

  cellHeight: number;

  tableIdLength: number;

  branchNumLength: number;

  pillarCell: string;

  importShape: boolean;
};

export type MapShapeData = {
  id: string;

  shape: string;

  areaId: string;

  tableId: string;

  branchNum: string;

  x: number;

  y: number;

  x2: number;

  y2: number;

  width: number;

  height: number;

  strokeWidth: number;

  stroke: string;

  strokeRgb: Color;

  strokeDash: boolean;

  fill: string;

  fillRgb: Color;

  rotation: number;

  locationNum: string;

  displayLocationNum: string;

  showFullLocationNum: boolean;

  widthCells: number;

  heightCells: number;

  placement: string;

  direction: string;

  text: string;

  textAnchor: string;

  fontSize: number;

  flipHorizontal: boolean;
};

export type MapData = {
  sheetName: string;

  width: number;

  height: number;

  cellWidth: number;

  cellHeight: number;

  tableIdLength: number;

  branchNumLength: number;

  excelShapes: MapShapeData[];

  message: string;
};

export type ImportExcelApiUploadResult = {
  data: MapData;
} & Result;

class ExcelImports {
  /**
   *
   * @param payload
   * @param file
   * @returns
   */
  upload = async (
    payload: RestRequest<ImportExcelApiUploadCondition>,
    file: File
  ) => {
    const formData = new FormData();
    formData.append(UPLOAD_PARAM_FILENAME, file);
    formData.append(
      'inputData',
      new Blob([JSON.stringify(payload.parameters)], {
        type: 'application/json',
      })
    );

    return await http.postMultipart('api/excel-imports/upload', formData);
  };
}

export const excelImports = new ExcelImports();
