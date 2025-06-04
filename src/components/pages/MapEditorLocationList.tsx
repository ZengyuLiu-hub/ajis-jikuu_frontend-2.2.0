import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as RV from 'react-virtualized';
import styled from 'styled-components';

import {
  Button,
  CancelButton,
  CheckBox,
  Dropdown,
  InputText,
  RadioButton,
  SubmitButton,
} from '../atoms';
import {
  ModalCommands,
  ModalContent,
  ModalTemplate as Template,
} from '../templates';

import * as editorConstants from '../../constants/editor';
import { DataTable } from '../../containers/atoms';

const StyledTemplate = styled(Template)`
  &.maximizable-modal {
    > section {
      overflow: visible;
    }
  }
`;

const Wrapper = styled.section`
  min-width: 1400px;
`;

const Content = styled(ModalContent)`
  display: grid;
  grid-template-rows: auto 1fr auto;
  row-gap: 6px;
  padding: 0;
  width: 100%;
  height: 555px;

  &.maximized {
    height: calc(100vh - 183px);
  }
`;

const MaximizeModal = styled.label`
  position: absolute;
  top: -27px;
  right: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
`;

const MaximizeIcon = styled.div`
  width: 100%;
  height: 24px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 1);
  border-radius: 4px;

  &:hover {
    border: 1px solid rgba(204, 204, 204, 1);
  }
`;

const MaximizeStatus = styled.input`
  display: none;

  & + ${MaximizeIcon}::after {
    position: absolute;
    content: '';
    top: 0;
    left: 18px;
    border: none;
    background-color: transparent;
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M17 11l-5-5-5 5M17 18l-5-5-5 5'/%3E%3C/svg%3E");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 21px 21px;
    width: 24px;
    height: 100%;
  }

  &:hover {
    & + ${MaximizeIcon}::after {
      background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23cccccc' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M17 11l-5-5-5 5M17 18l-5-5-5 5'/%3E%3C/svg%3E");
    }
  }

  &:checked {
    & + ${MaximizeIcon}::after {
      background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M7 13l5 5 5-5M7 6l5 5 5-5'/%3E%3C/svg%3E");
    }

    &:hover {
      & + ${MaximizeIcon}::after {
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23cccccc' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M7 13l5 5 5-5M7 6l5 5 5-5'/%3E%3C/svg%3E");
      }
    }
  }
`;

const SearchCondition = styled.div`
  display: flex;
  flex-direction: column;
  flex: none;
  padding: 0 15px;
`;

const SearchResult = styled.div`
  display: flex;
  margin-top: 15px;
  padding: 0 15px;
  width: 100%;
`;

const ResultDescription = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
`;

const DataStatus = styled.div`
  display: flex;
  flex-direction: row;

  > div {
    &:not(:first-child) {
      margin-left: 15px;
    }

    > span:first-child {
      margin-right: 5px;
    }
  }
`;

const Status = styled.div`
  display: grid;
  grid-template-columns: auto auto auto auto auto;
  grid-column-gap: 15px;
  height: 100%;
`;

const TotalCount = styled.div`
  display: flex;
  height: 100%;
`;

const StatusItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  > span {
    display: inline-flex;
    align-items: center;
    font-weight: bold;
    margin-right: 5px;
    white-space: nowrap;
    height: 24px;
  }

  > span:first-child {
    color: rgba(102, 102, 102, 1);
  }

  > span:not(:first-child) {
    color: rgba(75, 0, 130, 1);
  }
`;

const DataCount = styled.div`
  display: flex;
  justify-content: right;
  min-width: 180px;

  > span {
    margin-left: 3px;
  }
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
  display: flex;
  align-items: center;
  height: 24px;

  > span {
    display: inline-flex;
    margin-right: 5px;
  }
`;

const ItemValue = styled.div`
  display: flex;
  align-items: center;
  height: 24px;

  > input {
    min-width: 50px;
    width: 90px;
  }
`;

