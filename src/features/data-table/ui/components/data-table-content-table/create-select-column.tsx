import type { ColumnDef } from "@tanstack/react-table";

import styles from "./create-select-column.module.css";

export function createSelectColumn<TData>(): ColumnDef<TData, unknown> {
  return {
    id: "select",
    size: 48,
    header: ({ table }) => (
      <input
        type="checkbox"
        className={styles.checkbox}
        checked={table.getIsAllPageRowsSelected() || table.getIsAllRowsSelected()}
        ref={(el) => {
          if (el) {
            el.indeterminate =
              table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected();
          }
        }}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
        aria-label="Selecionar todos"
        title="Selecionar todos"
      />
    ),
    cell: ({ row }) => (
      <div className={styles.checkboxCell}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          aria-label="Selecionar linha"
          title="Selecionar linha"
        />
      </div>
    ),
  };
}
