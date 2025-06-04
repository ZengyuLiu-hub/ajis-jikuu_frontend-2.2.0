import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { InputNumber } from '../../components/atoms';

const meta: Meta<typeof InputNumber> = {
  title: 'atoms/InputNumber',
  component: InputNumber,
  tags: ['autodocs'],
  argTypes: {
    nullBehavior: {
      description:
        '空値の場合の振る舞い(DEFAULT=標準の動作、NOTHING=何もしない)',
      control: 'select',
      options: [undefined, 'DEFAULT', 'NOTHING'],
    },
    value: {
      description: '利用する側から渡す初期値',
      table: {
        defaultValue: { summary: '0' },
        type: { summary: 'number | string' },
      },
    },
    onBlur: {
      description:
        '入力値が min または max を超えていた場合は min または max の値に補正',
    },
  },
};
export default meta;

type Story = StoryObj<typeof InputNumber>;

export const Default: Story = {
  render: (args: React.InputHTMLAttributes<HTMLInputElement>) => (
    <InputNumber {...args} />
  ),
  args: {
    value: 10,
    min: -100,
    max: 100,
    minLength: 1,
    maxLength: 9,
    disabled: false,
    onChange: action('Change!'),
    onBlur: action('Blur!'),
  },
};
