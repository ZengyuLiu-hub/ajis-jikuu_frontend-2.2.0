import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styled from 'styled-components';

import {
  InputType,
  InputTypes,
  GondolaAlignment,
  GondolaAlignments,
  WallAlignment,
  WallAlignments,
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
  grid-template-rows: 40px 1fr;
  background-color: rgba(205, 205, 205, 1);
  height: 320px;
`;

const TableDescription = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

const WallLayout = styled.div`
  display: grid;
  margin: 20px auto;

  > div {
    padding: 3px;
    border: 1px solid rgba(51, 51, 51, 1);
    background-color: rgba(255, 255, 255, 1);

    &.selectable {
      cursor: pointer;
    }

    &.selected {
      background-color: rgba(242, 242, 242, 1);
    }
  }

  &.vertical {
    grid-template-columns: 30px;
    grid-auto-rows: 60px;

    > div:first-child {
      grid-row-start: 1;
      grid-row-end: 2;
    }

    > div:nth-child(2) {
      grid-row-start: 2;
      grid-row-end: 3;
    }

    > div:nth-child(3) {
      grid-row-start: 3;
      grid-row-end: 4;
    }

    > div:last-child {
      grid-row-start: 4;
      grid-row-end: 5;
    }
  }

  &.horizontal {
    grid-template-columns: repeat(4, 60px);
    grid-auto-rows: 30px;
    margin: 100px auto;

    > div:first-child {
      grid-column-start: 1;
      grid-column-end: 2;
    }

    > div:nth-child(2),
    div:nth-child(4) {
      grid-column-start: 2;
      grid-column-end: 3;
    }

    > div:nth-child(3),
    div:nth-child(5) {
      grid-column-start: 3;
      grid-column-end: 4;
    }

    > div:last-child {
      grid-column-start: 4;
      grid-column-end: 5;
    }
  }
`;

const Settings = styled.div``;

const Item = styled.div`
  display: flex;
  align-items: center;
  padding-right: 15px;
  min-height: 34px;

  > * + * {
    margin-left: 5px;
  }

  > span:first-child {
    min-width: 200px;
  }
`;

const ItemValue = styled.div`
  display: flex;
  flex-direction: row;

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
  startLocationNum: string;
  locationNumInputType: InputType;
  gondolaAlignment: GondolaAlignment;
  wallAlignment: WallAlignment;
  allViewFullLocationNum: boolean;
  gondolaWidthCells: number;
  gondolaDepthCells: number;
  numOfGondola: number;
  repeatCount: number;
  incrementalBranchNum: number;
  startingGondola: number;
};

