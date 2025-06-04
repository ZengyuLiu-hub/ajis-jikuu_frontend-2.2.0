import { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';

export const StyledSubmitButton = styled.button`
  margin: 0;
  padding: 0;
  border: none;
  background-color: transparent;
  background-position: center center;
  background-repeat: no-repeat;
  background-color: rgba(208, 73, 10, 1);
  color: rgba(255, 255, 255, 1);

  padding: 0 30px;
  min-width: 145px;
  min-height: 24px;
  height: 26px;
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  text-decoration: none;

  &:hover {
    box-shadow: 1px 1px rgba(206, 205, 205, 1);
    cursor: pointer;
  }

  &:focus {
    background-color: rgba(190, 68, 8, 1);
    outline: none;
  }

  &[aria-disabled='true'],
  &:disabled {
    opacity: 0.5;

    &:hover {
      box-shadow: none;
      cursor: not-allowed;
    }
  }
`;

StyledSubmitButton.defaultProps = {
  type: 'button',
};

export const SubmitButton = (
  props: ButtonHTMLAttributes<HTMLButtonElement>
) => {
  return <StyledSubmitButton {...props} />;
};
