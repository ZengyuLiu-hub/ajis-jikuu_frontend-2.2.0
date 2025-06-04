import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { RadioButton } from '../../components/atoms';

const meta: Meta<typeof RadioButton> = {
  title: 'atoms/RadioButton',
  component: RadioButton,
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof RadioButton>;

export const Default: Story = {
  render: (args) => (
    <>
      <RadioButton
        {...args}
        label="RadioButton1"
        value="1"
        defaultChecked={true}
      />
      <RadioButton {...args} label="RadioButton2" value="2" />
      <RadioButton {...args} label="RadioButton3" value="3" />
    </>
  ),
  args: {
    name: 'RadioButton',
    disabled: false,
    onChange: action('Change!'),
  },
};
