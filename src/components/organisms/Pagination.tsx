import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styled from 'styled-components';

import { Button, Dropdown, InputNumber } from '../atoms';

const Outline = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-column-gap: 10px;
  padding: 10px 0;
  width: 100%;
`;

const DataCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  min-width: 200px;
  height: 100%;

  > span {
    margin-left: 3px;
  }
`;

const Page = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  > button + button {
    margin-left: 5px;
  }
`;

const Pages = styled.div`
  display: flex;
  align-items: center;
  margin: 0 5px;
  height: 100%;

  > button + button {
    margin-left: 5px;
  }
`;

const Options = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  min-width: 300px;
  height: 100%;

  > label {
    display: flex;
    align-items: center;

    > span {
      display: flexbox;
      justify-content: end;
      margin-right: 9px;
    }
  }
`;

const FirstButton = styled(Button)`
  height: 33px;
`;

const LastButton = styled(Button)`
  height: 33px;
`;

const PreviousButton = styled(Button)`
  height: 33px;
`;

const NextButton = styled(Button)`
  height: 33px;
`;

const PageButton = styled(Button)`
  height: 33px;

  &[aria-disabled='true'].selected,
  &:disabled.selected {
    background: linear-gradient(
      rgba(197, 197, 197, 1),
      rgba(183, 183, 183, 1),
      rgba(179, 179, 179, 1)
    );

    &:hover {
      background: linear-gradient(
        rgba(197, 197, 197, 1),
        rgba(183, 183, 183, 1),
        rgba(179, 179, 179, 1)
      );
      cursor: not-allowed;
    }
  }
`;

const PageRecordsList = styled(Dropdown)`
  height: 33px;
`;

const Current = styled.div`
  display: flex;
  align-items: center;
  margin-left: 60px;
`;

const JumpPage = styled.div`
  display: flex;
  align-items: center;
  margin-left: 60px;

  > span {
    display: flexbox;
    justify-content: end;
    margin-right: 6px;
  }

  > input[type='text'] {
    min-width: 40px;
    width: 40px;
    height: 33px;
  }

  > button {
    margin-left: 6px;
    height: 33px;
  }
`;

interface ResultProps {
  hits: number;
  totalHits: number;
}
const ResultContent = React.memo((props: ResultProps) => {
  const [t] = useTranslation();

  const numberFormat: Intl.NumberFormat = new Intl.NumberFormat('ja');

  return (
    <DataCount>
      {t('organisms:Pagination.results', {
        hits: numberFormat.format(props.hits),
        totalHits: numberFormat.format(props.totalHits),
      })}
    </DataCount>
  );
});

interface CurrentProps {
  pageSize: number;
  currentPage: number;
}
const CurrentContent = React.memo((props: CurrentProps) => {
  return (
    <Current>
      <span>{`${props.currentPage} / ${props.pageSize}`}</span>
    </Current>
  );
});

interface JumpProps {
  pages: number[];
  pageSize: number;
  goToPage: number;
  onChangeGoToPage(value: number): void;
  onClickGoToPage(e: React.MouseEvent<HTMLButtonElement>): void;
}
const JumpContent = React.memo((props: JumpProps) => {
  const [t] = useTranslation();

  return (
    <JumpPage>
      <span>{t('organisms:Pagination.goToPage.label')}</span>
      <InputNumber
        min={1}
        max={props.pageSize}
        value={props.goToPage}
        disabled={props.pages.length === 1}
        onBlur={(e) => props.onChangeGoToPage(Number(e.target.value))}
      />
      <Button
        disabled={props.pages.length === 1}
        onClick={props.onClickGoToPage}
      >
        {t('organisms:Pagination.goToPage.button')}
      </Button>
    </JumpPage>
  );
});

interface OptionProps {
  pageRecordsList: number[];
  pageRecords: number;
  onChange(e: React.ChangeEvent<HTMLSelectElement>): void;
}
const OptionContent = React.memo((props: OptionProps) => {
  const [t] = useTranslation();

  return (
    <Options>
      <label>
        <span>{t('organisms:Pagination.options.pageRecords.label')}</span>
        <PageRecordsList
          items={props.pageRecordsList}
          value={props.pageRecords}
          onChange={props.onChange}
        />
      </label>
    </Options>
  );
});

interface Props {
  pageRecordsList: number[];
  hits: number;
  totalHits: number;
  pages: number[];
  pageSize: number;
  currentPage: number;
  pageRecords: number;
  goToPage: number;
  onClickPageNum(page: number): void;
  onChangePageRecords(e: React.ChangeEvent<HTMLSelectElement>): void;
  onChangeGoToPage(value: number): void;
  onClickGoToPage(e: React.MouseEvent<HTMLButtonElement>): void;
}

/**
 * ページ割り
 */
export const Pagination = (props: Props) => {
  const { pages, pageSize, currentPage, onClickPageNum } = props;

  const [t] = useTranslation();

  return (
    <Outline>
      <ResultContent hits={props.hits} totalHits={props.totalHits} />
      <Page>
        {pages.length > 0 && (
          <>
            <FirstButton
              disabled={currentPage === 1}
              onClick={() => onClickPageNum(1)}
            >
              {t('organisms:Pagination.firstButton')}
            </FirstButton>
            <PreviousButton
              disabled={currentPage === 1}
              onClick={() => onClickPageNum(currentPage - 1)}
            >
              {t('organisms:Pagination.previousButton')}
            </PreviousButton>
            <Pages>
              {pages.map((num) => {
                return (
                  <PageButton
                    key={num}
                    disabled={num === currentPage}
                    className={classNames({ selected: currentPage === num })}
                    onClick={() => onClickPageNum(num)}
                  >
                    {num}
                  </PageButton>
                );
              })}
            </Pages>
            <NextButton
              disabled={currentPage === pageSize}
              onClick={() => onClickPageNum(currentPage + 1)}
            >
              {t('organisms:Pagination.nextButton')}
            </NextButton>
            <LastButton
              disabled={currentPage === pageSize}
              onClick={() => onClickPageNum(pageSize)}
            >
              {t('organisms:Pagination.lastButton')}
            </LastButton>
            <CurrentContent
              currentPage={props.currentPage}
              pageSize={props.pageSize}
            />
            <JumpContent
              pages={props.pages}
              pageSize={props.pageSize}
              goToPage={props.goToPage}
              onChangeGoToPage={props.onChangeGoToPage}
              onClickGoToPage={props.onClickGoToPage}
            />
          </>
        )}
      </Page>
      <OptionContent
        pageRecordsList={props.pageRecordsList}
        pageRecords={props.pageRecords}
        onChange={props.onChangePageRecords}
      />
    </Outline>
  );
};
