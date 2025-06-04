import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
`;

export const StyledRangeSlider = styled.input`
  appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 6px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #04aa6d;
    cursor: pointer;
  }
`;
StyledRangeSlider.defaultProps = {
  type: 'range',
};

const PlusMinusButton = styled.button`
  position: relative;
  display: inline-block;
  user-select: none;
  vertical-align: middle;
  border: none;
  background-color: transparent;
  width: 30px;
  height: 24px;
  line-height: 24px;
  text-decoration: none;
  cursor: pointer;

  &::after {
    position: absolute;
    margin: auto;
    color: rgba(255, 255, 255, 1);
    font-size: 1.5rem;
    font-weight: 700;
  }

  &.minus::after {
    top: 43%;
    left: 50%;
    transform: translate(-50%, -50%);
    content: '-';
  }

  &.plus::after {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    content: '+';
  }
`;

const Current = styled.span`
  display: inline-flex;
  height: 24px;
  line-height: 24px;
  color: #fff;
`;

interface Props {
  max: number;
  min: number;
  step: number;
  value: number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onClickIncremental?: React.MouseEventHandler<HTMLButtonElement>;
  onClickDecremental?: React.MouseEventHandler<HTMLButtonElement>;
}

export const RangeSlider = (props: Props) => {
  return (
    <Container>
      {props.onClickDecremental && (
        <PlusMinusButton className="minus" onClick={props.onClickDecremental} />
      )}
      <StyledRangeSlider
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        onChange={props.onChange}
      />
      {props.onClickIncremental && (
        <PlusMinusButton className="plus" onClick={props.onClickIncremental} />
      )}
      <Current>{props.value}</Current>
    </Container>
  );
};
