import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Layout } from '../../types';

import { EditableLabel } from '../atoms';

const Container = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: auto 1fr auto auto auto;
  grid-column-gap: 3px;
  margin: 0;
  padding: 0;
  border: none;
  height: 30px;
`;

const Information = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-column-gap: 15px;
  margin: 0;
  padding: 0 20px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(200, 200, 200, 1);
  height: 100%;
`;

const InformationItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  > span:first-child {
    display: inline-block;
    color: rgba(102, 102, 102, 1);
    font-weight: bold;
    margin-right: 5px;
    white-space: nowrap;
  }

  > span:not(:first-child) {
    display: inline-block;
    color: rgba(75, 0, 130, 1);
    font-weight: bold;
    margin-right: 5px;
    white-space: nowrap;
  }
`;

const TabContainer = styled.div`
  overflow: hidden;
  display: flex;
  flex-wrap: nowrap;
  margin: 0;
  padding: 0;
  min-height: 0;
  max-height: 100%;
  width: 100%;
  height: 100%;
`;

const Tab = styled.div`
  margin: 0;
  padding: 0;
  height: 100%;

  &:not(:last-of-type) {
    margin-right: 1px;
  }
`;

const TabLabel = styled(EditableLabel)`
  overflow: hidden;
  display: flex;
  align-self: center;
  color: rgba(62, 62, 62, 1);
  min-width: 40px;
  max-width: 100%;
  font-size: 10pt;
  font-weight: bold;
`;

const TabDeleteButton = styled.button`
  display: none;
  margin: 0;
  padding: 0;
  border: none;
  width: 30px;
  height: 30px;
  cursor: pointer;

  background-color: transparent;
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%233e3e3e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='18' y1='6' x2='6' y2='18'%3E%3C/line%3E%3Cline x1='6' y1='6' x2='18' y2='18'%3E%3C/line%3E%3C/svg%3E");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 15px 15px;

  &:hover {
    background-color: transparent;
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23f8f8ff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='18' y1='6' x2='6' y2='18'%3E%3C/line%3E%3Cline x1='6' y1='6' x2='18' y2='18'%3E%3C/line%3E%3C/svg%3E");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 15px 15px;
  }

  &:focus {
    outline: none;
  }
`;

const TabItem = styled.div`
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr auto;
  background: LightGray;
  min-width: 80px;
  max-width: 200px;
  height: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    > ${TabDeleteButton} {
      display: block;
    }
  }
`;

const TabSwitch = styled.input`
  display: none;

  &:checked {
    & + ${TabItem} {
      background: rgba(62, 62, 62, 1);

      > ${TabLabel} {
        color: rgba(248, 248, 255, 1);
      }

      > ${TabDeleteButton} {
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23f8f8ff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='18' y1='6' x2='6' y2='18'%3E%3C/line%3E%3Cline x1='6' y1='6' x2='18' y2='18'%3E%3C/line%3E%3C/svg%3E");

        &:hover {
          background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23c0c0c0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='18' y1='6' x2='6' y2='18'%3E%3C/line%3E%3Cline x1='6' y1='6' x2='18' y2='18'%3E%3C/line%3E%3C/svg%3E");
        }
      }
    }
  }
`;

const TabHorizonScroll = styled.div`
  position: relative;

  > button + button {
    margin-left: 1px;
  }
`;

const TabHorizonScrollButton = styled.button`
  margin: 0;
  padding: 0;
  border: none;
  width: 20px;
  height: 100%;
  cursor: pointer;

  background-color: rgba(230, 230, 230, 1);
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 12px 12px;

  &:disabled {
    opacity: 0.5;
    background-color: rgba(183, 183, 183, 1);
    cursor: default;
  }

  &:hover {
    background-color: rgba(183, 183, 183, 1);
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 12px 12px;
  }

  &.right {
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' x='0' y='0' width='16' height='16' viewBox='0 0 512 512' style='width: 16px; height: 16px;'%3E%3Cg%3E%3Cpolygon points='163.916,0 92.084,71.822 276.258,255.996 92.084,440.178 163.916,512 419.916,255.996' style='fill: %233e3e3e;'%3E%3C/polygon%3E%3C/g%3E%3C/svg%3E");
  }

  &.left {
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' x='0' y='0' width='16' height='16' viewBox='0 0 512 512' style='width: 16px; height: 16px;'%3E%3Cg%3E%3Cpolygon points='419.916,71.821 348.084,0 92.084,256.005 348.084,512 419.916,440.178 235.742,256.005' style='fill: %233e3e3e;'%3E%3C/polygon%3E%3C/g%3E%3C/svg%3E");
  }
`;

const CopyTab = styled.button`
  margin: 0;
  padding: 0;
  border: none;
  width: 30px;
  height: 30px;
  cursor: pointer;

  background-color: rgba(230, 230, 230, 1);
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%233e3e3e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='9' y='9' width='13' height='13' rx='2' ry='2'%3E%3C/rect%3E%3Cpath d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'%3E%3C/path%3E%3C/svg%3E");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 24px 24px;

  &:hover {
    background-color: rgba(183, 183, 183, 1);
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%233e3e3e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='9' y='9' width='13' height='13' rx='2' ry='2'%3E%3C/rect%3E%3Cpath d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'%3E%3C/path%3E%3C/svg%3E");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 24px 24px;
  }

  &:focus {
    outline: none;
  }
