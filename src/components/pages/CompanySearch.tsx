// src/components/pages/CompanySearch.tsx
import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Company } from '../../types/company';
import {
  SearchResultTemplate as Template,
  SearchConditionArea,
  SearchConditionRow,
  SearchConditionItem,
  SearchConditionCommands,
  FooterRow,
} from '../templates';
import { Button,InputText } from '../atoms';
import * as RV from 'react-virtualized';
import { DataTable } from '../../containers/atoms';
import { Pagination } from '../../containers/organisms';
// 样式定义
const ErrorMessage = styled.span`
  color: rgba(255, 0, 0, 1);
`;
export type SearchCondition = {
  jurisdictionClass: string;
  companyCode: string;
  companyName: string;
};

export type SearchConditionEvent = {
  onBlurCompanyCode(value: string): void;
  onChangeCompanyName(value: string): void;
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
// 组件属性定义
interface Props {
  title: string;
  searchCondition: SearchCondition;
  searchConditionEvent: SearchConditionEvent;
  onClickSearch(e: React.MouseEvent<HTMLButtonElement>): void;
  onClickClearSearchCondition(e: React.MouseEvent<HTMLButtonElement>): void;
  columns: RV.ColumnProps[];
  data: Company[];
  pageCondition: PageCondition;
  pageEvent: PageEvent;
  errors: Map<string, string>;
}

// 企业信息检索组件
export const CompanySearch = (props : Props) => {
  const [t] = useTranslation();
  const { searchCondition, searchConditionEvent, errors, pageCondition, pageEvent } =
    props;
  const searchContent = (
    <>
      <SearchConditionArea>
        <SearchConditionRow>
          <SearchConditionItem>
            <span>{t('pages:CompanySearch.condition.companyCode')}</span>
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
            <span>{t('pages:CompanySearch.condition.companyName')}</span>
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