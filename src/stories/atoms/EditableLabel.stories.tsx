import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import styled from 'styled-components';

import { EditableLabel } from '../../components/atoms';

const Outline = styled.div`
  .red {
    background-color: red;
    color: black;
  }
  .green {
    background-color: green;
    color: black;
  }
  .blue {
    background-color: blue;
    color: white;
  }
  .black {
    background-color: black;
    color: white;
  }
`;

const meta: Meta<typeof EditableLabel> = {
  title: 'atoms/EditableLabel',
  component: EditableLabel,
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof EditableLabel>;

export const Default: Story = {
  render: (args) => (
    <Outline>
      <EditableLabel {...args} />
    </Outline>
  ),
  args: {
    className: '',
    value: 'EditableLabel',
    onChange: action('Change!'),
  },
};
