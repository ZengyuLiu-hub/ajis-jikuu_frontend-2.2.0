import React from 'react';
import * as RV from 'react-virtualized';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { InventoryDatesData, MapStore } from '../../types';

import { Button, DatePicker, CheckBox } from '../atoms';
import { DataTable } from '../../containers/atoms';
import { Pagination } from '../../containers/organisms';

import {
  SearchResultTemplate as Template,
  SearchConditionArea,
  SearchConditionRow,
  SearchConditionItem,
  SearchConditionCommands,
  FooterRow,
} from '../templates';

const PageCommands = styled.div`
  position: absolute;
  left: 135px;
  top: 34px;
`;

const MapVersionCommands = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

export type SearchCondition = {
  companyCode: string;
  storeCode: string;
  inventoryDateFrom?: Date;
  inventoryDateTo?: Date;
  linkedSchedule: boolean;
};

export type SearchConditionEvent = {
  onChangeInventoryDateFrom(date?: Date): void;
  onChangeInventoryDateTo(date?: Date): void;
  onChangeLinkedSchedule(checked: boolean): void;
};

export type PageCondition = {
  totalHits: number;
  pageRecordsList: number[];
  pageRecords: number;
  displayPageSize: number;
  currentPage: number;
};

export type PageEvent = {
  onChangePageRecords(records: number): void;
  onChangeCurrentPage(page: number): void;
};

interface Props {
  title: string;
  mapStore: MapStore;
  searchCondition: SearchCondition;
  searchConditionEvent: SearchConditionEvent;
  data: InventoryDatesData[];
  columns: RV.ColumnProps[];
  enableBackButton: boolean;
  canCreate: boolean;
  onClickBackButton(e: React.MouseEvent<HTMLButtonElement>): void;
  onClickCreate(e: React.MouseEvent<HTMLButtonElement>): void;
  onClickSearch(e: React.MouseEvent<HTMLButtonElement>): void;
  onClickClearSearchCondition(e: React.MouseEvent<HTMLButtonElement>): void;
  pageCondition: PageCondition;
  pageEvent: PageEvent;
}

/**
 * 版数一覧
 *
 * @param {Props} props プロパティ
 * @returns {React.ReactElement} ReactElement
 */
export const MapVersionSearch = (props: Props) => {
  const {
    mapStore,
    searchCondition,
    searchConditionEvent,
    pageCondition,
    pageEvent,
  } = props;

  const [t] = useTranslation();

  const searchContent = (
    <>
      <PageCommands>
        <div>
          {props.enableBackButton && (
            <Button onClick={props.onClickBackButton}>
              {t('pages:MapVersions.command.back')}
            </Button>
          )}
        </div>
      </PageCommands>
      <SearchConditionArea>
        <SearchConditionRow>
          <SearchConditionItem>
            <span>{t('pages:MapVersions.condition.jurisdictionName')}</span>
            <span>{`${mapStore.jurisdictionName}`}</span>
          </SearchConditionItem>
          <SearchConditionItem>
            <span>{t('pages:MapVersions.condition.companyName')}</span>
            <span>{`${mapStore.companyName} (${searchCondition.companyCode})`}</span>
          </SearchConditionItem>
          <SearchConditionItem>
            <span>{t('pages:MapVersions.condition.storeName')}</span>
            <span>{`${mapStore.storeName} (${searchCondition.storeCode})`}</span>
          </SearchConditionItem>
        </SearchConditionRow>
        <SearchConditionRow>
          <SearchConditionItem>
            <span>{t('pages:MapVersions.condition.inventoryDate')}</span>
            <DatePicker
              selected={searchCondition.inventoryDateFrom}
              onChange={(date) =>
                searchConditionEvent.onChangeInventoryDateFrom(
                  date ?? undefined,
                )
              }
              selectsStart
              startDate={searchCondition.inventoryDateFrom}
              endDate={searchCondition.inventoryDateTo}
              maxDate={searchCondition.inventoryDateTo}
            />
            <span className="dateRangeExpression"></span>
            <DatePicker
              selected={searchCondition.inventoryDateTo}
              onChange={(date) =>
                searchConditionEvent.onChangeInventoryDateTo(date ?? undefined)
              }
              selectsEnd
              startDate={searchCondition.inventoryDateFrom}
              endDate={searchCondition.inventoryDateTo}
              minDate={searchCondition.inventoryDateFrom}
            />
          </SearchConditionItem>
          <SearchConditionItem>
            <span>{t('pages:MapVersions.condition.linkedSchedule.label')}</span>
            <CheckBox
              label={`${t('pages:MapVersions.condition.linkedSchedule.value')}`}
              onChange={(e) =>
                searchConditionEvent.onChangeLinkedSchedule(e.target.checked)
              }
              checked={searchCondition.linkedSchedule}
            />
          </SearchConditionItem>
        </SearchConditionRow>
        <SearchConditionRow>
          <SearchConditionCommands>
            <Button onClick={props.onClickSearch}>
              {t('pages:MapVersions.condition.button.search')}
            </Button>
            <Button onClick={props.onClickClearSearchCondition}>
              {t('pages:MapVersions.condition.button.clear')}
            </Button>
          </SearchConditionCommands>
        </SearchConditionRow>
      </SearchConditionArea>
      <MapVersionCommands>
        <Button onClick={props.onClickCreate} disabled={!props.canCreate}>
          {t('pages:MapVersions.command.new')}
        </Button>
      </MapVersionCommands>
    </>
  );

  const resultContent = (
    <DataTable
      headerHeight={40}
      rowHeight={34}
      columns={props.columns}
      data={props.data}
    />
  );

  const footerContent = (
    <FooterRow>
      <Pagination
        hits={props.data.length}
        totalHits={pageCondition.totalHits}
        pageRecordsList={pageCondition.pageRecordsList}
        pageRecords={pageCondition.pageRecords}
        displayPageSize={pageCondition.displayPageSize}
        currentPage={pageCondition.currentPage}
        onChangePageRecords={pageEvent.onChangePageRecords}
        onChangeCurrentPage={pageEvent.onChangeCurrentPage}
      />
    </FooterRow>
  );

  return (
    <Template
      title={props.title}
      searchContent={searchContent}
      resultContent={resultContent}
      footerContent={footerContent}
    />
  );
};
