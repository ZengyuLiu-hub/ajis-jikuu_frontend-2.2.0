import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import * as editorConstants from '../../constants/editor';

import {
  LocationDisplayFormatType,
  LocationDisplayFormatTypes,
  MapPdfPaperSize,
  MapPdfPaperSizes,
  ScreenCaptureRange,
  ScreenCaptureRanges,
  StageRegulationSize,
} from '../../types';

import {
  Button,
  CheckBox,
  CancelButton,
  Dropdown,
  InputNumber,
  ItemLabel,
  RadioButton,
  SubmitButton,
  HelpIcon,
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

const MaxLengthRow = styled(ItemRow)`
  > input[type='number'] {
    min-width: 50px;
    width: 60px;
  }
`;

const LocationFormatRow = styled(ItemRow)`
  display: flex;
  align-items: center;
  min-height: 24px;

  > label {
    width: 120px;
  }

  > span {
    min-width: 60px;
  }
`;

const DefaultValueRow = styled(ItemRow)``;

export type Condition = {
  stageWidth: number;
  stageHeight: number;
  regulationSize?: StageRegulationSize;
  showLattice: boolean;
  latticeWidth: number;
  latticeHeight: number;
  showRulers: boolean;
  screenCaptureRange: ScreenCaptureRange;
  printSize: MapPdfPaperSize;
  areaIdLength: number;
  tableIdLength: number;
  branchNumLength: number;
  locationDisplayFormatType: LocationDisplayFormatType;
  fontSize: number;
};

export type ConditionEvent = {
  onChangeStageWidth(value: number): void;
  onChangeStageHeight(value: number): void;
  onChangeRegulationSize(size: StageRegulationSize): void;
  onChangeShowLattice(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeLatticeWidth(value: number): void;
  onChangeLatticeHeight(value: number): void;
  onChangeShowRulers(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeScreenCaptureRange(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangePrintSize(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeAreaIdLength(value: number): void;
  onChangeTableIdLength(value: number): void;
  onChangeBranchNumLength(value: number): void;
  onChangeLocationDisplayFormatType(type: LocationDisplayFormatType): void;
  onChangeFontSize(value: number): void;
};

interface Props extends ReactModal.Props {
  condition: Condition;
  conditionEvent: ConditionEvent;
  regulationSizes: any[];
  onClickFormatSetting(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void;
  onClickCancel(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onClickSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onClickClose(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

/**
 * マップエディタ環境設定
 */
export const MapEditorPreference = (props: Props) => {
  const { condition, conditionEvent } = props;

  const [t] = useTranslation();

  return (
    <Template
      {...props}
      title={`${t('pages:MapEditorPreference.title')}`}
      description={`${t('pages:MapEditorPreference.description')}`}
      onRequestClose={props.onClickCancel}
      contentLabel="MapEditorPreference"
    >
      <Wrapper>
        <ModalContent>
          {/** ステージサイズ */}
          <Item>
            <ItemLabel
              label={`${t('pages:MapEditorPreference.stageSize.label')}`}
            />
            <ItemValue>
              <ItemRow>
                <span>{t('pages:MapEditorPreference.stageSize.width')}</span>
                <InputNumber
                  min={300}
                  max={5000}
                  maxLength={4}
                  onBlur={(e) =>
                    conditionEvent.onChangeStageWidth(Number(e.target.value))
                  }
                  value={condition.stageWidth}
                />
                <span>{t('pages:MapEditorPreference.stageSize.unit')}</span>
              </ItemRow>
              <ItemRow>
                <span>{t('pages:MapEditorPreference.stageSize.height')}</span>
                <InputNumber
                  min={300}
                  max={5000}
                  maxLength={4}
                  onBlur={(e) =>
                    conditionEvent.onChangeStageHeight(Number(e.target.value))
                  }
                  value={condition.stageHeight}
                />
                <span>{t('pages:MapEditorPreference.stageSize.unit')}</span>
              </ItemRow>
              <ItemRow>
                <span>
                  {t(
                    'pages:MapEditorPreference.stageSize.regulationSize.label',
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
          {/** 格子 */}
          <Item>
            <ItemLabel
              label={`${t('pages:MapEditorPreference.lattice.label')}`}
            />
            <ItemValue>
              <ItemRow>
                <CheckBox
                  label={`${t('pages:MapEditorPreference.lattice.visible')}`}
                  onChange={conditionEvent.onChangeShowLattice}
                  checked={condition.showLattice}
                />
              </ItemRow>
              <ItemRow>
                <span>{t('pages:MapEditorPreference.lattice.width')}</span>
                <InputNumber
                  min={1}
                  max={100}
                  maxLength={3}
                  onBlur={(e) =>
                    conditionEvent.onChangeLatticeWidth(Number(e.target.value))
                  }
                  value={condition.latticeWidth}
                />
                <span>{t('pages:MapEditorPreference.lattice.unit')}</span>
              </ItemRow>
              <ItemRow>
                <span>{t('pages:MapEditorPreference.lattice.height')}</span>
                <InputNumber
                  min={1}
                  max={100}
                  maxLength={3}
                  onBlur={(e) =>
                    conditionEvent.onChangeLatticeHeight(Number(e.target.value))
                  }
                  value={condition.latticeHeight}
                />
                <span>{t('pages:MapEditorPreference.lattice.unit')}</span>
              </ItemRow>
            </ItemValue>
          </Item>
          {/** ルーラー */}
          <Item>
            <ItemLabel
              label={`${t('pages:MapEditorPreference.ruler.label')}`}
            />
            <ItemValue>
              <ItemRow>
                <CheckBox
                  label={`${t('pages:MapEditorPreference.ruler.visible')}`}
                  onChange={conditionEvent.onChangeShowRulers}
                  checked={condition.showRulers}
                />
              </ItemRow>
            </ItemValue>
          </Item>
          {/** 画面キャプチャ範囲 */}
          <Item>
            <ItemLabel
              label={`${t(
                'pages:MapEditorPreference.screenCaptureRange.label',
              )}`}
            />
            <ItemValue>
              <ItemRow>
                <RadioButton
                  name="MapEditorPreference.screenCaptureRange"
                  label={`${t(
                    'pages:MapEditorPreference.screenCaptureRange.view',
                  )}`}
                  value={ScreenCaptureRanges.VIEW}
                  onChange={conditionEvent.onChangeScreenCaptureRange}
                  checked={
                    ScreenCaptureRanges.VIEW === condition.screenCaptureRange
                  }
                />
                <RadioButton
                  name="MapEditorPreference.screenCaptureRange"
                  label={`${t(
                    'pages:MapEditorPreference.screenCaptureRange.stage',
                  )}`}
                  value={ScreenCaptureRanges.STAGE}
                  onChange={conditionEvent.onChangeScreenCaptureRange}
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
              label={`${t('pages:MapEditorPreference.printSize.label')}`}
            />
            <ItemValue>
              <ItemRow>
                <RadioButton
                  name="MapEditorPreference.printSize"
                  label={`${MapPdfPaperSizes.A4}`}
                  value={MapPdfPaperSizes.A4}
                  onChange={conditionEvent.onChangePrintSize}
                  checked={condition.printSize === MapPdfPaperSizes.A4}
                />
                <RadioButton
                  name="MapEditorPreference.printSize"
                  label={`${MapPdfPaperSizes.A3}`}
                  value={MapPdfPaperSizes.A3}
                  onChange={conditionEvent.onChangePrintSize}
                  checked={condition.printSize === MapPdfPaperSizes.A3}
                />
              </ItemRow>
            </ItemValue>
          </Item>
          {/** 桁数 */}
          <Item>
            <ItemLabel
              label={`${t('pages:MapEditorPreference.length.label')}`}
            />
            <ItemValue>
              <MaxLengthRow>
                <span>{t('pages:MapEditorPreference.length.areaId')}</span>
                <InputNumber
                  min={0}
                  max={3}
                  maxLength={2}
                  onBlur={(e) =>
                    conditionEvent.onChangeAreaIdLength(Number(e.target.value))
                  }
                  value={condition.areaIdLength}
                />
                <span>{t('pages:MapEditorPreference.length.unit')}</span>
              </MaxLengthRow>
              <MaxLengthRow>
                <span>{t('pages:MapEditorPreference.length.tableId')}</span>
                <InputNumber
                  min={1}
                  max={4}
                  maxLength={2}
                  onBlur={(e) =>
                    conditionEvent.onChangeTableIdLength(Number(e.target.value))
                  }
                  value={condition.tableIdLength}
                />
                <span>{t('pages:MapEditorPreference.length.unit')}</span>
              </MaxLengthRow>
              <MaxLengthRow>
                <span>{t('pages:MapEditorPreference.length.branchNum')}</span>
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
                <span>{t('pages:MapEditorPreference.length.unit')}</span>
              </MaxLengthRow>
            </ItemValue>
          </Item>
          {/** 表示用ロケーション書式 */}
          <Item>
            <ItemLabel
              label={`${t(
                'pages:MapEditorPreference.locationDisplayFormatType.label',
              )}`}
            />
            <ItemValue>
              <LocationFormatRow>
                <RadioButton
                  name="MapEditorPreference.locationDisplayFormatType"
                  label={`${t(
                    'pages:MapEditorPreference.locationDisplayFormatType.standard',
                  )}`}
                  value={LocationDisplayFormatTypes.STANDARD}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    conditionEvent.onChangeLocationDisplayFormatType(
                      e.target.value as LocationDisplayFormatType,
                    )
                  }
                  checked={
                    condition.locationDisplayFormatType ===
                    LocationDisplayFormatTypes.STANDARD
                  }
                />
                <RadioButton
                  name="MapEditorPreference.locationDisplayFormatType"
                  label={`${t(
                    'pages:MapEditorPreference.locationDisplayFormatType.custom',
                  )}`}
                  value={LocationDisplayFormatTypes.CUSTOM}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    conditionEvent.onChangeLocationDisplayFormatType(
                      e.target.value as LocationDisplayFormatType,
                    )
                  }
                  checked={
                    condition.locationDisplayFormatType ===
                    LocationDisplayFormatTypes.CUSTOM
                  }
                />
              </LocationFormatRow>
              <LocationFormatRow>
                <span>
                  {t(
                    'pages:MapEditorPreference.locationDisplayFormatType.format.label',
                  )}
                </span>
                {condition.locationDisplayFormatType ===
                LocationDisplayFormatTypes.STANDARD ? (
                  <span>
                    {t(
                      `pages:MapEditorPreference.locationDisplayFormatType.format.value.${condition.locationDisplayFormatType}`,
                    )}
                  </span>
                ) : (
                  <Button onClick={props.onClickFormatSetting}>
                    {t(
                      'pages:MapEditorPreference.locationDisplayFormatType.button.formatSetting',
                    )}
                  </Button>
                )}
              </LocationFormatRow>
            </ItemValue>
          </Item>
          {/** デフォルトフォントサイズ */}
          <Item>
            <ItemLabel label={t(`pages:MapEditorPreference.defaults.label`)} />
            <ItemValue>
              <DefaultValueRow>
                <span>
                  {t(`pages:MapEditorPreference.defaults.fontSize.label`)}
                </span>
                <InputNumber
                  min={editorConstants.FONT_SIZE_MIN}
                  max={editorConstants.FONT_SIZE_MAX}
                  onBlur={(e) =>
                    conditionEvent.onChangeFontSize(Number(e.target.value))
                  }
                  value={condition.fontSize}
                />
                <span>
                  {t('pages:MapEditorPreference.defaults.fontSize.unit')}
                </span>
                <HelpIcon
                  message={t(
                    'pages:MapEditorPreference.defaults.fontSize.help',
                  )}
                />
              </DefaultValueRow>
            </ItemValue>
          </Item>
        </ModalContent>
        <ModalCommands>
          <CancelButton onClick={props.onClickCancel}>
            {t('pages:MapEditorPreference.button.cancel')}
          </CancelButton>
          <SubmitButton onClick={props.onClickSubmit}>
            {t('pages:MapEditorPreference.button.submit')}
          </SubmitButton>
        </ModalCommands>
      </Wrapper>
    </Template>
  );
};
