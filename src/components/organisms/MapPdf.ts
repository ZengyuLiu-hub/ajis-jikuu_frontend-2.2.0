import { jsPDF } from 'jspdf';

import {
  Language,
  Languages,
  MapPdfOrientation,
  MapPdfPaperSize,
  MapPdfPaperSizes,
} from '../../types';

export interface MapPdfProps {
  orientation: MapPdfOrientation;
  paperSize: MapPdfPaperSize;
  imageData: string;
  imageSize: { width: number; height: number };
  filename: string;
  language: Language;
  timezone: string;
}

/**
 * マップ PDF 帳票を作成します.
 */
export class MapPdf {
  protected _props: MapPdfProps;

  protected _doc: jsPDF;

  constructor(props: MapPdfProps) {
    this._props = props;

    this._doc = new jsPDF({
      orientation: props.orientation,
      unit: 'px',
      format: props.paperSize,
    });

    if (this._props.language === Languages.ja) {
      // 日本語フォント
      this._doc.addFont('/fonts/ipaexg.ttf', 'IPAexGothic', 'normal');
      this._doc.setFont('IPAexGothic', 'normal');
    }
  }

  protected paperWidth = (): number =>
    this._props.paperSize === MapPdfPaperSizes.A3 ? 875 : 620;

  protected paperHeight = (): number =>
    this._props.paperSize === MapPdfPaperSizes.A3 ? 595 : 410;

  /**
   * マップを画像へ変換し取り込みます.
   *
   * @param options オプション
   * @param options.x 配置 X 座標
   * @param options.y 配置 Y 座標
   * @param options.printableSpace 画像の印刷可能領域
   */
  protected mapImage = ({
    x,
    y,
    printableSpace,
  }: {
    x: number;
    y: number;
    printableSpace: {
      width: number;
      height: number;
    };
  }) => {
    const widthRatio = printableSpace.width / this._props.imageSize.width;
    const heightRatio = printableSpace.height / this._props.imageSize.height;

    const ratio =
      widthRatio > heightRatio
        ? (Math.floor(Math.floor(heightRatio * 1000) / 5) * 5) / 1000
        : (Math.floor(Math.floor(widthRatio * 1000) / 5) * 5) / 1000;

    const width = this._props.imageSize.width * ratio;
    const height = this._props.imageSize.height * ratio;

    // マップ
    const centered = {
      x: x + (printableSpace.width - width) / 2,
      y: y + (printableSpace.height - height) / 2,
    };
    this._doc.addImage(
      this._props.imageData,
      'PNG',
      centered.x,
      centered.y,
      width,
      height,
    );
  };

  /**
   * PDF 帳票を生成します.
   */
  public build = () => {
    // マップイメージ
    this.mapImage({
      x: 10,
      y: 20,
      printableSpace: {
        width: this.paperWidth() - 10,
        height: this._props.paperSize === MapPdfPaperSizes.A3 ? 605 : 420,
      },
    });

    // 保存
    this._doc.save(this._props.filename);
  };
}
