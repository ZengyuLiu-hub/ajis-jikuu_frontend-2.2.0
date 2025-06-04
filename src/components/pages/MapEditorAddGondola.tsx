import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styled from 'styled-components';

import { GondolaAlignment, GondolaAlignments } from '../../types';
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

const SampleView = styled.div`
  display: grid;
  margin: 50px auto auto auto;

  > div {
    position: relative;
    padding: 3px;
    background-color: rgba(255, 255, 255, 1);
    border: 1px solid rgba(51, 51, 51, 1);

    span {
      display: block;
      position: absolute;
    }
  }

  &.horizontal {
    > div {
      width: 60px;
      height: 30px;

      span {
        top: 4px;
        left: 1px;
      }
    }
  }

  &.vertical {
    margin-top: 35px;

    > div {
      width: 30px;
      height: 60px;

      span {
        bottom: 1px;
        left: 1px;
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
  showFullLocationNum: boolean;
  gondolaAlignment: GondolaAlignment;
  gondolaWidthCells: number;
  gondolaDepthCells: number;
};

export type ConditionEvent = {
  onBlurLocationNum(e: React.FocusEvent<HTMLInputElement>): void;
  onChangeShowFullLocationNum(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeGondolaAlignment(e: React.ChangeEvent<HTMLInputElement>): void;
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
 * テーブル追加
 */
export const MapEditorAddGondola = (props: Props) => {
  const { condition, conditionEvent } = props;

  const [t] = useTranslation();

  return (
    <Template
      {...props}
      title={`${t('pages:MapEditorAddGondola.title')}`}
      description={`${t('pages:MapEditorAddGondola.description')}`}
      onRequestClose={props.onClickCancel}
      contentLabel="MapEditorAddGondola"
    >
      <Wrapper>
        <ModalContent>
          <PreviewLayout>
            <Preview>
              <SampleView
                className={classNames({
                  vertical:
                    GondolaAlignments.VERTICAL === condition.gondolaAlignment,
                  horizontal:
                    GondolaAlignments.HORIZONTAL === condition.gondolaAlignment,
                })}
              >
                <div>
                  <span>01</span>
                </div>
              </SampleView>
            </Preview>
            <Settings>
              {/** ロケーション番号 */}
              <Item>
                <ItemLabel
                  label={t(
                    'pages:MapEditorAddGondola.settings.locationNum.label'
                  )}
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
              {/** フル桁表示 */}
              <Item>
                <ItemLabel
                  label={t(
                    'pages:MapEditorAddGondola.settings.showFullLocationNum.label'
                  )}
                />
                <ItemValue>
                  <ItemRow>
                    <CheckBox
                      onChange={conditionEvent.onChangeShowFullLocationNum}
                      checked={condition.showFullLocationNum}
                    />
                  </ItemRow>
                </ItemValue>
              </Item>
              {/** 向き */}
              <Item>
                <ItemLabel
                  label={t(
                    'pages:MapEditorAddGondola.settings.alignment.label'
                  )}
                />
                <ItemValue>
                  <ItemRow>
                    <RadioButton
                      name="MapEditorAddGondola.gondolaAlignments"
                      value={GondolaAlignments.VERTICAL}
                      label={`${t(
                        'pages:MapEditorAddGondola.settings.alignment.vertical'
                      )}`}
                      onChange={conditionEvent.onChangeGondolaAlignment}
                      checked={
                        GondolaAlignments.VERTICAL ===
                        condition.gondolaAlignment
                      }
                    />
                    <RadioButton
                      name="MapEditorAddGondola.gondolaAlignments"
                      value={GondolaAlignments.HORIZONTAL}
                      label={`${t(
                        'pages:MapEditorAddGondola.settings.alignment.horizontal'
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
              {/** ゴンドラの幅 */}
              <Item>
                <ItemLabel
                  label={t(
                    'pages:MapEditorAddGondola.settings.widthCells.label'
                  )}
                />
                <ItemValue>
                  <ItemRow>
                    {condition.gondolaAlignment ===
                    GondolaAlignments.VERTICAL ? (
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
                    <span>
                      {t('pages:MapEditorAddGondola.settings.widthCells.unit')}
                    </span>
                  </ItemRow>
                </ItemValue>
              </Item>
              {/** ゴンドラの奥行き */}
              <Item>
                <ItemLabel
                  label={t(
                    'pages:MapEditorAddGondola.settings.depthCells.label'
                  )}
                />
                <ItemValue>
                  <ItemRow>
                    {condition.gondolaAlignment ===
                    GondolaAlignments.VERTICAL ? (
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
                    <span>
                      {t('pages:MapEditorAddGondola.settings.depthCells.unit')}
                    </span>
                  </ItemRow>
                </ItemValue>
              </Item>
            </Settings>
          </PreviewLayout>
        </ModalContent>
        <ModalCommands>
          <CancelButton onClick={props.onClickCancel}>
            {t('pages:MapEditorAddGondola.button.cancel')}
          </CancelButton>
          <SubmitButton onClick={props.onClickSubmit}>
            {t('pages:MapEditorAddGondola.button.submit')}
          </SubmitButton>
        </ModalCommands>
      </Wrapper>
    </Template>
  );
};
