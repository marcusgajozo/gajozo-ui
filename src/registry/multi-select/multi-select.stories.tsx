import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within, expect, fn } from 'storybook/test';
import { MultiSelect } from './index';

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

/** Default state: trigger closed, placeholder visible. */
export const Default: Story = {};

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
