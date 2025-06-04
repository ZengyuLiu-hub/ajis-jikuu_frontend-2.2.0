import React, { Dispatch } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Button, InputNumber } from '../atoms';

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-column-gap: 3px;
  margin: 0;
  padding: 0;
  background: transparent;
  border: none;
  height: 40px;
`;

const Information = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  padding: 0 0 0 20px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(200, 200, 200, 1);
  height: 100%;
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
    line-height: 24px;
  }

  > span:first-child {
    color: rgba(102, 102, 102, 1);
  }

  > span:not(:first-child) {
    color: rgba(75, 0, 130, 1);
  }
`;

const StageSize = styled.div`
  margin: 0 10px;

  > input[type='text']:not(:first-child),
  > button:not(:first-child) {
    margin-left: 5px;
  }

  input[type='text'] {
    min-width: 80px;
    width: 80px;
  }
`;

const Operation = styled.div`
  display: flex;
  align-items: center;
  padding-right: 20px;
  height: 100%;

  > button:not(:first-child) {
    margin-left: 5px;
  }
`;

const ShapeControlMinimize = styled.div`
  position: relative;
  background-color: transparent;
  border: none;
  width: 24px;
  height: 100%;
`;

const MinimizeButton = styled.button`
  background-color: rgba(62, 62, 62, 1);
  border: none;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const MinimizeStatus = styled.input`
  display: none;

  & + ${MinimizeButton}::after {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    border: none;
    background-color: transparent;
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='48px' height='48px' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' stroke='%23c8c8c8' stroke-width='3' stroke-linecap='square' stroke-linejoin='miter' fill='none' color='%233e3e3e'%3E%3Cpolyline points='14 18 8 12 14 6 14 6'/%3E%3C/svg%3E");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 21px 21px;
    width: 24px;
    height: 100%;
  }

  &:checked {
    & + ${MinimizeButton}::after {
      position: absolute;
      content: '';
      top: 0;
      left: 0;
      border: none;
      background-color: transparent;
      background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='48px' height='48px' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' stroke='%23c8c8c8' stroke-width='3' stroke-linecap='square' stroke-linejoin='miter' fill='none' color='%233e3e3e'%3E%3Cpolyline points='10 6 16 12 10 18 10 18'/%3E%3C/svg%3E");
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 21px 21px;
      width: 24px;
      height: 100%;
    }
  }
