import React from 'react';
import styled from 'styled-components';

import { Modal, Props as ModalProps, BlueStyles } from '../molecules/Modal';

const Description = styled.article`
  position: relative;
  display: flex;
  margin-bottom: 10px;

  &.blue {
    > div:first-child::before {
      background-color: rgba(0, 174, 238, 1);
    }
  }

  &.orange {
    > div:first-child::before {
      background-color: rgba(255, 120, 0, 1);
    }
  }

  div {
    display: grid;
    grid-auto-rows: auto;
    grid-row-gap: 3px;

    p {
      display: flex;
      align-items: center;
      margin: 0;
      padding-right: 15px;
      white-space: pre-wrap;
      word-wrap: break-word;
      min-height: 24px;
    }
  }
`;

const DescriptionSymbol = styled.div`
  position: relative;
  margin-right: 6px;
  width: 24px;
  height: 24px;

  &::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    background-color: rgba(0, 174, 238, 1);
    width: 20px;
    height: 20px;
  }

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
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12h13M12 5l7 7-7 7'/%3E%3C/svg%3E");
    background-size: 18px 18px;
  }
`;

export const ModalContent = styled.div`
  overflow: auto;
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0 10px;
`;

export const ModalCommands = styled.div`
  display: flex;
  flex: none;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;

  &:not(:empty) {
    margin-top: 25px;
  }

  &.single {
    justify-content: center;
  }
`;

interface Props extends ModalProps {
  description?: string;
  children: React.ReactNode;
  zIndex?: number;
}

export const ModalTemplate = (props: Props) => {
  const styles = props.zIndex
    ? {
        ...BlueStyles,
        overlay: { ...BlueStyles.overlay, zIndex: props.zIndex },
      }
    : BlueStyles;

  return (
    <Modal {...props} style={styles}>
      {props.description && (
        <Description className="blue">
          <DescriptionSymbol></DescriptionSymbol>
          <div>
            {props.description.split('\n\n').map((text, i) => (
              <p key={i}>
                <span>{text}</span>
              </p>
            ))}
          </div>
        </Description>
      )}

      {props.children}
    </Modal>
  );
};
