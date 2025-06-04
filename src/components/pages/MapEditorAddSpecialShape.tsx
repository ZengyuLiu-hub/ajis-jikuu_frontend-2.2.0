import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styled from 'styled-components';

import {
  SpecialShapeTypes,
  SpecialShapeType,
  Directions,
  Direction,
} from '../../types';

import {
  CancelButton,
  InputNumber,
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
  grid-template-rows: 1fr;
  background-color: rgba(205, 205, 205, 1);
`;

const ShapeLayout = styled.div`
  display: grid;
  margin: 50px auto;

  grid-template-rows: repeat(4, 30px);
  grid-template-columns: repeat(4, 30px);

  &.top {
    > div {
      &:first-child {
        background: rgba(255, 255, 255, 1);
        border-top: 1px solid rgba(0, 0, 0, 1);
      }

      &:nth-child(n + 2):nth-child(-n + 4) {
        background: rgba(255, 255, 255, 1);
        border-top: 1px solid rgba(0, 0, 0, 1);
        border-bottom: 1px solid rgba(0, 0, 0, 1);
      }

      &:nth-child(4) {
        background: rgba(255, 255, 255, 1);
        border-right: 1px solid rgba(0, 0, 0, 1);
      }

      &:first-child,
      &:nth-child(5),
      &:nth-child(9),
      &:nth-child(13) {
        background: rgba(255, 255, 255, 1);
        border-left: 1px solid rgba(0, 0, 0, 1);
      }

      &:nth-child(5),
      &:nth-child(9),
      &:nth-child(13) {
        background: rgba(255, 255, 255, 1);
        border-right: 1px solid rgba(0, 0, 0, 1);
        border-left: 1px solid rgba(0, 0, 0, 1);
      }

      &:nth-child(13) {
        background: rgba(255, 255, 255, 1);
        border-bottom: 1px solid rgba(0, 0, 0, 1);
      }
    }
  }

  &.right {
    > div {
      &:first-child {
        background: rgba(255, 255, 255, 1);
        border-top: 1px solid rgba(0, 0, 0, 1);
        border-bottom: 1px solid rgba(0, 0, 0, 1);
        border-left: 1px solid rgba(0, 0, 0, 1);
      }

      &:nth-child(n + 2):nth-child(-n + 3) {
        background: rgba(255, 255, 255, 1);
        border-top: 1px solid rgba(0, 0, 0, 1);
        border-bottom: 1px solid rgba(0, 0, 0, 1);
      }

      &:nth-child(4) {
        background: rgba(255, 255, 255, 1);
        border-top: 1px solid rgba(0, 0, 0, 1);
        border-right: 1px solid rgba(0, 0, 0, 1);
      }

      &:nth-child(8),
      &:nth-child(12),
      &:last-child {
        background: rgba(255, 255, 255, 1);
        border-right: 1px solid rgba(0, 0, 0, 1);
        border-left: 1px solid rgba(0, 0, 0, 1);
      }

      &:last-child {
        background: rgba(255, 255, 255, 1);
        border-bottom: 1px solid rgba(0, 0, 0, 1);
      }
    }
  }

  &.bottom {
    > div {
      &:nth-child(4n) {
        background: rgba(255, 255, 255, 1);
        border-right: 1px solid rgba(0, 0, 0, 1);
      }

      &:nth-child(4n):not(:last-child) {
        border-left: 1px solid rgba(0, 0, 0, 1);
      }

      &:nth-child(4) {
        border-top: 1px solid rgba(0, 0, 0, 1);
      }

      &:nth-child(n + 13):nth-child(-n + 15) {
        background: rgba(255, 255, 255, 1);
        border-top: 1px solid rgba(0, 0, 0, 1);
      }

      &:nth-child(n + 13):nth-child(-n + 16) {
        border-bottom: 1px solid rgba(0, 0, 0, 1);
      }

      &:nth-child(13) {
        border-left: 1px solid rgba(0, 0, 0, 1);
      }
    }
  }

  &.left {
    > div {
      &:first-child {
        background: rgba(255, 255, 255, 1);
        border-top: 1px solid rgba(0, 0, 0, 1);
      }

      &:first-child,
      &:nth-child(5),
      &:nth-child(9),
      &:nth-child(13) {
        background: rgba(255, 255, 255, 1);
        border-left: 1px solid rgba(0, 0, 0, 1);
      }

      &:first-child,
      &:nth-child(5),
      &:nth-child(9) {
        background: rgba(255, 255, 255, 1);
        border-right: 1px solid rgba(0, 0, 0, 1);
      }

      &:nth-child(n + 13):nth-child(-n + 16) {
        background: rgba(255, 255, 255, 1);
        border-bottom: 1px solid rgba(0, 0, 0, 1);
      }

      &:nth-child(n + 14):nth-child(-n + 16) {
        background: rgba(255, 255, 255, 1);
        border-top: 1px solid rgba(0, 0, 0, 1);
      }

      &:last-child {
        border-right: 1px solid rgba(0, 0, 0, 1);
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
    margin-top: 10px;
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

  > span {
    min-width: 100px;
  }
`;

export type Condition = {
  shapeType: SpecialShapeType;
  direction: Direction;
  width: number;
  depth: number;
  tableTopDepth: number;
};

export type ConditionEvent = {
  onChangeShapeType(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeDirection(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeWidth(value: number): void;
  onChangeDepth(value: number): void;
  onChangeTableTopDepth(value: number): void;
};

interface Props extends ReactModal.Props {
  condition: Condition;
  conditionEvent: ConditionEvent;
  onClickCancel(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onClickSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onClickClose(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

/**
 * 特殊型の追加
 */
export const MapEditorAddSpecialShape = (props: Props) => {
  const { condition, conditionEvent } = props;

  const [t] = useTranslation();

  return (
    <Template
      {...props}
      title={`${t('pages:MapEditorAddSpecialShape.title')}`}
      description={`${t('pages:MapEditorAddSpecialShape.description')}`}
      onRequestClose={props.onClickCancel}
      contentLabel="MapEditorAddSpecialShape"
    >
      <Wrapper>
        <ModalContent>
          <PreviewLayout>
            <Preview>
              <ShapeLayout
                className={classNames({
                  top: Directions.TOP === condition.direction,
                  right: Directions.RIGHT === condition.direction,
                  bottom: Directions.BOTTOM === condition.direction,
                  left: Directions.LEFT === condition.direction,
                })}
              >
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </ShapeLayout>
            </Preview>
            {/** 形 */}
            <Settings>
              <Item>
                <ItemLabel
                  label={`${t('pages:MapEditorAddSpecialShape.shapes.label')}`}
                />
                <ItemValue>
                  <ItemRow>
                    <RadioButton
                      name="MapEditorAddSpecialShape.shapeType"
                      value={SpecialShapeTypes.L}
                      label={`${t('pages:MapEditorAddSpecialShape.shapes.L')}`}
                      onChange={conditionEvent.onChangeShapeType}
                      checked={SpecialShapeTypes.L === condition.shapeType}
                    />
                  </ItemRow>
                </ItemValue>
              </Item>
              {/** 向き */}
              <Item>
                <ItemLabel
                  label={`${t(
                    'pages:MapEditorAddSpecialShape.direction.label'
                  )}`}
                />
                <ItemValue>
                  <ItemRow>
                    <RadioButton
                      name="MapEditorAddSpecialShape.direction"
                      value={Directions.TOP}
                      label={`${t(
                        'pages:MapEditorAddSpecialShape.direction.TOP'
                      )}`}
                      onChange={conditionEvent.onChangeDirection}
                      checked={Directions.TOP === condition.direction}
                    />
                    <RadioButton
                      name="MapEditorAddSpecialShape.direction"
                      value={Directions.RIGHT}
                      label={`${t(
                        'pages:MapEditorAddSpecialShape.direction.RIGHT'
                      )}`}
                      onChange={conditionEvent.onChangeDirection}
                      checked={Directions.RIGHT === condition.direction}
                    />
                    <RadioButton
                      name="MapEditorAddSpecialShape.direction"
                      value={Directions.BOTTOM}
                      label={`${t(
                        'pages:MapEditorAddSpecialShape.direction.BOTTOM'
                      )}`}
                      onChange={conditionEvent.onChangeDirection}
                      checked={Directions.BOTTOM === condition.direction}
                    />
                    <RadioButton
                      name="MapEditorAddSpecialShape.direction"
                      value={Directions.LEFT}
                      label={`${t(
                        'pages:MapEditorAddSpecialShape.direction.LEFT'
                      )}`}
                      onChange={conditionEvent.onChangeDirection}
                      checked={Directions.LEFT === condition.direction}
                    />
                  </ItemRow>
                </ItemValue>
              </Item>
              {/** 全体の幅 */}
              <Item>
                <ItemLabel
                  label={`${t('pages:MapEditorAddSpecialShape.width.label')}`}
                />
                <ItemValue>
                  <ItemRow>
                    <InputNumber
                      min={10}
                      max={300}
                      step={10}
                      minLength={2}
                      maxLength={3}
                      onBlur={(e) =>
                        conditionEvent.onChangeWidth(Number(e.target.value))
                      }
                      value={condition.width}
                    />
                    <span>
                      {t('pages:MapEditorAddSpecialShape.width.unit')}
                    </span>
                  </ItemRow>
                </ItemValue>
              </Item>
              {/** 全体の奥行き */}
              <Item>
                <ItemLabel
                  label={`${t('pages:MapEditorAddSpecialShape.depth.label')}`}
                />
                <ItemValue>
                  <ItemRow>
                    <InputNumber
                      min={10}
                      max={300}
                      step={10}
                      minLength={2}
                      maxLength={3}
                      onBlur={(e) =>
                        conditionEvent.onChangeDepth(Number(e.target.value))
                      }
                      value={condition.depth}
                    />
                    <span>
                      {t('pages:MapEditorAddSpecialShape.depth.unit')}
                    </span>
                  </ItemRow>
                </ItemValue>
              </Item>
              {/** 天板の奥行き */}
              <Item>
                <ItemLabel
                  label={`${t(
                    'pages:MapEditorAddSpecialShape.tableTopDepth.label'
                  )}`}
                />
                <ItemValue>
                  <ItemRow>
                    <InputNumber
                      min={10}
                      max={300}
                      step={10}
                      minLength={2}
                      maxLength={3}
                      onBlur={(e) =>
                        conditionEvent.onChangeTableTopDepth(
                          Number(e.target.value)
                        )
                      }
                      value={condition.tableTopDepth}
                    />
                    <span>
                      {t('pages:MapEditorAddSpecialShape.tableTopDepth.unit')}
                    </span>
                  </ItemRow>
                </ItemValue>
              </Item>
            </Settings>
          </PreviewLayout>
        </ModalContent>
        <ModalCommands>
          <CancelButton onClick={props.onClickCancel}>
            {t('pages:MapEditorAddSpecialShape.button.cancel')}
          </CancelButton>
          <SubmitButton onClick={props.onClickSubmit}>
            {t('pages:MapEditorAddSpecialShape.button.submit')}
          </SubmitButton>
        </ModalCommands>
      </Wrapper>
    </Template>
  );
};
