import { type ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import * as React from "react";

import { type DataTableAction, useCreateActionColumn } from "../../hooks/use-create-action-column";
import { useCreateSelectColumn } from "../../hooks/use-create-select-column";
import { DataTableContext } from "../data-table-context";
import { Table } from "../table";

export interface DataTableProps<TData = unknown, TValue = unknown> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalItems?: number;
  onSelectRow?: (rows: TData[]) => void;
  actionColumn?: DataTableAction<TData>[];
  optionsPerPage?: number[];
  isLoading?: boolean;
}

export interface DataTableContentTableProps<TData, TValue> extends Omit<
  DataTableProps<TData, TValue>,
  "totalItems" | "optionsPerPage" | "isLoading"
> {
  children: React.ReactNode;
}

export function DataTableContentTable<TData, TValue>({
  columns,
  data,
  onSelectRow,
  actionColumn,
  children,
}: DataTableContentTableProps<TData, TValue>) {
  const getSelectColumn = useCreateSelectColumn<TData>();
  const getActionColumn = useCreateActionColumn<TData>();

  const finalColumns = React.useMemo(() => {
    let cols = [...columns];
    if (onSelectRow) {
      cols = [getSelectColumn(), ...cols];
    }
    if (actionColumn && actionColumn.length > 0) {
      cols = [...cols, getActionColumn(actionColumn)];
    }
    return cols;
  }, [columns, onSelectRow, actionColumn, getSelectColumn, getActionColumn]);

  const [rowSelection, setRowSelection] = React.useState({});
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: finalColumns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  const selectedRows = table.getSelectedRowModel().rows;

  React.useEffect(() => {
    if (onSelectRow) {
      onSelectRow(selectedRows.map((r) => r.original));
    }
  }, [selectedRows, onSelectRow]);

  const tableState = table.getState();

  const contextValue = React.useMemo(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => ({ table, columns: finalColumns }) as any,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table, finalColumns, tableState]
  );

  return (
    <DataTableContext.Provider value={contextValue}>
      <Table>{children}</Table>
    </DataTableContext.Provider>
  );
}