const ItemFromTo = styled.div`
  > span {
    margin: 0 3px;
  }
`;

const AreaValue = styled(ItemValue)`
  > input {
    min-width: 50px;
    width: 60px;
  }
`;

const TableValue = styled(ItemFromTo)`
  > input {
    min-width: 50px;
    width: 60px;
  }
`;

const LocationValue = styled(ItemFromTo)`
  > input {
    min-width: 50px;
    width: 80px;
  }
`;

const TextItem = styled(SearchConditionItem)`
  > label {
    > span {
      margin-right: 5px;
    }

    > input {
      width: 200px;
    }
  }
`;

const OperationMode = styled.div`
  display: flex;
  align-items: center;
  height: 24px;

  > label {
    display: flex;
    align-items: center;

    > span {
      margin-right: 5px;
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

const BulkUpdateRows = styled.div`
  display: none;
  flex-direction: column;

  &.visible {
    display: flex;
  }
`;

const BulkUpdateRow = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0 15px;
  height: 36px;

  &:hover {
    background: none;
  }

  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    background-color: rgba(229, 229, 229, 1);
    border-top: 1px solid rgba(128, 128, 128, 1);
    border-bottom: 1px solid rgba(128, 128, 128, 1);
    border-left: 1px solid rgba(128, 128, 128, 1);

    &:last-child {
      border-right: 1px solid rgba(128, 128, 128, 1);
    }

    input {
      min-width: 50px;
      width: 100%;
    }

    &.locationNum {
      width: 149px;
    }
    &.showFullLocationNum {
      width: 60px;
    }
    &.ignoreLocation {
      width: 130px;
    }
    &.areaId {
      width: 70px;
    }
    &.tableId {
      width: 70px;
    }
    &.branch {
      width: 80px;
    }
    &.text {
      width: 200px;
    }
    &.fontSize {
      width: 70px;
    }
    &.remarks {
      width: 330px;
    }
    &.changingStatus {
      width: 81px;
      flex-grow: 1;

      button {
        &:focus {
          outline: none;
          background: linear-gradient(
            rgba(197, 197, 197, 1),
            rgba(183, 183, 183, 1),
            rgba(179, 179, 179, 1)
          );
        }
      }
    }
    &.changeSelection {
      width: 269px;
    }
  }
`;

const BulkUpdateSelectionRow = styled(BulkUpdateRow)`
  height: 24px;
`;

export type Condition = {
  areaId: string;
  areaIdOption: string;
  tableIdFrom: string;
  tableIdTo: string;
  locationNumFrom: string;
  locationNumTo: string;
  ignoreLocation: string;
  showFullLocationNum: string;
  text: string;
  remarks: string;
  changingStatus: string;
  operationMode: string;
};

