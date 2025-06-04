import { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';

export const StyledNextButton = styled.button`
  display: inline-flex;
  align-items: center;
  border: none;
  margin: 0;
  padding: 0;
  min-width: 145px;
  height: 26px;
  font-size: 1rem;
  text-align: center;
  text-decoration: none;
  color: rgba(102, 102, 102, 1);

  &::before,
  &::after {
    content: '';
    display: inline-block;
    border-top: 13px solid rgba(255, 255, 255, 1);
    border-bottom: 13px solid rgba(255, 255, 255, 1);
    border-left: 13px solid rgba(255, 255, 255, 1);
    width: 0;
    height: 0;
    vertical-align: middle;
  }
  &::before {
    border-top-color: rgba(255, 119, 0, 1);
    border-bottom-color: rgba(255, 119, 0, 1);
  }
  &::after {
    border-left-color: rgba(255, 119, 0, 1);
  }

  span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 119, 0, 1);
    color: rgba(255, 255, 255, 1);
    padding: 0 20px;
    min-width: 100px;
    width: 100%;
    height: 100%;
    font-weight: bold;
  }

  &:hover {
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }

  &[aria-disabled='true'],
  &:disabled {
    opacity: 0.5;

    &:hover {
      cursor: not-allowed;
    }
  }
`;

StyledNextButton.defaultProps = {
  type: 'button',
};

export const NextButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return <StyledNextButton {...props} />;
};
