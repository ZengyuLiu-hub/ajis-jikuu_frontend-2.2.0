import React, { TextareaHTMLAttributes } from 'react';
import styled from 'styled-components';

export const StyledTextArea = styled.textarea`
  border: 1px solid rgba(151, 151, 151, 1);
  background: rgba(245, 245, 245, 1);
  margin: 0;
  padding: 2px 4px;
  min-width: 200px;
  min-height: 25px;
  font-size: 1rem;

  &::placeholder {
    font-style: italic;
  }

  &:hover {
    border-color: rgba(2, 154, 209, 1);
  }

  &:focus {
    outline-color: rgba(2, 154, 209, 1);
  }

  &[aria-disabled='true'],
  &:disabled {
    opacity: 0.5;

    &:hover {
      cursor: not-allowed;
    }
  }
`;

export const TextArea = (
  props: TextareaHTMLAttributes<HTMLTextAreaElement>
) => {
  // キー入力
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();
  };

  return <StyledTextArea {...props} onKeyDown={handleKeyDown} />;
};
