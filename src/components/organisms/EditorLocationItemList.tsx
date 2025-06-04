import React from 'react';
import { useTranslation } from 'react-i18next';
import * as RV from 'react-virtualized';
import styled from 'styled-components';

import { LocationSearchCategories, LocationSearchCategory } from '../../types';

import { Button, Dropdown, InputText } from '../atoms';

const AutoSizer = RV.AutoSizer as unknown as React.FC<RV.AutoSizerProps>;
const List = RV.List as unknown as React.FC<RV.ListProps>;

const Container = styled.div`
  display: grid;
  grid-template-rows: auto auto 1fr;
  height: 100%;
`;

const SearchContainer = styled.div`
  padding: 2px;
  background-color: rgba(255, 255, 255, 1);
  border: 1px solid rgba(128, 128, 128, 1);

  label {
    span {
      display: inline-flex;
      justify-content: flex-end;
      width: 120px;
    }
  }
`;

const SearchCondition = styled.div`
  overflow: hidden;
  display: flex;
  align-items: center;
  height: 26px;
  background-color: rgba(255, 255, 255, 1);

  > label {
    display: flex;
    align-items: center;
    height: 24px;

    input[type='text'] {
      min-width: 50px;
      width: 100px;
    }

    > *:not(:first-child) {
      margin-left: 2px;
    }
  }

  > button {
    margin-left: 2px;
  }
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: rgba(255, 255, 255, 1);
  min-height: 0;
  max-height: 100%;
  height: 100%;

  p {
    margin: 0;
  }

  .list {
    border: 1px solid rgba(128, 128, 128, 1);

    &:focus {
      outline: none;
    }
  }
`;

const ListOperation = styled.div`
  overflow: hidden;
  display: grid;
  grid-template-columns: auto 1fr;
  padding: 2px;
  background-color: rgba(255, 255, 255, 1);
  border-right: 1px solid rgba(128, 128, 128, 1);
  border-left: 1px solid rgba(128, 128, 128, 1);
`;

const SearchResultCommand = styled.div`
  > button:not(:first-child) {
    margin-left: 2px;
  }
`;

const SearchResultInfo = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0 6px;

  > span {
    display: inline-flex;
    align-items: center;

    &:last-child {
      margin-left: 3px;
    }
  }
`;

const AutoSizerWrapper = styled.div`
  display: flex;
  flex: 1 1 auto;
  min-height: 0;
  max-height: 100%;
  height: 100%;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 4px;

  &:nth-child(odd) {
    background-color: rgba(255, 255, 255, 1);
  }

  &:nth-child(even) {
    background-color: rgba(240, 240, 255, 1);
  }

  &:last-child {
    border-bottom: 1px solid rgba(200, 200, 200, 1);
  }

  &:hover {
    background-color: rgba(206, 219, 239, 1);
    cursor: pointer;
  }

  &[aria-selected='true'] {
    background-color: rgba(168, 198, 238, 1);
  }

  > span {
    display: inline-block;
  }
