import { Dispatch } from 'react';
import ReactModal from 'react-modal';
import * as RV from 'react-virtualized';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { InventoryOperationDate, Jurisdiction } from '../../types';
import {
  Button,
  CancelButton,
  DatePicker,
  Dropdown,
  InputText,
  SubmitButton,
} from '../atoms';
import {
  ModalTemplate as Template,
  FooterRow,
  SearchConditionArea,
  SearchConditionCommands,
  SearchConditionItem,
  SearchConditionRow,
  ModalContent,
  ModalCommands,
} from '../templates';
import { DataTable } from '../../containers/atoms';
import { Pagination } from '../../containers/organisms';

const Wrapper = styled.section`
  min-width: 1200px;
`;

const StyledModalContent = styled(ModalContent)`
  height: 570px;
`;

const SearchConditionContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: none;
  padding: 0 15px;
`;

const SearchResultContent = styled.div`
  display: flex;
  overflow: auto;
  padding: 0 15px;
  height: 500px;
`;

const PageFooter = styled.div``;

const ErrorMessage = styled.span`
  color: rgba(255, 0, 0, 1);
`;

export type SearchCondition = {
  jurisdictionClass: string;
  companyCode: string;
  companyName: string;
  storeCode: string;
  storeName: string;
  inventoryDateFrom?: Date;
  inventoryDateTo?: Date;
};

export type SearchConditionEvent = {
  onChangeJurisdictionClass(value: string): void;
  onChangeCompanyCode(value: string): void;
  onChangeCompanyName(value: string): void;
  onChangeStoreCode(value: string): void;
  onChangeStoreName(value: string): void;
  onChangeInventoryDateFrom(date: Date): void;
  onChangeInventoryDateTo(date: Date): void;
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

interface Props extends ReactModal.Props {
  jurisdictions: Jurisdiction[];
  columns: RV.ColumnProps[];
  data: InventoryOperationDate[];
  searchCondition: SearchCondition;
  searchConditionEvent: Dispatch<any>;
  errors: Map<string, string>;
  canJurisdictionSelect: boolean;
  onClickSearch(): void;
  onClickClear(): void;
  pageCondition: PageCondition;
  pageEvent: PageEvent;
  onClickCancel(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  selectedRow?: any;
  onChangeSelectedRow(data: any): void;
  onClickSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

/**
 * ロケーション比較用データ検索.
 *
 * @param props プロパティ
 * @returns {React.ReactElement} ReactElement
 */
export const InventoryOperationDateSearch = (
  props: Props,
): React.ReactElement => {
  const [t] = useTranslation();

  const {
    jurisdictions,
    searchCondition,
    searchConditionEvent,
    errors,
    columns,
    data,
    onClickSearch,
    onClickClear,
    pageCondition,
    pageEvent,
  } = props;

  const searchContent = (
    <SearchConditionArea>
      <SearchConditionRow>
        <SearchConditionItem>
          <span>
            {t(
              'pages:InventoryOperationDateSearch.condition.jurisdictionClass',
            )}
          </span>
          <Dropdown
            items={jurisdictions}
            labelField="jurisdictionName"
            valueField="jurisdictionClass"
            onChange={(e) => {
              const { value: jurisdictionClass } = e.target;
              searchConditionEvent({ jurisdictionClass });
            }}
            value={searchCondition.jurisdictionClass}
            disabled={!props.canJurisdictionSelect}
          />
        </SearchConditionItem>
        <SearchConditionItem>
          <span>
            {t('pages:InventoryOperationDateSearch.condition.inventoryDate')}
          </span>
          <DatePicker
            selected={searchCondition.inventoryDateFrom}
            onChange={(inventoryDateFrom) =>
              searchConditionEvent({ inventoryDateFrom })
            }
            selectsStart
            startDate={searchCondition.inventoryDateFrom}
            endDate={searchCondition.inventoryDateTo}
            maxDate={searchCondition.inventoryDateTo}
          />
          <span className="dateRangeExpression"></span>
          <DatePicker
            selected={searchCondition.inventoryDateTo}
            onChange={(inventoryDateTo) =>
              searchConditionEvent({ inventoryDateTo })
            }
            selectsEnd
            startDate={searchCondition.inventoryDateFrom}
            endDate={searchCondition.inventoryDateTo}
            minDate={searchCondition.inventoryDateFrom}
          />
        </SearchConditionItem>
      </SearchConditionRow>
      <SearchConditionRow>
        <SearchConditionItem>
          <span>
            {t('pages:InventoryOperationDateSearch.condition.companyCode')}
          </span>
          <InputText
            size={5}
            onBlur={(e) => {
              const { value: companyCode } = e.target;
              searchConditionEvent({ companyCode });
            }}
            value={searchCondition.companyCode}
            valueMode="HALF_WIDTH_NUMBER"
            maxLength={5}
          />
        </SearchConditionItem>
        <SearchConditionItem>
          <span>
            {t('pages:InventoryOperationDateSearch.condition.companyName')}
          </span>
          <InputText
            onChange={(e) => {
              const { value: companyName } = e.target;
              searchConditionEvent({ companyName });
            }}
            value={searchCondition.companyName}
          />
        </SearchConditionItem>
        <SearchConditionItem>
          <span>
            {t('pages:InventoryOperationDateSearch.condition.storeCode')}
          </span>
          <InputText
            size={5}
            onBlur={(e) => {
              const { value: storeCode } = e.target;
              searchConditionEvent({ storeCode });
            }}
            value={searchCondition.storeCode}
            valueMode="HALF_WIDTH_NUMBER"
            maxLength={5}
          />
        </SearchConditionItem>
        <SearchConditionItem>
          <span>
            {t('pages:InventoryOperationDateSearch.condition.storeName')}
          </span>
          <InputText
            onChange={(e) => {
              const { value: storeName } = e.target;
              searchConditionEvent({ storeName });
            }}
            value={searchCondition.storeName}
          />
        </SearchConditionItem>
      </SearchConditionRow>
      {errors.has('companyCode') && (
        <SearchConditionRow>
          <ErrorMessage>{errors.get('cc')}</ErrorMessage>
        </SearchConditionRow>
      )}
      {errors.has('sc') && (
        <SearchConditionRow>
          <ErrorMessage>{errors.get('sc')}</ErrorMessage>
        </SearchConditionRow>
      )}
      <SearchConditionRow>
        <SearchConditionCommands>
          <Button onClick={onClickSearch}>
            {t('pages:InventoryOperationDateSearch.condition.button.search')}
          </Button>
          <Button onClick={onClickClear}>
            {t('pages:InventoryOperationDateSearch.condition.button.clear')}
          </Button>
        </SearchConditionCommands>
      </SearchConditionRow>
    </SearchConditionArea>
  );

  const resultContent = (
    <DataTable
      headerHeight={40}
      rowHeight={34}
      columns={columns}
      data={data}
      onRowClick={({ rowData }) => props.onChangeSelectedRow(rowData)}
      selectedRow={props.selectedRow}
    />
  );

  const footerContent = (
    <FooterRow>
      <Pagination
        hits={data.length}
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
      {...props}
      title={t('pages:InventoryOperationDateSearch.title')}
      onRequestClose={props.onClickCancel}
      contentLabel="InventoryOperationDateSearch"
    >
      <Wrapper>
        <StyledModalContent>
          {/* 検索条件 */}
          <SearchConditionContent>{searchContent}</SearchConditionContent>
          {/* 検索結果 */}
          <SearchResultContent>{resultContent}</SearchResultContent>
          {/* フッター */}
          <PageFooter>{footerContent}</PageFooter>
        </StyledModalContent>
        <ModalCommands>
          <CancelButton onClick={props.onClickCancel}>
            {t('pages:InventoryOperationDateSearch.command.cancel')}
          </CancelButton>
          <SubmitButton
            onClick={props.onClickSubmit}
            disabled={!props.selectedRow}
          >
            {t('pages:InventoryOperationDateSearch.command.submit')}
          </SubmitButton>
        </ModalCommands>
      </Wrapper>
    </Template>
  );
};
