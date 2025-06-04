import styled from 'styled-components';

export const StyledItemLabel = styled.span`
  display: inline-flex;
  align-items: center;
  position: relative;
  color: rgba(102, 102, 102, 1);
  padding-left: 15px;
  height: 20px;
  font-weight: bold;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    margin: auto 0;
    background: transparent
      url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAMCAYAAACulacQAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAAB50RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNS4xqx9I6wAAAIZJREFUGJV1kEENxDAMBCeVAVRBUAg5BO0hqBQEpXKEIgVBAyUIogLIox8/rFy7r5Vsz1rrJLUZCEDt0VeMJh2cwMGgCajAD1gltXMcXkABZmCT1DZJbRmxGfjaCKdbB7DqdVb/hw024g2be/RO7LfArr4AiMHuQOjRf55KyD1691ZCGRu6AW3wKiyBh+ETAAAAAElFTkSuQmCC')
      left center no-repeat;
    background-size: 7px 12px;
    width: 7px;
    height: 100%;
  }

  &.complete::before {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAMCAYAAACulacQAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAAB50RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNS4xqx9I6wAAAH9JREFUGJV10EERgzAUhOEvDAKQUAlUAVQBFpCRa2+xEwUgBQl1kF5yyKRlTzvz3vv3zYYSTZhxheTSaKiDA7tOAy68sZTo6IcfnJiwlmgt0aPHZrzaiFC3diz1Olf/g53biDtsDkkY22+xVX/C2GA3zCF5/ishhyTclXD2DX0Bx1EmA0SgMSsAAAAASUVORK5CYII=');
  }
`;

interface Props {
  className?: string;
  label: string;
}

export const ItemLabel = (props: Props) => {
  return <StyledItemLabel {...props}>{props.label}</StyledItemLabel>;
};
