import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as RV from 'react-virtualized';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styled from 'styled-components';

import { DialogTypes } from '../../types';
import { CompareResult } from '../../api';
import { useAppDispatch } from '../../app/hooks';

import { appModule } from '../../modules';
import { actionHelper, getCompareResult } from '../../actions';
import { useLanguage, useUser } from '../../selectors';

import { MapEditorCompareLocationResult as Component } from '../../components/pages/MapEditorCompareLocationResult';

const RowNum = styled.span`
  display: flexbox;
  align-items: center;
  justify-content: end;
  padding-right: 5px;
  width: 100%;
`;

const OldLocation = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  padding: 4px;
  width: 100%;
  height: 100%;

  &.difference {
    background-color: rgba(239, 83, 80, 0.5);
  }
`;

export type DiffLocation = {
  areaId: string;
  locationNum: string;
};

/**
 * ロケーション比較結果
 */
export const MapEditorCompareLocationResult = () => {
  const { token = '' } = useParams<{
    token: string;
  }>();

  const dispatch = useAppDispatch();
  const [t] = useTranslation();

  const language = useLanguage();
  const user = useUser();

  const [data, setData] = useState<CompareResult>();

  const [newDiscrepancies, setNewDiscrepancies] = useState(0);
  const [oldDiscrepancies, setOldDiscrepancies] = useState(0);

  const OldLocationRenderer = (cellProps: RV.TableCellProps) => {
    const { rowData, cellData } = cellProps;

    return (
      <OldLocation
        className={classNames({
          difference: rowData.difference,
        })}
      >
        <span>{cellData ?? ''}</span>
      </OldLocation>
    );
  };

  const columns: RV.ColumnProps[] = [
    {
      label: t('pages:MapEditorCompareLocationResult.dataTable.rowNum.label'),
      dataKey: 'rowNum',
      cellRenderer: ({ rowIndex }: any) => <RowNum>{rowIndex + 1}</RowNum>,
      width: 60,
      disableSort: true,
    },
    {
      label: t(
        'pages:MapEditorCompareLocationResult.dataTable.newAreaId.label',
      ),
      dataKey: 'areaId',
      cellDataGetter: ({ rowData }: any) => rowData.newLocation.areaId,

      width: 100,
    },
    {
      label: t(
        'pages:MapEditorCompareLocationResult.dataTable.newLocationNum.label',
      ),
      dataKey: 'locationNum',
      cellDataGetter: ({ rowData }: any) => rowData.newLocation.locationNum,
      width: 150,
      flexGrow: 1,
    },
    {
      label: t(
        'pages:MapEditorCompareLocationResult.dataTable.oldAreaId.label',
      ),
      dataKey: 'areaId',
      cellDataGetter: ({ rowData }: any) => rowData.oldLocation.areaId,
      cellRenderer: OldLocationRenderer,
      width: 100,
    },
    {
      label: t(
        'pages:MapEditorCompareLocationResult.dataTable.oldLocationNum.label',
      ),
      dataKey: 'locationNum',
      cellDataGetter: ({ rowData }: any) => rowData.oldLocation.locationNum,
      cellRenderer: OldLocationRenderer,
      width: 150,
      flexGrow: 1,
    },
  ];

  useEffect(() => {
    if (!data || !data.results || data.results.length === 0) {
      setNewDiscrepancies(0);
      setOldDiscrepancies(0);
      return;
    }

    setNewDiscrepancies(
      data.results.filter(
        (d) =>
          (d.newLocation.areaId || d.newLocation.locationNum) && d.difference,
      ).length,
    );

    setOldDiscrepancies(
      data.results.filter(
        (d) =>
          (d.oldLocation.areaId || d.oldLocation.locationNum) && d.difference,
      ).length,
    );
  }, [data]);

  /**
   * Load, Unload 処理
   */
  useEffect(() => {
    (async () => {
      dispatch(appModule.actions.updateLoading(true));

      dispatch(
        getCompareResult(
          token,
          ({ data }) => {
            setData(data);

            dispatch(appModule.actions.updateLoading(false));
          },
          ({ e, result }) => {
            if (result) {
              dispatch(
                appModule.actions.updateAlertDialog({
                  type: DialogTypes.ERROR,
                  message: `${result?.error}`,
                }),
              );

              dispatch(appModule.actions.updateLoading(false));
            } else {
              actionHelper.showErrorDialog(e, dispatch);
            }
          },
        ),
      );
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Component
      columns={columns}
      data={data}
      lang={language}
      timezone={user.timeZone}
      newDiscrepancies={newDiscrepancies}
      oldDiscrepancies={oldDiscrepancies}
    />
  );
};
