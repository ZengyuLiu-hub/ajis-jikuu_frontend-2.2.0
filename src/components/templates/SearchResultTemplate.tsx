import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { StyledButton } from '../atoms';
import { AuthenticatedPageTemplate as Template } from '../templates';

const Wrapper = styled.section`
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  grid-row-gap: 5px;
  width: 100%;
  height: 100%;
`;

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  flex: none;
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex: none;
  padding: 5px;
`;

const TitleArea = styled.div`
  position: relative;
  display: flex;
  padding-left: 25px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto 0;
    background-color: rgba(0, 174, 238, 1);
    width: 20px;
    height: 20px;
  }

  span {
    position: relative;
    color: rgba(102, 102, 102, 1);
    font-size: 17px;
    font-weight: bold;
  }
`;

const PageFooter = styled.div``;

const Description = styled.div`
  margin: 0;
`;

const SearchResult = styled.div`
  display: flex;
  overflow: auto;
  padding: 0 15px;
`;

const SearchCondition = styled.div`
  display: flex;
  flex-direction: column;
  flex: none;
  padding: 0 15px;
`;

export const LastUpdate = styled.div`
  display: flex;
  align-items: center;
  padding-right: 10px;

  label {
    color: rgba(102, 102, 102, 1);
    font-weight: bold;

    span {
      font-weight: normal;
    }

    + button {
      margin-left: 20px;
    }
  }
`;

export const FooterRow = styled.div`
  display: flex;
  justify-content: space-between;
  flex: none;
  padding: 0 15px;

  > div {
    display: flex;
    flex: auto;

    > * + * {
      margin-left: 5px;
    }

    &:first-child {
      justify-content: flex-start;
    }

    &:last-child {
      justify-content: flex-end;
    }
  }
`;

export const RefreshButton = styled(StyledButton)`
  position: relative;
  margin-left: 20px;
  padding-left: 22px;
  color: rgba(51, 77, 154, 1);
  width: 100px;
  height: 22px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(51, 77, 154, 1) url('assets/images/icon/reload.svg') center
      center no-repeat;
    background-size: 16px 16px;
    width: 22px;
    height: 100%;
  }
`;


export const SearchConditionArea = styled.div`
  border: 1px solid rgba(120,190,215,1);
  margin-bottom: 10px;
  padding: 10px 0;
`;

export const SearchConditionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 30px;
  height: 35px;
`;

export const SearchConditionItem = styled.div`
  display: flex;
  align-items: center;

  &:not(:first-child) {
    margin-left: 30px;
  }

  > span:first-child {
    display: inline-block;
    color: rgba(102, 102, 102, 1);
    font-weight: bold;
    margin-right: 5px;
    white-space: nowrap;
  }

  > span:not(first-child) {
    display: inline-block;
    color: rgba(75, 0, 130, 1);
    font-weight: bold;
    margin-right: 5px;
    white-space: nowrap;
  }

  > label + input,
  > label + div {
    margin-left: 5px;
  }

  .dateRangeExpression {
    display: inline-block;
    margin: 0 5px;
    font-weight: normal;

    &::after {
      content: '〜';
    }
  }
`;

export const SearchConditionCommands = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;

  button + button {
    margin-left: 10px;
  }
`;

export interface Props {
  title: string;
  searchDescription?: ReactNode;
  titleContent?: ReactNode;
  headerContent?: ReactNode;
  searchContent?: ReactNode;
  resultContent: ReactNode;
  footerContent?: ReactNode;
}

export const SearchResultTemplate = (props: Props) => {
  return (
    <Template>
      <Wrapper>
        {/* ヘッダー */}
        <PageHeader>
          <TitleRow>
            <TitleArea>
              <span>{props.title}</span>
            </TitleArea>
            {props.titleContent}
          </TitleRow>
          {props.headerContent}
        </PageHeader>
        {/* 検索条件 */}
        <SearchCondition>
          <Description>{props.searchDescription}</Description>
          {props.searchContent}
        </SearchCondition>
        {/* 検索結果 */}
        <SearchResult>{props.resultContent}</SearchResult>
        {/* フッター */}
        <PageFooter>{props.footerContent}</PageFooter>
      </Wrapper>
    </Template>
  );
};