export type ConditionEvent = {
  onChangeAreaId(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeAreaIdOption(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeTableIdFrom(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeTableIdTo(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeLocationNumFrom(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeLocationNumTo(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeIgnoreLocation(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeShowFullLocationNum(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeText(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeRemarks(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeChangingStatus(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeOperationMode(e: React.ChangeEvent<HTMLInputElement>): void;
  onClickSearch(e: React.MouseEvent<HTMLButtonElement>): void;
  onClickClearSearchCondition(e: React.MouseEvent<HTMLButtonElement>): void;
};

interface Props extends ReactModal.Props {
  areaIdLength: number;
  tableIdLength: number;
  locationNumLength: number;
  condition: Condition;
  conditionEvent: ConditionEvent;
  columns: RV.ColumnProps[];
  data: any[];
  totalRecords: number;
  countOfArea: number;
  countOfTable: number;
  countOfLocation: number;
  countOfMissingNumber: number;
  countOfEmptyNumber: number;
  bulkShowFullLocationNum: boolean;
  bulkIgnoreLocation: string;
  bulkAreaId: string;
  bulkTableId: string;
  bulkText: string;
  bulkFontSize: number;
  bulkRemarks: string;
  selectedBulkAreaId: boolean;
  selectedBulkTableId: boolean;
  selectedBulkText: boolean;
  selectedBulkFontSize: boolean;
  selectedBulkRemarks: boolean;
  maximizedModal: boolean;
  ignoreLocationItems: any[];
  selectedBulkIgnoreLocation: boolean;
  onChangeBulkShowFullLocationNum(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeBulkIgnoreLocation(e: React.ChangeEvent<HTMLSelectElement>): void;
  onChangeBulkAreaId(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeBulkTableId(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeBulkText(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeBulkFontSize(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeBulkRemarks(e: React.ChangeEvent<HTMLInputElement>): void;
  onClickBulkChange(e: React.MouseEvent<HTMLButtonElement>): void;
  onChangeBulkIgnoreLocation: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onChangeSelectedBulkIgnoreLocation(
    e: React.ChangeEvent<HTMLInputElement>,
  ): void;
  onChangeSelectedBulkAreaId(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeSelectedBulkTableId(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeSelectedBulkText(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeSelectedBulkFontSize(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeSelectedBulkRemarks(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeMaximizedModal(e: React.ChangeEvent<HTMLInputElement>): void;
  onClickCancel(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onClickSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onClickClose(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

/**
 * ロケーション一覧
 */
export const MapEditorLocationList = (props: Props) => {
  const { condition, conditionEvent } = props;

  const [t] = useTranslation();

  const numberFormat: Intl.NumberFormat = new Intl.NumberFormat('ja');

  const description = (
    <ResultDescription>
      <DataStatus>
        <TotalCount>
          <StatusItem>
            <span>{t('pages:MapEditorLocationList.totalCount.open')}</span>
          </StatusItem>
          <Status>
            <StatusItem>
              <span>
                {t('pages:MapEditorLocationList.totalCount.countOfArea')}
              </span>
              <span>{numberFormat.format(props.countOfArea)}</span>
            </StatusItem>
            <StatusItem>
              <span>
                {t('pages:MapEditorLocationList.totalCount.countOfTable')}
              </span>
              <span>{numberFormat.format(props.countOfTable)}</span>
            </StatusItem>
            <StatusItem>
              <span>
                {t('pages:MapEditorLocationList.totalCount.countOfLocation')}
              </span>
              <span>{numberFormat.format(props.countOfLocation)}</span>
            </StatusItem>
            <StatusItem>
              <span>
                {t(
                  'pages:MapEditorLocationList.totalCount.countOfMissingNumber',
                )}
              </span>
              <span>{numberFormat.format(props.countOfMissingNumber)}</span>
            </StatusItem>
            <StatusItem>
              <span>
                {t('pages:MapEditorLocationList.totalCount.countOfEmptyNumber')}
              </span>
              <span>{numberFormat.format(props.countOfEmptyNumber)}</span>
            </StatusItem>
          </Status>
          <StatusItem>
            <span>{t('pages:MapEditorLocationList.totalCount.close')}</span>
          </StatusItem>
        </TotalCount>
      </DataStatus>
      <OperationMode>
        <label>
          <span>{t('pages:MapEditorLocationList.operationModes.label')}</span>
          <RadioButton
            name="MapEditorLocationList.operationMode"
            label={`${t('pages:MapEditorLocationList.operationModes.VIEW')}`}
            value="VIEW"
            onChange={conditionEvent.onChangeOperationMode}
            checked={condition.operationMode === 'VIEW'}
          />
          <RadioButton
            name="MapEditorLocationList.operationMode"
            label={`${t('pages:MapEditorLocationList.operationModes.EDIT')}`}
            value="EDIT"
            onChange={conditionEvent.onChangeOperationMode}
            checked={condition.operationMode === 'EDIT'}
          />
        </label>
      </OperationMode>
      <DataCount>
        <span>
          {t('pages:MapEditorLocationList.results', {
            hits: numberFormat.format(props.data.length),
            total: numberFormat.format(props.totalRecords),
          })}
        </span>
      </DataCount>
    </ResultDescription>
  );

  return (
    <StyledTemplate
      {...props}
      title={`${t('pages:MapEditorLocationList.title')}`}
      description={`${t('pages:MapEditorLocationList.description')}`}
      onRequestClose={props.onClickCancel}
      contentLabel="MapEditorLocationList"
      className="maximizable-modal"
    >
      <Wrapper>
        <MaximizeModal>
          <MaximizeStatus
            type="checkbox"
            onChange={props.onChangeMaximizedModal}
            checked={props.maximizedModal}
          />
          <MaximizeIcon />
        </MaximizeModal>
        <Content
          className={classNames({
            maximized: props.maximizedModal,
          })}
        >
          <SearchCondition>
            <SearchConditionRow>
              <SearchConditionItem>
                {/* エリアID */}
                <ItemLabel>
                  <span>
                    {t('pages:MapEditorLocationList.condition.areaId.label')}
                  </span>
                </ItemLabel>
                <AreaValue>
                  <RadioButton
                    name="MapEditorLocationList.areaIdOption"
                    label={`${t(
                      'pages:MapEditorLocationList.condition.areaId.UNSPECIFIED',
                    )}`}
                    value={'UNSPECIFIED'}
                    onChange={conditionEvent.onChangeAreaIdOption}
                    checked={condition.areaIdOption === 'UNSPECIFIED'}
                  />
                  <RadioButton
                    name="MapEditorLocationList.areaIdOption"
                    label={`${t(
                      'pages:MapEditorLocationList.condition.areaId.SPECIFIED',
                    )}`}
                    value={'SPECIFIED'}
                    onChange={conditionEvent.onChangeAreaIdOption}
                    checked={condition.areaIdOption === 'SPECIFIED'}
                  />
                  <InputText
                    valueMode="HALF_WIDTH_ALPHABET_AND_NUMBER"
                    maxLength={props.areaIdLength}
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                      const { value } = e.target;

                      e.target.value =
                        value.length === 0
                          ? value
                          : `${value}`.padStart(props.areaIdLength, '0');

                      conditionEvent.onChangeAreaId(e);
                    }}
                    onChange={conditionEvent.onChangeAreaId}
                    value={condition.areaId}
                  />
                </AreaValue>
              </SearchConditionItem>
              <SearchConditionItem>
                {/* テーブルID */}
                <ItemLabel>
                  <span>
                    {t('pages:MapEditorLocationList.condition.tableId.label')}
                  </span>
                </ItemLabel>
                <TableValue>
                  <InputText
                    valueMode="HALF_WIDTH_NUMBER"
                    maxLength={props.tableIdLength}
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                      const { value } = e.target;

                      e.target.value =
                        value.length === 0
                          ? value
                          : `${value}`.padStart(props.tableIdLength, '0');

                      conditionEvent.onChangeTableIdFrom(e);
                    }}
                    onChange={conditionEvent.onChangeTableIdFrom}
                    value={condition.tableIdFrom}
                  />
                  <span>〜</span>
                  <InputText
                    valueMode="HALF_WIDTH_NUMBER"
                    maxLength={props.tableIdLength}
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                      const { value } = e.target;

                      e.target.value =
                        value.length === 0
                          ? value
                          : `${value}`.padStart(props.tableIdLength, '0');

                      conditionEvent.onChangeTableIdTo(e);
                    }}
                    onChange={conditionEvent.onChangeTableIdTo}
                    value={condition.tableIdTo}
                  />
                </TableValue>
              </SearchConditionItem>
              <SearchConditionItem>
                {/* ロケーション番号 */}
                <ItemLabel>
                  <span>
                    {t(
                      'pages:MapEditorLocationList.condition.locationNum.label',
                    )}
                  </span>
                </ItemLabel>
                <LocationValue>
                  <InputText
                    valueMode="HALF_WIDTH_NUMBER"
                    maxLength={props.locationNumLength}
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                      const { value } = e.target;

                      e.target.value =
                        value.length === 0
                          ? value
                          : `${value}`.padStart(props.locationNumLength, '0');

                      conditionEvent.onChangeLocationNumFrom(e);
                    }}
                    onChange={conditionEvent.onChangeLocationNumFrom}
                    value={condition.locationNumFrom}
                  />
                  <span>〜</span>
                  <InputText
                    valueMode="HALF_WIDTH_NUMBER"
                    maxLength={props.locationNumLength}
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                      const { value } = e.target;

                      e.target.value =
                        value.length === 0
                          ? value
                          : `${value}`.padStart(props.locationNumLength, '0');

                      conditionEvent.onChangeLocationNumTo(e);
                    }}
                    onChange={conditionEvent.onChangeLocationNumTo}
                    value={condition.locationNumTo}
                  />
                </LocationValue>
              </SearchConditionItem>
              <SearchConditionItem>
                {/* フル桁表示 */}
                <ItemLabel>
                  <span>
                    {t(
                      'pages:MapEditorLocationList.condition.showFullLocationNum.label',
                    )}
                  </span>
                </ItemLabel>
                <ItemValue>
                  <RadioButton
                    name="MapEditorLocationList.showFullLocationNum"
                    label={`${t(
                      'pages:MapEditorLocationList.condition.showFullLocationNum.NONE',
                    )}`}
                    value={'NONE'}
                    onChange={conditionEvent.onChangeShowFullLocationNum}
                    checked={condition.showFullLocationNum === 'NONE'}
                  />
                  <RadioButton
                    name="MapEditorLocationList.showFullLocationNum"
                    label={`${t(
                      'pages:MapEditorLocationList.condition.showFullLocationNum.SHOW',
                    )}`}
                    value={'SHOW'}
                    onChange={conditionEvent.onChangeShowFullLocationNum}
                    checked={condition.showFullLocationNum === 'SHOW'}
                  />
                  <RadioButton
                    name="MapEditorLocationList.showFullLocationNum"
                    label={`${t(
                      'pages:MapEditorLocationList.condition.showFullLocationNum.HIDE',
                    )}`}
                    value={'HIDE'}
                    onChange={conditionEvent.onChangeShowFullLocationNum}
                    checked={condition.showFullLocationNum === 'HIDE'}
                  />
                </ItemValue>
              </SearchConditionItem>
            </SearchConditionRow>
            <SearchConditionRow>
              {/* テキスト */}
              <TextItem>
                <label>
                  <span>
                    {t('pages:MapEditorLocationList.condition.text.label')}
                  </span>
                  <InputText
                    maxLength={255}
                    onChange={conditionEvent.onChangeText}
                    value={condition.text}
                  />
                </label>
              </TextItem>
              {/* メモ */}
              <TextItem>
                <label>
                  <span>
                    {t('pages:MapEditorLocationList.condition.remarks.label')}
                  </span>
                  <InputText
                    maxLength={500}
                    onChange={conditionEvent.onChangeRemarks}
                    value={condition.remarks}
                  />
                </label>
              </TextItem>
              <SearchConditionItem>
                {/* 欠番 */}
                <ItemLabel>
                  <span>
                    {t(
                      'pages:MapEditorLocationList.condition.ignoreLocation.label',
                    )}
                  </span>
                </ItemLabel>
                <ItemValue>
                  <RadioButton
                    name="MapEditorLocationList.ignoreLocation"
                    label={`${t(
                      'pages:MapEditorLocationList.condition.ignoreLocation.NONE',
                    )}`}
                    value={'NONE'}
                    onChange={conditionEvent.onChangeIgnoreLocation}
                    checked={condition.ignoreLocation === 'NONE'}
                  />
                  <RadioButton
                    name="MapEditorLocationList.ignoreLocation"
                    label={`${t(
                      'pages:MapEditorLocationList.condition.ignoreLocation.MISSING',
                    )}`}
                    value={'MISSING'}
                    onChange={conditionEvent.onChangeIgnoreLocation}
                    checked={condition.ignoreLocation === 'MISSING'}
                  />
                  <RadioButton
                    name="MapEditorLocationList.ignoreLocation"
                    label={`${t(
                      'pages:MapEditorLocationList.condition.ignoreLocation.EMPTY',
                    )}`}
                    value={'EMPTY'}
                    onChange={conditionEvent.onChangeIgnoreLocation}
                    checked={condition.ignoreLocation === 'EMPTY'}
                  />
                </ItemValue>
              </SearchConditionItem>
              <SearchConditionItem>
                {/* 状態 */}
                <ItemLabel>
                  <span>
                    {t(
                      'pages:MapEditorLocationList.condition.changingStatus.label',
                    )}
                  </span>
                </ItemLabel>
                <ItemValue>
                  <RadioButton
                    name="MapEditorLocationList.changingStatus"
                    label={`${t(
                      'pages:MapEditorLocationList.condition.changingStatus.NONE',
                    )}`}
                    value={'NONE'}
                    onChange={conditionEvent.onChangeChangingStatus}
                    checked={condition.changingStatus === 'NONE'}
                  />
                  <RadioButton
                    name="MapEditorLocationList.changingStatus"
                    label={`${t(
                      'pages:MapEditorLocationList.condition.changingStatus.WAIT',
                    )}`}
                    value={'WAIT'}
                    onChange={conditionEvent.onChangeChangingStatus}
                    checked={condition.changingStatus === 'WAIT'}
                  />
                </ItemValue>
              </SearchConditionItem>
            </SearchConditionRow>
            <SearchCommand>
              <Button onClick={conditionEvent.onClickSearch}>
                {t('pages:MapEditorLocationList.condition.button.search')}
              </Button>
              <Button onClick={conditionEvent.onClickClearSearchCondition}>
                {t('pages:MapEditorLocationList.condition.button.clear')}
              </Button>
            </SearchCommand>
          </SearchCondition>
          <SearchResult>
            <DataTable
              description={description}
              headerHeight={40}
              rowHeight={31}
              columns={props.columns}
              data={props.data}
            />
          </SearchResult>
          {/* 一括変更 */}
          <BulkUpdateRows
            className={classNames({
              visible: condition.operationMode === 'EDIT',
            })}
          >
            <BulkUpdateRow>
              {/* ロケーション列 */}
              <div className="locationNum">
                {t('pages:MapEditorLocationList.bulkUpdate.label')}
              </div>
              {/* フル桁列 */}
              <div className="showFullLocationNum">
                <CheckBox
                  checked={props.bulkShowFullLocationNum}
                  onChange={props.onChangeBulkShowFullLocationNum}
                />
              </div>
              {/* 除外列 */}
              <div className="ignoreLocation">
                <Dropdown
                  disabled={!props.selectedBulkIgnoreLocation}
                  items={props.ignoreLocationItems}
                  valueField="value"
                  labelField="label"
                  onChange={props.onChangeBulkIgnoreLocation}
                  value={props.bulkIgnoreLocation}
                />
              </div>
              {/* エリア列 */}
              <div className="areaId">
                <InputText
                  valueMode="HALF_WIDTH_ALPHABET_AND_NUMBER"
                  maxLength={props.areaIdLength}
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    const { value } = e.target;

                    e.target.value =
                      value.length === 0
                        ? value
                        : `${value}`.padStart(props.areaIdLength, '0');

                    props.onChangeBulkAreaId(e);
                  }}
                  onChange={props.onChangeBulkAreaId}
                  value={props.bulkAreaId}
                  disabled={!props.selectedBulkAreaId}
                />
              </div>
              {/* テーブル列 */}
              <div className="tableId">
                <InputText
                  valueMode="HALF_WIDTH_NUMBER"
                  maxLength={props.tableIdLength}
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    const { value } = e.target;

                    e.target.value =
                      value.length === 0
                        ? value
                        : `${value}`.padStart(props.tableIdLength, '0');

                    props.onChangeBulkTableId(e);
                  }}
                  onChange={props.onChangeBulkTableId}
                  value={props.bulkTableId}
                  disabled={!props.selectedBulkTableId}
                />
              </div>
              {/* 枝番列 */}
              <div className="branch"></div>
              {/* テキスト列 */}
              <div className="text">
                <InputText
                  maxLength={255}
                  onChange={props.onChangeBulkText}
                  value={props.bulkText}
                  disabled={!props.selectedBulkText}
                />
              </div>
              {/* フォントサイズ列 */}
              <div className="fontSize">
                <InputText
                  valueMode="HALF_WIDTH_NUMBER"
                  min={editorConstants.FONT_SIZE_MIN}
                  max={editorConstants.FONT_SIZE_MAX}
                  onBlur={props.onChangeBulkFontSize}
                  onChange={props.onChangeBulkFontSize}
                  value={props.bulkFontSize}
                  disabled={!props.selectedBulkFontSize}
                />
              </div>
              {/* メモ列 */}
              <div className="remarks">
                <InputText
                  maxLength={500}
                  onChange={props.onChangeBulkRemarks}
                  value={props.bulkRemarks}
                  disabled={!props.selectedBulkRemarks}
                />
              </div>
              {/* 操作状態列 */}
              <div className="changingStatus">
                {/* 変更ボタン */}
                <Button
                  onClick={props.onClickBulkChange}
                  disabled={
                    !props.selectedBulkIgnoreLocation &&
                    !props.selectedBulkAreaId &&
                    !props.selectedBulkTableId &&
                    !props.selectedBulkText &&
                    !props.selectedBulkFontSize &&
                    !props.selectedBulkRemarks
                  }
                >
                  {t('pages:MapEditorLocationList.bulkUpdate.change')}
                </Button>
              </div>
            </BulkUpdateRow>
            <BulkUpdateSelectionRow>
              <div className="locationNum">
                {t('pages:MapEditorLocationList.bulkUpdate.selectedColumn')}
              </div>
              <div className="showFullLocationNum"></div>
              <div className="ignoreLocation">
                <CheckBox
                  checked={props.selectedBulkIgnoreLocation}
                  onChange={props.onChangeSelectedBulkIgnoreLocation}
                />
              </div>
              <div className="areaId">
                <CheckBox
                  checked={props.selectedBulkAreaId}
                  onChange={props.onChangeSelectedBulkAreaId}
                />
              </div>
              <div className="tableId">
                <CheckBox
                  checked={props.selectedBulkTableId}
                  onChange={props.onChangeSelectedBulkTableId}
                />
              </div>
              <div className="branch"></div>
              <div className="text">
                <CheckBox
                  checked={props.selectedBulkText}
                  onChange={props.onChangeSelectedBulkText}
                />
              </div>
              <div className="fontSize">
                <CheckBox
                  checked={props.selectedBulkFontSize}
                  onChange={props.onChangeSelectedBulkFontSize}
                />
              </div>
              <div className="remarks">
                <CheckBox
                  checked={props.selectedBulkRemarks}
                  onChange={props.onChangeSelectedBulkRemarks}
                />
              </div>
              <div className="changingStatus"></div>
            </BulkUpdateSelectionRow>
          </BulkUpdateRows>
        </Content>
        <ModalCommands>
          <CancelButton onClick={props.onClickCancel}>
            {t('pages:MapEditorLocationList.button.cancel')}
          </CancelButton>
          <SubmitButton onClick={props.onClickSubmit}>
            {t('pages:MapEditorLocationList.button.submit')}
          </SubmitButton>
        </ModalCommands>
      </Wrapper>
    </StyledTemplate>
  );
};
