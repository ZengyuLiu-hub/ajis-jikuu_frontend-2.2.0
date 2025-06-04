import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactModal from 'react-modal';
import * as RV from 'react-virtualized';
import styled from 'styled-components';

import { ProductLocation } from '../../types';

import { DataTable } from '../../containers/atoms';
import { Button, CancelButton, InputText, SubmitButton } from '../atoms';
import {
  ModalCommands,
  ModalContent,
  ModalTemplate as Template,
} from '../templates';

const Wrapper = styled.section`
  min-width: 1085px;
`;

const Content = styled(ModalContent)`
  display: grid;
  grid-template-rows: auto 1fr;
  row-gap: 18px;
  padding: 0;
  width: 100%;
  height: 500px;
`;

const SearchConditionContent = styled.div``;

const SearchCondition = styled.div`
  display: flex;
  flex-direction: column;
  flex: none;
  padding: 0 15px;
`;

const SearchConditionRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  &:not(:first-child) {
    margin-top: 3px;
  }
`;

const SearchConditionItem = styled.div`
  display: flex;
  align-items: center;

  &:not(:first-child) {
    margin-left: 15px;
  }
`;

const ItemLabel = styled.div`
  > span {
    display: inline-flex;
    margin-right: 5px;
  }
`;

const ItemValue = styled.div`
  > input {
    &.productName {
      width: 350px;
    }

    &.sku,
    &.twoGradeBarcode {
      width: 200px;
    }
  }
`;

const SearchCommand = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;

  > button:not(:first-child) {
    margin-left: 5px;
  }
`;

const SearchResultContent = styled.div`
  display: flex;
  overflow: auto;
  padding: 0 15px;
  height: 390px;
`;

const ResultDescription = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  height: 27px;
`;

const DataCount = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: right;
  min-width: 180px;

  > span {
    margin-left: 3px;
  }
`;

const SearchResultClearButton = styled(SubmitButton)`
  background-color: rgba(10, 73, 208, 1);

  &:focus {
    background-color: rgba(8, 8, 190, 1);
  }
`;

const ChangeSearchToggle = styled.div`
  width: 320px;
`;

