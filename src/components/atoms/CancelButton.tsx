import { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';

export const StyledCancelButton = styled.button`
  margin: 0;
  padding: 0;
  border: 2px solid rgba(6, 118, 222, 1);
  background-color: transparent;
  background-position: center center;
  background-repeat: no-repeat;
  background-color: rgba(255, 255, 255, 1);
  color: rgba(6, 118, 222, 1);

  padding: 0 30px;
  min-width: 145px;
  min-height: 24px;
  height: 26px;
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  text-decoration: none;

  &:hover {
    box-shadow: 2px 2px rgba(206, 205, 205, 1);
    cursor: pointer;
  }

  &:focus {
    background-color: rgba(240, 250, 255, 1);
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

StyledCancelButton.defaultProps = {
  type: 'button',
};

export const CancelButton = (
  props: ButtonHTMLAttributes<HTMLButtonElement>
) => {
  return <StyledCancelButton {...props} />;
};
