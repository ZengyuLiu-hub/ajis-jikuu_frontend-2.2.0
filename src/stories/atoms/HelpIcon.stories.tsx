import type { Meta, StoryObj } from '@storybook/react';

import { HelpIcon } from '../../components/atoms';

const meta: Meta<typeof HelpIcon> = {
  title: 'atoms/HelpIcon',
  component: HelpIcon,
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof HelpIcon>;

export const Default: Story = {
  render: (args) => <HelpIcon {...args} />,
  args: {
    message: 'ヘルプメッセージ',
  },
};
