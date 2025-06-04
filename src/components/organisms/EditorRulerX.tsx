import styled from 'styled-components';

const RulerContainer = styled.div`
  overflow: hidden;
  display: ${(props) => `${props.theme.visible ? 'flex' : 'none'}`};
  flex-direction: row;
  background-color: rgba(255, 255, 255, 1);
  min-width: 0;
  max-width: 100%;
  width: 100%;
  height: 15px;
`;

const LargeScale = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  margin: 0;
  padding: 0;
  border: none;
  width: ${(props) =>
    `${props.theme.latticeWidth * 10 * props.theme.scaleRatio}px`};
  height: 15px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 15px;
    left: 0;
    background-color: rgba(0, 0, 0, 0.2);
    width: 1px;
    height: 15px;
  }

  > span {
    user-select: none;
    position: absolute;
    top: 0;
    left: 2px;
    color: rgba(0, 0, 0, 0.5);
    font-family: Arial, Helvetica, sans-serif;
    font-size: 10px;
    transform-origin: bottom left;
  }
`;

const SmallScale = styled.div`
  position: relative;
  width: ${(props) => `${props.theme.latticeWidth * props.theme.scaleRatio}px`};
  height: 15px;

  &:nth-child(1)::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 1px;
    height: 15px;
    background-color: rgba(80, 80, 80, 0.1);
  }

  &:nth-child(n + 2):nth-child(-n + 5)::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 1px;
    height: 5px;
    background-color: rgba(80, 80, 80, 0.1);
  }

  &:nth-child(6)::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 1px;
    height: 10px;
    background-color: rgba(80, 80, 80, 0.1);
  }

  &:nth-child(n + 7):nth-child(-n + 10)::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 1px;
    height: 5px;
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

export const EditorRulerX = (props: Props) => {
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
            <span>{d.text}</span>
          </LargeScale>
        );
      })}
    </RulerContainer>
  );
};
