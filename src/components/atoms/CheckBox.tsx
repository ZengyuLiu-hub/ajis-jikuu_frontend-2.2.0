import { InputHTMLAttributes } from 'react';
import styled from 'styled-components';

const StyledLabel = styled.label`
  position: relative;
  display: inline-flex;
  align-items: center;
  color: rgba(0, 0, 0, 1);
  padding: 0 0 0 18px;
  cursor: pointer;

  &:hover {
    input {
      & + div {
        border-color: rgba(2, 154, 209, 1);
      }

      &:not([disabled]):checked {
        & + div {
          background: rgba(2, 154, 209, 1);
          border: none;
        }
      }
    }
  }

  &[aria-disabled='true'],
  &:disabled {
    input {
      & + div {
        background: rgba(204, 204, 204, 1);
        border: none;
      }
    }

    span {
      opacity: 0.5;
    }

    &:hover {
      cursor: not-allowed;
    }
  }
`;

export const StyledInput = styled.input`
  display: none;
  position: absolute;
  z-index: -1;
  opacity: 0;

  &:focus {
    & + div {
      border-color: rgba(2, 154, 209, 1);
    }
  }

  &:checked {
    & + div {
      background: rgba(4, 176, 238, 1);
      border: none;

      &::after {
        display: block;
      }
    }

    &:focus {
      & + div {
        background: rgba(2, 154, 209, 1);
        border: none;
      }
    }
  }

  &[aria-disabled='true'],
  &:disabled {
    & + div {
      border-color: rgba(123, 123, 123, 1);
      background: rgba(230, 230, 230, 1);
      opacity: 0.6;
      pointer-events: none;
    }
  }
`;

StyledInput.defaultProps = {
  type: 'checkbox',
};

const CustomCheckBox = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  background: rgba(245, 245, 245, 1);
  border: 1px solid rgba(204, 204, 204, 1);
  border-radius: 4px;
  box-sizing: border-box;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  height: 18px;
  width: 18px;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: transparent;
    background-position: center center;
    background-repeat: no-repeat;
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E");
    background-size: 14px 14px;
  }
`;

const Text = styled.span`
  display: inline-block;
  height: 18px;
  font-size: 13px;

  &:not(:empty) {
    padding: 0 1px 0 0.5ex;
  }
`;

export interface CheckBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const CheckBox = (props: CheckBoxProps) => {
  const { label, disabled } = props;

  return (
    <StyledLabel aria-disabled={disabled}>
      <StyledInput {...props} />
      <CustomCheckBox></CustomCheckBox>
      <Text>{label}</Text>
    </StyledLabel>
  );
};
