import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import * as viewerConstants from '../../constants/viewer';

import { ViewLocationColorType, ViewLocationColorTypes } from '../../types';

import {
  ModalCommands,
  ModalContent,
  ModalTemplate as Template,
} from '../templates';

import { CancelButton } from '../atoms';

const Wrapper = styled.section`
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
  width: 1200px;
  min-height: 720px;
`;

const Location = styled(ModalContent)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 9px;
`;

const Gondola = styled.div`
  display: grid;
  grid-auto-rows: auto;
  grid-auto-columns: auto;
  grid-column-gap: 3px;
  grid-row-gap: 3px;
  overflow-y: auto;
  overflow-x: auto;
  height: 720px;
  width: 600px;
`;

const Shelf = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-column-gap: 9px;
  grid-auto-flow: column;
`;

const Number = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(128, 128, 128, 1);
  background-color: rgb(154 199 236);
  width: 22px;

  > span {
    color: rgb(255 255 255);
  }
`;

const Items = styled.div`
  display: grid;
  grid-column-gap: 3px;
  grid-auto-flow: column;
`;

const Item = styled.div`
  display: grid;
  border: 1px solid rgba(128, 128, 128, 1);
  min-height: 60px;
  min-width: 30px;

  &.selected {
    border: 5px solid rgb(12 32 228);

    > p {
      opacity: 0.5;
    }
  }

  &:hover {
    border: 3px solid rgb(113 125 240);
    cursor: pointer;

    > p {
      opacity: 0.3;
    }
  }

  > p {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0;
  }
`;

const DetailsContent = styled.div`
  display: grid;
  border-left: 1px solid rgba(128, 128, 128, 1);
  grid-template-rows: 8fr 1fr;
`;

const Details = styled.div`
  padding: 9px;
`;

const DetailsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 6px;
  border-bottom: 1px solid rgba(128, 128, 128, 1);
  min-height: 25px;
`;

const DetailsLabel = styled.div`
  display: flex;
  align-items: center;
  color: rgba(102, 102, 102, 1);
  font-weight: bold;
`;

const DetailsValue = styled.div`
  display: flex;
  align-items: center;
`;

const Commands = styled(ModalCommands)`
  justify-content: space-between;
  padding: 0 20px;
`;

const ChangeSearchToggle = styled.div`
  width: 320px;
  height: 26px;
`;

const Toggle = styled.button`
  background: rgba(255, 255, 255, 1);
  color: rgba(36, 100, 215, 1);
  border: 1px solid rgba(36, 100, 215, 1);
  width: 50%;
  height: 26px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background: rgba(220, 220, 220, 1);
  }

  &:disabled {
    background: rgba(66, 135, 245, 1);
    color: rgba(255, 255, 255, 1);
    border: 1px solid rgba(36, 100, 215, 1);
    cursor: not-allowed;
  }

  &.planogram {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    border-right: 0px;
  }

  &.countData {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    border-left: 0px;
  }
`;

interface ChangeSearchTargetProps {
  /** 棚割データ検索対象 */
  isPlanogramData: boolean;
  /** 検索対象切替 */
  onChangeSearchTarget(target: boolean): void;
}

const ChangeSearchTargetContent = React.memo(
  (props: ChangeSearchTargetProps) => {
    const [t] = useTranslation();

    return (
      <ChangeSearchToggle>
        <Toggle
          disabled={props.isPlanogramData}
          onClick={() => props.onChangeSearchTarget(true)}
          className={'planogram'}
        >
          {t('pages:MapViewerPlanogram.planogramData')}
        </Toggle>
        <Toggle
          disabled={!props.isPlanogramData}
          onClick={() => props.onChangeSearchTarget(false)}
          className={'countData'}
        >
          {t('pages:MapViewerPlanogram.countData')}
        </Toggle>
      </ChangeSearchToggle>
    );
  },
);

/**
 * 棚割フェイス.
 */
export type PlanogramFace = {
  /** 一意識別子. */
  id?: string;

  /** 管轄区分. */
  jurisdictionClass: string;

  /** 企業コード. */
  companyCode: string;

  /** 店舗コード. */
  storeCode: string;

  /** 棚卸日. */
  inventoryDate?: string;

  /** ダンプNo.. */
  dumpNo?: number;

  /** 社員番号. */
  employeeCode?: string;

  /** エリア. */
  areaId: string;

  /** ロケーション番号. */
  locationNum: string;

  /** シェルフ. */
  shelf: number;

  /** フェイス. */
  face: number;

  /** 部門. */
  department?: string;

  /** 部門名. */
  departmentName?: string;

  /** 商品名. */
  productName?: string;

  /** SKUコード. */
  sku: string;

  /** 2段バーコード. */
  twoGradeBarcode?: string;

  /** 売価. */
  sellingPrice?: number;

  /** 数量. */
  quantity: number;

  /** フェイシング数. */
  facing: number;

  /** カウント時間. */
  countTime?: string;

  /** 集中チェック実施ステータス. */
  intensiveCheckStatus?: string;

  /** サンプリング実施ステータス. */
  samplingStatus?: string;

  /** オーディット実施ステータス. */
  auditStatus?: string;

  /** 全体進捗ステータス. */
  allProgressStatus?: string;

  /** 更新日時. */
  updatedAt: string;
};