export type ConditionEvent = {
  onBlurStartLocationNum(e: React.FocusEvent<HTMLInputElement>): void;
  onChangeLocationNumInputType(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeGondolaAlignment(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeWallAlignment(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeAllViewFullLocationNum(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeGondolaWidthCells(value: number): void;
  onChangeGondolaDepthCells(value: number): void;
  onChangeNumOfGondola(value: number): void;
  onChangeRepeatCount(value: number): void;
  onChangeIncrementalLocationNum(value: number): void;
  onChangeStartingGondola(e: number): void;
};

export type StartingPointData = {
  key: number;
  label: string;
  selectable: boolean;
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

export const MapEditorAddWall = (props: Props) => {
  const { condition, conditionEvent } = props;

  const [t] = useTranslation();

  return (
    <Template
      {...props}
      title={`${t('pages:MapEditorAddWall.title')}`}
      description={`${t('pages:MapEditorAddWall.description')}`}
      onRequestClose={props.onClickCancel}
      contentLabel="MapEditorAddWall"
    >
      <Wrapper>
        <ModalContent>
          <PreviewLayout>
            <Preview>
              <TableDescription>
                {t('pages:MapEditorAddWall.startingGondola.description')}
              </TableDescription>
              <WallLayout
                className={classNames({
                  vertical:
                    GondolaAlignments.VERTICAL === condition.gondolaAlignment,
                  horizontal:
                    GondolaAlignments.HORIZONTAL === condition.gondolaAlignment,
                })}
              >
                {props.startingPointData.map((data) => (
                  <div
                    key={data.key}
                    className={classNames({
                      selectable: data.selectable,
                      selected:
                        data.selectable &&
                        data.key === condition.startingGondola,
                    })}
                    onClick={() =>
                      data.selectable &&
                      conditionEvent.onChangeStartingGondola(data.key)
                    }
                  >
                    {data.label}
                  </div>
                ))}
              </WallLayout>
            </Preview>
            <Settings>
              <Item>
                <ItemLabel
                  label={t('pages:MapEditorAddWall.startLocationNum.label')}
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
                      name="MapEditorAddWall.locationNumInputType"
                      label={`${t(
                        'pages:MapEditorAddWall.startLocationNum.MANUAL',
                      )}`}
                      value={InputTypes.MANUAL}
                      onChange={conditionEvent.onChangeLocationNumInputType}
                      checked={
                        InputTypes.MANUAL === condition.locationNumInputType
                      }
                    />
                    <RadioButton
                      name="MapEditorAddWall.locationNumInputType"
                      value={InputTypes.AUTO}
                      label={`${t(
                        'pages:MapEditorAddWall.startLocationNum.AUTO',
                      )}`}
                      onChange={conditionEvent.onChangeLocationNumInputType}
                      checked={
                        InputTypes.AUTO === condition.locationNumInputType
                      }
                    />
                  </ItemRow>
                </ItemValue>
              </Item>
              <Item>
                <ItemLabel
                  label={t('pages:MapEditorAddWall.wallAlignment.label')}
                />
                <ItemValue>
                  <ItemRow>
                    <RadioButton
                      name="MapEditorAddWall.wallAlignment"
                      value={WallAlignments.FW}
                      label="FW"
                      onChange={conditionEvent.onChangeWallAlignment}
                      checked={WallAlignments.FW === condition.wallAlignment}
                    />
                    <RadioButton
                      name="MapEditorAddWall.wallAlignment"
                      value={WallAlignments.LW}
                      label="LW"
                      onChange={conditionEvent.onChangeWallAlignment}
                      checked={WallAlignments.LW === condition.wallAlignment}
                    />
                    <RadioButton
                      name="MapEditorAddWall.wallAlignment"
                      value={WallAlignments.BW}
                      label="BW"
                      onChange={conditionEvent.onChangeWallAlignment}
                      checked={WallAlignments.BW === condition.wallAlignment}
                    />
                    <RadioButton
                      name="MapEditorAddWall.wallAlignment"
                      value={WallAlignments.RW}
                      label="RW"
                      onChange={conditionEvent.onChangeWallAlignment}
                      checked={WallAlignments.RW === condition.wallAlignment}
                    />
                  </ItemRow>
                </ItemValue>
              </Item>
              <Item>
                <ItemLabel
                  label={t(
                    'pages:MapEditorAddWall.allViewFullLocationNum.label',
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
              <Item>
                <ItemLabel
                  label={t('pages:MapEditorAddWall.gondolaWidthCells.label')}
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
                      {t('pages:MapEditorAddWall.gondolaWidthCells.unit')}
                    </span>
                  </ItemRow>
                </ItemValue>
              </Item>
              <Item>
                <ItemLabel
                  label={t('pages:MapEditorAddWall.gondolaDepthCells.label')}
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
                      {t('pages:MapEditorAddWall.gondolaDepthCells.unit')}
                    </span>
                  </ItemRow>
                </ItemValue>
              </Item>
              <Item>
                <ItemLabel
                  label={t('pages:MapEditorAddWall.numOfGondola.label')}
                />
                <ItemValue>
                  <ItemRow>
                    <InputNumber
                      min={1}
                      max={100}
                      minLength={1}
                      maxLength={3}
                      onBlur={(e) =>
                        conditionEvent.onChangeNumOfGondola(
                          Number(e.target.value),
                        )
                      }
                      value={condition.numOfGondola}
                    />
                  </ItemRow>
                </ItemValue>
              </Item>
            </Settings>
          </PreviewLayout>
        </ModalContent>
        <ModalCommands>
          <CancelButton onClick={props.onClickCancel}>
            {t('pages:MapEditorAddWall.button.cancel')}
          </CancelButton>
          <SubmitButton onClick={props.onClickSubmit}>
            {t('pages:MapEditorAddWall.button.submit')}
          </SubmitButton>
        </ModalCommands>
      </Wrapper>
    </Template>
  );
};
