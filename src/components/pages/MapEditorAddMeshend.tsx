import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styled from 'styled-components';

import { Direction, Directions } from '../../types';
import {
  CancelButton,
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

const MeshendLayout = styled.div`
  display: grid;
  margin: 50px auto auto auto;

  > div {
    position: relative;
    padding: 3px;
    background-color: rgba(255, 255, 255, 1);

    span {
      display: block;
      position: absolute;
    }
  }

  &.top {
    > div {
      width: 60px;
      height: 30px;

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

      span {
        top: 4px;
        left: 1px;
      }
    }
  }

  &.right {
    margin-top: 35px;

    > div {
      width: 30px;
      height: 60px;

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

      span {
        bottom: 1px;
        left: 1px;
        transform: rotate(-90deg);
      }
    }
  }

  &.bottom {
    > div {
      width: 60px;
      height: 30px;

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

      span {
        top: 1px;
        left: 1px;
      }
    }
  }

  &.left {
    margin-top: 35px;

    > div {
      width: 30px;
      height: 60px;

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

      span {
        bottom: 1px;
        left: 4px;
        transform: rotate(-90deg);
      }
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
  locationNum: string;
  gondolaDirection: Direction;
  gondolaWidthCells: number;
  gondolaDepthCells: number;
};

export type ConditionEvent = {
  onBlurLocationNum(e: React.FocusEvent<HTMLInputElement>): void;
  onChangeGondolaDirection(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeGondolaWidthCells(value: number): void;
  onChangeGondolaDepthCells(value: number): void;
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
  onClickCancel(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onClickSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onClickClose(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

/**
 * 編目エンドを追加
 */
export const MapEditorAddMeshend = (props: Props) => {
  const { condition, conditionEvent } = props;

  const [t] = useTranslation();

  return (
    <Template
      {...props}
      title={`${t('pages:MapEditorAddMeshend.title')}`}
      description={`${t('pages:MapEditorAddMeshend.description')}`}
      onRequestClose={props.onClickCancel}
      contentLabel="MapEditorAddMeshend"
    >
      <Wrapper>
        <ModalContent>
          <PreviewLayout>
            <Preview>
              <MeshendLayout
                className={classNames({
                  top: Directions.TOP === condition.gondolaDirection,
                  right: Directions.RIGHT === condition.gondolaDirection,
                  bottom: Directions.BOTTOM === condition.gondolaDirection,
                  left: Directions.LEFT === condition.gondolaDirection,
                })}
              >
                <div>
                  <span>01</span>
                </div>
              </MeshendLayout>
            </Preview>
            {/** ロケーション番号 */}
            <Settings>
              <Item>
                <ItemLabel
                  label={`${t('pages:MapEditorAddMeshend.locationNum.label')}`}
                />
                <ItemValue>
                  <ItemRow>
                    <InputText
                      maxLength={props.locationNumLength}
                      onBlur={conditionEvent.onBlurLocationNum}
                      value={condition.locationNum}
                      valueMode="HALF_WIDTH_NUMBER"
                    />
                  </ItemRow>
                </ItemValue>
              </Item>
              {/** 向き */}
              <Item>
                <ItemLabel
                  label={`${t('pages:MapEditorAddMeshend.alignment.label')}`}
                />
                <ItemValue>
                  <ItemRow>
                    <RadioButton
                      name="MapEditorAddMeshend.gondolaDirection"
                      value={Directions.TOP}
                      label={`${t('pages:MapEditorAddMeshend.alignment.TOP')}`}
                      onChange={conditionEvent.onChangeGondolaDirection}
                      checked={Directions.TOP === condition.gondolaDirection}
                    />
                    <RadioButton
                      name="MapEditorAddMeshend.gondolaDirection"
                      value={Directions.RIGHT}
                      label={`${t(
                        'pages:MapEditorAddMeshend.alignment.RIGHT'
                      )}`}
                      onChange={conditionEvent.onChangeGondolaDirection}
                      checked={Directions.RIGHT === condition.gondolaDirection}
                    />
                    <RadioButton
                      name="MapEditorAddMeshend.gondolaDirection"
                      value={Directions.BOTTOM}
                      label={`${t(
                        'pages:MapEditorAddMeshend.alignment.BOTTOM'
                      )}`}
                      onChange={conditionEvent.onChangeGondolaDirection}
                      checked={Directions.BOTTOM === condition.gondolaDirection}
                    />
                    <RadioButton
                      name="MapEditorAddMeshend.gondolaDirection"
                      value={Directions.LEFT}
                      label={`${t('pages:MapEditorAddMeshend.alignment.LEFT')}`}
                      onChange={conditionEvent.onChangeGondolaDirection}
                      checked={Directions.LEFT === condition.gondolaDirection}
                    />
                  </ItemRow>
                </ItemValue>
              </Item>
              {/** ゴンドラの幅 */}
              <Item>
                <ItemLabel
                  label={`${t(
                    'pages:MapEditorAddMeshend.gondolaWidthCells.label'
                  )}`}
                />
                <ItemValue>
                  <ItemRow>
                    {condition.gondolaDirection === Directions.TOP ||
                    condition.gondolaDirection === Directions.BOTTOM ? (
                      <InputNumber
                        min={1}
                        max={100}
                        step={1}
                        minLength={1}
                        maxLength={3}
                        onBlur={(e) =>
                          conditionEvent.onChangeGondolaWidthCells(
                            Number(e.target.value)
                          )
                        }
                        value={condition.gondolaWidthCells}
                      />
                    ) : (
                      <InputNumber
                        min={1}
                        max={100}
                        step={1}
                        minLength={1}
                        maxLength={3}
                        onBlur={(e) =>
                          conditionEvent.onChangeGondolaDepthCells(
                            Number(e.target.value)
                          )
                        }
                        value={condition.gondolaDepthCells}
                      />
                    )}
                    <span>{`${t(
                      'pages:MapEditorAddMeshend.gondolaWidthCells.unit'
                    )}`}</span>
                  </ItemRow>
                </ItemValue>
              </Item>
              {/** ゴンドラの奥行き */}
              <Item>
                <ItemLabel
                  label={`${t(
                    'pages:MapEditorAddMeshend.gondolaDepthCells.label'
                  )}`}
                />
                <ItemValue>
                  <ItemRow>
                    {condition.gondolaDirection === Directions.TOP ||
                    condition.gondolaDirection === Directions.BOTTOM ? (
                      <InputNumber
                        min={1}
                        max={100}
                        step={1}
                        minLength={1}
                        maxLength={3}
                        onBlur={(e) =>
                          conditionEvent.onChangeGondolaDepthCells(
                            Number(e.target.value)
                          )
                        }
                        value={condition.gondolaDepthCells}
                      />
                    ) : (
                      <InputNumber
                        min={1}
                        max={100}
                        step={1}
                        minLength={1}
                        maxLength={3}
                        onBlur={(e) =>
                          conditionEvent.onChangeGondolaWidthCells(
                            Number(e.target.value)
                          )
                        }
                        value={condition.gondolaWidthCells}
                      />
                    )}
                    <span>{`${t(
                      'pages:MapEditorAddMeshend.gondolaDepthCells.unit'
                    )}`}</span>
                  </ItemRow>
                </ItemValue>
              </Item>
            </Settings>
          </PreviewLayout>
        </ModalContent>
        <ModalCommands>
          <CancelButton onClick={props.onClickCancel}>
            {t('pages:MapEditorAddMeshend.button.cancel')}
          </CancelButton>
          <SubmitButton onClick={props.onClickSubmit}>
            {t('pages:MapEditorAddMeshend.button.submit')}
          </SubmitButton>
        </ModalCommands>
      </Wrapper>
    </Template>
  );
};
