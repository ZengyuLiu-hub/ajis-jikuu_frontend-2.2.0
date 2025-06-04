import React from 'react';
import * as RV from 'react-virtualized';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Jurisdiction, Store } from '../../types';

import { Button, Dropdown, InputText } from '../atoms';

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

const ErrorMessage = styled.span`
  color: rgba(255, 0, 0, 1);
`;

export type SearchCondition = {
  jurisdictionClass: string;
  companyCode: string;
  companyName: string;
  storeCode: string;
  storeName: string;
  storeName2: string;
};

export type SearchConditionEvent = {
  onChangeJurisdictionClass(value: string): void;
  onBlurCompanyCode(value: string): void;
  onChangeCompanyName(value: string): void;
  onBlurStoreCode(value: string): void;
  onChangeStoreName(value: string): void;
  onChangeStoreName2(value: string): void;
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
  jurisdictions: Jurisdiction[];
  columns: RV.ColumnProps[];
  data: Store[];
  searchCondition: SearchCondition;
  searchConditionEvent: SearchConditionEvent;
  errors: Map<string, string>;
  canJurisdictionSelect: boolean;
  onClickSearch(e: React.MouseEvent<HTMLButtonElement>): void;
  onClickClearSearchCondition(e: React.MouseEvent<HTMLButtonElement>): void;
  pageCondition: PageCondition;
  pageEvent: PageEvent;
}

export const StoreSearch = (props: Props) => {
  const { searchCondition, searchConditionEvent, errors, pageCondition, pageEvent } =
    props;

  const [t] = useTranslation();

  const searchContent = (
    <>
      <SearchConditionArea>
        <SearchConditionRow>
          <SearchConditionItem>
            <span>{t('pages:StoreSearch.condition.jurisdictionClass')}</span>
            <Dropdown
              items={props.jurisdictions}
              labelField="jurisdictionName"
              valueField="jurisdictionClass"
              onChange={(e) =>
                searchConditionEvent.onChangeJurisdictionClass(e.target.value)
              }
              value={searchCondition.jurisdictionClass}
              disabled={!props.canJurisdictionSelect}
            />
          </SearchConditionItem>
        </SearchConditionRow>
        <SearchConditionRow>
          <SearchConditionItem>
            <span>{t('pages:StoreSearch.condition.companyCode')}</span>
            <InputText
              onBlur={(e) =>
                searchConditionEvent.onBlurCompanyCode(e.target.value)
              }
              value={searchCondition.companyCode}
              valueMode="HALF_WIDTH_NUMBER"
              maxLength={5}
            />
          </SearchConditionItem>
          <SearchConditionItem>
            <span>{t('pages:StoreSearch.condition.companyName')}</span>
            <InputText
              onChange={(e) =>
                searchConditionEvent.onChangeCompanyName(e.target.value)
              }
              value={searchCondition.companyName}
            />
          </SearchConditionItem>
        </SearchConditionRow>
        {errors.has('companyCode') && (
          <SearchConditionRow>
            <ErrorMessage>{errors.get('companyCode')}</ErrorMessage>
          </SearchConditionRow>
        )}
        <SearchConditionRow>
          <SearchConditionItem>
            <span>{t('pages:StoreSearch.condition.storeCode')}</span>
            <InputText
              onBlur={(e) =>
                searchConditionEvent.onBlurStoreCode(e.target.value)
              }
              value={searchCondition.storeCode}
              valueMode="HALF_WIDTH_NUMBER"
              maxLength={5}
            />
          </SearchConditionItem>
         <SearchConditionItem>
            <span>{t('pages:StoreSearch.condition.storeName')}</span>
            <InputText
              onChange={(e) =>
                searchConditionEvent.onChangeStoreName(e.target.value)
              }
              value ={searchCondition.storeName}
            />
          </SearchConditionItem>
          <SearchConditionItem>
            <span>{t('pages:StoreSearch.condition.storeName2')}</span>
            <InputText
              onChange={(e) =>
                searchConditionEvent.onChangeStoreName2(e.target.value)
              }
              value ={searchCondition.storeName2}
            />
          </SearchConditionItem>
        </SearchConditionRow>
        {errors.has('sc') && (
          <SearchConditionRow>
            <ErrorMessage>{errors.get('sc')}</ErrorMessage>
          </SearchConditionRow>
        )}
        <SearchConditionRow>
          <SearchConditionCommands>
            <Button onClick={props.onClickSearch}>
              {t('pages:StoreSearch.condition.button.search')}
            </Button>
            <Button onClick={props.onClickClearSearchCondition}>
              {t('pages:StoreSearch.condition.button.clear')}
            </Button>
          </SearchConditionCommands>
        </SearchConditionRow>
      </SearchConditionArea>
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
