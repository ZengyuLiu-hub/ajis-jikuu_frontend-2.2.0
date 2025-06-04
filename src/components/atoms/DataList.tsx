import * as RV from 'react-virtualized';
import styled from 'styled-components';

const AutoSizer = RV.AutoSizer as unknown as React.FC<RV.AutoSizerProps>;
const List = RV.List as unknown as React.FC<RV.ListProps>;

const ListArea = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
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

const AutoSizerWrapper = styled.div`
  display: flex;
  flex: 1 1 auto;
  min-height: 0;
  max-height: 100%;
  height: 100%;
`;

const ListItem = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 4px;

  &:hover {
    background-color: rgba(206, 219, 239, 1);
    cursor: default;
  }

  &[aria-selected='true'] {
    background-color: rgba(168, 198, 238, 1);
  }
`;

interface Props {
  rowHeight: number | ((info: RV.Index) => number);
  data: any[];
  label?: string;
  labelFunction?(item: any, index: number): string;
  selectedItem: any;
  onClick?(item: any): void;
}

export const DataList = (props: Props) => {
  const { data } = props;

  const rowRenderer: RV.ListRowRenderer = (rowProps: RV.ListRowProps) => {
    const item = data[rowProps.index];
    const label = props.labelFunction
      ? props.labelFunction(item, rowProps.index)
      : props.label && item[props.label];
    return (
      <ListItem
        title={label}
        aria-selected={item === props.selectedItem}
        key={rowProps.key}
        style={rowProps.style}
        onClick={() => props.onClick && props.onClick(item)}
      >
        {label}
      </ListItem>
    );
  };

  return (
    <ListArea>
      <AutoSizerWrapper>
        <AutoSizer>
          {({ width, height }) => {
            return (
              <List
                className="list"
                rowHeight={props.rowHeight}
                rowRenderer={rowRenderer}
                rowCount={props.data.length}
                width={width}
                height={height}
              />
            );
          }}
        </AutoSizer>
      </AutoSizerWrapper>
    </ListArea>
  );
};