`;

const AddTab = styled.button`
  margin: 0;
  padding: 0;
  border: none;
  width: 30px;
  height: 30px;
  cursor: pointer;

  background-color: rgba(230, 230, 230, 1);
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%233e3e3e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='12' y1='5' x2='12' y2='19'%3E%3C/line%3E%3Cline x1='5' y1='12' x2='19' y2='12'%3E%3C/line%3E%3C/svg%3E");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 24px 24px;

  &:hover {
    background-color: rgba(183, 183, 183, 1);
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%233e3e3e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='12' y1='5' x2='12' y2='19'%3E%3C/line%3E%3Cline x1='5' y1='12' x2='19' y2='12'%3E%3C/line%3E%3C/svg%3E");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 24px 24px;
  }

  &:focus {
    outline: none;
  }
`;

export type DragTab = {
  /* 移動対象タブID */
  dragTabId: string;

  /* 移動先タブID */
  dropTabId?: string;
};

interface InformationProps {
  companyCode: string;
  companyName: string;
  storeCode: string;
  storeName: string;
}
const InformationContent = React.memo((props: InformationProps) => {
  const [t] = useTranslation();

  return (
    <Information>
      <InformationItem>
        <span>{t('organisms:EditorLayoutTabs.information.company')}</span>
        <span>{`${props.companyName} (${props.companyCode})`}</span>
      </InformationItem>
      <InformationItem>
        <span>{t('organisms:EditorLayoutTabs.information.store')}</span>
        <span>{`${props.storeName} (${props.storeCode})`}</span>
      </InformationItem>
    </Information>
  );
});

interface TabHorizonScrollProps {
  canHorizonScrollingRight: boolean;
  canHorizonScrollingLeft: boolean;
  onClickTabScrollRight(e: React.MouseEvent<HTMLButtonElement>): void;
  onClickTabScrollLeft(e: React.MouseEvent<HTMLButtonElement>): void;
}

const TabHorizonScrollContent = React.memo((props: TabHorizonScrollProps) => {
  return (
    <TabHorizonScroll>
      <TabHorizonScrollButton
        className="left"
        disabled={!props.canHorizonScrollingLeft}
        onClick={props.onClickTabScrollLeft}
      ></TabHorizonScrollButton>
      <TabHorizonScrollButton
        className="right"
        disabled={!props.canHorizonScrollingRight}
        onClick={props.onClickTabScrollRight}
      ></TabHorizonScrollButton>
    </TabHorizonScroll>
  );
});

interface Props extends InformationProps, TabHorizonScrollProps {
  tabContainerRef: React.RefObject<HTMLDivElement>;
  layoutTabs: Layout[];
  currentTab: string;
  onClickTab(layout: Layout): void;
  onChangeTabLabel(layout: { layoutId: string; layoutName: string }): void;
  onClickDeleteTab(layout: Layout): void;
  onClickCopyTab(): void;
  onClickAddTab(): void;
  onDropTab(value: DragTab): void;
}

/**
 * マップエディタ：レイアウトタブ
 */
export const EditorLayoutTabs = (props: Props) => {
  const [t] = useTranslation();

  return (
    <Container>
      <InformationContent
        companyCode={props.companyCode}
        companyName={props.companyName}
        storeCode={props.storeCode}
        storeName={props.storeName}
      />
      <TabContainer
        ref={props.tabContainerRef}
        onDragOver={(e) => {
          e.preventDefault();

          const latestItem = e.currentTarget.children.item(
            e.currentTarget.children.length - 1,
          ) as HTMLDivElement;
          if (latestItem) {
            latestItem.style.borderRight = '2px solid rgba(70, 102, 255, 1)';
          }
        }}
        onDragLeave={(e) => {
          const latestItem = e.currentTarget.children.item(
            e.currentTarget.children.length - 1,
          ) as HTMLDivElement;
          if (latestItem) {
            latestItem.style.borderRight = '';
          }
        }}
        onDrop={(e) => {
          props.onDropTab({
            dragTabId: e.dataTransfer.getData('text/plain'),
          });
          const latestItem = e.currentTarget.children.item(
            e.currentTarget.children.length - 1,
          ) as HTMLDivElement;
          if (latestItem) {
            latestItem.style.borderRight = '';
          }
        }}
      >
        {props.layoutTabs.map((layout, i) => (
          <Tab
            key={layout.layoutId}
            draggable={true}
            onDragStart={(e) => {
              e.stopPropagation();
              e.dataTransfer.setData('text/plain', layout.layoutId);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.currentTarget.style.borderLeft =
                '2px solid rgba(70, 102, 255, 1)';
            }}
            onDragLeave={(e) => {
              e.stopPropagation();
              e.currentTarget.style.borderLeft = '';
            }}
            onDrop={(e) => {
              e.stopPropagation();
              props.onDropTab({
                dragTabId: e.dataTransfer.getData('text/plain'),
                dropTabId: layout.layoutId,
              });
              e.currentTarget.style.borderLeft = '';
            }}
          >
            <TabSwitch
              type="radio"
              name="layoutTab"
              value={layout.layoutId}
              onChange={(e) => e.stopPropagation()}
              checked={layout.layoutId === props.currentTab}
            />
            <TabItem
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                e.stopPropagation();
                props.onClickTab(layout);
              }}
            >
              <TabLabel
                value={layout.layoutName}
                onChange={(newValue) =>
                  props.onChangeTabLabel({
                    layoutId: layout.layoutId,
                    layoutName: newValue,
                  })
                }
              />
              <TabDeleteButton
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  props.onClickDeleteTab(layout);
                }}
              />
            </TabItem>
          </Tab>
        ))}
      </TabContainer>
      <TabHorizonScrollContent {...props} />
      <CopyTab
        title={t('organisms:EditorLayoutTabs.button.copy')}
        onClick={props.onClickCopyTab}
      />
      <AddTab
        title={t('organisms:EditorLayoutTabs.button.add')}
        onClick={props.onClickAddTab}
      />
    </Container>
  );
};
