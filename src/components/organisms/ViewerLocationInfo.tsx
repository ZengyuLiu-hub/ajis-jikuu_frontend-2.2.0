import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import {
  ViewLocationColorType,
  ViewLocationColorTypes,
  ViewLocationAggregateDataType,
  ViewLocationAggregateDataTypes,
} from '../../types';
import { Button, Dropdown } from '../atoms';

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
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

const Operation = styled.div`
  display: flex;
  align-items: center;
  padding-right: 20px;
  height: 100%;

  > button:not(:first-child),
  label:not(:first-child) {
    margin-left: 5px;
  }
`;

// 総数：エリア数
interface CountOfAreasProps {
  countOfAreas: number;
}
const CountOfAreas = React.memo((props: CountOfAreasProps) => {
  const [t] = useTranslation();

  const numberFormat: Intl.NumberFormat = new Intl.NumberFormat('ja');

  return (
    <StatusItem>
      <span>{t('organisms:ViewerLocationInfo.countOfAreas')}</span>
      <span>{numberFormat.format(props.countOfAreas)}</span>
    </StatusItem>
  );
});

// 総数：テーブル数
interface CountOfTablesProps {
  countOfTables: number;
}
const CountOfTables = React.memo((props: CountOfTablesProps) => {
  const [t] = useTranslation();

  const numberFormat: Intl.NumberFormat = new Intl.NumberFormat('ja');

  return (
    <StatusItem>
      <span>{t('organisms:ViewerLocationInfo.countOfTables')}</span>
      <span>{numberFormat.format(props.countOfTables)}</span>
    </StatusItem>
  );
});

// 総数：ロケーション数
interface CountOfLocationsProps {
  countOfLocations: number;
}
const CountOfLocations = React.memo((props: CountOfLocationsProps) => {
  const [t] = useTranslation();

  const numberFormat: Intl.NumberFormat = new Intl.NumberFormat('ja');

  return (
    <StatusItem>
      <span>{t('organisms:ViewerLocationInfo.countOfLocations')}</span>
      <span>{numberFormat.format(props.countOfLocations)}</span>
    </StatusItem>
  );
});

// 総数：欠番
interface CountOfMissingNumberProps {
  countOfMissingNumber: number;
}
const CountOfMissingNumber = React.memo((props: CountOfMissingNumberProps) => {
  const [t] = useTranslation();

  const numberFormat: Intl.NumberFormat = new Intl.NumberFormat('ja');

  return (
    <StatusItem>
      <span>{t('organisms:ViewerLocationInfo.countOfMissingNumber')}</span>
      <span>{numberFormat.format(props.countOfMissingNumber)}</span>
    </StatusItem>
  );
});

// 総数：空白
interface CountOfEmptyNumberProps {
  countOfEmptyNumber: number;
}
const CountOfEmptyNumber = React.memo((props: CountOfEmptyNumberProps) => {
  const [t] = useTranslation();

  const numberFormat: Intl.NumberFormat = new Intl.NumberFormat('ja');

  return (
    <StatusItem>
      <span>{t('organisms:ViewerLocationInfo.countOfEmptyNumber')}</span>
      <span>{numberFormat.format(props.countOfEmptyNumber)}</span>
    </StatusItem>
  );
});

// PDF 帳票作成
interface PrintMapPdfProps {
  onClickPrintMapPdf(e: React.MouseEvent<HTMLButtonElement>): void;
}
const PrintMapPdf = React.memo((props: PrintMapPdfProps) => {
  const [t] = useTranslation();

  return (
    <Button onClick={props.onClickPrintMapPdf}>
      {t('organisms:ViewerLocationInfo.button.printMapPdf')}
    </Button>
  );
});

interface Props
  extends CountOfAreasProps,
    CountOfTablesProps,
    CountOfLocationsProps,
    CountOfMissingNumberProps,
    CountOfEmptyNumberProps,
    PrintMapPdfProps {
  selectedViewLocationColorType: ViewLocationColorType;
  selectedViewLocationAggregateDataType: ViewLocationAggregateDataType;
  onChangeViewLocationColorType(type: ViewLocationColorType): void;
  onChangeViewLocationAggregateDataType(
    type: ViewLocationAggregateDataType,
  ): void;
}

