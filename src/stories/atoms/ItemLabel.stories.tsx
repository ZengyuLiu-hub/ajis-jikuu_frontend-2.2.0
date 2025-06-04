import type { Meta, StoryObj } from '@storybook/react';

import { ItemLabel } from '../../components/atoms';

const meta: Meta<typeof ItemLabel> = {
  title: 'atoms/ItemLabel',
  component: ItemLabel,
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof ItemLabel>;

export const Default: Story = {
  render: (args) => <ItemLabel {...args} />,
  args: {
    label: 'ItemLabel',
  },
};