`;

interface CountOfAreasProps {
  countOfAreas: number;
}
const CountOfAreas = React.memo((props: CountOfAreasProps) => {
  const [t] = useTranslation();

  const numberFormat: Intl.NumberFormat = new Intl.NumberFormat('ja');

  return (
    <StatusItem>
      <span>{t('organisms:EditorLocationInfo.countOfAreas')}</span>
      <span>{numberFormat.format(props.countOfAreas)}</span>
    </StatusItem>
  );
});

interface CountOfTablesProps {
  countOfTables: number;
}
const CountOfTables = React.memo((props: CountOfTablesProps) => {
  const [t] = useTranslation();

  const numberFormat: Intl.NumberFormat = new Intl.NumberFormat('ja');

  return (
    <StatusItem>
      <span>{t('organisms:EditorLocationInfo.countOfTables')}</span>
      <span>{numberFormat.format(props.countOfTables)}</span>
    </StatusItem>
  );
});

interface CountOfLocationsProps {
  countOfLocations: number;
}
const CountOfLocations = React.memo((props: CountOfLocationsProps) => {
  const [t] = useTranslation();

  const numberFormat: Intl.NumberFormat = new Intl.NumberFormat('ja');

  return (
    <StatusItem>
      <span>{t('organisms:EditorLocationInfo.countOfLocations')}</span>
      <span>{numberFormat.format(props.countOfLocations)}</span>
    </StatusItem>
  );
});

interface CountOfMissingNumberProps {
  countOfMissingNumber: number;
}
const CountOfMissingNumber = React.memo((props: CountOfMissingNumberProps) => {
  const [t] = useTranslation();

  const numberFormat: Intl.NumberFormat = new Intl.NumberFormat('ja');

  return (
    <StatusItem>
      <span>{t('organisms:EditorLocationInfo.countOfMissingNumber')}</span>
      <span>{numberFormat.format(props.countOfMissingNumber)}</span>
    </StatusItem>
  );
});

interface CountOfEmptyNumberProps {
  countOfEmptyNumber: number;
}
const CountOfEmptyNumber = React.memo((props: CountOfEmptyNumberProps) => {
  const [t] = useTranslation();

  const numberFormat: Intl.NumberFormat = new Intl.NumberFormat('ja');

  return (
    <StatusItem>
      <span>{t('organisms:EditorLocationInfo.countOfEmptyNumber')}</span>
      <span>{numberFormat.format(props.countOfEmptyNumber)}</span>
    </StatusItem>
  );
});

interface StageCellSizeAdjusterProps {
  latticeSize: { width: number; height: number };
  stageCellSize: { width: number; height: number };
  stageCellSizeEvent: Dispatch<any>;
  onClickSubmitStageCellSize(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void;
}

const StageCellSizeAdjuster = React.memo(
  ({
    latticeSize,
    stageCellSize,
    stageCellSizeEvent,
    onClickSubmitStageCellSize,
  }: StageCellSizeAdjusterProps) => {
    const [t] = useTranslation();

    // 格子サイズに合わせて、セル幅の最小値、最大値調整
    const minWidth = 60 / (latticeSize.width / 5);
    const maxWidth = 1000 / (latticeSize.width / 5);

    // 格子サイズに合わせて、セル高さの最小値、最大値調整
    const minHeight = 60 / (latticeSize.height / 5);
    const maxHeight = 1000 / (latticeSize.height / 5);

    return (
      <StageSize>
        <span>{t('organisms:EditorLocationInfo.stageCellSize')}</span>
        <InputNumber
          min={minWidth}
          max={maxWidth}
          maxLength={4}
          onBlur={(e) => stageCellSizeEvent({ width: Number(e.target.value) })}
          value={stageCellSize.width}
        />
        <InputNumber
          min={minHeight}
          max={maxHeight}
          maxLength={4}
          onBlur={(e) => stageCellSizeEvent({ height: Number(e.target.value) })}
          value={stageCellSize.height}
        />
        <Button onClick={onClickSubmitStageCellSize}>
          {t('organisms:EditorLocationInfo.button.submitStageCellSize')}
        </Button>
      </StageSize>
    );
  },
);

interface ShowLocationListProps {
  onClickShowLocationList(e: React.MouseEvent<HTMLButtonElement>): void;
}
const ShowLocationList = React.memo((props: ShowLocationListProps) => {
  const [t] = useTranslation();

  return (
    <Button onClick={props.onClickShowLocationList}>
      {t('organisms:EditorLocationInfo.button.showLocationList')}
    </Button>
  );
});

interface PrintMapPdfProps {
  onClickPrintMapPdf(e: React.MouseEvent<HTMLButtonElement>): void;
}
const PrintMapPdf = React.memo((props: PrintMapPdfProps) => {
  const [t] = useTranslation();

  return (
    <Button onClick={props.onClickPrintMapPdf}>
      {t('organisms:EditorLocationInfo.button.printMapPdf')}
    </Button>
  );
});

interface MinimizeProps {
  shapeControlExpand: boolean;
  onClickShapeControlExpand(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void;
  onChangeMinimizeStatus(e: React.ChangeEvent<HTMLInputElement>): void;
}
const MinimizeContent = React.memo((props: MinimizeProps) => (
  <ShapeControlMinimize>
    <MinimizeStatus
      type="checkbox"
      onChange={props.onChangeMinimizeStatus}
      checked={props.shapeControlExpand}
    />
    <MinimizeButton onClick={props.onClickShapeControlExpand}></MinimizeButton>
  </ShapeControlMinimize>
));

interface Props
  extends CountOfAreasProps,
    CountOfTablesProps,
    CountOfLocationsProps,
    CountOfMissingNumberProps,
    CountOfEmptyNumberProps,
    StageCellSizeAdjusterProps,
    ShowLocationListProps,
    PrintMapPdfProps,
    MinimizeProps {}

/**
 * マップエディタ：ロケーション情報
 */
export const EditorLocationInfo = (props: Props) => {
  const [t] = useTranslation();

  return (
    <Container>
      <Information>
        <TotalCount>
          <StatusItem>
            <span>{t('organisms:EditorLocationInfo.totalCount.open')}</span>
          </StatusItem>
          <Status>
            <CountOfAreas countOfAreas={props.countOfAreas} />
            <CountOfTables countOfTables={props.countOfTables} />
            <CountOfLocations countOfLocations={props.countOfLocations} />
            <CountOfMissingNumber
              countOfMissingNumber={props.countOfMissingNumber}
            />
            <CountOfEmptyNumber countOfEmptyNumber={props.countOfEmptyNumber} />
          </Status>
          <StatusItem>
            <span>{t('organisms:EditorLocationInfo.totalCount.close')}</span>
          </StatusItem>
        </TotalCount>
        <Operation>
          <StageCellSizeAdjuster
            latticeSize={props.latticeSize}
            stageCellSize={props.stageCellSize}
            stageCellSizeEvent={props.stageCellSizeEvent}
            onClickSubmitStageCellSize={props.onClickSubmitStageCellSize}
          />
          <ShowLocationList
            onClickShowLocationList={props.onClickShowLocationList}
          />
          <PrintMapPdf onClickPrintMapPdf={props.onClickPrintMapPdf} />
        </Operation>
      </Information>
      <MinimizeContent
        shapeControlExpand={props.shapeControlExpand}
        onClickShapeControlExpand={props.onClickShapeControlExpand}
        onChangeMinimizeStatus={props.onChangeMinimizeStatus}
      />
    </Container>
  );
};