const Toggle = styled.button`
  background: rgba(255, 255, 255, 1);
  color: rgba(36, 100, 215, 1);
  border: 1px solid rgba(36, 100, 215, 1);
  min-height: 24px;
  width: 50%;
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
          {t('pages:MapViewerProductLocationSearch.planogramData')}
        </Toggle>
        <Toggle
          disabled={!props.isPlanogramData}
          onClick={() => props.onChangeSearchTarget(false)}
          className={'countData'}
        >
          {t('pages:MapViewerProductLocationSearch.countData')}
        </Toggle>
      </ChangeSearchToggle>
    );
  },
);

export type Condition = {
  productName: string;
  sku: string;
  twoGradeBarcode: string;
};

export type ConditionEvent = {
  onChangeProductName(value: string): void;
  onChangeSku(value: string): void;
  onChangeTwoGradeBarcode(value: string): void;
  onClickSearch(e: React.MouseEvent<HTMLButtonElement>): void;
  onClickClearSearchCondition(e: React.MouseEvent<HTMLButtonElement>): void;
};

interface Props extends ReactModal.Props, ChangeSearchTargetProps {
  /** 検索条件 */
  condition: Condition;
  /** 検索条件イベント */
  conditionEvent: ConditionEvent;
  /** 項目定義 */
  columns: RV.ColumnProps[];
  /** 検索結果 */
  result: ProductLocation[];
  /** 棚割データ検索可否 */
  canSearchPlanogramData: boolean;
  /** 検索結果クリア */
  onClickSearchResultClear(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void;
  /** 閉じる押下 */
  onClickClose(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

/**
 * 商品ロケーション検索.
 *
 * @param props プロパティ
 * @returns {React.ReactElement} ReactElement
 */
export const MapViewerProductLocationSearch = (
  props: Props,
): React.ReactElement => {
  const { condition, conditionEvent } = props;

  const [t] = useTranslation();

  const numberFormat: Intl.NumberFormat = new Intl.NumberFormat('ja');

  // 検索条件
  const searchContent = (
    <SearchCondition>
      <SearchConditionRow>
        <SearchConditionItem>
          {/* 商品名 */}
          <ItemLabel>
            <span>
              {t('pages:MapViewerProductLocationSearch.condition.productName')}
            </span>
          </ItemLabel>
          <ItemValue>
            <InputText
              className="productName"
              onChange={(e) =>
                conditionEvent.onChangeProductName(e.target.value)
              }
              value={condition.productName}
              disabled={props.isPlanogramData}
            />
          </ItemValue>
        </SearchConditionItem>
        <SearchConditionItem>
          {/* SKU */}
          <ItemLabel>
            <span>
              {t('pages:MapViewerProductLocationSearch.condition.sku')}
            </span>
          </ItemLabel>
          <ItemValue>
            <InputText
              className="sku"
              valueMode="HALF_WIDTH"
              maxLength={20}
              onBlur={(e) => conditionEvent.onChangeSku(e.target.value)}
              onChange={(e) => conditionEvent.onChangeSku(e.target.value)}
              value={condition.sku}
            />
          </ItemValue>
        </SearchConditionItem>
        <SearchConditionItem>
          {/* 2段バーコード */}
          <ItemLabel>
            <span>
              {t(
                'pages:MapViewerProductLocationSearch.condition.twoGradeBarcode',
              )}
            </span>
          </ItemLabel>
          <ItemValue>
            <InputText
              className="twoGradeBarcode"
              valueMode="HALF_WIDTH"
              maxLength={20}
              onBlur={(e) =>
                conditionEvent.onChangeTwoGradeBarcode(e.target.value)
              }
              onChange={(e) =>
                conditionEvent.onChangeTwoGradeBarcode(e.target.value)
              }
              value={condition.twoGradeBarcode}
              disabled={props.isPlanogramData}
            />
          </ItemValue>
        </SearchConditionItem>
      </SearchConditionRow>
      <SearchCommand>
        {props.canSearchPlanogramData ? (
          <ChangeSearchTargetContent {...props} />
        ) : (
          <></>
        )}
        <Button onClick={conditionEvent.onClickSearch}>
          {t('pages:MapViewerProductLocationSearch.condition.button.search')}
        </Button>
        <Button onClick={conditionEvent.onClickClearSearchCondition}>
          {t('pages:MapViewerProductLocationSearch.condition.button.clear')}
        </Button>
      </SearchCommand>
    </SearchCondition>
  );

  // 検索件数
  const resultDescription = (
    <ResultDescription>
      <div></div>
      <DataCount>
        <span>
          {t('pages:MapViewerProductLocationSearch.results', {
            hits: numberFormat.format(props.result.length),
          })}
        </span>
      </DataCount>
    </ResultDescription>
  );

  // 検索結果
  const resultContent = (
    <DataTable
      description={resultDescription}
      headerHeight={33}
      rowHeight={33}
      columns={props.columns}
      data={props.result}
    />
  );

  return (
    <Template
      {...props}
      title={t('pages:MapViewerProductLocationSearch.title')}
      onRequestClose={props.onClickClose}
      contentLabel="MapViewerProductLocationSearch"
    >
      <Wrapper>
        <Content>
          <SearchConditionContent>{searchContent}</SearchConditionContent>
          <SearchResultContent>{resultContent}</SearchResultContent>
        </Content>
        <ModalCommands>
          <CancelButton onClick={props.onClickClose}>
            {t('pages:MapViewerProductLocationSearch.button.close')}
          </CancelButton>
          <SearchResultClearButton onClick={props.onClickSearchResultClear}>
            {t('pages:MapViewerProductLocationSearch.button.searchResultClear')}
          </SearchResultClearButton>
        </ModalCommands>
      </Wrapper>
    </Template>
  );
};
