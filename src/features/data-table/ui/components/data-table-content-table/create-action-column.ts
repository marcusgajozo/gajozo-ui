import type { ColumnDef } from "@tanstack/react-table";
import { createElement } from "react";

import type { DataTableAction } from "../../hooks/use-create-action-column";
import { DataTableActionCell } from "../data-table-action-cell";

export function createActionColumn<TData>(
  actions: DataTableAction<TData>[]
): ColumnDef<TData, unknown> {
  return {
    id: "actions",
    size: 10,
    header: "Ações",
    cell: ({ row }) => createElement(DataTableActionCell<TData>, { actions, row: row.original }),
  };
}
