import "../ui/theme.css";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import { DataTableActionDropdown } from "../ui/components/data-table-action-dropdown/data-table-action-dropdown";

describe("DataTableActionDropdown", () => {
  test("renders trigger and opens menu, handles hover states properly", async () => {
    const user = userEvent.setup();
    const actions = [
      { title: "Editar", onAction: () => {} },
      { title: "Excluir", onAction: () => {} },
    ];

    render(<DataTableActionDropdown actions={actions} row={{ id: "1" }} />);

    const trigger = screen.getByRole("button", { name: "Ações" });
    expect(trigger).toBeTruthy();

    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeTruthy();
    });

    const menu = screen.getByRole("menu");
    expect(menu).toBeTruthy();

    const menuItems = screen.getAllByRole("menuitem");
    expect(menuItems).toHaveLength(2);

    expect(menuItems[0].className).toContain("dropdownItem");

    await user.keyboard("{ArrowDown}");

    await waitFor(() => {
      expect(menuItems[0].getAttribute("data-highlighted")).not.toBeNull();
    });
  });
});
