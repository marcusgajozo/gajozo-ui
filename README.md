# Gajozo UI

A copy-paste React component library. No npm package, no framework lock-in — just copy the component folder into your project.

## Philosophy

- **Copy-paste:** Each component is a self-contained folder with an `index.tsx` and a `*.module.css`. Copy it, use it.
- **Zero runtime deps:** Components depend only on React. No UI library, no shared utilities, no CSS-in-JS runtime.
- **Broad compatibility:** Targets React 16.8 (hooks era) through React 19 — no `useId`, no concurrent-only APIs, no RSC.
- **Accessible:** WAI-ARIA patterns, full keyboard navigation, and focus management included out of the box.
- **Themeable:** CSS custom properties for easy design token overrides.

## Stack

| Tool                | Version   | Purpose                    |
| ------------------- | --------- | -------------------------- |
| React               | 16.8 – 19 | UI library (peer dep only) |
| TypeScript          | ~6        | Type safety                |
| Vite                | 8         | Bundler & dev server       |
| CSS Modules         | —         | Scoped styles, no runtime  |
| Storybook           | 10        | Component explorer & docs  |
| Vitest + Playwright | 4         | Browser interaction tests  |

## Available Components

| Component     | Folder                       | Description                                                                |
| ------------- | ---------------------------- | -------------------------------------------------------------------------- |
| `Select`      | `src/registry/select/`       | Single-value dropdown with keyboard nav, label, and required state         |
| `MultiSelect` | `src/registry/multi-select/` | Multi-value dropdown with search, chips, clear-all, and max-selected limit |

## Getting Started

```bash
pnpm install
pnpm storybook         # dev server at http://localhost:6006
pnpm build-storybook   # static build → storybook-static/
```

## Using a Component

1. Open the component in Storybook.
2. Click **Copiar index.tsx** or **Copiar CSS** to copy individual files to the clipboard.
3. Or click **Baixar ZIP** to download both files as a zip archive.
4. Drop the files into your project and import the component.

No configuration or shared utilities needed — each component is entirely self-contained.

## Deployment

The Storybook static build can be served as a plain website:

```bash
# Build
docker build -t gajozo-ui .

# Run
docker run -p 8080:80 gajozo-ui
```

The `Dockerfile` uses a three-stage build (deps → Storybook build → nginx:alpine) for minimal image size.

## License

Apache License 2.0
