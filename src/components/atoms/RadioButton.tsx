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
  type: 'radio',
};

const CustomRadioButton = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  background: rgba(245, 245, 245, 1);
  border: 1px solid rgba(204, 204, 204, 1);
  border-radius: 50%;
  box-sizing: border-box;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  height: 18px;
  width: 18px;

  &::after {
    content: '';
    position: absolute;
    display: none;
    top: 6px;
    left: 6px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(245, 245, 245, 1);
  }
`;

const Text = styled.span`
  display: inline-flexbox;
  align-items: center;
  height: 18px;
  font-size: 13px;

  &:not(:empty) {
    padding: 0 1ex 0 0.5ex;
  }
`;

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const RadioButton = (props: Props) => {
  const { label, disabled } = props;

  return (
    <StyledLabel aria-disabled={disabled}>
      <StyledInput {...props} />
      <CustomRadioButton></CustomRadioButton>
      <Text>{label}</Text>
    </StyledLabel>
  );
};
