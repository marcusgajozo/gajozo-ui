# Reusable UI Components

A copy-paste React component library. No npm package, no framework lock-in — just copy the component folder into your project.

## Philosophy

- **Copy-paste:** Each component is a self-contained folder with an `index.tsx` and a `*.module.css`. Copy it, use it.
- **Zero runtime deps:** Components depend only on React and headless utilities (like `@base-ui/react`). No heavy UI libraries, no shared utilities, no CSS-in-JS runtime.
- **Accessible:** WAI-ARIA patterns, full keyboard navigation, and focus management included out of the box.
- **Themeable:** CSS Modules alongside custom properties for easy design token overrides.
- **Composition:** We use the composition pattern to keep your UI adaptable.

## Stack

| Tool                | Purpose                    |
| ------------------- | -------------------------- |
| React               | UI library (peer dep only) |
| TypeScript          | Type safety                |
| Vite                | Bundler & dev server       |
| CSS Modules         | Scoped styles, no runtime  |
| Storybook           | Component explorer & docs  |
| Vitest + Playwright | Browser interaction tests  |

## Available Components

| Component     | Folder                       | Description                                                                |
| ------------- | ---------------------------- | -------------------------------------------------------------------------- |
| `Select`      | `src/features/select/`       | Single-value dropdown with keyboard nav, label, and required state         |
| `MultiSelect` | `src/features/multi-select/` | Multi-value dropdown with search, chips, clear-all, and max-selected limit |
| `Modal`       | `src/features/modal/`        | Overlaid accessible dialog with local or global state management (Zustand) |

## Getting Started

```bash
pnpm install
pnpm storybook         # dev server at http://localhost:6006
pnpm build-storybook   # static build → storybook-static/
```

## Using a Component

1. Open the component in Storybook.
2. Check the Code Viewer tab to view the source code.
3. Install the dependencies for the component if it has any (e.g. `@base-ui/react`).
4. Drop the files into your project and import the component.

No configuration or shared utilities needed — each component is entirely self-contained.

## Deployment

The Storybook static build can be served as a plain website:

```bash
# Build
docker build -t reusable-ui-components .

# Run
docker run -p 8080:80 reusable-ui-components
```

The `Dockerfile` uses a three-stage build (deps → Storybook build → nginx:alpine) for minimal image size.

## License

Apache License 2.0
