# Select Component

A custom Select component built using `@base-ui/react`'s Combobox primitive. It supports search filtering out of the box, full keyboard accessibility, and uses standard CSS modules for styling.

## Installation

1. Make sure you have `@base-ui/react` installed in your project:
   ```bash
   pnpm add @base-ui/react
   ```
2. Copy the entire `select` folder into your project (e.g., `src/components/select`).

## Structure

- `index.ts`: Export file.
- `select.tsx`: Main component file.
- `select-trigger.tsx`: Subcomponent for the trigger button.
- `select-dropdown.tsx`: Subcomponent for the dropdown/popup menu.
- `theme.css`: **Design API!** Contains all design tokens (CSS variables) for the component. Edit this file to easily customize colors, borders, typography, etc.
- `select.module.css`: Base structural styles (container, label).
- `select-trigger.module.css`: Structural styles specific to the trigger.
- `select-dropdown.module.css`: Structural styles specific to the dropdown.

## Usage

```tsx
import { Select } from "./select";

const options = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "orange", label: "Orange", disabled: true },
];

export function MyForm() {
  return (
    <Select label="Choose a fruit" options={options} onChange={(value) => console.log(value)} />
  );
}
```
