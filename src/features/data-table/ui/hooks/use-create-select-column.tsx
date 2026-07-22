import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

import styles from "./use-create-select-column.module.css";

export function useCreateSelectColumn<TData>() {
  return useMemo(
    () => (): ColumnDef<TData, unknown> => ({
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
          />
        </div>
      ),
    }),
    []
  );
}