`;

interface SearchProps {
  areaIdLength: number;
  tableIdLength: number;
  branchNumLength: number;
  searchCategory: LocationSearchCategory;
  searchText: string;
  isSearchOnChangeCategory: boolean;
  onChangeSearchCategory(e: React.ChangeEvent<HTMLSelectElement>): void;
  onClickSearch(e: React.MouseEvent<HTMLButtonElement>): void;
  onBlurSearchText(e: React.FocusEvent<HTMLInputElement>): void;
}
const SearchContent = React.memo((props: SearchProps) => {
  const [t] = useTranslation();

  const searchCategories = [
    {
      label: t('organisms:EditorLocationItemList.search.list.area'),
      value: LocationSearchCategories.AREA_ID,
    },
    {
      label: t('organisms:EditorLocationItemList.search.list.table'),
      value: LocationSearchCategories.TABLE_ID,
    },
    {
      label: t('organisms:EditorLocationItemList.search.list.location'),
      value: LocationSearchCategories.LOCATION_NUM,
    },
    {
      label: t(
        'organisms:EditorLocationItemList.search.list.duplicatedLocation',
      ),
      value: LocationSearchCategories.DUPLICATED_LOCATION_NUM,
    },
    {
      label: t('organisms:EditorLocationItemList.search.list.areaMismatch'),
      value: LocationSearchCategories.AREA_ID_MISMATCH,
    },
  ];

  return (
    <SearchContainer>
      <SearchCondition>
        <label>
          <Dropdown
            items={searchCategories}
            labelField="label"
            valueField="value"
            onChange={props.onChangeSearchCategory}
            value={props.searchCategory}
          />
          <InputText
            maxLength={
              props.searchCategory === LocationSearchCategories.LOCATION_NUM
                ? props.tableIdLength + props.branchNumLength
                : props.searchCategory === LocationSearchCategories.TABLE_ID
                  ? props.tableIdLength
                  : props.areaIdLength
            }
            valueMode="HALF_WIDTH_ALPHABET_AND_NUMBER"
            onBlur={props.onBlurSearchText}
            value={props.searchText}
            disabled={props.isSearchOnChangeCategory}
          />
        </label>
        <Button
          onClick={props.onClickSearch}
          disabled={props.isSearchOnChangeCategory}
        >
          {t('organisms:EditorLocationItemList.search.searchButton')}
        </Button>
      </SearchCondition>
    </SearchContainer>
  );
});

interface OperationProps {
  searchResult: any[];
  onKeyDown(e: React.KeyboardEvent<HTMLDivElement>): void;
  onKeyUp(e: React.KeyboardEvent<HTMLDivElement>): void;
  onClickSelectAll(e: React.MouseEvent<HTMLButtonElement>): void;
  onClickUnSelectAll(e: React.MouseEvent<HTMLButtonElement>): void;
  onClickClear(e: React.MouseEvent<HTMLButtonElement>): void;
}
const OperationContent = React.memo((props: OperationProps) => {
  const [t] = useTranslation();

  return (
    <ListOperation onKeyDown={props.onKeyDown} onKeyUp={props.onKeyUp}>
      <SearchResultCommand>
        <Button
          onClick={props.onClickSelectAll}
          disabled={props.searchResult.length === 0}
        >
          {t('organisms:EditorLocationItemList.button.selectAll')}
        </Button>
        <Button
          onClick={props.onClickUnSelectAll}
          disabled={props.searchResult.length === 0}
        >
          {t('organisms:EditorLocationItemList.button.unSelectAll')}
        </Button>
        <Button onClick={props.onClickClear}>
          {t('organisms:EditorLocationItemList.button.clear')}
        </Button>
      </SearchResultCommand>
      <SearchResultInfo>
        <span>
          {t('organisms:EditorNoLocationItemList.results', {
            length: props.searchResult.length,
          })}
        </span>
      </SearchResultInfo>
    </ListOperation>
  );
});

interface ListProps {
  selectedNodeIds: string[];
  searchResult: any[];
  onKeyDown(e: React.KeyboardEvent<HTMLDivElement>): void;
  onKeyUp(e: React.KeyboardEvent<HTMLDivElement>): void;
  onClickItem(id: string): void;
}
const ListContent = React.memo((props: ListProps) => {
  const rowRenderer: RV.ListRowRenderer = (rowProps: RV.ListRowProps) => {
    const config = props.searchResult[rowProps.index];
    const label = config.locationNum;
    return (
      <ListItem
        title={label}
        aria-selected={props.selectedNodeIds.includes(config.uuid)}
        key={rowProps.key}
        style={rowProps.style}
        onClick={() => props.onClickItem(config.uuid)}
      >
        <span>{label}</span>
      </ListItem>
    );
  };

  return (
    <ListContainer onKeyDown={props.onKeyDown} onKeyUp={props.onKeyUp}>
      <AutoSizerWrapper>
        <AutoSizer>
          {({ width, height }) => {
            return (
              <List
                className="list"
                rowHeight={30}
                rowRenderer={rowRenderer}
                rowCount={props.searchResult.length}
                width={width}
                height={height}
              />
            );
          }}
        </AutoSizer>
      </AutoSizerWrapper>
    </ListContainer>
  );
});

interface Props extends SearchProps, OperationProps, ListProps {}

/**
 * 付番あり
 */
export const EditorLocationItemList = (props: Props) => {
  return (
    <Container>
      <SearchContent {...props} />
      <OperationContent {...props} />
      <ListContent {...props} />
    </Container>
  );
};
