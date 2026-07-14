import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
  parameters: {
    viewMode: "docs",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
  },
};

export default preview;
