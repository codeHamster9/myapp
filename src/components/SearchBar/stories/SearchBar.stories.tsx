import type { StoryObj, Meta } from '@storybook/react'

import SearchBar from '..'

type Story = StoryObj<typeof meta>

const meta = {
  title: 'Components/SearchBar',
  component: SearchBar,
} satisfies Meta<typeof SearchBar>

export default meta
export const Primary: Story = {
  args: {
    placeholder: 'SearchBar',
  },
}

// export const Default = Template.bind({})
// Default.args = {}

// export const WithPlaceholder = Template.bind({})
// WithPlaceholder.args = {
//   placeholder: 'Search for experiences...',
// }

// export const WithValue = Template.bind({})
// WithValue.args = {
//   value: 'Search query',
// }

// export const WithOnChange = Template.bind({})
// WithValue.args = {
//   onChange: (e: ChangeEvent<HTMLInputElement>) => console.log(e.target.value),
// }
