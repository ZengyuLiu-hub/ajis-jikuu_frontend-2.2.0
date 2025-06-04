import ReactModal from 'react-modal';
import styled from 'styled-components';

export const BlueStyles: ReactModal.Styles = {
  overlay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: '100vw',
    height: '100vh',
  },
  content: {
    position: 'static',
    color: 'lightsteelblue',
    padding: '4px',
    backgroundColor: 'rgba(6, 118, 222, 1)',
    border: 'none',
    borderRadius: '5px',
    minWidth: '300px',
    maxWidth: '100vw',
    minHeight: '100px',
    maxHeight: '100vh',
    boxShadow: '3px 3px 10px rgba(0, 0, 0, 0.3)',
  },
};

export const OrangeStyles: ReactModal.Styles = {
  overlay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: '100vw',
    height: '100vh',
  },
  content: {
    position: 'static',
    color: 'lightsteelblue',
    padding: '4px',
    backgroundColor: 'rgba(255, 120, 0, 1)',
    border: 'none',
    borderRadius: '5px',
    minWidth: '300px',
    maxWidth: '100vw',
    minHeight: '100px',
    maxHeight: '100vh',
    boxShadow: '3px 3px 10px rgba(0, 0, 0, 0.3)',
  },
};

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0;
  padding: 0 8px 0 0;
  height: 30px;
  background-color: transparent;
  color: white;

  > span {
    position: relative;
    display: flex;
    align-items: center;
    padding-left: 18px;
    height: 24px;
    color: rgba(255, 255, 255, 1);
    font-size: 15px;
    font-weight: bold;

    &::before {
      content: '';
      position: absolute;
      top: 3px;
      bottom: 3px;
      left: 10px;
      background: white;
      width: 2px;
    }
  }
`;

const CloseButton = styled.button.attrs({
  type: 'button',
})`
  margin: 0;
  padding: 0;
  background-color: transparent;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 12px 12px;
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 512 512' style='width: 32px; height: 32px; opacity: 1;' xml:space='preserve'%3E%3Cstyle type='text/css'%3E.st0{fill:%234B4B4B;}%3C/style%3E%3Cg%3E%3Cpolygon class='st0' points='512,52.535 459.467,0.002 256.002,203.462 52.538,0.002 0,52.535 203.47,256.005 0,459.465 52.533,511.998 256.002,308.527 459.467,511.998 512,459.475 308.536,256.005 	' style='fill: rgb(255, 255, 255);'%3E%3C/polygon%3E%3C/g%3E%3C/svg%3E");
  border: none;
  width: 12px;
  height: 12px;
  color: rgba(255, 255, 255, 1);

  &:hover {
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 512 512' style='width: 32px; height: 32px; opacity: 1;' xml:space='preserve'%3E%3Cstyle type='text/css'%3E.st0{fill:%234B4B4B;}%3C/style%3E%3Cg%3E%3Cpolygon class='st0' points='512,52.535 459.467,0.002 256.002,203.462 52.538,0.002 0,52.535 203.47,256.005 0,459.465 52.533,511.998 256.002,308.527 459.467,511.998 512,459.475 308.536,256.005 	' style='fill: rgb(204, 204, 204);'%3E%3C/polygon%3E%3C/g%3E%3C/svg%3E");
    cursor: pointer;
  }

  &:focus {
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg version='1.1' id='_x32_' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 512 512' style='width: 32px; height: 32px; opacity: 1;' xml:space='preserve'%3E%3Cstyle type='text/css'%3E.st0{fill:%234B4B4B;}%3C/style%3E%3Cg%3E%3Cpolygon class='st0' points='512,52.535 459.467,0.002 256.002,203.462 52.538,0.002 0,52.535 203.47,256.005 0,459.465 52.533,511.998 256.002,308.527 459.467,511.998 512,459.475 308.536,256.005 	' style='fill: rgb(153, 153, 153);'%3E%3C/polygon%3E%3C/g%3E%3C/svg%3E");
    outline: 0;
  }
`;

const Body = styled.section`
  overflow: auto;
  position: relative;
  margin: 0;
  padding: 15px 5px;
  background: rgba(255, 255, 255, 1);
  border-radius: 0 0 5px 5px;
  max-width: calc(100vw - 8px);
  max-height: calc(100vh - 38px);
`;

export interface Props extends ReactModal.Props {
  title: string;
  style?: ReactModal.Styles;
  enableCloseButton?: boolean;
}

export const Modal = (props: Props) => {
  const { enableCloseButton = true } = props;

  const onRequestClose = (e: React.KeyboardEvent<HTMLElement>) => {
    const pressKey = e.code?.toLowerCase();
    if (pressKey === 'escape' && props.onRequestClose) {
      props.onRequestClose(e);
    }
  };

  return (
    <ReactModal
      isOpen={props.isOpen}
      style={props.style ? props.style : BlueStyles}
      onAfterOpen={props.onAfterOpen}
      contentLabel={props.contentLabel}
      className={props.className}
      onRequestClose={onRequestClose}
    >
      <Header>
        <span>{props.title}</span>
        {enableCloseButton && <CloseButton onClick={props.onRequestClose} />}
      </Header>
      <Body>{props.children}</Body>
    </ReactModal>
  );
};
