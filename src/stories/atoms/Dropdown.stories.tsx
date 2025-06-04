import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Dropdown } from '../../components/atoms';

const phoneticCodes = [
  {
    label: 'Alpha',
    value: 'Alpha',
  },
  {
    label: 'Bravo',
    value: 'Bravo',
  },
  {
    label: 'Charlie',
    value: 'Charlie',
  },
  {
    label: 'Delta',
    value: 'Delta',
  },
  {
    label: 'Echo',
    value: 'Echo',
  },
  {
    label: 'Foxtrot',
    value: 'Foxtrot',
  },
  {
    label: 'Golf',
    value: 'Golf',
  },
  {
    label: 'Hotel',
    value: 'Hotel',
  },
  {
    label: 'India',
    value: 'India',
  },
  {
    label: 'Juliet',
    value: 'Juliet',
  },
  {
    label: 'Kilo',
    value: 'Kilo',
  },
  {
    label: 'Lima',
    value: 'Lima',
  },
  {
    label: 'Mike',
    value: 'Mike',
  },
  {
    label: 'November',
    value: 'November',
  },
  {
    label: 'Oscar',
    value: 'Oscar',
  },
  {
    label: 'Papa',
    value: 'Papa',
  },
  {
    label: 'Quebec',
    value: 'Quebec',
  },
  {
    label: 'Romeo',
    value: 'Romeo',
  },
  {
    label: 'Sierra',
    value: 'Sierra',
  },
  {
    label: 'Tango',
    value: 'Tango',
  },
  {
    label: 'Uniform',
    value: 'Uniform',
  },
  {
    label: 'Victor',
    value: 'Victor',
  },
  {
    label: 'Whiskey',
    value: 'Whiskey',
  },
  {
    label: 'X-ray',
    value: 'X-ray',
  },
  {
    label: 'Yankee',
    value: 'Yankee',
  },
  {
    label: 'Zulu',
    value: 'Zulu',
  },
];

const meta: Meta<typeof Dropdown> = {
  title: 'atoms/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'select',
      options: [
        'Alpha',
        'Bravo',
        'Charlie',
        'Delta',
        'Echo',
        'Foxtrot',
        'Golf',
        'Hotel',
        'India',
        'Juliet',
        'Kilo',
        'Lima',
        'Mike',
        'November',
        'Oscar',
        'Papa',
        'Quebec',
        'Romeo',
        'Sierra',
        'Tango',
        'Uniform',
        'Victor',
        'Whiskey',
        'XRay',
        'Yankee',
        'Zulu',
      ],
    },
  },
};
export default meta;

type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
  render: (args) => <Dropdown {...args} />,
  args: {
    itemsCaption: 'choice value...',
    value: 'Alpha',
    disabled: false,
    items: phoneticCodes,
    labelField: 'label',
    valueField: 'value',
    onChange: action('Change!'),
  },
};
