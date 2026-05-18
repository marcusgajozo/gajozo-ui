import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within, expect, fn } from 'storybook/test';
import { Select } from './index';
import { CodeViewer } from '../../storybook/code-viewer';
import indexSrc from './index.tsx?raw';
import cssSrc from './select.module.css?raw';

const COUNTRIES: { value: string; label: string; disabled?: boolean }[] = [
  { value: 'br', label: 'Brasil' },
  { value: 'us', label: 'Estados Unidos' },
  { value: 'pt', label: 'Portugal' },
  { value: 'ar', label: 'Argentina' },
  { value: 'de', label: 'Alemanha', disabled: true },
  { value: 'fr', label: 'França' },
];

const meta = {
  title: 'Components/Select',
  component: Select,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    options: COUNTRIES,
    placeholder: 'Selecione um país...',
    onChange: fn(),
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default state with source code viewer. */
export const Default: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
        <div style={{ width: '280px' }}>
          <Select {...args} />
        </div>
      </div>
      <CodeViewer
        files={[
          { name: 'index.tsx', content: indexSrc, language: 'tsx' },
          { name: 'select.module.css', content: cssSrc, language: 'css' },
        ]}
        zipName="select"
      />
    </div>
  ),
};

/** Pre-selected value via `value` prop (controlled mode). */
export const WithPreselected: Story = {
  args: {
    value: 'br',
  },
};

/** Disabled component: trigger is muted and not interactive. */
export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'pt',
  },
};

/** Open the dropdown, click an option — trigger label updates and dropdown closes. */
export const Interactions: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('combobox'));
    expect(canvas.getByRole('listbox')).toBeTruthy();

    await userEvent.click(canvas.getByRole('option', { name: /^Brasil$/ }));

    expect(canvas.queryByRole('listbox')).toBeNull();
    expect(canvas.getByRole('combobox')).toHaveTextContent('Brasil');
  },
};

/** Keyboard-only: open → ArrowDown → Enter selects the focused option. */
export const KeyboardNavigation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const trigger = canvas.getByRole('combobox');
    trigger.focus();

    await userEvent.keyboard('{Enter}');
    expect(canvas.getByRole('listbox')).toBeTruthy();

    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{Enter}');

    expect(canvas.queryByRole('listbox')).toBeNull();
    expect(trigger).toHaveTextContent('Brasil');
  },
};

/** Escape closes the dropdown without selecting. */
export const EscapeClosesWithoutSelecting: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('combobox'));
    expect(canvas.getByRole('listbox')).toBeTruthy();

    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{Escape}');

    expect(canvas.queryByRole('listbox')).toBeNull();
    expect(canvas.getByRole('combobox')).toHaveTextContent('Selecione um país...');
  },
};

/** Width stays fixed at 100% of the parent regardless of which option is selected. */
export const FixedWidth: Story = {
  decorators: [
    Story => (
      <div style={{ width: '320px' }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const container = canvasElement.querySelector('[role="combobox"]')!.parentElement!;
    const widthBefore = container.getBoundingClientRect().width;

    await userEvent.click(canvas.getByRole('combobox'));
    await userEvent.click(canvas.getByRole('option', { name: /^Brasil$/ }));

    const widthAfter = container.getBoundingClientRect().width;
    expect(widthAfter).toBe(widthBefore);

    await userEvent.click(canvas.getByRole('combobox'));
    await userEvent.click(canvas.getByRole('option', { name: /^França$/ }));

    expect(container.getBoundingClientRect().width).toBe(widthBefore);
  },
};

/** Label renders above the trigger and is linked via aria-labelledby. */
export const WithLabel: Story = {
  args: {
    label: 'País de origem',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const label = canvas.getByText('País de origem');
    expect(label).toBeTruthy();
    expect(canvas.queryByText('*')).toBeNull();

    const combobox = canvas.getByRole('combobox');
    const labelId = label.getAttribute('id');
    expect(combobox.getAttribute('aria-labelledby')).toBe(labelId);
  },
};

/** Required shows a red asterisk after the label text. */
export const WithLabelRequired: Story = {
  args: {
    label: 'País de origem',
    required: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText('País de origem')).toBeTruthy();
    expect(canvas.getByText('*')).toBeTruthy();

    const combobox = canvas.getByRole('combobox');
    expect(combobox.getAttribute('aria-required')).toBe('true');
  },
};

/** Type in search to filter options, then clear to restore all. */
export const Searchable: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('combobox'));

    const searchInput = canvas.getByRole('searchbox');
    await userEvent.type(searchInput, 'por');

    const options = canvas.getAllByRole('option');
    expect(options.length).toBe(1);
    expect(options[0]).toHaveTextContent('Portugal');

    await userEvent.clear(searchInput);
    expect(canvas.getAllByRole('option').length).toBe(COUNTRIES.length);
  },
};

/** Disabled options cannot be selected. */
export const DisabledOption: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('combobox'));

    const disabledOption = canvas.getByRole('option', { name: /^Alemanha$/ });
    expect(disabledOption.getAttribute('aria-disabled')).toBe('true');

    await userEvent.click(disabledOption);
    expect(canvas.getByRole('combobox')).toHaveTextContent('Selecione um país...');
  },
};
