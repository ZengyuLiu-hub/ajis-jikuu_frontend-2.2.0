import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactModal from 'react-modal';
import styled from 'styled-components';
import classNames from 'classnames';

import { DialogType, DialogTypes } from '../../types';

import { Button } from '../atoms';
import { Modal, BlueStyles, OrangeStyles } from '../molecules';

const Symbol = styled.div`
  position: relative;
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

const MessageArea = styled.div`
  position: relative;
  display: flex;
  padding: 0 15px 15px 5px;

  &.blue {
    ${Symbol}::before {
      background-color: rgba(0, 174, 238, 1);
    }
  }

  &.orange {
    ${Symbol}::before {
      background-color: rgba(255, 120, 0, 1);
    }
  }
`;

const Messages = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-column-gap: 6px;

  p {
    margin: 0;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
`;

const Commands = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 15px;

  button {
    min-width: 80px;
    height: 25px;

    & + button {
      margin-left: 20px;
    }
  }
`;

interface MessageProps {
  type: DialogType;
  message: string;
}
const MessageContent = React.memo((props: MessageProps) => (
  <MessageArea
    className={classNames({
      orange: props.type === DialogTypes.ERROR,
      blue:
        props.type === DialogTypes.INFORMATION ||
        props.type === DialogTypes.CONFIRM,
    })}
  >
    <Messages>
      <Symbol></Symbol>
      <p>{props.message}</p>
    </Messages>
  </MessageArea>
));

interface CommandProps {
  type: DialogType;
  positiveAction?(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  negativeAction?(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}
const CommandContent = React.memo((props: CommandProps) => {
  const [t] = useTranslation();

  return (
    <Commands>
      <Button onClick={props.positiveAction}>
        {t('organisms:alertDialog.positiveButton')}
      </Button>
      {props.type === DialogTypes.CONFIRM && (
        <Button onClick={props.negativeAction}>
          {t('organisms:alertDialog.negativeButton')}
        </Button>
      )}
    </Commands>
  );
});

interface Props extends ReactModal.Props {
  type: DialogType;
  message: string;
  onRequestClose(e: React.MouseEvent | React.KeyboardEvent): void;
  positiveAction?(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  negativeAction?(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

/**
 * ダイアログ
 */
export const AlertDialog = (props: Props) => {
  const { type, message } = props;

  const [t] = useTranslation();

  const CustomStyles =
    type === DialogTypes.ERROR
      ? { ...OrangeStyles, overlay: { ...OrangeStyles.overlay, zIndex: 100 } }
      : { ...BlueStyles, overlay: { ...BlueStyles.overlay, zIndex: 100 } };

  return (
    <Modal
      {...props}
      title={t(`organisms:alertDialog.title.${type}`)}
      style={CustomStyles}
    >
      <MessageContent type={type} message={message} />
      <CommandContent
        type={type}
        positiveAction={props.positiveAction}
        negativeAction={props.negativeAction}
      />
    </Modal>
  );
};
