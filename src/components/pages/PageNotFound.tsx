import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Button } from '../atoms';

import { AuthenticatedPageTemplate as Template } from '../templates';

const Wrapper = styled.section`
  display: grid;
  grid-template-rows: auto 1fr;
  grid-row-gap: 0;
  width: 100%;
  height: 100%;
`;

const Message = styled.h1`
  padding: 5px 10px;
  color: rgba(0, 0, 0, 1);
  font-size: 18px;
`;

const Operation = styled.div`
  margin: auto;
`;

const BackButton = styled(Button)`
  width: 180px;
  height: 40px;
`;

export const PageNotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [t] = useTranslation();

  const onClickBack = () => {
    navigate(-1);
  };

  return (
    <Template>
      <Wrapper>
        <Message>
          {t('messages:error.pageNotFound', { path: location.pathname })}
        </Message>
        <Operation>
          <BackButton onClick={onClickBack}>
            {t('pages:PageNotFound.button.back')}
          </BackButton>
        </Operation>
      </Wrapper>
    </Template>
  );
};
