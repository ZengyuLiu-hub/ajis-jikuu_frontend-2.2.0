import { MapPdfPaperSizes } from '../../types';

import { i18n } from '../../app/i18n';
import { EditorUtil } from '../../utils/EditorUtil';
import { MapPdf, MapPdfProps } from './MapPdf';

type Rectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

interface MapPdfInventoryProps extends MapPdfProps {
  note: string;
}

/**
 * 棚卸作業用のマップ PDF 帳票を作成します.
 */
export class MapPdfInventory extends MapPdf {
  private note: string;

  constructor(props: MapPdfInventoryProps) {
    super(props);
    this.note = props.note;
  }

  private notes = (): Rectangle => {
    const width = this.paperWidth();
    const height = 30;
    const x = 10;
    const y = this.paperHeight();

    const halfWidth = EditorUtil.calcGuideGridSize((width - 20) / 2, 10);

    // 枠線：上
    this._doc.line(x, y, x + 10, y);
    this._doc.line(x + 60, y, width, y);

    // 枠線：右
    this._doc.line(width, y, width, y + height);

    // 枠線：下
    this._doc.line(x, y + height, width, y + height);

    // 枠線：左
    this._doc.line(x, y, x, y + height);

    // タイトル
    const title = i18n.t('organisms:MapPdf.note.title');

    this._doc.setFontSize(8);
    this._doc.text(title, x + 12, y + 2);

    const toOneLine = (() => {
      const canvas = document.createElement('canvas');

      const context = canvas.getContext('2d');
      if (!context) {
        console.error('context is not found.');
        return (note: string) => note;
      }
      context.font = '8px';

      canvas.remove();

      const limit = this._props.paperSize === MapPdfPaperSizes.A3 ? 681 : 472;

      return (note: string) => {
        let oneLineNote = '';
        for (const char of note) {
          oneLineNote = `${oneLineNote}${char}`;
          if (context.measureText(oneLineNote).width >= limit) {
            return `${oneLineNote}...`;
          }
        }
        return note;
      };
    })();

    // 棚卸メモ
    let offsetX = 0;
    let offsetY = 10;
    let coefficient = 0;
    this.note.split('\n').forEach((note, index) => {
      if (index > 5) {
        return;
      }
      if (index !== 0 && index % 3 === 0) {
        offsetY = 10;
        offsetX = offsetX + halfWidth;
        coefficient = 1;
      } else {
        offsetY = 10 + 9 * coefficient++;
      }
      this._doc.text(toOneLine(note), x + offsetX + 2, y + offsetY);
    });

    return { x, y, width, height };
  };

  /**
   * PDF 帳票を生成します.
   */
  public build = () => {
    // 棚卸メモ
    this.notes();

    // マップイメージ
    this.mapImage({
      x: 10,
      y: 20,
      printableSpace: {
        width: this.paperWidth() - 10,
        height: this._props.paperSize === MapPdfPaperSizes.A3 ? 565 : 385,
      },
    });

    // 保存
    this._doc.save(this._props.filename);
  };
}
