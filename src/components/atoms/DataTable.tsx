import { ReactNode } from 'react';
import * as immutable from 'immutable';
import * as RV from 'react-virtualized';
import styled from 'styled-components';

const AutoSizer = RV.AutoSizer as unknown as React.FC<RV.AutoSizerProps>;
const Table = RV.Table as unknown as React.FC<RV.TableProps>;
const Column = RV.Column as unknown as React.FC<RV.ColumnProps>;

export const Cell = styled.div`
  display: flex;
  align-items: center;
  height: 100%;

  p {
    display: flex;
    align-items: center;
    min-height: 17px;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const basicCellRenderer: RV.TableCellRenderer = ({ cellData }) => {
  return (
    <Cell>
      <p>{cellData}</p>
    </Cell>
  );
};

export const tooltipCellRenderer: RV.TableCellRenderer = ({ cellData }) => {
  return (
    <Cell>
      <p title={cellData}>{cellData}</p>
    </Cell>
  );
};

const TableArea = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
  max-height: 100%;

  * {
    box-sizing: border-box;
  }

  p {
    margin: 0;
  }

  .table {
    > div {
      &:focus {
        outline: none;
      }
    }

    .ellipsis {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .grid {
    .row:last-child {
      > div {
        border-bottom: 1px solid rgba(128, 128, 128, 1);
      }
    }
  }

  .headerRow,
  .oddRow,
  .evenRow {
    display: flex;

    > div {
      margin: 0;
      height: 100%;

      &:focus {
        outline: none;
      }
    }

    &:focus {
      outline: none;
    }
  }

  .oddRow,
  .evenRow {
    > div {
      display: flex;
      align-items: center;
      border-right: 1px solid rgba(128, 128, 128, 1);
      font-size: 12px;

      &:first-child {
        border-left: 1px solid rgba(128, 128, 128, 1);
      }
    }
  }

  .headerRow {
    > div.headerRow {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      border-top: 1px solid rgba(128, 128, 128, 1);
      border-bottom: 1px solid rgba(128, 128, 128, 1);
      border-right: 1px solid rgba(128, 128, 128, 1);

      &::after {
        content: '';
        position: absolute;
        right: 1px;
        bottom: 0;
        left: 1px;
        height: 2px;
      }

      &:first-child {
        border-left: 1px solid rgba(128, 128, 128, 1);
      }

      &:nth-child(odd)::after {
        background-color: rgba(4, 191, 238, 1);
      }

      &:nth-child(even)::after {
        background-color: rgba(4, 141, 238, 1);
      }

      &:hover {
        background-color: rgba(224, 224, 224, 1);
      }

      > span {
        color: rgba(102, 102, 102, 1);
        font-size: 12px;
        font-weight: bold;
        text-align: center;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
    }
  }

  .oddRow,
  .evenRow {
    font-size: 11px;

    &:hover {
      background-color: rgba(206, 219, 239, 1);
      cursor: default;
    }

    &.selected {
      background-color: rgba(140, 221, 255, 1);
    }

    > div {
      position: relative;
      padding: 4px;
    }
  }

  .oddRow {
    background-color: rgba(255, 255, 255, 1);
  }

  .evenRow {
    background-color: rgba(240, 250, 255, 1);
  }
`;

const Description = styled.div`
  margin: 0;
`;

const AutoSizerWrapper = styled.div`
  overflow: hidden;
  display: flex;
  flex: 1 1 auto;
  min-height: 0;
  max-height: 100%;
  height: 100%;
`;

interface Props {
  description?: ReactNode;
  headerHeight: number;
  overScanRowCount?: number;
  rowHeight: number | ((info: RV.Index) => number);
  sortedList?: immutable.List<any>;
  sortBy?: string;
  sortDirection?: RV.SortDirectionType;
  onSort?(info: { sortBy: string; sortDirection: RV.SortDirectionType }): void;
  scrollToIndex?: number;
  columns: RV.ColumnProps[];
  data: any[];
  selectedRow?: any;
  selectedUniqueKey?: any;
  onRowClick?(info: RV.RowMouseEventHandlerParams): void;
  fixedRowWidth?: boolean;
}

/**
 * DataTable
 */
export const DataTable = (props: Props) => {
  const {
    description,
    columns,
    sortedList,
    selectedRow,
    selectedUniqueKey,
    onSort,
    data,
    fixedRowWidth,
    ...tableProps
  } = props;

  const rowClassName = ({ index }: RV.Index) => {
    if (index < 0) {
      return 'headerRow';
    }
    const rowClass = index % 2 === 0 ? 'evenRow' : 'oddRow';
    if (
      sortedList && selectedRow && selectedUniqueKey
        ? selectedRow[selectedUniqueKey] ===
          sortedList.get(index)[selectedUniqueKey]
        : selectedRow === sortedList?.get(index)
    ) {
      return `row ${rowClass} selected`;
    }
    return `row ${rowClass}`;
  };

  const rowGetter = ({ index }: RV.Index) =>
    sortedList ? sortedList.get(index) : {};

  return (
    <TableArea>
      <Description>{description}</Description>
      <AutoSizerWrapper>
        <AutoSizer>
          {({ width, height }) => {
            // 行の幅を固定にする場合は columns の width 合計値で固定化
            const rowWidth = fixedRowWidth
              ? columns.reduce(
                  (accumulator, current) => accumulator + current.width,
                  0
                )
              : width;
            return (
              <Table
                {...tableProps}
                className="table"
                gridClassName="grid"
                headerClassName="headerRow"
                rowClassName={rowClassName}
                rowGetter={rowGetter}
                rowCount={data.length}
                width={rowWidth}
                height={height}
                sort={onSort}
              >
                {columns.map((column, i) => {
                  return <Column {...column} key={`${column.dataKey}${i}`} />;
                })}
              </Table>
            );
          }}
        </AutoSizer>
      </AutoSizerWrapper>
    </TableArea>
  );
};
