import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import styled from 'styled-components';

import { MainMenu } from '../../components/molecules';

const Wrapper = styled.header`
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: 1fr;
  grid-column-gap: 10px;
  padding: 0 15px 0 10px;
  background-color: rgba(40, 40, 40, 1);
  height: 30px;
`;

const Header = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

const meta: Meta<typeof MainMenu> = {
  title: 'molecules/MainMenu',
  component: MainMenu,
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof MainMenu>;

export const Default: Story = {
  render: (args) => (
    <Wrapper>
      <Header>
        <MainMenu {...args} />
      </Header>
    </Wrapper>
  ),
  args: {
    onClickMenu: action('Click!'),
  },
};
