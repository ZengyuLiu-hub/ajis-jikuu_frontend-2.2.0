import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import {
  CancelButton,
  CheckBox,
  Dropdown,
  InputFile,
  InputNumber,
  InputText,
  ItemLabel,
  RadioButton,
  SubmitButton,
} from '../atoms';
import {
  ModalCommands,
  ModalContent,
  ModalTemplate as Template,
} from '../templates';

const Wrapper = styled.section`
  min-width: 800px;
`;

const ErrorMessage = styled.span`
  color: rgba(255, 0, 0, 1);
`;

const Item = styled.div`
  display: flex;
  align-items: flex-start;
  padding-right: 15px;
  min-height: 34px;

  > * + * {
    margin-left: 5px;
  }

  > span:first-child {
    min-width: 130px;
  }

  > span {
    margin-top: 3px;
  }
`;

const ItemValue = styled.div`
  display: flex;
  flex-direction: column;

  p {
    margin: 0;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  button {
    min-width: 120px;
  }
`;

const ItemRowColumn = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;

  > input[type='text'] {
    min-width: 50px;
    width: 80px;
  }

  > input[type='number'] {
    min-width: 50px;
    width: 60px;
  }

  > span:first-child {
    display: inline-flex;
    justify-content: flex-end;
    margin-right: 6px;
    min-width: 150px;
  }

  input + span {
    margin-left: 15px;
  }
`;

const ItemRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;

  &:not(:first-child) {
    margin-top: 3px;
  }

  > div {
    width: 330px;
  }

  &.pillar-description {
    margin-left: 245px;
  }
`;

export type SheetInfo = {
  label: string;
  value: {
    name: string;
    index: number;
  };
};

export type Condition = {
  excelFile?: File;
  sheetInfo?: SheetInfo;
  startCell: string;
  endCell: string;
  cellWidth: number;
  cellHeight: number;
  tableIdLength: number;
  branchNumLength: number;
  pillarOption: "UNSPECIFIED" | "SPECIFIED";
  pillarCell: string;
  importShape: boolean;
};

export type ConditionEvent = {
  onChangeExcelFile(file: File): boolean;
  onChangeSheetInfo(e: React.ChangeEvent<HTMLSelectElement>): void;
  onBlurStartCell(e: React.FocusEvent<HTMLInputElement>): void;
  onBlurEndCell(e: React.FocusEvent<HTMLInputElement>): void;
  onChangeCellWidth(value: number): void;
  onChangeCellHeight(value: number): void;
  onChangeTableIdLength(value: number): void;
  onChangeBranchNumLength(value: number): void;
  onChangePillarOption(e: React.ChangeEvent<HTMLInputElement>): void;
  onBlurPillarCell(e: React.FocusEvent<HTMLInputElement>): void;
  onChangeImportShape(e: React.ChangeEvent<HTMLInputElement>): void;
};

