import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { NavigateLinkButton } from '../../components/molecules';

const meta: Meta<typeof NavigateLinkButton> = {
  title: 'molecules/NavigateLinkButton',
  component: NavigateLinkButton,
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof NavigateLinkButton>;

export const Default: Story = {
  render: (args) => (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<NavigateLinkButton {...args} />} />
      </Routes>
    </MemoryRouter>
  ),
  args: {
    label: 'NavigateLinkButton',
    disabled: false,
    onClick: action('Click!'),
  },
};
