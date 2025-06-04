import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styled from 'styled-components';

import {
  InputType,
  InputTypes,
  GondolaAlignment,
  GondolaAlignments,
  NumberingRule,
  NumberingRules,
  TableEndTypes,
  TableEndType,
  RepeatDirections,
  RepeatDirection,
} from '../../types';
import {
  CancelButton,
  CheckBox,
  InputNumber,
  InputText,
  ItemLabel,
  RadioButton,
  SubmitButton,
} from '../atoms';
import {
  ModalTemplate as Template,
  ModalContent,
  ModalCommands,
} from '../templates';

const Wrapper = styled.section`
  min-width: 500px;
`;

const PreviewLayout = styled.div`
  display: grid;
  grid-template-columns: 300px 450px;
  column-gap: 15px;
`;

const Preview = styled.div`
  display: grid;
  grid-template-rows: 60px 1fr;
  background-color: rgba(205, 205, 205, 1);
`;

const TableDescription = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

const TableLayout = styled.div`
  display: grid;
  margin: 50px auto auto auto;

  > div {
    padding: 3px;
    background-color: rgba(255, 255, 255, 1);

    &.basic {
      border: 1px solid rgba(51, 51, 51, 1);
    }

    &.mesh {
      position: relative;
      border: none;

      > span {
        display: block;
        position: absolute;
      }
    }

    &.nothing {
      color: rgba(102, 102, 102);
      opacity: 0.4;
    }

    &.selectable {
      cursor: pointer;
    }

    &.selected {
      background-color: rgba(242, 242, 242, 1);
    }
  }

  &.vertical {
    grid-template-columns: repeat(2, 30px);
    grid-auto-rows: 30px;

    > div {
      &:first-child {
        grid-column-start: 1;
        grid-column-end: 3;
        grid-row-start: 1;
        grid-row-end: 1;
      }

      &:nth-child(2),
      &:nth-child(3) {
        grid-row-start: 2;
        grid-row-end: 4;
      }

      &:nth-child(4),
      &:nth-child(5) {
        grid-row-start: 4;
        grid-row-end: 6;
      }

      &:last-child {
        grid-column-start: 1;
        grid-column-end: 3;
        grid-row-start: 6;
        grid-row-end: 6;
      }

      &.mesh.no1 {
        &::before {
          position: absolute;
          right: 0;
          bottom: 0;
          left: 0;
          content: '';
          border: 1px solid rgba(51, 51, 51, 1);
        }

        &::after {
          position: absolute;
          right: 0;
          bottom: 3px;
          left: 0;
          content: '';
          border: 1px solid rgba(51, 51, 51, 1);
        }

        > span {
          top: 1px;
          left: 1px;
        }
      }

      &.mesh.no6 {
        &::before {
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          content: '';
          border: 1px solid rgba(51, 51, 51, 1);
        }

        &::after {
          position: absolute;
          top: 3px;
          right: 0;
          left: 0;
          content: '';
          border: 1px solid rgba(51, 51, 51, 1);
        }

        > span {
          top: 4px;
          left: 1px;
        }
      }
    }
  }

  &.HORIZONTAL {
    grid-template-columns: repeat(6, 30px);
    grid-auto-rows: 30px;
    margin-top: 100px;

    > div {
      &:first-child {
        grid-column-start: 1;
        grid-column-end: 1;
        grid-row-start: 1;
        grid-row-end: 3;
      }

      &:nth-child(2) {
        grid-column-start: 2;
        grid-column-end: 4;
        grid-row-start: 2;
        grid-row-end: 3;
      }

      &:nth-child(3) {
        grid-column-start: 2;
        grid-column-end: 4;
        grid-row-start: 1;
        grid-row-end: 2;
      }

      &:nth-child(4) {
        grid-column-start: 4;
        grid-column-end: 6;
        grid-row-start: 2;
        grid-row-end: 3;
      }

      &:nth-child(5) {
        grid-column-start: 4;
        grid-column-end: 6;
        grid-row-start: 1;
        grid-row-end: 2;
      }

      &:last-child {
        grid-column-start: 6;
        grid-column-end: 6;
        grid-row-start: 1;
        grid-row-end: 3;
      }

      &.mesh.no1 {
        &::before {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          content: '';
          border: 1px solid rgba(51, 51, 51, 1);
        }

        &::after {
          position: absolute;
          top: 0;
          right: 3px;
          bottom: 0;
          content: '';
          border: 1px solid rgba(51, 51, 51, 1);
        }
      }

      &.mesh.no6 {
        &::before {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          content: '';
          border: 1px solid rgba(51, 51, 51, 1);
        }

        &::after {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 3px;
          content: '';
          border: 1px solid rgba(51, 51, 51, 1);
        }
      }
    }
  }
`;

