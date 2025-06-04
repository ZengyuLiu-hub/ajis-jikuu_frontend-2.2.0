import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { UploadTextButton } from '../../components/atoms';

const meta: Meta<typeof UploadTextButton> = {
  title: 'atoms/UploadTextButton',
  component: UploadTextButton,
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof UploadTextButton>;

export const Default: Story = {
  render: (args) => <UploadTextButton {...args} />,
  args: {
    children: 'Upload',
    disabled: false,
    onFileSelection: action('FileSelection!'),
  },
};
