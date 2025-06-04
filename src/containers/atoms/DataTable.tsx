import { ReactNode, useState, useEffect } from 'react';
import * as immutable from 'immutable';
import * as RV from 'react-virtualized';

import { DataTable as Component } from '../../components/atoms';

interface Props {
  description?: ReactNode;
  headerHeight: number;
  rowHeight: number | ((info: RV.Index) => number);
  scrollToIndex?: number;
  onRowClick?: (info: RV.RowMouseEventHandlerParams) => void;
  sortBy?: string;
  columns: RV.ColumnProps[];
  data: any[];
  selectedRow?: any;
  selectedUniqueKey?: any;
  fixedRowWidth?: boolean;
}

export const DataTable = (props: Props) => {
  // 表示データ
  const [data, setData] = useState(props.data);

  // ソートデータ
  const [sortedList, setSortedList] = useState<immutable.List<any>>();

  // ソートキー
  const [sortBy, setSortBy] = useState<string | undefined>(props.sortBy);

  // ソート順
  const [sortDirection, setSortDirection] =
    useState<RV.SortDirectionType>('DESC');

  // スクロール先頭行インデックス
  const [scrollToIndex, setScrollToIndex] = useState<number>();
  useEffect(() => setScrollToIndex(props.scrollToIndex), [props.scrollToIndex]);

  // ソート処理
  const executeSort = (info: {
    sortBy: string;
    sortDirection: RV.SortDirectionType;
  }) => {
    setSortBy(info.sortBy);
    setSortDirection(info.sortDirection);

    if (!data) {
      return;
    }
    const sorted = immutable.List.of(...data)
      .sortBy((item: any) => item[info.sortBy])
      .sort()
      .update((list: any) =>
        info.sortDirection === RV.SortDirection.DESC ? list.reverse() : list
      );
    setSortedList(sorted);
  };

  useEffect(() => {
    setScrollToIndex(0);
    setSortBy(undefined);
    setSortedList(immutable.List.of(...props.data));
    setData(props.data);
  }, [props.data]);

  return (
    <Component
      {...props}
      overScanRowCount={30}
      sortedList={sortedList}
      sortBy={sortBy}
      sortDirection={sortDirection}
      onSort={executeSort}
      scrollToIndex={scrollToIndex}
      data={data}
    />
  );
};
