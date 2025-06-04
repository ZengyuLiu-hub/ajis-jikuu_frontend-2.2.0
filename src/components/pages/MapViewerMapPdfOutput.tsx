import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import {
  MapPdfOutputMode,
  MapPdfOutputModes,
  MapPdfPaperSize,
  MapPdfPaperSizes,
  MapPdfRotation,
  MapPdfRotations,
  ScreenCaptureRange,
  ScreenCaptureRanges,
  StageRegulationSize,
} from '../../types';

import {
  CancelButton,
  CheckBox,
  Dropdown,
  InputNumber,
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
  min-width: 500px;
  max-width: 800px;
`;

const Content = styled(ModalContent)`
  padding-top: 10px;
  min-height: 90px;
`;

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
    min-width: 250px;
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
    min-width: 120px;
  }
`;

export type Condition = {
  outputMode: MapPdfOutputMode;
  outputHeaderFooter: boolean;
  rotation: MapPdfRotation;
  stageWidth: number;
  stageHeight: number;
  regulationSize?: StageRegulationSize;
  screenCaptureRange: ScreenCaptureRange;
  printSize: MapPdfPaperSize;
};

export type ConditionEvent = {
  onChangeOutputMode(mode: MapPdfOutputMode): void;
  onChangeOutputHeaderFooter(value: boolean): void;
  onChangeRotation(value: MapPdfRotation): void;
  onChangeStageWidth(value: number): void;
  onChangeStageHeight(value: number): void;
  onChangeRegulationSize(size: StageRegulationSize): void;
  onChangeScreenCaptureRange(range: ScreenCaptureRange): void;
  onChangePrintSize(size: MapPdfPaperSize): void;
};

interface Props extends ReactModal.Props {
  condition: Condition;
  conditionEvent: ConditionEvent;
  regulationSizes: any[];
  onClickCancel(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onClickReset(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onClickSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onClickClose(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

/**
 * マップ PDF 出力モード.
 *
 * @param props プロパティ
 * @returns {React.ReactElement} ReactElement
 */
export const MapViewerMapPdfOutput = (props: Props): React.ReactElement => {
  const { condition, conditionEvent } = props;

  const [t] = useTranslation();

  return (
    <Template
      {...props}
      title={`${t('pages:MapViewerMapPdfOutput.title')}`}
      description={`${t('pages:MapViewerMapPdfOutput.description')}`}
      onRequestClose={props.onClickCancel}
      contentLabel="MapViewerMapPdfOutput"
    >
      <Wrapper>
        <Content>
          {/** 出力モード */}
          <Item>
            <ItemLabel
              label={t('pages:MapViewerMapPdfOutput.outputMode.label')}
            />
            <ItemValue>
              <ItemRow>
                <RadioButton
                  name="MapViewerMapPdfOutput.outputMode"
                  label={`${t(
                    'pages:MapViewerMapPdfOutput.outputMode.inventory',
                  )}`}
                  value={MapPdfOutputModes.INVENTORY}
                  onChange={(e) =>
                    conditionEvent.onChangeOutputMode(
                      e.target.value as MapPdfOutputMode,
                    )
                  }
                  checked={condition.outputMode === MapPdfOutputModes.INVENTORY}
                />
                <RadioButton
                  name="MapViewerMapPdfOutput.outputMode"
                  label={`${t(
                    'pages:MapViewerMapPdfOutput.outputMode.statementOfDelivery',
                  )}`}
                  value={MapPdfOutputModes.STATEMENT_OF_DELIVERY}
                  onChange={(e) =>
                    conditionEvent.onChangeOutputMode(
                      e.target.value as MapPdfOutputMode,
                    )
                  }
                  checked={
                    condition.outputMode ===
                    MapPdfOutputModes.STATEMENT_OF_DELIVERY
                  }
                />
              </ItemRow>
            </ItemValue>
          </Item>
          <Item>
            <ItemLabel
              label={t('pages:MapViewerMapPdfOutput.outputHeaderFooter.label')}
            />
            <ItemValue>
              <ItemRow>
                <CheckBox
                  label={t(
                    'pages:MapViewerMapPdfOutput.outputHeaderFooter.output',
                  )}
                  onChange={(e) =>
                    conditionEvent.onChangeOutputHeaderFooter(e.target.checked)
                  }
                  checked={condition.outputHeaderFooter}
                  disabled={
                    condition.outputMode !==
                    MapPdfOutputModes.STATEMENT_OF_DELIVERY
                  }
                />
              </ItemRow>
            </ItemValue>
          </Item>
          {/** 回転 */}
          <Item>
            <ItemLabel
              label={t('pages:MapViewerMapPdfOutput.rotation.label')}
            />
            <ItemValue>
              <ItemRow>
                <RadioButton
                  name="MapViewerMapPdfOutput.rotation"
                  label={t('pages:MapViewerMapPdfOutput.rotation.none')}
                  value={MapPdfRotations.NONE}
                  onChange={(e) =>
                    conditionEvent.onChangeRotation(
                      e.target.value as MapPdfRotation,
                    )
                  }
                  checked={condition.rotation === MapPdfRotations.NONE}
                />
                <RadioButton
                  name="MapViewerMapPdfOutput.rotation"
                  label={t('pages:MapViewerMapPdfOutput.rotation.right')}
                  value={MapPdfRotations.RIGHT}
                  onChange={(e) =>
                    conditionEvent.onChangeRotation(
                      e.target.value as MapPdfRotation,
                    )
                  }
                  checked={condition.rotation === MapPdfRotations.RIGHT}
                />
                <RadioButton
                  name="MapViewerMapPdfOutput.rotation"
                  label={t('pages:MapViewerMapPdfOutput.rotation.left')}
                  value={MapPdfRotations.LEFT}
                  onChange={(e) =>
                    conditionEvent.onChangeRotation(
                      e.target.value as MapPdfRotation,
                    )
                  }
                  checked={condition.rotation === MapPdfRotations.LEFT}
                />
              </ItemRow>
            </ItemValue>
            <ItemRow></ItemRow>
          </Item>
          {/** ステージサイズ */}
          <Item>
            <ItemLabel
              label={t('pages:MapViewerMapPdfOutput.stageSize.label')}
            />
            <ItemValue>
              <ItemRow>
                <span>{t('pages:MapViewerMapPdfOutput.stageSize.width')}</span>
                <InputNumber
                  min={300}
                  max={5000}
                  maxLength={4}
                  onBlur={(e) =>
                    conditionEvent.onChangeStageWidth(Number(e.target.value))
                  }
                  value={condition.stageWidth}
                />
                <span>{t('pages:MapViewerMapPdfOutput.stageSize.unit')}</span>
              </ItemRow>
              <ItemRow>
                <span>{t('pages:MapViewerMapPdfOutput.stageSize.height')}</span>
                <InputNumber
                  min={300}
                  max={5000}
                  maxLength={4}
                  onBlur={(e) =>
                    conditionEvent.onChangeStageHeight(Number(e.target.value))
                  }
                  value={condition.stageHeight}
                />
                <span>{t('pages:MapViewerMapPdfOutput.stageSize.unit')}</span>
              </ItemRow>
              <ItemRow>
                <span>
                  {t(
                    'pages:MapViewerMapPdfOutput.stageSize.regulationSize.label',
                  )}
                </span>
                <Dropdown
                  items={props.regulationSizes}
                  valueField="value"
                  labelField="label"
                  itemsCaption=""
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    conditionEvent.onChangeRegulationSize(
                      e.target.value as StageRegulationSize,
                    )
                  }
                  value={condition.regulationSize}
                />
              </ItemRow>
            </ItemValue>
          </Item>
          {/** 画面キャプチャ範囲 */}
          <Item>
            <ItemLabel
              label={t('pages:MapViewerMapPdfOutput.screenCaptureRange.label')}
            />
            <ItemValue>
              <ItemRow>
                <RadioButton
                  name="MapViewerMapPdfOutput.screenCaptureRange"
                  label={`${t(
                    'pages:MapViewerMapPdfOutput.screenCaptureRange.view',
                  )}`}
                  value={ScreenCaptureRanges.VIEW}
                  onChange={(e) =>
                    conditionEvent.onChangeScreenCaptureRange(
                      e.target.value as ScreenCaptureRange,
                    )
                  }
                  checked={
                    ScreenCaptureRanges.VIEW === condition.screenCaptureRange
                  }
                />
                <RadioButton
                  name="MapViewerMapPdfOutput.screenCaptureRange"
                  label={`${t(
                    'pages:MapViewerMapPdfOutput.screenCaptureRange.stage',
                  )}`}
                  value={ScreenCaptureRanges.STAGE}
                  onChange={(e) =>
                    conditionEvent.onChangeScreenCaptureRange(
                      e.target.value as ScreenCaptureRange,
                    )
                  }
                  checked={
                    ScreenCaptureRanges.STAGE === condition.screenCaptureRange
                  }
                />
              </ItemRow>
            </ItemValue>
          </Item>
          {/** PDF 帳票の用紙サイズ */}
          <Item>
            <ItemLabel
              label={t('pages:MapViewerMapPdfOutput.printSize.label')}
            />
            <ItemValue>
              <ItemRow>
                <RadioButton
                  name="MapViewerMapPdfOutput.printSize"
                  label={`${MapPdfPaperSizes.A4}`}
                  value={MapPdfPaperSizes.A4}
                  onChange={(e) =>
                    conditionEvent.onChangePrintSize(
                      e.target.value as MapPdfPaperSize,
                    )
                  }
                  checked={condition.printSize === MapPdfPaperSizes.A4}
                />
                <RadioButton
                  name="MapViewerMapPdfOutput.printSize"
                  label={`${MapPdfPaperSizes.A3}`}
                  value={MapPdfPaperSizes.A3}
                  onChange={(e) =>
                    conditionEvent.onChangePrintSize(
                      e.target.value as MapPdfPaperSize,
                    )
                  }
                  checked={condition.printSize === MapPdfPaperSizes.A3}
                />
              </ItemRow>
            </ItemValue>
          </Item>
        </Content>
        <ModalCommands>
          <CancelButton onClick={props.onClickCancel}>
            {t('pages:MapViewerMapPdfOutput.button.cancel')}
          </CancelButton>
          <CancelButton onClick={props.onClickReset}>
            {t('pages:MapViewerMapPdfOutput.button.reset')}
          </CancelButton>
          <SubmitButton onClick={props.onClickSubmit}>
            {t('pages:MapViewerMapPdfOutput.button.submit')}
          </SubmitButton>
        </ModalCommands>
      </Wrapper>
    </Template>
  );
};
