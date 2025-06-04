import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import {
  IslandType,
  IslandTypes,
  InputType,
  InputTypes,
  AvailableType,
  AvailableTypes,
} from '../../types';
import {
  CancelButton,
  CheckBox,
  InputText,
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

const Item = styled.div`
  display: flex;
  align-items: flex-start;
  padding-right: 15px;
  min-height: 34px;

  &:not(:first-child) {
    margin-top: 15px;
  }

  > * + * {
    margin-left: 5px;
  }
`;

const ItemLabel = styled.div`
  min-width: 200px;
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

  > input[type='text'] {
    &.freeTextValue {
      width: 250px;
    }
  }
`;

export type Condition = {
  islandType: IslandType;
  circleLocationNum: string;
  circleLocationNumInputType: InputType;
  circleLocationNumShowFull: boolean;
  circleLocationBorderAvailable: AvailableType;
  squareLocationNum: string;
  squareLocationNumInputType: InputType;
  squareLocationNumShowFull: boolean;
  squareLocationBorderAvailable: AvailableType;
  registerLocationNum: string;
  registerLocationNumInputType: InputType;
  registerLocationNumShowFull: boolean;
  registerBorderAvailable: AvailableType;
  freeTextValue: string;
  freeTextLocationNum: string;
  freeTextLocationNumInputType: InputType;
  freeTextLocationNumShowFull: boolean;
  freeTextBorderAvailable: AvailableType;
};

export type ConditionEvent = {
  onChangeIslandType(e: React.ChangeEvent<HTMLInputElement>): void;
  onBlurCircleLocationNum(e: React.FocusEvent<HTMLInputElement>): void;
  onChangeCircleLocationNumInputType(
    e: React.ChangeEvent<HTMLInputElement>
  ): void;
  onChangeCircleLocationNumShowFull(
    e: React.ChangeEvent<HTMLInputElement>
  ): void;
  onChangeCircleLocationBorderAvailable(
    e: React.ChangeEvent<HTMLInputElement>
  ): void;
  onBlurSquareLocationNum(e: React.FocusEvent<HTMLInputElement>): void;
  onChangeSquareLocationNumInputType(
    e: React.ChangeEvent<HTMLInputElement>
  ): void;
  onChangeSquareLocationNumShowFull(
    e: React.ChangeEvent<HTMLInputElement>
  ): void;
  onChangeSquareLocationBorderAvailable(
    e: React.ChangeEvent<HTMLInputElement>
  ): void;
  onBlurRegisterLocationNum(e: React.FocusEvent<HTMLInputElement>): void;
  onChangeRegisterLocationNumInputType(
    e: React.ChangeEvent<HTMLInputElement>
  ): void;
  onChangeRegisterLocationNumShowFull(
    e: React.ChangeEvent<HTMLInputElement>
  ): void;
  onChangeRegisterBorderAvailable(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeFreeTextValue(e: React.ChangeEvent<HTMLInputElement>): void;
  onBlurFreeTextLocationNum(e: React.FocusEvent<HTMLInputElement>): void;
  onChangeFreeTextLocationNumInputType(
    e: React.ChangeEvent<HTMLInputElement>
  ): void;
  onChangeFreeTextLocationNumShowFull(
    e: React.ChangeEvent<HTMLInputElement>
  ): void;
  onChangeFreeTextBorderAvailable(e: React.ChangeEvent<HTMLInputElement>): void;
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
 * アイランドを追加
 */
export const MapEditorAddIsland = (props: Props) => {
  const { condition, conditionEvent } = props;

  const [t] = useTranslation();

  return (
    <Template
      {...props}
      title={`${t('pages:MapEditorAddIsland.title')}`}
      description={`${t('pages:MapEditorAddIsland.description')}`}
      onRequestClose={props.onClickCancel}
      contentLabel="MapEditorAddIsland"
    >
      <Wrapper>
        <ModalContent>
          {/** 丸テーブル */}
          <Item>
            <ItemLabel>
              <RadioButton
                name="MapEditorAddIsland.islandType"
                value={IslandTypes.CIRCLE}
                label={`${t('pages:MapEditorAddIsland.circle.label')}`}
                onChange={conditionEvent.onChangeIslandType}
                checked={IslandTypes.CIRCLE === condition.islandType}
              />
            </ItemLabel>
            <ItemValue>
              <ItemRow>
                <span>
                  {t('pages:MapEditorAddIsland.circle.locationNum.label')}
                </span>
                <InputText
                  maxLength={props.locationNumLength}
                  onBlur={conditionEvent.onBlurCircleLocationNum}
                  value={condition.circleLocationNum}
                  valueMode="HALF_WIDTH_NUMBER"
                  disabled={
                    InputTypes.AUTO === condition.circleLocationNumInputType
                  }
                />
                <RadioButton
                  name="MapEditorAddIsland.circleLocationNumInputType"
                  value={InputTypes.MANUAL}
                  label={`${t(
                    'pages:MapEditorAddIsland.circle.locationNum.manual'
                  )}`}
                  onChange={conditionEvent.onChangeCircleLocationNumInputType}
                  checked={
                    InputTypes.MANUAL === condition.circleLocationNumInputType
                  }
                />
                <RadioButton
                  name="MapEditorAddIsland.circleLocationNumInputType"
                  value={InputTypes.AUTO}
                  label={`${t(
                    'pages:MapEditorAddIsland.circle.locationNum.auto'
                  )}`}
                  onChange={conditionEvent.onChangeCircleLocationNumInputType}
                  checked={
                    InputTypes.AUTO === condition.circleLocationNumInputType
                  }
                />
                <CheckBox
                  label={`${t(
                    'pages:MapEditorAddIsland.circle.locationNum.showFull'
                  )}`}
                  onChange={conditionEvent.onChangeCircleLocationNumShowFull}
                  checked={condition.circleLocationNumShowFull}
                />
              </ItemRow>
              <ItemRow>
                <span>{t('pages:MapEditorAddIsland.circle.border.label')}</span>
                <RadioButton
                  name="MapEditorAddIsland.circleLocationBorderAvailable"
                  value={AvailableTypes.AVAILABLE}
                  label={`${t(
                    'pages:MapEditorAddIsland.circle.border.available'
                  )}`}
                  onChange={
                    conditionEvent.onChangeCircleLocationBorderAvailable
                  }
                  checked={
                    AvailableTypes.AVAILABLE ===
                    condition.circleLocationBorderAvailable
                  }
                />
                <RadioButton
                  name="MapEditorAddIsland.circleLocationBorderAvailable"
                  value={AvailableTypes.NOT_AVAILABLE}
                  label={`${t(
                    'pages:MapEditorAddIsland.circle.border.notAvailable'
                  )}`}
                  onChange={
                    conditionEvent.onChangeCircleLocationBorderAvailable
                  }
                  checked={
                    AvailableTypes.NOT_AVAILABLE ===
                    condition.circleLocationBorderAvailable
                  }
                />
              </ItemRow>
            </ItemValue>
          </Item>
          {/** 四角テーブル */}
          <Item>
            <ItemLabel>
              <RadioButton
                name="MapEditorAddIsland.islandType"
                value={IslandTypes.SQUARE}
                label={`${t('pages:MapEditorAddIsland.square.label')}`}
                onChange={conditionEvent.onChangeIslandType}
                checked={IslandTypes.SQUARE === condition.islandType}
              />
            </ItemLabel>
            <ItemValue>
              <ItemRow>
                <span>
                  {t('pages:MapEditorAddIsland.circle.locationNum.label')}
                </span>
                <InputText
                  maxLength={props.locationNumLength}
                  onBlur={conditionEvent.onBlurSquareLocationNum}
                  value={condition.squareLocationNum}
                  valueMode="HALF_WIDTH_NUMBER"
                  disabled={
                    InputTypes.AUTO === condition.squareLocationNumInputType
                  }
                />
                <RadioButton
                  name="MapEditorAddIsland.squareLocationNumInputType"
                  value={InputTypes.MANUAL}
                  label={`${t(
                    'pages:MapEditorAddIsland.circle.locationNum.manual'
                  )}`}
                  onChange={conditionEvent.onChangeSquareLocationNumInputType}
                  checked={
                    InputTypes.MANUAL === condition.squareLocationNumInputType
                  }
                />
                <RadioButton
                  name="MapEditorAddIsland.squareLocationNumInputType"
                  value={InputTypes.AUTO}
                  label={`${t(
                    'pages:MapEditorAddIsland.circle.locationNum.auto'
                  )}`}
                  onChange={conditionEvent.onChangeSquareLocationNumInputType}
                  checked={
                    InputTypes.AUTO === condition.squareLocationNumInputType
                  }
                />
                <CheckBox
                  label={`${t(
                    'pages:MapEditorAddIsland.circle.locationNum.showFull'
                  )}`}
                  onChange={conditionEvent.onChangeSquareLocationNumShowFull}
                  checked={condition.squareLocationNumShowFull}
                />
              </ItemRow>
              <ItemRow>
                <span>{t('pages:MapEditorAddIsland.circle.border.label')}</span>
                <RadioButton
                  name="MapEditorAddIsland.squareLocationBorderAvailable"
                  value={AvailableTypes.AVAILABLE}
                  label={`${t(
                    'pages:MapEditorAddIsland.circle.border.available'
                  )}`}
                  onChange={
                    conditionEvent.onChangeSquareLocationBorderAvailable
                  }
                  checked={
                    AvailableTypes.AVAILABLE ===
                    condition.squareLocationBorderAvailable
                  }
                />
                <RadioButton
                  name="MapEditorAddIsland.squareLocationBorderAvailable"
                  value={AvailableTypes.NOT_AVAILABLE}
                  label={`${t(
                    'pages:MapEditorAddIsland.circle.border.notAvailable'
                  )}`}
                  onChange={
                    conditionEvent.onChangeSquareLocationBorderAvailable
                  }
                  checked={
                    AvailableTypes.NOT_AVAILABLE ===
                    condition.squareLocationBorderAvailable
                  }
                />
              </ItemRow>
            </ItemValue>
          </Item>
          {/** レジ */}
          <Item>
            <ItemLabel>
              <RadioButton
                name="MapEditorAddIsland.islandType"
                value={IslandTypes.REGISTER}
                label={`${t('pages:MapEditorAddIsland.register.label')}`}
                onChange={conditionEvent.onChangeIslandType}
                checked={IslandTypes.REGISTER === condition.islandType}
              />
            </ItemLabel>
            <ItemValue>
              <ItemRow>
                <span>
                  {t('pages:MapEditorAddIsland.register.locationNum.label')}
                </span>
                <InputText
                  maxLength={props.locationNumLength}
                  onBlur={conditionEvent.onBlurRegisterLocationNum}
                  value={condition.registerLocationNum}
                  valueMode="HALF_WIDTH_NUMBER"
                  disabled={
                    InputTypes.AUTO === condition.registerLocationNumInputType
                  }
                />
                <RadioButton
                  name="MapEditorAddIsland.registerLocationNumInputType"
                  value={InputTypes.MANUAL}
                  label={`${t(
                    'pages:MapEditorAddIsland.register.locationNum.manual'
                  )}`}
                  onChange={conditionEvent.onChangeRegisterLocationNumInputType}
                  checked={
                    InputTypes.MANUAL === condition.registerLocationNumInputType
                  }
                />
                <RadioButton
                  name="MapEditorAddIsland.registerLocationNumInputType"
                  value={InputTypes.AUTO}
                  label={`${t(
                    'pages:MapEditorAddIsland.register.locationNum.auto'
                  )}`}
                  onChange={conditionEvent.onChangeRegisterLocationNumInputType}
                  checked={
                    InputTypes.AUTO === condition.registerLocationNumInputType
                  }
                />
                <CheckBox
                  label={`${t(
                    'pages:MapEditorAddIsland.register.locationNum.showFull'
                  )}`}
                  onChange={conditionEvent.onChangeRegisterLocationNumShowFull}
                  checked={condition.registerLocationNumShowFull}
                />
              </ItemRow>
              <ItemRow>
                <span>
                  {t('pages:MapEditorAddIsland.register.border.label')}
                </span>
                <RadioButton
                  name="MapEditorAddIsland.registerBorderAvailable"
                  value={AvailableTypes.AVAILABLE}
                  label={`${t(
                    'pages:MapEditorAddIsland.register.border.available'
                  )}`}
                  onChange={conditionEvent.onChangeRegisterBorderAvailable}
                  checked={
                    AvailableTypes.AVAILABLE ===
                    condition.registerBorderAvailable
                  }
                />
                <RadioButton
                  name="MapEditorAddIsland.registerBorderAvailable"
                  value={AvailableTypes.NOT_AVAILABLE}
                  label={`${t(
                    'pages:MapEditorAddIsland.register.border.notAvailable'
                  )}`}
                  onChange={conditionEvent.onChangeRegisterBorderAvailable}
                  checked={
                    AvailableTypes.NOT_AVAILABLE ===
                    condition.registerBorderAvailable
                  }
                />
              </ItemRow>
            </ItemValue>
          </Item>
          {/** フリーテキスト */}
          <Item>
            <ItemLabel>
              <RadioButton
                name="MapEditorAddIsland.islandType"
                value={IslandTypes.FREE_TEXT}
                label={`${t('pages:MapEditorAddIsland.freeText.label')}`}
                onChange={conditionEvent.onChangeIslandType}
                checked={IslandTypes.FREE_TEXT === condition.islandType}
              />
            </ItemLabel>
            <ItemValue>
              <ItemRow>
                <span>{t('pages:MapEditorAddIsland.freeText.text.label')}</span>
                <InputText
                  className="freeTextValue"
                  onChange={conditionEvent.onChangeFreeTextValue}
                  value={condition.freeTextValue}
                />
              </ItemRow>
              <ItemRow>
                <span>
                  {t('pages:MapEditorAddIsland.freeText.locationNum.label')}
                </span>
                <InputText
                  maxLength={props.locationNumLength}
                  onBlur={conditionEvent.onBlurFreeTextLocationNum}
                  value={condition.freeTextLocationNum}
                  valueMode="HALF_WIDTH_NUMBER"
                  disabled={
                    InputTypes.AUTO === condition.freeTextLocationNumInputType
                  }
                />
                <RadioButton
                  name="MapEditorAddIsland.freeTextLocationNumInputType"
                  value={InputTypes.MANUAL}
                  label={`${t(
                    'pages:MapEditorAddIsland.freeText.locationNum.manual'
                  )}`}
                  onChange={conditionEvent.onChangeFreeTextLocationNumInputType}
                  checked={
                    InputTypes.MANUAL === condition.freeTextLocationNumInputType
                  }
                />
                <RadioButton
                  name="MapEditorAddIsland.freeTextLocationNumInputType"
                  value={InputTypes.AUTO}
                  label={`${t(
                    'pages:MapEditorAddIsland.freeText.locationNum.auto'
                  )}`}
                  onChange={conditionEvent.onChangeFreeTextLocationNumInputType}
                  checked={
                    InputTypes.AUTO === condition.freeTextLocationNumInputType
                  }
                />
                <CheckBox
                  label={`${t(
                    'pages:MapEditorAddIsland.freeText.locationNum.showFull'
                  )}`}
                  onChange={conditionEvent.onChangeFreeTextLocationNumShowFull}
                  checked={condition.freeTextLocationNumShowFull}
                />
              </ItemRow>
              <ItemRow>
                <span>
                  {t('pages:MapEditorAddIsland.freeText.border.label')}
                </span>
                <RadioButton
                  name="MapEditorAddIsland.freeTextBorderAvailable"
                  value={AvailableTypes.AVAILABLE}
                  label={`${t(
                    'pages:MapEditorAddIsland.freeText.border.available'
                  )}`}
                  onChange={conditionEvent.onChangeFreeTextBorderAvailable}
                  checked={
                    AvailableTypes.AVAILABLE ===
                    condition.freeTextBorderAvailable
                  }
                />
                <RadioButton
                  name="MapEditorAddIsland.freeTextBorderAvailable"
                  value={AvailableTypes.NOT_AVAILABLE}
                  label={`${t(
                    'pages:MapEditorAddIsland.freeText.border.notAvailable'
                  )}`}
                  onChange={conditionEvent.onChangeFreeTextBorderAvailable}
                  checked={
                    AvailableTypes.NOT_AVAILABLE ===
                    condition.freeTextBorderAvailable
                  }
                />
              </ItemRow>
            </ItemValue>
          </Item>
        </ModalContent>
        <ModalCommands>
          <CancelButton onClick={props.onClickCancel}>
            {t('pages:MapEditorAddIsland.button.cancel')}
          </CancelButton>
          <SubmitButton onClick={props.onClickSubmit}>
            {t('pages:MapEditorAddIsland.button.submit')}
          </SubmitButton>
        </ModalCommands>
      </Wrapper>
    </Template>
  );
};
