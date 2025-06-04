import React from 'react';
import { useTranslation } from 'react-i18next';
import * as RV from 'react-virtualized';
import styled from 'styled-components';

import * as editorConstants from '../../constants/editor';

import { Button } from '../atoms';

const AutoSizer = RV.AutoSizer as unknown as React.FC<RV.AutoSizerProps>;
const List = RV.List as unknown as React.FC<RV.ListProps>;

const Container = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  min-height: 0;
  max-height: 100%;
  height: calc(100% - 1px);
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
  border-top: 1px solid rgba(128, 128, 128, 1);
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

interface ResultCommandProps {
  disabled: boolean;
  onClickSelectAll(e: React.MouseEvent<HTMLButtonElement>): void;
  onClickUnSelectAll(e: React.MouseEvent<HTMLButtonElement>): void;
}
const ResultCommand = React.memo((props: ResultCommandProps) => {
  const [t] = useTranslation();

  return (
    <SearchResultCommand>
      <Button onClick={props.onClickSelectAll} disabled={props.disabled}>
        {t('organisms:EditorNoLocationItemList.button.selectAll')}
      </Button>
      <Button onClick={props.onClickUnSelectAll} disabled={props.disabled}>
        {t('organisms:EditorNoLocationItemList.button.unSelectAll')}
      </Button>
    </SearchResultCommand>
  );
});

interface ResultInfoProps {
  resultLength: number;
}
const ResultInfo = React.memo((props: ResultInfoProps) => {
  const [t] = useTranslation();

  return (
    <SearchResultInfo>
      <span>
        {t('organisms:EditorNoLocationItemList.results', {
          length: props.resultLength,
        })}
      </span>
    </SearchResultInfo>
  );
});

interface ListProps {
  selectedNodeIds: string[];
  searchResult: any[];
  onKeyDown(e: React.KeyboardEvent<HTMLDivElement>): void;
  onKeyUp(e: React.KeyboardEvent<HTMLDivElement>): void;
  onClickItem(uuid: string): void;
}
const ListContent = React.memo((props: ListProps) => {
  const rowRenderer: RV.ListRowRenderer = (rowProps: RV.ListRowProps) => {
    const config = props.searchResult[rowProps.index];
    const label =
      config.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_TEXT) && config.text
        ? config.text
        : config.shape;
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

interface Props extends ListProps {
  searchResult: any[];
  onKeyDown(e: React.KeyboardEvent<HTMLDivElement>): void;
  onKeyUp(e: React.KeyboardEvent<HTMLDivElement>): void;
  onClickSelectAll(e: React.MouseEvent<HTMLButtonElement>): void;
  onClickUnSelectAll(e: React.MouseEvent<HTMLButtonElement>): void;
}

/**
 * 付番なし
 */
export const EditorNoLocationItemList = (props: Props) => {
  return (
    <Container>
      <ListOperation onKeyDown={props.onKeyDown} onKeyUp={props.onKeyUp}>
        <ResultCommand
          disabled={props.searchResult.length === 0}
          onClickSelectAll={props.onClickSelectAll}
          onClickUnSelectAll={props.onClickUnSelectAll}
        />
        <ResultInfo resultLength={props.searchResult.length} />
      </ListOperation>
      <ListContent {...props} />
    </Container>
  );
};
