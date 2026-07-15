import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import { Select } from "../ui/select";

const COUNTRIES = [
  { value: "br", label: "Brasil" },
  { value: "us", label: "Estados Unidos" },
  { value: "pt", label: "Portugal" },
  { value: "ar", label: "Argentina" },
  { value: "de", label: "Alemanha", disabled: true },
  { value: "fr", label: "França" },
];

describe("Select Component", () => {
  test("Interactions: opens and selects an option", async () => {
    const user = userEvent.setup();
    render(<Select options={COUNTRIES} placeholder="Selecione..." onChange={vi.fn()} />);

    const combobox = screen.getByRole("combobox");
    await user.click(combobox);

    expect(screen.getByRole("listbox")).toBeTruthy();

    await user.click(screen.getByRole("option", { name: /^Brasil$/ }));

    expect(screen.queryByRole("listbox")).toBeNull();
    expect(combobox.textContent).toContain("Brasil");
  });

  test("Keyboard Navigation", async () => {
    const user = userEvent.setup();
    render(<Select options={COUNTRIES} placeholder="Selecione..." onChange={vi.fn()} />);

    const combobox = screen.getByRole("combobox");
    combobox.focus();

    await user.keyboard("{Enter}");
    expect(screen.getByRole("listbox")).toBeTruthy();

    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");

    expect(screen.queryByRole("listbox")).toBeNull();
    expect(combobox.textContent).toContain("Brasil");
  });

  test("Escape closes without selecting", async () => {
    const user = userEvent.setup();
    render(<Select options={COUNTRIES} placeholder="Selecione..." onChange={vi.fn()} />);

    const combobox = screen.getByRole("combobox");
    await user.click(combobox);
    expect(screen.getByRole("listbox")).toBeTruthy();

    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("listbox")).toBeNull();
    expect(combobox.textContent).toContain("Selecione...");
  });

  test("With Label", () => {
    render(<Select options={COUNTRIES} placeholder="Selecione..." label="País de origem" />);

    const label = screen.getByText("País de origem");
    expect(label).toBeTruthy();

    const combobox = screen.getByRole("combobox");
    expect(combobox.getAttribute("aria-labelledby")).toBe(label.getAttribute("id"));
  });

  test("With Label Required", () => {
    render(
      <Select options={COUNTRIES} placeholder="Selecione..." label="País de origem" required />
    );

    expect(screen.getByText("País de origem")).toBeTruthy();
    expect(screen.getByText("*")).toBeTruthy();

    const combobox = screen.getByRole("combobox");
    expect(combobox.getAttribute("aria-required")).toBe("true");
  });

  test("Searchable", async () => {
    const user = userEvent.setup();
    render(<Select options={COUNTRIES} placeholder="Selecione..." />);

    await user.click(screen.getByRole("combobox"));

    const searchInput = screen.getByRole("searchbox");
    await user.type(searchInput, "por");

    const options = screen.getAllByRole("option");
    expect(options.length).toBe(1);
    expect(options[0].textContent).toContain("Portugal");

    await user.clear(searchInput);
    expect(screen.getAllByRole("option").length).toBe(COUNTRIES.length);
  });

  test("Disabled Option", async () => {
    const user = userEvent.setup();
    render(<Select options={COUNTRIES} placeholder="Selecione..." />);

    await user.click(screen.getByRole("combobox"));

    const disabledOption = screen.getByRole("option", { name: /^Alemanha$/ });
    expect(disabledOption.getAttribute("aria-disabled")).toBe("true");

    await user.click(disabledOption);
    expect(screen.getByRole("combobox").textContent).toContain("Selecione...");
  });
});