interface Props extends ReactModal.Props, ChangeSearchTargetProps {
  /** 画面タイトル */
  title: string;
  /** シェルフ毎フェイス一覧 */
  shelves: PlanogramFace[][];
  /** 選択フェイス */
  selectedItem: PlanogramFace | undefined;
  /** 商品フェイス一覧 */
  productFaces: string[];
  /** ビューアロケーション色種別 */
  viewLocationColorType: ViewLocationColorType;
  /** 棚割データ検索可否 */
  canSearchPlanogramData: boolean;
  /** 欠番 */
  missingNumber: boolean;
  /** 空白 */
  emptyNumber: boolean;
  /** 棚割色付け取得処理 */
  getViewLocationColor(
    loc: PlanogramFace,
    colorType?: ViewLocationColorType,
  ): { fill: string };
  /** フェイス選択/選択解除 */
  onClickFace(item: PlanogramFace): void;
  /** 閉じる押下 */
  onClickClose(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

/**
 * マップビューア：棚割
 */
export const MapViewerPlanogram = (props: Props) => {
  const { selectedItem } = props;

  const [t] = useTranslation();

  const numberFormat: Intl.NumberFormat = new Intl.NumberFormat('ja');

  const selectedKey =
    selectedItem &&
    `${selectedItem.shelf}_${selectedItem.face}_${selectedItem.sku}`;

  return (
    <Template {...props} title={props.title} contentLabel="MapViewerPlanogram">
      <Wrapper>
        <Location>
          <Gondola>
            {props.shelves.map((items, index) => (
              <Shelf key={index}>
                <Number>
                  <span>{index + 1}</span>
                </Number>
                <Items>
                  {items.map((item) => {
                    const key = `${item.shelf}_${item.face}_${item.sku}`;
                    let fill = viewerConstants.VIEWER_LOCATION_FILL_WHITE;

                    if (!props.missingNumber && !props.emptyNumber) {
                      if (
                        props.viewLocationColorType ===
                          ViewLocationColorTypes.PRODUCT_LOCATION &&
                        props.productFaces.includes(
                          `${item.shelf}_${item.face}`,
                        )
                      ) {
                        fill =
                          viewerConstants.VIEWER_LOCATION_FILL_YELLOW_GREEN;
                      } else {
                        fill = props.getViewLocationColor(
                          item,
                          props.viewLocationColorType,
                        )?.fill;
                      }
                    }

                    return (
                      <Item
                        className={classNames({
                          selected: key === selectedKey,
                        })}
                        key={key}
                        onClick={() => props.onClickFace(item)}
                      >
                        <p
                          style={{
                            backgroundColor: `${fill}`,
                          }}
                        >
                          {item.quantity}
                        </p>
                      </Item>
                    );
                  })}
                </Items>
              </Shelf>
            ))}
          </Gondola>
          <DetailsContent>
            <Details>
              {selectedItem && (
                <>
                  {
                    /* ダンプNo. */
                    selectedItem.hasOwnProperty('dumpNo') && (
                      <DetailsRow>
                        <DetailsLabel>
                          {t('pages:MapViewerPlanogram.details.dumpNo')}
                        </DetailsLabel>
                        <DetailsValue>{selectedItem.dumpNo}</DetailsValue>
                      </DetailsRow>
                    )
                  }
                  {/* エリア */}
                  <DetailsRow>
                    <DetailsLabel>
                      {t('pages:MapViewerPlanogram.details.areaId')}
                    </DetailsLabel>
                    <DetailsValue>
                      {selectedItem.hasOwnProperty('areaId') &&
                        selectedItem.areaId}
                    </DetailsValue>
                  </DetailsRow>
                  {/* ロケーション */}
                  <DetailsRow>
                    <DetailsLabel>
                      {t('pages:MapViewerPlanogram.details.locationNum')}
                    </DetailsLabel>
                    <DetailsValue>
                      {selectedItem.hasOwnProperty('locationNum') &&
                        selectedItem.locationNum}
                    </DetailsValue>
                  </DetailsRow>
                  {/* シェルフ */}
                  <DetailsRow>
                    <DetailsLabel>
                      {t('pages:MapViewerPlanogram.details.shelf')}
                    </DetailsLabel>
                    <DetailsValue>
                      {selectedItem.hasOwnProperty('shelf') &&
                        selectedItem.shelf}
                    </DetailsValue>
                  </DetailsRow>
                  {/* フェイス */}
                  <DetailsRow>
                    <DetailsLabel>
                      {t('pages:MapViewerPlanogram.details.face')}
                    </DetailsLabel>
                    <DetailsValue>
                      {selectedItem.hasOwnProperty('face') && selectedItem.face}
                    </DetailsValue>
                  </DetailsRow>
                  {/* SKU */}
                  <DetailsRow>
                    <DetailsLabel>
                      {t('pages:MapViewerPlanogram.details.sku')}
                    </DetailsLabel>
                    <DetailsValue>
                      {selectedItem.hasOwnProperty('sku') && selectedItem.sku}
                    </DetailsValue>
                  </DetailsRow>
                  {/* 2段バーコード */}
                  <DetailsRow>
                    <DetailsLabel>
                      {t('pages:MapViewerPlanogram.details.twoGradeBarcode')}
                    </DetailsLabel>
                    <DetailsValue>
                      {selectedItem.hasOwnProperty('twoGradeBarcode') &&
                        selectedItem.twoGradeBarcode}
                    </DetailsValue>
                  </DetailsRow>
                  {/* 商品名 */}
                  <DetailsRow>
                    <DetailsLabel>
                      {t('pages:MapViewerPlanogram.details.productName')}
                    </DetailsLabel>
                    <DetailsValue>
                      {selectedItem.hasOwnProperty('productName') &&
                        selectedItem.productName}
                    </DetailsValue>
                  </DetailsRow>
                  {/* 売価 */}
                  <DetailsRow>
                    <DetailsLabel>
                      {t('pages:MapViewerPlanogram.details.sellingPrice')}
                    </DetailsLabel>
                    <DetailsValue>
                      {selectedItem.hasOwnProperty('sellingPrice') &&
                        selectedItem.sellingPrice &&
                        numberFormat.format(selectedItem.sellingPrice)}
                    </DetailsValue>
                  </DetailsRow>
                  {/* 数量 */}
                  <DetailsRow>
                    <DetailsLabel>
                      {t('pages:MapViewerPlanogram.details.quantity')}
                    </DetailsLabel>
                    <DetailsValue>
                      {selectedItem.hasOwnProperty('quantity') &&
                        numberFormat.format(selectedItem.quantity)}
                    </DetailsValue>
                  </DetailsRow>
                  {/* フェイシング数 */}
                  <DetailsRow>
                    <DetailsLabel>
                      {t('pages:MapViewerPlanogram.details.facing')}
                    </DetailsLabel>
                    <DetailsValue>
                      {selectedItem.hasOwnProperty('facing') &&
                        numberFormat.format(selectedItem.facing)}
                    </DetailsValue>
                  </DetailsRow>
                  {/* 部門 */}
                  <DetailsRow>
                    <DetailsLabel>
                      {t('pages:MapViewerPlanogram.details.department')}
                    </DetailsLabel>
                    <DetailsValue>
                      {selectedItem.hasOwnProperty('department') &&
                        selectedItem.department}
                    </DetailsValue>
                  </DetailsRow>
                  {/* 部門名 */}
                  <DetailsRow>
                    <DetailsLabel>
                      {t('pages:MapViewerPlanogram.details.departmentName')}
                    </DetailsLabel>
                    <DetailsValue>
                      {selectedItem.hasOwnProperty('departmentName') &&
                        selectedItem.departmentName}
                    </DetailsValue>
                  </DetailsRow>
                  {
                    /* カウント時間 */
                    selectedItem.hasOwnProperty('countTime') && (
                      <DetailsRow>
                        <DetailsLabel>
                          {t('pages:MapViewerPlanogram.details.countTime')}
                        </DetailsLabel>
                        <DetailsValue>{selectedItem.countTime}</DetailsValue>
                      </DetailsRow>
                    )
                  }
                  {
                    /* 社員番号 */
                    selectedItem.hasOwnProperty('employeeCode') && (
                      <DetailsRow>
                        <DetailsLabel>
                          {t('pages:MapViewerPlanogram.details.employeeCode')}
                        </DetailsLabel>
                        <DetailsValue>{selectedItem.employeeCode}</DetailsValue>
                      </DetailsRow>
                    )
                  }
                  {/* 更新日時 */}
                  <DetailsRow>
                    <DetailsLabel>
                      {t('pages:MapViewerPlanogram.details.updatedAt.label')}
                    </DetailsLabel>
                    <DetailsValue>
                      {selectedItem.hasOwnProperty('updatedAt') &&
                        selectedItem.updatedAt}
                    </DetailsValue>
                  </DetailsRow>
                </>
              )}
            </Details>
            <Commands>
              {props.canSearchPlanogramData ? (
                <ChangeSearchTargetContent {...props} />
              ) : (
                <div></div>
              )}
              <CancelButton onClick={props.onClickClose}>
                {t('pages:MapViewerNote.button.close')}
              </CancelButton>
            </Commands>
          </DetailsContent>
        </Location>
      </Wrapper>
    </Template>
  );
};
