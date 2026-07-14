import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { CodeViewer } from "../../../storybook/code-viewer";
import { Select } from "../ui/index";
import cssSrc from "../ui/select.module.css?raw";
import selectSrc from "../ui/select.tsx?raw";
import themeSrc from "../ui/theme.css?raw";

const COUNTRIES: { value: string; label: string; disabled?: boolean }[] = [
  { value: "br", label: "Brasil" },
  { value: "us", label: "Estados Unidos" },
  { value: "pt", label: "Portugal" },
  { value: "ar", label: "Argentina" },
  { value: "de", label: "Alemanha", disabled: true },
  { value: "fr", label: "França" },
];

const meta = {
  title: "Components/Select",
  component: Select,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    options: COUNTRIES,
    placeholder: "Selecione um país...",
    onChange: fn(),
    icon: <FontAwesomeIcon icon={faGlobe} />,
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: { layout: "padded" },
  render: (args) => (
    <div>
      <div style={{ display: "flex", justifyContent: "center", padding: "32px 0" }}>
        <div style={{ width: "280px" }}>
          <Select {...args} />
        </div>
      </div>
      <CodeViewer
        files={[
          { name: "theme.css", content: themeSrc, language: "css" },
          { name: "select.tsx", content: selectSrc, language: "tsx" },
          { name: "select.module.css", content: cssSrc, language: "css" },
        ]}
        zipName="select"
      />
    </div>
  ),
};