/**
 * マップビューア：ロケーション情報
 */
export const ViewerLocationInfo = (props: Props) => {
  const [t] = useTranslation();

  const viewLocationColorTypes = [
    {
      label: t(
        'organisms:ViewerLocationInfo.viewLocationColorTypes.countProgress',
      ),
      value: ViewLocationColorTypes.COUNT_PROGRESS,
    },
    {
      label: t(
        'organisms:ViewerLocationInfo.viewLocationColorTypes.intensiveCheck',
      ),
      value: ViewLocationColorTypes.INTENSIVE_CHECK,
    },
    {
      label: t('organisms:ViewerLocationInfo.viewLocationColorTypes.sampling'),
      value: ViewLocationColorTypes.SAMPLING,
    },
    {
      label: t('organisms:ViewerLocationInfo.viewLocationColorTypes.audit'),
      value: ViewLocationColorTypes.AUDIT,
    },
    {
      label: t(
        'organisms:ViewerLocationInfo.viewLocationColorTypes.allProgress',
      ),
      value: ViewLocationColorTypes.ALL_PROGRESS,
    },
    {
      label: t(
        'organisms:ViewerLocationInfo.viewLocationColorTypes.productLocation',
      ),
      value: ViewLocationColorTypes.PRODUCT_LOCATION,
    },
  ];

  // 集計値種別選択肢
  const viewLocationAggregateDataTypes = [
    {
      label: t(
        'organisms:ViewerLocationInfo.viewLocationAggregateDataTypes.none',
      ),
      value: ViewLocationAggregateDataTypes.NONE,
    },
    {
      label: t(
        'organisms:ViewerLocationInfo.viewLocationAggregateDataTypes.departmentName',
      ),
      value: ViewLocationAggregateDataTypes.DEPARTMENT_NAME,
    },
    {
      label: t(
        'organisms:ViewerLocationInfo.viewLocationAggregateDataTypes.quantity',
      ),
      value: ViewLocationAggregateDataTypes.QUANTITY,
    },
    {
      label: t(
        'organisms:ViewerLocationInfo.viewLocationAggregateDataTypes.employeeNum',
      ),
      value: ViewLocationAggregateDataTypes.EMPLOYEE_NUM,
    },
    {
      label: t(
        'organisms:ViewerLocationInfo.viewLocationAggregateDataTypes.countTime',
      ),
      value: ViewLocationAggregateDataTypes.COUNT_TIME,
    },
    {
      label: t(
        'organisms:ViewerLocationInfo.viewLocationAggregateDataTypes.editorText',
      ),
      value: ViewLocationAggregateDataTypes.EDITOR_TEXT,
    },
  ];

  return (
    <Container>
      <Information>
        <TotalCount>
          <StatusItem>
            <span>{t('organisms:ViewerLocationInfo.totalCount.open')}</span>
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
            <span>{t('organisms:ViewerLocationInfo.totalCount.close')}</span>
          </StatusItem>
        </TotalCount>
        <Operation>
          <PrintMapPdf onClickPrintMapPdf={props.onClickPrintMapPdf} />
          <Dropdown
            items={viewLocationColorTypes}
            labelField="label"
            valueField="value"
            value={props.selectedViewLocationColorType}
            onChange={(e) =>
              props.onChangeViewLocationColorType(
                e.target.value as ViewLocationColorType,
              )
            }
          />
          <Dropdown
            items={viewLocationAggregateDataTypes}
            labelField="label"
            valueField="value"
            value={props.selectedViewLocationAggregateDataType}
            onChange={(e) =>
              props.onChangeViewLocationAggregateDataType(
                e.target.value as ViewLocationAggregateDataType,
              )
            }
          />
        </Operation>
      </Information>
    </Container>
  );
};
