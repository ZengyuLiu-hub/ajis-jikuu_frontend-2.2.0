import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import * as editorConstants from '../../constants/editor';
import * as viewerConstants from '../../constants/viewer';

import { ViewLocationColorType, ViewLocationColorTypes } from '../../types';
import { Button } from '../atoms';

const Container = styled.div`
  position: absolute;
  display: grid;
  grid-template-rows: auto auto;
  grid-row-gap: 9px;
  padding: 9px;
  border: 1px solid rgba(128, 128, 128, 1);
  background-color: rgba(0, 0, 0, 0.8);
  box-shadow: 0 10px 25px 0 rgba(0, 0, 0, 0.5);
  min-width: 322px;
  min-height: 120px;
`;

const Body = styled.div``;

const Property = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  width: 100%;
  min-height: 30px;

  > div {
    display: flex;
    align-items: center;
    padding: 3px 3px 3px 6px;
    border-bottom: 1px solid rgba(128, 128, 128, 1);
    color: rgba(255, 255, 255, 1);
    min-width: 160px;
    height: 100%;
  }

  &:last-child {
    > div {
      border-bottom: none;
    }
  }
`;

const Label = styled.div`
  border-right: 1px solid rgba(128, 128, 128, 1);
  white-space: nowrap;
  width: 160px;
`;

const Value = styled.div`
  p {
    display: grid;
    grid-auto-rows: auto;
    grid-row-gap: 3px;
    margin: 0;
    padding: 0;
    max-width: 240px;

    > span {
      display: inline-block;
      color: rgba(255, 255, 255, 1);
    }
  }
`;

const Face = styled.div`
  display: flex;
  justify-content: flex-end;
