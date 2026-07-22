import { Menu } from "@base-ui/react/menu";
import * as React from "react";

import type { DataTableAction } from "../../hooks/use-create-action-column";
import styles from "./data-table-action-dropdown.module.css";

export interface DataTableActionDropdownProps<TData> {
  actions: DataTableAction<TData>[];
  row: TData;
}

export function DataTableActionDropdown<TData>({
  actions,
  row,
}: DataTableActionDropdownProps<TData>) {
  return (
    <Menu.Root>
      <Menu.Trigger
        className={styles.actionButton}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        aria-label="Ações"
        title="Ações"
      >
        <MoreVerticalIcon />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={4} align="end">
          <Menu.Popup className={styles.dropdownMenu}>
            {actions.map((action, index) => {
              const children = <span>{action.title}</span>;

              if (action.url) {
                return (
                  <Menu.Item
                    key={`btn-${index}`}
                    className={styles.dropdownItem}
                    title={action.title}
                    render={
                      // eslint-disable-next-line jsx-a11y/anchor-has-content
                      <a href={action.url} onClick={(e) => e.stopPropagation()} />
                    }
                  >
                    {children}
                  </Menu.Item>
                );
              }

              return (
                <Menu.Item
                  key={`btn-${index}`}
                  className={styles.dropdownItem}
                  title={action.title}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    if (action.onAction) {
                      action.onAction(row);
                    }
                  }}
                >
                  {children}
                </Menu.Item>
              );
            })}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

function MoreVerticalIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}
