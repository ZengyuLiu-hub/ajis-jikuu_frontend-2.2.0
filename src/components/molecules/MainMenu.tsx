import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const StyledMenu = styled.nav`
  ul {
    padding: 0;
    font-size: 0;
    list-style-type: none;

    li {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 30px;
      line-height: 30px;
      font-size: 1rem;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);

      display: inline-block;
      padding: 0 15px;
      position: relative;

      &:hover {
        cursor: pointer;
        background-color: rgba(210, 215, 211, 1);
        color: rgba(0, 0, 0, 1);
      }
    }
  }
`;

interface Props {
  onClickMenu(): void;
}

export const MainMenu = (props: Props) => {
  const [t] = useTranslation();

  return (
    <StyledMenu>
      <ul>
        <li onClick={() => props.onClickMenu()}>
          {t('molecules:MainMenu.search.label')}
        </li>
      </ul>
    </StyledMenu>
  );
};
