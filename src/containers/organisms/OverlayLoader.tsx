import styled from 'styled-components';
import ClipLoader from 'react-spinners/ClipLoader';

import { useAppState } from '../../selectors';

const Wrapper = styled.div`
  display: none;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 10;

  &:not(:empty) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const OverlayLoader = () => {
  const { loading } = useAppState();

  return (
    <Wrapper>
      <ClipLoader size={55} color={'#123abc'} loading={loading} />
    </Wrapper>
  );
};
