import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Layout } from '../../types';
import { Dropdown } from '../atoms';

const Container = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: auto 1fr auto;
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
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
  min-height: 0;
  max-height: 100%;
  width: 100%;
  height: 100%;
`;

const LayoutDropdown = styled(Dropdown)`
  height: 30px;
`;

// 企業、店舗情報
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
        <span>{t('organisms:ViewerLayoutTabs.information.company')}</span>
        <span>{`${props.companyName} (${props.companyCode})`}</span>
      </InformationItem>
      <InformationItem>
        <span>{t('organisms:ViewerLayoutTabs.information.store')}</span>
        <span>{`${props.storeName} (${props.storeCode})`}</span>
      </InformationItem>
    </Information>
  );
});

interface Props extends InformationProps {
  layoutTabs: Layout[];
  currentLayoutId: string;
  onChangeLayout(layout: Layout): void;
}

/**
 * マップビューア：レイアウトタブ
 */
export const ViewerLayoutTabs = (props: Props) => {
  return (
    <Container>
      <InformationContent
        companyCode={props.companyCode}
        companyName={props.companyName}
        storeCode={props.storeCode}
        storeName={props.storeName}
      />
      <TabContainer>
        <LayoutDropdown
          items={props.layoutTabs}
          valueField="layoutId"
          labelField="layoutName"
          onChange={(e) =>
            props.onChangeLayout(props.layoutTabs[e.target.selectedIndex])
          }
          value={props.currentLayoutId}
        />
      </TabContainer>
    </Container>
  );
};
