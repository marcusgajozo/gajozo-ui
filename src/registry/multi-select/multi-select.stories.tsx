import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within, expect, fn } from 'storybook/test';
import { MultiSelect } from './index';
import { CodeViewer } from '../../storybook/code-viewer';
import indexSrc from './index.tsx?raw';
import cssSrc from './multi-select.module.css?raw';

const FRAMEWORKS: { value: string; label: string; disabled?: boolean }[] = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'Solid' },
  { value: 'ember', label: 'Ember', disabled: true },
];

const meta = {
  title: 'Components/MultiSelect',
  component: MultiSelect,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    options: FRAMEWORKS,
    placeholder: 'Select frameworks...',
    onChange: fn(),
  },
} satisfies Meta<typeof MultiSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default state with source code viewer. */
export const Default: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
        <div style={{ width: '320px' }}>
          <MultiSelect {...args} />
        </div>
      </div>
      <CodeViewer
        files={[
          { name: 'index.tsx', content: indexSrc, language: 'tsx' },
          { name: 'multi-select.module.css', content: cssSrc, language: 'css' },
        ]}
        zipName="multi-select"
      />
    </div>
  ),
};

/** Pre-selected items passed via `value` (controlled mode). */
export const WithPreselected: Story = {
  args: {
    value: ['react', 'vue'],
  },
};

/** Disabled component: trigger is muted and not interactive. */
export const Disabled: Story = {
  args: {
    disabled: true,
    value: ['react'],
  },
};

/** Maximum of 2 items can be selected at once. */
export const MaxSelected: Story = {
  args: {
    maxSelected: 2,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('combobox'));

    await userEvent.click(canvas.getByRole('option', { name: /^React$/ }));
    await userEvent.click(canvas.getByRole('option', { name: /^Vue$/ }));

    expect(canvas.getByLabelText('Remove React')).toBeTruthy();
    expect(canvas.getByLabelText('Remove Vue')).toBeTruthy();

    const angularOption = canvas.getByRole('option', { name: /^Angular$/ });
    expect(angularOption.getAttribute('aria-disabled')).toBe('true');

    await userEvent.click(angularOption);
    expect(canvas.queryByLabelText('Remove Angular')).toBeNull();
  },
};

/** Open, select items by clicking, then deselect one. */
export const Interactions: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('combobox'));
    expect(canvas.getByRole('listbox')).toBeTruthy();

    await userEvent.click(canvas.getByRole('option', { name: /^React$/ }));
    expect(canvas.getByLabelText('Remove React')).toBeTruthy();

    await userEvent.click(canvas.getByRole('option', { name: /^Vue$/ }));
    expect(canvas.getByLabelText('Remove Vue')).toBeTruthy();

    await userEvent.click(canvas.getByRole('option', { name: /^React$/ }));
    expect(canvas.queryByLabelText('Remove React')).toBeNull();
  },
};

/** Keyboard-only navigation: open → ArrowDown → Space → Escape. */
export const KeyboardNavigation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const trigger = canvas.getByRole('combobox');
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    expect(canvas.getByRole('listbox')).toBeTruthy();

    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard(' ');
    expect(canvas.getByLabelText('Remove React')).toBeTruthy();

    await userEvent.keyboard('{Escape}');
    expect(canvas.queryByRole('listbox')).toBeNull();
  },
};

/** Type in search to filter options, then clear to restore all. */
export const Searchable: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('combobox'));

    const searchInput = canvas.getByRole('searchbox');
    await userEvent.type(searchInput, 'vue');

    const options = canvas.getAllByRole('option');
    expect(options.length).toBe(1);
    expect(options[0]).toHaveTextContent('Vue');

    await userEvent.clear(searchInput);
    expect(canvas.getAllByRole('option').length).toBe(FRAMEWORKS.length);
  },
};

/** Width stays fixed at 100% of the parent regardless of how many items are selected. */
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
    await userEvent.click(canvas.getByRole('option', { name: /^React$/ }));
    await userEvent.click(canvas.getByRole('option', { name: /^Vue$/ }));
    await userEvent.click(canvas.getByRole('option', { name: /^Angular$/ }));
    await userEvent.keyboard('{Escape}');

    const widthAfter = container.getBoundingClientRect().width;
    expect(widthAfter).toBe(widthBefore);
  },
};

/** Label renders above the trigger and is linked via aria-labelledby. */
export const WithLabel: Story = {
  args: {
    label: 'Frameworks favoritos',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const label = canvas.getByText('Frameworks favoritos');
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
    label: 'Frameworks favoritos',
    required: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText('Frameworks favoritos')).toBeTruthy();
    expect(canvas.getByText('*')).toBeTruthy();

    const combobox = canvas.getByRole('combobox');
    expect(combobox.getAttribute('aria-required')).toBe('true');
  },
};

/** Select items, then clear all with the × button. */
export const ClearAll: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('combobox'));
    await userEvent.click(canvas.getByRole('option', { name: /^React$/ }));
    await userEvent.click(canvas.getByRole('option', { name: /^Vue$/ }));

    await userEvent.keyboard('{Escape}');

    const clearBtn = canvas.getByLabelText('Clear all');
    await userEvent.click(clearBtn);

    expect(canvas.queryByLabelText('Remove React')).toBeNull();
    expect(canvas.queryByLabelText('Remove Vue')).toBeNull();
    expect(canvas.getByText('Select frameworks...')).toBeTruthy();
  },
};
