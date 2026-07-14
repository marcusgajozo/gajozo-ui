# MultiSelect Component

A custom MultiSelect component built using `@base-ui/react`'s Combobox primitive. It supports search filtering out of the box, full keyboard accessibility, and uses standard CSS modules for styling.

## Installation

1. Make sure you have `@base-ui/react` installed in your project:
   ```bash
   pnpm add @base-ui/react
   ```
2. Copy the entire `multi-select` folder into your project (e.g., `src/components/multi-select`).

## Structure

- `index.ts`: Export file.
- `multi-select.tsx`: Main component file.
- `multi-select-trigger.tsx`: Subcomponent for the trigger button and chips.
- `multi-select-dropdown.tsx`: Subcomponent for the dropdown/popup menu and search.
- `theme.css`: **Design API!** Contains all design tokens (CSS variables) for the component. Edit this file to easily customize colors, borders, typography, etc.
- `multi-select.module.css`: Base structural styles (container, label).
- `multi-select-trigger.module.css`: Structural styles specific to the trigger.
- `multi-select-dropdown.module.css`: Structural styles specific to the dropdown.

## Usage

```tsx
import { MultiSelect } from "./multi-select";

const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular", disabled: true },
];

export function MyForm() {
  return (
    <MultiSelect
      label="Choose frameworks"
      options={options}
      onChange={(value) => console.log(value)}
      maxSelected={2}
    />
  );
}
```