`;

// 文字列プロパティ
const StringProperty = React.memo((props: { label: String; value: string }) => {
  return (
    <Property>
      <Label>{props.label}</Label>
      <Value>{props.value}</Value>
    </Property>
  );
});

// 整数プロパティ
const IntegerProperty = React.memo(
  (props: { label: String; value: number }) => {
    const numberFormat: Intl.NumberFormat = new Intl.NumberFormat('ja');

    return (
      <Property>
        <Label>{props.label}</Label>
        <Value>{props.value && numberFormat.format(props.value)}</Value>
      </Property>
    );
  },
);

// メモ
const RemarksProperty = React.memo((props: { remarks: string }) => {
  const [t] = useTranslation();

  return (
    <Property>
      <Label>{t('organisms:ViewerShapeProperty.property.remarks')}</Label>
      <Value>
        <p>
          {props.remarks.split('\n').map((text, i) => (
            <span key={i}>{text}</span>
          ))}
        </p>
      </Value>
    </Property>
  );
});

interface locationStatusPropertyProps {
  type: ViewLocationColorType;
  countProgressStatus: string;
  intensiveCheckStatus: string;
  samplingStatus: string;
  auditStatus: string;
  allProgressStatus: string;
}

// ロケーションステータス
const LocationStatusProperty = React.memo(
  (props: locationStatusPropertyProps) => {
    const [t] = useTranslation();

    let status = '';
    if (props.type === ViewLocationColorTypes.COUNT_PROGRESS) {
      // カウント進捗
      status = t([
        `organisms:ViewerShapeProperty.property.locationStatus.countProgress.${props.countProgressStatus}`,
        'organisms:ViewerShapeProperty.property.locationStatus.countProgress.unspecific',
      ]);
    } else if (props.type === ViewLocationColorTypes.INTENSIVE_CHECK) {
      // 集中チェック
      status = t([
        `organisms:ViewerShapeProperty.property.locationStatus.intensiveCheckStatus.${props.intensiveCheckStatus}`,
        'organisms:ViewerShapeProperty.property.locationStatus.intensiveCheckStatus.unspecific',
      ]);
    } else if (props.type === ViewLocationColorTypes.SAMPLING) {
      // サンプリング
      status = t([
        `organisms:ViewerShapeProperty.property.locationStatus.samplingStatus.${props.samplingStatus}`,
        'organisms:ViewerShapeProperty.property.locationStatus.samplingStatus.unspecific',
      ]);
    } else if (props.type === ViewLocationColorTypes.AUDIT) {
      // オーディット
      status = t([
        `organisms:ViewerShapeProperty.property.locationStatus.auditStatus.${props.auditStatus}`,
        'organisms:ViewerShapeProperty.property.locationStatus.auditStatus.unspecific',
      ]);
    } else if (props.type === ViewLocationColorTypes.ALL_PROGRESS) {
      // 全体進捗
      status = t([
        `organisms:ViewerShapeProperty.property.locationStatus.allProgressStatus.${props.allProgressStatus}`,
        'organisms:ViewerShapeProperty.property.locationStatus.allProgressStatus.unspecific',
      ]);
    }

    return (
      <Property>
        <Label>
          {t('organisms:ViewerShapeProperty.property.locationStatus.label')}
        </Label>
        <Value>{status}</Value>
      </Property>
    );
  },
);

export type DisplayPosition = {
  top: number;
  left: number;
};

interface Props {
  propertyContainerRef: React.RefObject<HTMLDivElement>;
  displayPosition: DisplayPosition;
  shapeProperty: any;
  locationColorType: ViewLocationColorType;
  onClickShowPlanogramButton(): void;
}

/**
 * マップビューア：シェイププロパティ
 */
export const ViewerShapeProperty = (props: Props) => {
  const { shapeProperty } = props;

  const [t] = useTranslation();

  return (
    <Container
      ref={props.propertyContainerRef}
      style={{
        top: props.displayPosition.top,
        left: props.displayPosition.left,
      }}
    >
      <Body>
        {/* ロケーション番号 */}
        {shapeProperty.hasOwnProperty(
          editorConstants.SHAPE_PROP_NAME_LOCATION_NUM,
        ) && (
          <StringProperty
            label={t('organisms:ViewerShapeProperty.property.locationNum')}
            value={shapeProperty[editorConstants.SHAPE_PROP_NAME_LOCATION_NUM]}
          />
        )}

        {/* エリアID */}
        {shapeProperty.hasOwnProperty(
          editorConstants.SHAPE_PROP_NAME_AREA_ID,
        ) && (
          <StringProperty
            label={t('organisms:ViewerShapeProperty.property.areaId')}
            value={shapeProperty[editorConstants.SHAPE_PROP_NAME_AREA_ID]}
          />
        )}
        {/* テーブルID */}
        {shapeProperty.hasOwnProperty(
          editorConstants.SHAPE_PROP_NAME_TABLE_ID,
        ) && (
          <StringProperty
            label={t('organisms:ViewerShapeProperty.property.tableId')}
            value={shapeProperty[editorConstants.SHAPE_PROP_NAME_TABLE_ID]}
          />
        )}
        {/* 枝番 */}
        {shapeProperty.hasOwnProperty(
          editorConstants.SHAPE_PROP_NAME_BRANCH_NUM,
        ) && (
          <StringProperty
            label={t('organisms:ViewerShapeProperty.property.branchNum')}
            value={shapeProperty[editorConstants.SHAPE_PROP_NAME_BRANCH_NUM]}
          />
        )}
        {/* 部門名 */}
        {shapeProperty.hasOwnProperty(
          viewerConstants.SHAPE_PROP_NAME_DEPARTMENT_NAME,
        ) && (
          <StringProperty
            label={t('organisms:ViewerShapeProperty.property.departmentName')}
            value={
              shapeProperty[viewerConstants.SHAPE_PROP_NAME_DEPARTMENT_NAME]
            }
          />
        )}
        {/* 数量 */}
        {shapeProperty.hasOwnProperty(
          viewerConstants.SHAPE_PROP_NAME_QUANTITY,
        ) && (
          <IntegerProperty
            label={t('organisms:ViewerShapeProperty.property.quantity')}
            value={shapeProperty[viewerConstants.SHAPE_PROP_NAME_QUANTITY]}
          />
        )}
        {/* 社員番号 */}
        {shapeProperty.hasOwnProperty(
          viewerConstants.SHAPE_PROP_NAME_EMPLOYEE_NUM,
        ) && (
          <StringProperty
            label={t('organisms:ViewerShapeProperty.property.employeeNum')}
            value={shapeProperty[viewerConstants.SHAPE_PROP_NAME_EMPLOYEE_NUM]}
          />
        )}
        {/* カウント時間 */}
        {shapeProperty.hasOwnProperty(
          viewerConstants.SHAPE_PROP_NAME_COUNT_TIME,
        ) && (
          <StringProperty
            label={t('organisms:ViewerShapeProperty.property.countTime')}
            value={shapeProperty[viewerConstants.SHAPE_PROP_NAME_COUNT_TIME]}
          />
        )}
        {/* エディタテキスト */}
        {shapeProperty.hasOwnProperty(
          viewerConstants.SHAPE_PROP_NAME_EDITOR_TEXT,
        ) && (
          <StringProperty
            label={t('organisms:ViewerShapeProperty.property.editorText')}
            value={shapeProperty[viewerConstants.SHAPE_PROP_NAME_EDITOR_TEXT]}
          />
        )}
        {/* メモ */}
        {shapeProperty.hasOwnProperty(
          editorConstants.SHAPE_PROP_NAME_REMARKS,
        ) && (
          <RemarksProperty
            remarks={shapeProperty[editorConstants.SHAPE_PROP_NAME_REMARKS]}
          />
        )}
        {/* 連携データ作成日時 */}
        {shapeProperty.hasOwnProperty(
          editorConstants.SHAPE_PROP_NAME_CREATED_AT,
        ) && (
          <StringProperty
            label={t('organisms:ViewerShapeProperty.property.createdAt')}
            value={shapeProperty[editorConstants.SHAPE_PROP_NAME_CREATED_AT]}
          />
        )}
        {/* ロケーションステータス */}
        <LocationStatusProperty
          type={props.locationColorType}
          countProgressStatus={
            shapeProperty[editorConstants.SHAPE_PROP_NAME_COUNT_PROGRESS_STATUS]
          }
          intensiveCheckStatus={
            shapeProperty[
              editorConstants.SHAPE_PROP_NAME_INTENSIVE_CHECK_STATUS
            ]
          }
          samplingStatus={
            shapeProperty[editorConstants.SHAPE_PROP_NAME_SAMPLING_STATUS]
          }
          auditStatus={
            shapeProperty[editorConstants.SHAPE_PROP_NAME_AUDIT_STATUS]
          }
          allProgressStatus={
            shapeProperty[editorConstants.SHAPE_PROP_NAME_ALL_PROGRESS_STATUS]
          }
        />
      </Body>
      <Face>
        <Button onClick={props.onClickShowPlanogramButton}>
          {t('organisms:ViewerShapeProperty.planogram.showButton')}
        </Button>
      </Face>
    </Container>
  );
};
