import { MapPdfPaperSizes } from '../../types';

import { i18n } from '../../app/i18n';
import { DateTimeUtil } from '../../utils/DateTimeUtil';
import { EditorUtil } from '../../utils/EditorUtil';
import { MapPdf, MapPdfProps } from './MapPdf';

type Rectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type MapPdfData = {
  /** 管轄区分 */
  jurisdictionClass: string;

  /** 企業名 */
  companyName: string;

  /** 店舗名 */
  storeName: string;

  /** 郵便番号 */
  zipCode: string;

  /** 国交省住所１ */
  address1: string;

  /** 国交省住所２ */
  address2: string;

  /** 国交省住所補足 */
  addressDetail?: string;

  /** 電話番号 */
  tel: string;

  /** FAX番号 */
  fax?: string;

  /** 棚卸日 */
  inventoryDates: Date[];

  /** レイアウト名 */
  layoutName: string;
};

interface MapPdfStatementOfDeliveryProps extends MapPdfProps {
  data: MapPdfData;
}

/**
 * 納品用のマップ PDF 帳票を作成します.
 */
export class MapPdfStatementOfDelivery extends MapPdf {
  private data: MapPdfData;

  constructor(props: MapPdfStatementOfDeliveryProps) {
    super(props);
    this.data = props.data;
  }

  /**
   * ヘッダーを設定します.
   */
  private header = (): Rectangle => {
    const width = this.paperWidth();
    const height = 30;
    const x = 10;
    const y = 20;

    const labelWidth = 80;
    const halfWidth = EditorUtil.calcGuideGridSize(width / 2, 10);

    const telFaxX = width - 200;
    const telFaxLabelWidth = 60;

    const timeFrameX = width - 310;
    const timeFrameLabelWidth = 70;

    // 背景色
    this._doc.setFillColor('#cccccc');
    this._doc.rect(x, y, labelWidth, height, 'F');
    this._doc.rect(x + halfWidth, y, labelWidth, 10, 'F');
    this._doc.rect(telFaxX, y + 10, telFaxLabelWidth, 10, 'F');
    this._doc.rect(telFaxX, y + 20, telFaxLabelWidth, 10, 'F');
    this._doc.rect(timeFrameX, y + 20, timeFrameLabelWidth, 10, 'F');

    // 外枠：上
    this._doc.line(x, y, width, y);

    // 外枠：右
    this._doc.line(width, y, width, y + height);

    // 外枠：下
    this._doc.line(x, y + height, width, y + height);

    // 外枠：左
    this._doc.line(x, y, x, y + height);

    // 項目出力用枠：縦
    this._doc.line(x + labelWidth, y, x + labelWidth, y + height);

    // 項目出力用枠：縦（店舗名）
    this._doc.line(x + halfWidth, y, x + halfWidth, y + 10);
    this._doc.line(
      x + halfWidth + labelWidth,
      y,
      x + halfWidth + labelWidth,
      y + 10,
    );

    // 項目出力用枠：縦（TEL / FAX）
    this._doc.line(telFaxX, y + 10, telFaxX, y + 20);
    this._doc.line(
      telFaxX + telFaxLabelWidth,
      y + 10,
      telFaxX + telFaxLabelWidth,
      y + 20,
    );

    // 項目出力用枠：縦（棚卸開始時間）
    this._doc.line(timeFrameX, y + 20, timeFrameX, y + height);
    this._doc.line(
      timeFrameX + timeFrameLabelWidth,
      y + 20,
      timeFrameX + timeFrameLabelWidth,
      y + height,
    );

    // 項目出力用枠：縦（レイアウト）
    this._doc.line(telFaxX, y + 20, telFaxX, y + height);
    this._doc.line(
      telFaxX + telFaxLabelWidth,
      y + 20,
      telFaxX + telFaxLabelWidth,
      y + height,
    );

    // 項目出力用枠：横
    this._doc.line(x, y + 10, width, y + 10);
    this._doc.line(x, y + 20, width, y + 20);

    // フォントサイズ
    this._doc.setFontSize(9);

    // 企業名
    this._doc.text(
      `${i18n.t('organisms:MapPdf.header.companyName')}`,
      x + 2,
      y + 8,
    );
    this._doc.text(this.data.companyName, x + labelWidth + 2, y + 8);

    // 店舗名
    this._doc.text(
      `${i18n.t('organisms:MapPdf.header.storeName')}`,
      x + halfWidth + 2,
      y + 8,
    );
    this._doc.text(this.data.storeName, x + halfWidth + labelWidth + 2, y + 8);

    // 店舗住所
    this._doc.text(
      `${i18n.t('organisms:MapPdf.header.address')}`,
      x + 2,
      y + 18,
    );

    const { zipCode } = this.data;
    const zipCodeText = zipCode
      ? `${i18n.t('organisms:MapPdf.header.zipCodePrefix')} ${zipCode}`
      : '';
    const address = [
      this.data.address1,
      this.data.address2,
      this.data.addressDetail,
    ].join(' ');
    this._doc.text(
      [zipCodeText, address].join(' '),
      x + labelWidth + 2,
      y + 18,
    );

    // Tel / Fax
    this._doc.text(
      `${i18n.t('organisms:MapPdf.header.telFax')}`,
      telFaxX + 2,
      y + 18,
    );

    const { tel, fax } = this.data;
    const telFax = tel || fax ? `${tel ?? ''} / ${fax ?? ''}` : '';
    this._doc.text(telFax, telFaxX + telFaxLabelWidth + 2, y + 18);

    // 棚卸日
    this._doc.text(
      `${i18n.t('organisms:MapPdf.header.inventoryDate')}`,
      x + 2,
      y + 28,
    );

    const inventoryDates = this.data.inventoryDates.map((d) =>
      DateTimeUtil.parseDateToFormatString(
        d,
        `${i18n.t('organisms:MapPdf.header.inventoryDateFormat')}`,
        this._props.language,
        this._props.timezone,
      ),
    );
    this._doc.text(inventoryDates.join(', '), x + labelWidth + 2, y + 28);

    // 棚卸開始時間
    this._doc.text(
      `${i18n.t('organisms:MapPdf.header.timeFrame')}`,
      timeFrameX + 2,
      y + 28,
    );

    // レイアウト
    this._doc.text(
      `${i18n.t('organisms:MapPdf.header.layoutName')}`,
      telFaxX + 2,
      y + 28,
    );
    this._doc.text(
      this.data.layoutName,
      telFaxX + telFaxLabelWidth + 2,
      y + 28,
    );

    return { x, y, width, height };
  };

