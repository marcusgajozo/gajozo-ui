import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test } from "vitest";

afterEach(() => {
  cleanup();
});

import { MultiSelect } from "../ui/multi-select";

const FRAMEWORKS = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid" },
  { value: "ember", label: "Ember", disabled: true },
];

describe("MultiSelect Component", () => {
  test("Basic component rendering", () => {
    render(<MultiSelect options={FRAMEWORKS} placeholder="Select frameworks..." />);
    expect(screen.getByRole("combobox")).toBeTruthy();
  });
});
