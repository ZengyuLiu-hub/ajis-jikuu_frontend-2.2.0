import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.section`
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: 10px;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    'header'
    'content';
  padding: 0;
  border: none;
  background-color: rgba(255, 255, 255, 1);
  max-height: 100%;
  min-height: 0;
  height: 100%;
`;

const TemplateContent = styled.main`
  overflow: hidden;
  grid-area: content;
`;

interface Props {
  children: React.ReactNode;
}

export const AuthenticatedNewWindowTemplate = (props: Props) => {
  return (
    <>
      <Wrapper>
        <TemplateContent>{props.children}</TemplateContent>
      </Wrapper>
    </>
  );
};
