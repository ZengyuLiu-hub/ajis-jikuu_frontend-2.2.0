import { SelectHTMLAttributes } from 'react';
import styled from 'styled-components';

export const StyledOutline = styled.label`
  display: inline-block;
  position: relative;

  &::after {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    right: 9px;
    bottom: 0;
    margin: auto;
    border: 1px solid transparent;
    border-width: 5px 3px 0 3px;
    border-top-color: rgba(45, 45, 48, 1);
    width: 0;
    height: 0;
    pointer-events: none;
  }

  &[aria-disabled='true'],
  &:disabled {
    &::after {
      opacity: 0.5;
    }
  }
`;

export const StyledDropdown = styled.select`
  position: relative;
  top: 0;
  margin: 0;

  padding: 0 24px 0 8px;
  border: 1px solid rgba(151, 151, 151, 1);
  border-radius: 4px;
  min-width: 80px;
  min-height: 24px;
  color: rgba(0, 0, 0, 1);
  text-decoration: none;
  font-size: 1rem;

  appearance: none;
  outline: none;

  background: linear-gradient(
    rgba(245, 245, 245, 1),
    rgba(230, 230, 230, 1),
    rgba(200, 200, 200, 1)
  );

  &:hover {
    background: linear-gradient(
      rgba(197, 197, 197, 1),
      rgba(183, 183, 183, 1),
      rgba(179, 179, 179, 1)
    );
    cursor: pointer;
  }

  &[aria-disabled='true'],
  &:disabled {
    opacity: 0.5;

    &:hover {
      background: linear-gradient(
        rgba(245, 245, 245, 1),
        rgba(230, 230, 230, 1),
        rgba(200, 200, 200, 1)
      );
      box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.4);
      cursor: not-allowed;
    }
  }
`;

export const StyledDropdownItem = styled.option`
  min-height: 24px;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  items?: any[];
  itemsCaption?: string;
  labelField?: string;
  valueField?: string;
  labelFunction?: (item: any, index: number) => string;
  valueFunction?: (item: any, index: number) => string;
}

export const Dropdown = (props: Props) => {
  const {
    items,
    itemsCaption,
    labelField,
    valueField,
    labelFunction,
    valueFunction,
    ...domProps
  } = props;

  const getLabelField = (item: any, index: number) => {
    if (labelFunction) {
      return labelFunction(item, index);
    }
    return labelField ? item[labelField] : item;
  };

  const getValueField = (item: any, index: number) => {
    if (valueFunction) {
      return valueFunction(item, index);
    }
    return valueField ? item[valueField] : item;
  };

  return (
    <StyledOutline aria-disabled={props.disabled}>
      <StyledDropdown {...domProps}>
        {itemsCaption !== undefined ? (
          <StyledDropdownItem>{itemsCaption}</StyledDropdownItem>
        ) : undefined}
        {items &&
          items.map((item, index) => (
            <StyledDropdownItem key={index} value={getValueField(item, index)}>
              {getLabelField(item, index)}
            </StyledDropdownItem>
          ))}
      </StyledDropdown>
    </StyledOutline>
  );
};
