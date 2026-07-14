import { faTags } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { CodeViewer } from "../../../storybook/code-viewer";
import { MultiSelect } from "../ui/index";
import cssSrc from "../ui/multi-select.module.css?raw";
import multiSelectSrc from "../ui/multi-select.tsx?raw";
import themeSrc from "../ui/theme.css?raw";

const FRAMEWORKS: { value: string; label: string; disabled?: boolean }[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid" },
  { value: "ember", label: "Ember", disabled: true },
];

const meta = {
  title: "Components/MultiSelect",
  component: MultiSelect,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    options: FRAMEWORKS,
    placeholder: "Select frameworks...",
    onChange: fn(),
    icon: <FontAwesomeIcon icon={faTags} />,
  },
} satisfies Meta<typeof MultiSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: { layout: "padded" },
  render: (args) => (
    <div>
      <div style={{ display: "flex", justifyContent: "center", padding: "32px 0" }}>
        <div style={{ width: "320px" }}>
          <MultiSelect {...args} />
        </div>
      </div>
      <CodeViewer
        files={[
          { name: "theme.css", content: themeSrc, language: "css" },
          { name: "multi-select.tsx", content: multiSelectSrc, language: "tsx" },
          { name: "multi-select.module.css", content: cssSrc, language: "css" },
        ]}
        zipName="multi-select"
      />
    </div>
  ),
};
