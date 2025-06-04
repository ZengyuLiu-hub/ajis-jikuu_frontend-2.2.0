import React from 'react';
import { useTranslation } from 'react-i18next';
import * as RV from 'react-virtualized';
import styled from 'styled-components';

import { CompareResult } from '../../api';

import { DataTable } from '../../containers/atoms';
import { Language } from '../../types';
import { DateTimeUtil } from '../../utils/DateTimeUtil';
import { AuthenticatedNewWindowTemplate as Template } from '../templates';

const Wrapper = styled.section`
  display: grid;
  grid-template-rows: auto 1fr;
  grid-row-gap: 5px;
  padding-bottom: 15px;
  width: 100%;
  height: 100%;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  padding: 0 10px;
  width: 100%;
  height: 36px;

  > span {
    position: relative;
    padding-left: 25px;
    color: rgba(102, 102, 102, 1);
    font-size: 17px;
    font-weight: bold;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto 0;
      background-color: rgba(0, 174, 238, 1);
      width: 20px;
      height: 20px;
    }
  }
`;

const Content = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  grid-row-gap: 10px;
  width: 100%;
  height: 100%;
`;

const Condition = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 15px;
  padding: 0 15px 0 75px;
`;

const MetaData = styled.div``;

const MetaDataTitle = styled.div`
  font-weight: bold;
`;

const MetaDataEntry = styled.div`
  display: flex;
  align-items: center;
  margin-left: 20px;
  min-height: 24px;
`;

const MetaDataEntryLabel = styled.span`
  display: inline-block;
  width: 180px;
`;

const MetaDataEntryValue = styled.span``;

const Results = styled.div`
  display: flex;
  overflow: auto;
  padding: 0 15px;
`;

interface Props {
  columns: RV.ColumnProps[];
  data?: CompareResult;
  lang: Language;
  timezone: string;
  newDiscrepancies: number;
  oldDiscrepancies: number;
}

/**
 * ロケーション比較結果
 */
