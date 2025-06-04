import { useState, useEffect } from 'react';

import { Pagination as Component } from '../../components/organisms';

interface Props {
  hits: number;
  totalHits: number;
  pageRecordsList: number[];
  pageRecords: number;
  displayPageSize: number;
  currentPage: number;
  onChangePageRecords(records: number): void;
  onChangeCurrentPage(page: number): void;
}

/**
 * ページ割り
 */
export const Pagination = (props: Props) => {
  const { totalHits, pageRecords, displayPageSize, currentPage } = props;

  const [pageSize, setPageSize] = useState(1);
  const [pages, setPages] = useState<number[]>([]);
  const [goToPage, setGoToPage] = useState(1);

  const handleClickPageNum = (page: number) => {
    props.onChangeCurrentPage(page);
  };

  const handleChangePageRecords = (e: React.ChangeEvent<HTMLSelectElement>) => {
    props.onChangePageRecords(Number(e.target.value));
  };

  const handleChangeGoToPage = (value: number) => setGoToPage(value);

  const handleClickGoToPage = () => {
    if (goToPage > 0) {
      props.onChangeCurrentPage(goToPage);
    }
  };

  useEffect(() => {
    // 全ページ数
    const pageSize = Math.ceil(totalHits / pageRecords);
    setPageSize(pageSize);

    // ページ番号
    const pageOffset = currentPage - Math.ceil(displayPageSize / 2);
    if (pageOffset <= 0) {
      const result: number[] = [];
      if (pageSize < displayPageSize) {
        for (let i = 1; i <= pageSize; i++) {
          result.push(i);
        }
      } else {
        for (let i = 1; i <= displayPageSize; i++) {
          result.push(i);
        }
      }
      setPages(result);
    } else {
      const result: number[] = [];
      if (pageSize > displayPageSize) {
        if (pageOffset + displayPageSize > pageSize) {
          for (let i = pageSize - displayPageSize + 1; i <= pageSize; i++) {
            result.push(i);
          }
        } else {
          for (let i = pageOffset + 1; i <= pageOffset + displayPageSize; i++) {
            result.push(i);
          }
        }
        setPages(result);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalHits, pageRecords, currentPage]);

  return (
    <Component
      hits={props.hits}
      totalHits={props.totalHits}
      pageRecordsList={props.pageRecordsList}
      pages={pages}
      pageSize={pageSize}
      currentPage={currentPage}
      pageRecords={pageRecords}
      goToPage={goToPage}
      onClickPageNum={handleClickPageNum}
      onChangePageRecords={handleChangePageRecords}
      onChangeGoToPage={handleChangeGoToPage}
      onClickGoToPage={handleClickGoToPage}
    />
  );
};
