import type { ColumnDef, Table as ReactTableType } from "@tanstack/react-table";
import { createContext, useContext } from "react";

export interface DataTableContextValue<TData, TValue> {
  table: ReactTableType<TData>;
  columns: ColumnDef<TData, TValue>[];
}

const DataTableContext = createContext<DataTableContextValue<unknown, unknown> | undefined>(
  undefined
);

export function useDataTableContext<TData, TValue>() {
  const context = useContext(DataTableContext);
  if (!context) {
    throw new Error("DataTable components must be used within a DataTable.ContentTable");
  }
  return context as unknown as DataTableContextValue<TData, TValue>;
}

export { DataTableContext };