export const MapEditorCompareLocationResult = (props: Props) => {
  const [t] = useTranslation();

  const numberFormat: Intl.NumberFormat = new Intl.NumberFormat('ja');

  return (
    <Template>
      <Wrapper>
        <Header>
          {/** タイトル */}
          <span>{t('pages:MapEditorCompareLocationResult.title')}</span>
        </Header>
        <Content>
          {/** 条件 */}
          <Condition>
            {/** 今回 */}
            <MetaData>
              <MetaDataTitle>
                {t('pages:MapEditorCompareLocationResult.condition.title.new')}
              </MetaDataTitle>
              <MetaDataEntry>
                <MetaDataEntryLabel>
                  {t(
                    'pages:MapEditorCompareLocationResult.condition.jurisdictionClass',
                  )}
                </MetaDataEntryLabel>
                <MetaDataEntryValue>
                  {props.data?.newStore?.jurisdictionName ?? ''}
                </MetaDataEntryValue>
              </MetaDataEntry>
              <MetaDataEntry>
                <MetaDataEntryLabel>
                  {t(
                    'pages:MapEditorCompareLocationResult.condition.companyName',
                  )}
                </MetaDataEntryLabel>
                <MetaDataEntryValue>
                  {props.data?.newStore?.companyName ?? ''}
                </MetaDataEntryValue>
              </MetaDataEntry>
              <MetaDataEntry>
                <MetaDataEntryLabel>
                  {t(
                    'pages:MapEditorCompareLocationResult.condition.storeName',
                  )}
                </MetaDataEntryLabel>
                <MetaDataEntryValue>
                  {props.data?.newStore?.storeName ?? ''}
                </MetaDataEntryValue>
              </MetaDataEntry>
              <MetaDataEntry>
                <MetaDataEntryLabel>
                  {t(
                    'pages:MapEditorCompareLocationResult.condition.inventoryDate.label',
                  )}
                </MetaDataEntryLabel>
                <MetaDataEntryValue>
                  {props.data?.newStore?.inventoryDates &&
                    props.data?.newStore?.inventoryDates.map(
                      (inventoryDate, index) => (
                        <React.Fragment key={index}>
                          {DateTimeUtil.parseDateToFormatString(
                            inventoryDate,
                            t(
                              'pages:MapEditorCompareLocationResult.condition.inventoryDate.format',
                            ),
                            props.lang,
                            props.timezone,
                          ) ?? ''}
                          <br />
                        </React.Fragment>
                      ),
                    )}
                </MetaDataEntryValue>
              </MetaDataEntry>
              <MetaDataEntry>
                <MetaDataEntryLabel>
                  {t(
                    'pages:MapEditorCompareLocationResult.condition.locationCount',
                  )}
                </MetaDataEntryLabel>
                <MetaDataEntryValue>
                  {(props.data?.newLocationCount &&
                    numberFormat.format(props.data.newLocationCount)) ??
                    ''}
                </MetaDataEntryValue>
              </MetaDataEntry>
              <MetaDataEntry>
                <MetaDataEntryLabel>
                  {t(
                    'pages:MapEditorCompareLocationResult.condition.discrepancies',
                  )}
                </MetaDataEntryLabel>
                <MetaDataEntryValue>
                  {numberFormat.format(props.newDiscrepancies)}
                </MetaDataEntryValue>
              </MetaDataEntry>
            </MetaData>
            {/** 前回 */}
            <MetaData>
              <MetaDataTitle>
                {t('pages:MapEditorCompareLocationResult.condition.title.old')}
              </MetaDataTitle>
              <MetaDataEntry>
                <MetaDataEntryLabel>
                  {t(
                    'pages:MapEditorCompareLocationResult.condition.jurisdictionClass',
                  )}
                </MetaDataEntryLabel>
                <MetaDataEntryValue>
                  {props.data?.oldStore?.jurisdictionName ?? ''}
                </MetaDataEntryValue>
              </MetaDataEntry>
              <MetaDataEntry>
                <MetaDataEntryLabel>
                  {t(
                    'pages:MapEditorCompareLocationResult.condition.companyName',
                  )}
                </MetaDataEntryLabel>
                <MetaDataEntryValue>
                  {props.data?.oldStore?.companyName ?? ''}
                </MetaDataEntryValue>
              </MetaDataEntry>
              <MetaDataEntry>
                <MetaDataEntryLabel>
                  {t(
                    'pages:MapEditorCompareLocationResult.condition.storeName',
                  )}
                </MetaDataEntryLabel>
                <MetaDataEntryValue>
                  {props.data?.oldStore?.storeName ?? ''}
                </MetaDataEntryValue>
              </MetaDataEntry>
              <MetaDataEntry>
                <MetaDataEntryLabel>
                  {t(
                    'pages:MapEditorCompareLocationResult.condition.inventoryDate.label',
                  )}
                </MetaDataEntryLabel>
                <MetaDataEntryValue>
                  {(props.data?.oldStore?.inventoryDates &&
                    DateTimeUtil.parseDateToFormatString(
                      props.data?.oldStore?.inventoryDates[0],
                      t(
                        'pages:MapEditorCompareLocationResult.condition.inventoryDate.format',
                      ),
                      props.lang,
                      props.timezone,
                    )) ??
                    ''}
                </MetaDataEntryValue>
              </MetaDataEntry>
              <MetaDataEntry>
                <MetaDataEntryLabel>
                  {t(
                    'pages:MapEditorCompareLocationResult.condition.locationCount',
                  )}
                </MetaDataEntryLabel>
                <MetaDataEntryValue>
                  {(props.data?.oldLocationCount &&
                    numberFormat.format(props.data.oldLocationCount)) ??
                    ''}
                </MetaDataEntryValue>
              </MetaDataEntry>
              <MetaDataEntry>
                <MetaDataEntryLabel>
                  {t(
                    'pages:MapEditorCompareLocationResult.condition.discrepancies',
                  )}
                </MetaDataEntryLabel>
                <MetaDataEntryValue>
                  {numberFormat.format(props.oldDiscrepancies)}
                </MetaDataEntryValue>
              </MetaDataEntry>
            </MetaData>
          </Condition>
          {/** 比較結果 */}
          <Results>
            <DataTable
              headerHeight={40}
              rowHeight={34}
              columns={props.columns}
              data={props.data?.results ?? []}
            />
          </Results>
        </Content>
      </Wrapper>
    </Template>
  );
};
