import React from 'react';
import styled from 'styled-components';

const RulerContainer = styled.div`
  overflow: hidden;
  display: ${(props) => `${props.theme.visible ? 'flex' : 'none'}`};
  flex-direction: column;
  background-color: rgba(255, 255, 255, 1);
  width: 15px;
  min-height: 0;
  max-height: 100%;
  height: 100%;
`;

const LargeScale = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  border: none;
  width: 15px;
  height: ${(props) =>
    `${props.theme.latticeWidth * 10 * props.theme.scaleRatio}px`};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.2);
    width: 15px;
    height: 1px;
  }

  > span {
    user-select: none;
    position: absolute;
    display: inline-block;
    top: -9px;
    left: 0;
    color: rgba(0, 0, 0, 0.5);
    font-family: Arial, Helvetica, sans-serif;
    font-size: 10px;
    transform-origin: bottom left;
    transform: rotate(90deg);
  }
`;

const SmallScale = styled.div`
  position: relative;
  width: 15px;
  height: ${(props) =>
    `${props.theme.latticeWidth * props.theme.scaleRatio}px`};

  &:nth-child(1)::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 15px;
    height: 1px;
    background-color: rgba(80, 80, 80, 0.1);
  }

  &:nth-child(n + 2):nth-child(-n + 5)::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 5px;
    height: 1px;
    background-color: rgba(80, 80, 80, 0.1);
  }

  &:nth-child(6)::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 10px;
    height: 1px;
    background-color: rgba(80, 80, 80, 0.1);
  }

  &:nth-child(n + 7):nth-child(-n + 10)::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 5px;
    height: 1px;
    background-color: rgba(80, 80, 80, 0.1);
  }
`;

interface Props {
  containerRef: any;
  latticeSize: number;
  stageScale: number;
  scales: any[];
  visible: boolean;
}

export const EditorRulerY = (props: Props) => {
  RulerContainer.defaultProps = {
    theme: {
      visible: props.visible,
    },
  };

  LargeScale.defaultProps = {
    theme: {
      latticeWidth: props.latticeSize,
      scaleRatio: props.stageScale / 100,
    },
  };

  SmallScale.defaultProps = {
    theme: {
      latticeWidth: props.latticeSize,
      scaleRatio: props.stageScale / 100,
    },
  };

  return (
    <RulerContainer ref={props.containerRef}>
      {props.scales.map((d, i) => {
        return (
          <LargeScale key={i}>
            <SmallScale></SmallScale>
            <SmallScale></SmallScale>
            <SmallScale></SmallScale>
            <SmallScale></SmallScale>
            <SmallScale></SmallScale>
            <SmallScale></SmallScale>
            <SmallScale></SmallScale>
            <SmallScale></SmallScale>
            <SmallScale></SmallScale>
            <SmallScale></SmallScale>
            <span>{d.text.length === 1 ? ` ${d.text}` : `${d.text}`}</span>
          </LargeScale>
        );
      })}
    </RulerContainer>
  );
};
