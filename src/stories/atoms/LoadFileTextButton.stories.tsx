import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { LoadFileTextButton } from '../../components/atoms';

const meta: Meta<typeof LoadFileTextButton> = {
  title: 'atoms/LoadFileTextButton',
  component: LoadFileTextButton,
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof LoadFileTextButton>;

export const Default: Story = {
  render: (args) => <LoadFileTextButton {...args} />,
  args: {
    accept: '.jpg, .jpeg, .png',
    children: 'LoadFileTextButton',
    disabled: false,
    onFileSelection: action('FileSelection!'),
  },
};