  /**
   * フッターを設定します.
   */
  private footer = (): Rectangle => {
    const width = this.paperWidth();
    const height = 30;
    const x = 10;
    const y = this.paperHeight();

    const halfWidth = EditorUtil.calcGuideGridSize(width / 2, 10);

    // 枠線：上
    this._doc.line(x, y, width, y);

    // 項目出力用枠：縦
    this._doc.line(x + halfWidth, y, x + halfWidth, y + height);

    // フォントサイズ
    this._doc.setFontSize(7);

    // 定型文１
    this._doc.text(
      `${i18n.t('organisms:MapPdf.footer.fixedPhrase1')}`,
      x + 2,
      y + 8,
    );

    // 定型文２
    const fixedPhrase2 = `${i18n.t(
      'organisms:MapPdf.footer.fixedPhrase2',
    )}`.split('\n');
    this._doc.text(fixedPhrase2[0], x + halfWidth + 2, y + 8);
    this._doc.text(fixedPhrase2[1], x + halfWidth + 2, y + 15);

    // フォントサイズ
    this._doc.setFontSize(9);

    // 会社名
    const contractor = `organisms:MapPdf.footer.contractor.${this.data.jurisdictionClass}`;
    this._doc.text(`${i18n.t(contractor)}`, x + 2, y + 18);

    // スーパーバイザー
    this._doc.text(
      `${i18n.t('organisms:MapPdf.footer.supervisor')}`,
      halfWidth - 204,
      y + 28,
      { align: 'right' },
    );

    // スーパーバイザーサイン用下線
    this._doc.line(
      halfWidth - 200,
      y + height + 2,
      halfWidth - 5,
      y + height + 2,
    );

    // 役職 / 氏名
    this._doc.text(
      `${i18n.t('organisms:MapPdf.footer.approvedBy')}`,
      width - 204,
      y + 28,
      { align: 'right' },
    );

    // 顧客サイン用下線
    this._doc.line(width - 200, y + height + 2, width - 5, y + height + 2);

    return { x, y, width, height };
  };

  /**
   * PDF 帳票を生成します.
   */
  public build = () => {
    // ヘッダー
    const header = this.header();

    // フッター
    this.footer();

    // マップイメージ
    this.mapImage({
      x: 10,
      y: header.y + header.height + 5,
      printableSpace: {
        width: this.paperWidth() - 10,
        height: this._props.paperSize === MapPdfPaperSizes.A3 ? 539 : 350,
      },
    });

    // 保存
    this._doc.save(this._props.filename);
  };
}