const Settings = styled.div``;

const Item = styled.div`
  display: flex;
  align-items: flex-start;
  padding-right: 15px;
  min-height: 34px;

  &:not(:first-child) {
    margin-top: 5px;
  }

  > * + * {
    margin-left: 5px;
  }

  > span:first-child {
    min-width: 200px;
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

  input + span {
    margin-left: 15px;
  }

  input[type='number'],
  input[type='text'] {
    width: 100px;
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

  > * + * {
    margin-left: 5px;
  }

  > a {
    margin: 0 0 5px 0;
  }
`;

export type Condition = {
  tableEndType: TableEndType;
  startLocationNum: string;
  locationNumInputType: InputType;
  numberingRule: NumberingRule;
  allViewFullLocationNum: boolean;
  gondolaAlignment: GondolaAlignment;
  numOfSideLocation: number;
  gondolaWidthCells: number;
  gondolaDepthCells: number;
  repeatDirection: RepeatDirection;
  repeatGapCells: number;
  repeatCount: number;
  incrementalTableId: number;
  startingGondola: number;
};

export type ConditionEvent = {
  onChangeTableEndType(e: React.ChangeEvent<HTMLInputElement>): void;
  onBlurStartLocationNum(e: React.FocusEvent<HTMLInputElement>): void;
  onChangeLocationNumInputType(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeNumberingRule(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeAllViewFullLocationNum(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeGondolaAlignment(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeNumOfSideLocation(value: number): void;
  onChangeGondolaWidthCells(value: number): void;
  onChangeGondolaDepthCells(value: number): void;
  onChangeRepeatDirection(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeRepeatGapCells(value: number): void;
  onChangeRepeatCount(value: number): void;
  onChangeIncrementalTableId(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeStartingGondola(e: number): void;
  onChangeToMeshend(e: number): void;
};

export type StartingPointData = {
  key: number;
  label: string;
  selectable: boolean;
  tableType: TableEndType;
};

interface Props extends ReactModal.Props {
  locationNumLength: number;
  condition: Condition;
  conditionEvent: ConditionEvent;
  startingPointData: StartingPointData[];
  onClickCancel(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onClickSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onClickClose(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

/**
 * テーブル追加
 */
export const MapEditorAddTable = (props: Props) => {
  const { condition, conditionEvent } = props;

  const [t] = useTranslation();

  return (
    <Template
      {...props}
      title={`${t('pages:MapEditorAddTable.title')}`}
      description={`${t('pages:MapEditorAddTable.description')}`}
      onRequestClose={props.onClickCancel}
      contentLabel="MapEditorAddTable"
    >
      <Wrapper>
        <ModalContent>
          <PreviewLayout>
            <Preview>
              <TableDescription>
                <RadioButton
                  name="MapEditorAddTable.tableEndType"
                  label={`${t('pages:MapEditorAddTable.tableEndType.BASIC')}`}
                  value={TableEndTypes.BASIC}
                  onChange={conditionEvent.onChangeTableEndType}
                  checked={TableEndTypes.BASIC === condition.tableEndType}
                />
                <RadioButton
                  name="MapEditorAddTable.tableEndType"
                  label={`${t(
                    'pages:MapEditorAddTable.tableEndType.MESH_END',
                  )}`}
                  value={TableEndTypes.MESH_END}
                  onChange={conditionEvent.onChangeTableEndType}
                  checked={TableEndTypes.MESH_END === condition.tableEndType}
                />
              </TableDescription>
              <TableLayout
                className={classNames({
                  vertical:
                    GondolaAlignments.VERTICAL === condition.gondolaAlignment,
                  HORIZONTAL:
                    GondolaAlignments.HORIZONTAL === condition.gondolaAlignment,
                })}
              >
                {props.startingPointData.map((data) => (
                  <div
                    key={data.key}
                    className={classNames({
                      basic: TableEndTypes.BASIC === data.tableType,
                      mesh: TableEndTypes.MESH_END === data.tableType,
                      nothing: TableEndTypes.NO_END === data.tableType,
                      no1: data.key === 1,
                      no6: data.key === 6,
                      selectable: data.selectable,
                      selected:
                        data.selectable &&
                        data.key === condition.startingGondola,
                    })}
                    onClick={() => {
                      if (data.selectable) {
                        if (TableEndTypes.BASIC === condition.tableEndType) {
                          // 起点を選択
                          conditionEvent.onChangeStartingGondola(data.key);
                        } else if (
                          TableEndTypes.MESH_END === condition.tableEndType
                        ) {
                          // エンドを変更
                          conditionEvent.onChangeToMeshend(data.key);
                        }
                      }
                    }}
                  >
                    <span>{data.label}</span>
                  </div>
                ))}
              </TableLayout>
            </Preview>
            <Settings>
              {/* サイドロケーション数 */}
              <Item>
                <ItemLabel
                  label={t('pages:MapEditorAddTable.numOfSideLocation.label')}
                />
                <ItemValue>
                  <ItemRow>
                    <InputNumber
                      min={0}
                      max={100}
                      step={1}
                      minLength={1}
                      maxLength={3}
                      onBlur={(e) =>
                        conditionEvent.onChangeNumOfSideLocation(
                          Number(e.target.value),
                        )
                      }
                      value={condition.numOfSideLocation}
                    />
                  </ItemRow>
                </ItemValue>
              </Item>
              {/* エンドロケーション番号 */}
              <Item>
                <ItemLabel
                  label={t(
                    'pages:MapEditorAddTable.locationNumInputType.label',
                  )}
                />
                <ItemValue>
                  <ItemRow>
                    <InputText
                      maxLength={props.locationNumLength}
                      onBlur={conditionEvent.onBlurStartLocationNum}
                      value={condition.startLocationNum}
                      valueMode="HALF_WIDTH_NUMBER"
                      disabled={
                        InputTypes.AUTO === condition.locationNumInputType
                      }
                    />
                    <RadioButton
                      name="MapEditorAddTable.locationNumInputType"
                      label={`${t(
                        'pages:MapEditorAddTable.locationNumInputType.MANUAL',
                      )}`}
                      value={InputTypes.MANUAL}
                      onChange={conditionEvent.onChangeLocationNumInputType}
                      checked={
                        InputTypes.MANUAL === condition.locationNumInputType
                      }
                    />
                    <RadioButton
                      name="MapEditorAddTable.locationNumInputType"
                      value={InputTypes.AUTO}
                      label={`${t(
                        'pages:MapEditorAddTable.locationNumInputType.AUTO',
                      )}`}
                      onChange={conditionEvent.onChangeLocationNumInputType}
                      checked={
                        InputTypes.AUTO === condition.locationNumInputType
                      }
                    />
                  </ItemRow>
                </ItemValue>
              </Item>
              {/* 向き */}
              <Item>
                <ItemLabel
                  label={t('pages:MapEditorAddTable.gondolaAlignments.label')}
                />
                <ItemValue>
                  <ItemRow>
                    <RadioButton
                      name="MapEditorAddTable.gondolaAlignments"
                      value={GondolaAlignments.VERTICAL}
                      label={`${t(
                        'pages:MapEditorAddTable.gondolaAlignments.VERTICAL',
                      )}`}
                      onChange={conditionEvent.onChangeGondolaAlignment}
                      checked={
                        GondolaAlignments.VERTICAL ===
                        condition.gondolaAlignment
                      }
                    />
                    <RadioButton
                      name="MapEditorAddTable.gondolaAlignments"
                      value={GondolaAlignments.HORIZONTAL}
                      label={`${t(
                        'pages:MapEditorAddTable.gondolaAlignments.HORIZONTAL',
                      )}`}
                      onChange={conditionEvent.onChangeGondolaAlignment}
                      checked={
                        GondolaAlignments.HORIZONTAL ===
                        condition.gondolaAlignment
                      }
                    />
                  </ItemRow>
                </ItemValue>
              </Item>
              {/* ナンバリングルール */}
              <Item>
                <ItemLabel
                  label={t('pages:MapEditorAddTable.numberingRules.label')}
                />
                <ItemValue>
                  <ItemRow>
                    <RadioButton
                      name="MapEditorAddTable.numberingRules"
                      value={NumberingRules.COUNTER_CLOCKWISE}
                      label={`${t(
                        'pages:MapEditorAddTable.numberingRules.COUNTER_CLOCKWISE',
                      )}`}
                      onChange={conditionEvent.onChangeNumberingRule}
                      checked={
                        NumberingRules.COUNTER_CLOCKWISE ===
                        condition.numberingRule
                      }
                    />
                    <RadioButton
                      name="MapEditorAddTable.numberingRules"
                      value={NumberingRules.CLOCKWISE}
                      label={`${t(
                        'pages:MapEditorAddTable.numberingRules.CLOCKWISE',
                      )}`}
                      onChange={conditionEvent.onChangeNumberingRule}
                      checked={
                        NumberingRules.CLOCKWISE === condition.numberingRule
                      }
                    />
                  </ItemRow>
                </ItemValue>
              </Item>
              {/* 全フル桁表示 */}
              <Item>
                <ItemLabel
                  label={t(
                    'pages:MapEditorAddTable.allViewFullLocationNum.label',
                  )}
                />
                <ItemValue>
                  <ItemRow>
                    <CheckBox
                      onChange={conditionEvent.onChangeAllViewFullLocationNum}
                      checked={condition.allViewFullLocationNum}
                    />
                  </ItemRow>
                </ItemValue>
              </Item>
              {/* ゴンドラの幅 */}
              <Item>
                <ItemLabel
                  label={t('pages:MapEditorAddTable.gondolaWidthCells.label')}
                />
                <ItemValue>
                  <ItemRow>
                    <InputNumber
                      min={1}
                      max={100}
                      step={1}
                      minLength={1}
                      maxLength={3}
                      onBlur={(e) =>
                        conditionEvent.onChangeGondolaWidthCells(
                          Number(e.target.value),
                        )
                      }
                      value={condition.gondolaWidthCells}
                    />
                    <span>
                      {t('pages:MapEditorAddTable.gondolaWidthCells.unit')}
                    </span>
                  </ItemRow>
                </ItemValue>
              </Item>
              {/* ゴンドラの奥行き */}
              <Item>
                <ItemLabel
                  label={t('pages:MapEditorAddTable.gondolaDepthCells.label')}
                />
                <ItemValue>
                  <ItemRow>
                    <InputNumber
                      min={1}
                      max={100}
                      step={1}
                      minLength={1}
                      maxLength={3}
                      onBlur={(e) =>
                        conditionEvent.onChangeGondolaDepthCells(
                          Number(e.target.value),
                        )
                      }
                      value={condition.gondolaDepthCells}
                    />
                    <span>
                      {t('pages:MapEditorAddTable.gondolaDepthCells.unit')}
                    </span>
                  </ItemRow>
                </ItemValue>
              </Item>
              {/* 繰返し向き */}
              <Item>
                <ItemLabel
                  label={t('pages:MapEditorAddTable.repeatDirection.label')}
                />
                <ItemValue>
                  <ItemRow>
                    <RadioButton
                      name="MapEditorAddTable.repeatDirection"
                      value={RepeatDirections.TOP}
                      label={`${t(
                        'pages:MapEditorAddTable.repeatDirection.TOP',
                      )}`}
                      onChange={conditionEvent.onChangeRepeatDirection}
                      checked={
                        RepeatDirections.TOP === condition.repeatDirection
                      }
                    />
                    <RadioButton
                      name="MapEditorAddTable.repeatDirection"
                      value={RepeatDirections.RIGHT}
                      label={`${t(
                        'pages:MapEditorAddTable.repeatDirection.RIGHT',
                      )}`}
                      onChange={conditionEvent.onChangeRepeatDirection}
                      checked={
                        RepeatDirections.RIGHT === condition.repeatDirection
                      }
                    />
                    <RadioButton
                      name="MapEditorAddTable.repeatDirection"
                      value={RepeatDirections.BOTTOM}
                      label={`${t(
                        'pages:MapEditorAddTable.repeatDirection.BOTTOM',
                      )}`}
                      onChange={conditionEvent.onChangeRepeatDirection}
                      checked={
                        RepeatDirections.BOTTOM === condition.repeatDirection
                      }
                    />
                    <RadioButton
                      name="MapEditorAddTable.repeatDirection"
                      value={RepeatDirections.LEFT}
                      label={`${t(
                        'pages:MapEditorAddTable.repeatDirection.LEFT',
                      )}`}
                      onChange={conditionEvent.onChangeRepeatDirection}
                      checked={
                        RepeatDirections.LEFT === condition.repeatDirection
                      }
                    />
                  </ItemRow>
                </ItemValue>
              </Item>
              {/* 繰返し間隔 */}
              <Item>
                <ItemLabel
                  label={t('pages:MapEditorAddTable.repeatGapCells.label')}
                />
                <ItemValue>
                  <ItemRow>
                    <InputNumber
                      min={0}
                      max={300}
                      step={1}
                      minLength={1}
                      maxLength={3}
                      onBlur={(e) =>
                        conditionEvent.onChangeRepeatGapCells(
                          Number(e.target.value),
                        )
                      }
                      value={condition.repeatGapCells}
                    />
                    <span>
                      {t('pages:MapEditorAddTable.repeatGapCells.unit')}
                    </span>
                  </ItemRow>
                </ItemValue>
              </Item>
              {/* 繰返し回数 */}
              <Item>
                <ItemLabel
                  label={t('pages:MapEditorAddTable.repeatCount.label')}
                />
                <ItemValue>
                  <ItemRow>
                    <InputNumber
                      min={1}
                      max={99}
                      step={1}
                      minLength={1}
                      maxLength={2}
                      onBlur={(e) =>
                        conditionEvent.onChangeRepeatCount(
                          Number(e.target.value),
                        )
                      }
                      value={condition.repeatCount}
                    />
                  </ItemRow>
                </ItemValue>
              </Item>
            </Settings>
          </PreviewLayout>
        </ModalContent>
        <ModalCommands>
          <CancelButton onClick={props.onClickCancel}>
            {t('pages:MapEditorAddTable.button.cancel')}
          </CancelButton>
          <SubmitButton onClick={props.onClickSubmit}>
            {t('pages:MapEditorAddTable.button.submit')}
          </SubmitButton>
        </ModalCommands>
      </Wrapper>
    </Template>
  );
};