interface Props extends ReactModal.Props {
  sheetNames: SheetInfo[];
  latticeWidth: number;
  latticeHeight: number;
  condition: Condition;
  conditionEvent: ConditionEvent;
  errors: Map<string, string>;
  onClickCancel(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onClickSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onClickClose(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

/**
 * Excel マップ取り込み
 */
export const MapEditorExcelImport = (props: Props) => {
  const { condition, conditionEvent, errors } = props;

  const [t] = useTranslation();

  return (
    <Template
      {...props}
      title={`${t('pages:MapEditorExcelImport.title')}`}
      description={`${t('pages:MapEditorExcelImport.description')}`}
      onRequestClose={props.onClickCancel}
      contentLabel="MapEditorExcelImport"
    >
      <Wrapper>
        <ModalContent>
          {/** ブック */}
          <Item>
            <ItemLabel
              label={`${t('pages:MapEditorExcelImport.book.label')}`}
            />
            <ItemValue>
              <InputFile onFileSelection={conditionEvent.onChangeExcelFile}>
                {t('pages:MapEditorExcelImport.book.selectFile')}
              </InputFile>
              <span>{condition?.excelFile?.name}</span>
            </ItemValue>
          </Item>
          {errors.has('excelFile') && (
            <ErrorMessage>{errors.get('excelFile')}</ErrorMessage>
          )}
          {/** シート */}
          <Item>
            <ItemLabel
              label={`${t('pages:MapEditorExcelImport.sheet.label')}`}
            />
            <ItemValue>
              <ItemRow>
                <Dropdown
                  items={props.sheetNames}
                  labelField="label"
                  valueField="value"
                  valueFunction={(item) => JSON.stringify(item)}
                  onChange={conditionEvent.onChangeSheetInfo}
                  value={JSON.stringify(condition.sheetInfo)}
                  disabled={props.sheetNames.length === 0}
                />
              </ItemRow>
            </ItemValue>
          </Item>
          {/** 読取り範囲 */}
          <Item>
            <ItemLabel
              label={`${t('pages:MapEditorExcelImport.cellRange.label')}`}
            />
            <ItemValue>
              <ItemRow>
                <ItemRowColumn>
                  <span>{t('pages:MapEditorExcelImport.cellRange.start')}</span>
                  <InputText
                    valueMode="HALF_WIDTH_ALPHABET_AND_NUMBER"
                    maxLength={20}
                    onBlur={conditionEvent.onBlurStartCell}
                    value={condition.startCell}
                  />
                  <span></span>
                </ItemRowColumn>
                <ItemRowColumn>
                  <span>{t('pages:MapEditorExcelImport.cellRange.end')}</span>
                  <InputText
                    valueMode="HALF_WIDTH_ALPHABET_AND_NUMBER"
                    maxLength={20}
                    onBlur={conditionEvent.onBlurEndCell}
                    value={condition.endCell}
                  />
                  <span></span>
                </ItemRowColumn>
              </ItemRow>
            </ItemValue>
          </Item>
          {errors.has('startCell') && (
            <ErrorMessage>{errors.get('startCell')}</ErrorMessage>
          )}
          {errors.has('endCell') && (
            <ErrorMessage>{errors.get('endCell')}</ErrorMessage>
          )}
          {/** セルサイズ */}
          <Item>
            <ItemLabel
              label={`${t('pages:MapEditorExcelImport.cellSize.label')}`}
            />
            <ItemValue>
              <ItemRow>
                <ItemRowColumn>
                  <span>{t('pages:MapEditorExcelImport.cellSize.width')}</span>
                  <InputNumber
                    min={0}
                    max={100}
                    maxLength={3}
                    onBlur={(e) =>
                      conditionEvent.onChangeCellWidth(Number(e.target.value))
                    }
                    value={condition.cellWidth}
                  />
                  <span>{t('pages:MapEditorExcelImport.cellSize.unit')}</span>
                </ItemRowColumn>
                <ItemRowColumn>
                  <span>{t('pages:MapEditorExcelImport.cellSize.height')}</span>
                  <InputNumber
                    min={0}
                    max={100}
                    maxLength={3}
                    onBlur={(e) =>
                      conditionEvent.onChangeCellHeight(Number(e.target.value))
                    }
                    value={condition.cellHeight}
                  />
                  <span>{t('pages:MapEditorExcelImport.cellSize.unit')}</span>
                </ItemRowColumn>
              </ItemRow>
            </ItemValue>
          </Item>
          {errors.has('cellWidth') && (
            <ErrorMessage>{errors.get('cellWidth')}</ErrorMessage>
          )}
          {errors.has('cellHeight') && (
            <ErrorMessage>{errors.get('cellHeight')}</ErrorMessage>
          )}
          {/** 桁数 */}
          <Item>
            <ItemLabel
              label={`${t('pages:MapEditorExcelImport.length.label')}`}
            />
            <ItemValue>
              <ItemRow>
                <ItemRowColumn>
                  <span>{t('pages:MapEditorExcelImport.length.tableId')}</span>
                  <InputNumber
                    min={2}
                    max={4}
                    maxLength={2}
                    onBlur={(e) =>
                      conditionEvent.onChangeTableIdLength(
                        Number(e.target.value),
                      )
                    }
                    value={condition.tableIdLength}
                  />
                  <span>{t('pages:MapEditorExcelImport.length.unit')}</span>
                </ItemRowColumn>
                <ItemRowColumn>
                  <span>
                    {t('pages:MapEditorExcelImport.length.branchNum')}
                  </span>
                  <InputNumber
                    min={2}
                    max={4}
                    maxLength={2}
                    onBlur={(e) =>
                      conditionEvent.onChangeBranchNumLength(
                        Number(e.target.value),
                      )
                    }
                    value={condition.branchNumLength}
                  />
                  <span>{t('pages:MapEditorExcelImport.length.unit')}</span>
                </ItemRowColumn>
              </ItemRow>
            </ItemValue>
          </Item>
          {errors.has('tableIdLength') && (
            <ErrorMessage>{errors.get('tableIdLength')}</ErrorMessage>
          )}
          {errors.has('branchNumLength') && (
            <ErrorMessage>{errors.get('branchNumLength')}</ErrorMessage>
          )}
          {/** 柱の色 */}
          <Item>
            <ItemLabel
              label={`${t('pages:MapEditorExcelImport.pillar.label')}`}
            />
            <ItemValue>
              <ItemRow>
                <ItemRowColumn>
                  <span>{`${t(
                    'pages:MapEditorExcelImport.pillar.representativeCell',
                  )}`}</span>
                  <RadioButton
                    name="MapEditorExcelImport.pillarOption"
                    label={`${t(
                      'pages:MapEditorExcelImport.pillar.UNSPECIFIED',
                    )}`}
                    value={'UNSPECIFIED'}
                    onChange={conditionEvent.onChangePillarOption}
                    checked={condition.pillarOption === 'UNSPECIFIED'}
                  />
                  <RadioButton
                    name="MapEditorExcelImport.pillarOption"
                    label={`${t(
                      'pages:MapEditorExcelImport.pillar.SPECIFIED',
                    )}`}
                    value={'SPECIFIED'}
                    onChange={conditionEvent.onChangePillarOption}
                    checked={condition.pillarOption === 'SPECIFIED'}
                  />
                </ItemRowColumn>
                <ItemRowColumn>
                  <InputText
                    valueMode="HALF_WIDTH_ALPHABET_AND_NUMBER"
                    maxLength={20}
                    onBlur={conditionEvent.onBlurPillarCell}
                    value={condition.pillarCell}
                    disabled={condition.pillarOption === 'UNSPECIFIED'}
                  />
                </ItemRowColumn>
              </ItemRow>
              <ItemRow className="pillar-description">
                <span>
                  {t('pages:MapEditorExcelImport.pillar.description')}
                </span>
              </ItemRow>
            </ItemValue>
          </Item>
          {/** オートシェイプ */}
          <Item>
            <ItemLabel
              label={`${t('pages:MapEditorExcelImport.autoShape.label')}`}
            />
            <ItemValue>
              <ItemRowColumn>
                <span>{`${t(
                  'pages:MapEditorExcelImport.autoShape.import',
                )}`}</span>
                <CheckBox
                  onChange={conditionEvent.onChangeImportShape}
                  checked={condition.importShape}
                />
                <span></span>
              </ItemRowColumn>
            </ItemValue>
          </Item>
        </ModalContent>
        <ModalCommands>
          <CancelButton onClick={props.onClickCancel}>
            {t('pages:MapEditorExcelImport.button.cancel')}
          </CancelButton>
          <SubmitButton onClick={props.onClickSubmit}>
            {t('pages:MapEditorExcelImport.button.submit')}
          </SubmitButton>
        </ModalCommands>
      </Wrapper>
    </Template>
  );
};
