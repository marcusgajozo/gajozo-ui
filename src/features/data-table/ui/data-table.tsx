import "./theme.css";

import type { ColumnDef, Table as ReactTableType } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { createContext, useContext } from "react";

import styles from "./data-table.module.css";
import { DataTablePagination } from "./data-table-pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import type { DataTableAction } from "./use-create-action-column";

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalItems?: number;
  onSelectRow?: (rows: TData[]) => void;
  actionColumn?: DataTableAction<TData>[];
}

interface DataTableContextValue<TData, TValue> {
  table: ReactTableType<TData>;
  columns: ColumnDef<TData, TValue>[];
}

const DataTableContext = createContext<DataTableContextValue<unknown, unknown> | undefined>(
  undefined
);

export function useDataTableContext<TData, TValue>() {
  const context = useContext(DataTableContext);
  if (!context) {
    throw new Error("DataTable components must be used within a DataTable.Root");
  }
  return context as unknown as DataTableContextValue<TData, TValue>;
}

export interface DataTableRootProps<TData, TValue> extends Omit<
  DataTableProps<TData, TValue>,
  "totalItems"
> {
  children: React.ReactNode;
}

function DataTableRoot<TData, TValue>({
  columns,
  data,
  onSelectRow,
  actionColumn,
  children,
}: DataTableRootProps<TData, TValue>) {
  const finalColumns = React.useMemo(() => {
    let cols = [...columns];
    if (onSelectRow) {
      cols = [getSelectColumn<TData>(), ...cols];
    }
    if (actionColumn && actionColumn.length > 0) {
      cols = [...cols, getActionColumn<TData>(actionColumn)];
    }
    return cols;
  }, [columns, onSelectRow, actionColumn]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: finalColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const selectedRows = table.getSelectedRowModel().rows;

  React.useEffect(() => {
    if (onSelectRow) {
      onSelectRow(selectedRows.map((r) => r.original));
    }
  }, [selectedRows, onSelectRow]);

  const tableChildren: React.ReactNode[] = [];
  let paginationChild: React.ReactNode = null;

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === DataTablePaginationWrapper) {
      paginationChild = child;
    } else {
      tableChildren.push(child);
    }
  });

  const tableState = table.getState();

  const contextValue = React.useMemo(
    () => ({ table, columns: finalColumns }) as unknown as DataTableContextValue<unknown, unknown>,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table, finalColumns, tableState]
  );

  return (
    <DataTableContext.Provider value={contextValue}>
      <div className={styles.container}>
        <Table>{tableChildren}</Table>
        {paginationChild}
      </div>
    </DataTableContext.Provider>
  );
}

function DataTableHeader<TData, TValue>() {
  const { table } = useDataTableContext<TData, TValue>();

  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <TableHead
              key={header.id}
              style={{
                width:
                  header.column.columnDef.size !== undefined
                    ? header.column.columnDef.size
                    : undefined,
              }}
            >
              {header.isPlaceholder
                ? null
                : flexRender(header.column.columnDef.header, header.getContext())}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  );
}

function DataTableBody<TData, TValue>() {
  const { table, columns } = useDataTableContext<TData, TValue>();

  return (
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            data-testid="data-table-row"
            data-selected={row.getIsSelected() ? "true" : undefined}
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell
                key={cell.id}
                style={{
                  width:
                    cell.column.columnDef.size !== undefined
                      ? cell.column.columnDef.size
                      : undefined,
                }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} style={{ textAlign: "center" }}>
            Nenhum resultado encontrado.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
}

interface DataTablePaginationWrapperProps {
  totalItems?: number;
}

function DataTablePaginationWrapper<TData, TValue>({
  totalItems,
}: DataTablePaginationWrapperProps) {
  const { table } = useDataTableContext<TData, TValue>();
  const actualTotal = totalItems ?? table.options.data.length;
  return <DataTablePagination table={table} totalItems={actualTotal} />;
}
DataTablePaginationWrapper.displayName = "DataTablePagination";

function DataTableComponent<TData, TValue>(props: DataTableProps<TData, TValue>) {
  return (
    <DataTableRoot {...props}>
      <DataTableHeader<TData, TValue> />
      <DataTableBody<TData, TValue> />
      <DataTablePaginationWrapper<TData, TValue> totalItems={props.totalItems} />
    </DataTableRoot>
  );
}

export const DataTable = Object.assign(DataTableComponent, {
  Root: DataTableRoot,
  Header: DataTableHeader,
  Body: DataTableBody,
  Pagination: DataTablePaginationWrapper,
});

function getSelectColumn<TData>(): ColumnDef<TData, unknown> {
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
  };
}

function getActionColumn<TData>(actions: DataTableAction<TData>[]): ColumnDef<TData, unknown> {
  return {
    id: "actions",
    size: 48 * actions.length,
    header: () => null,
    cell: ({ row }) => {
      const activeActions = actions.filter((a) => !a.omit);
      if (activeActions.length === 0) return null;

      return (
        <div
          className={styles.actionCell}
          style={{ display: "flex", justifyContent: "center", gap: "8px" }}
        >
          {activeActions.map((action, index) => {
            const content = (
              <button
                key={index}
                className={styles.actionButton}
                onClick={(e) => {
                  if (action.onAction) {
                    e.stopPropagation();
                    action.onAction(row.original);
                  }
                }}
                title={action.title}
                aria-label={action.title}
              >
                {action.icon || action.title}
              </button>
            );

            if (action.url) {
              return (
                <a key={index} href={action.url} onClick={(e) => e.stopPropagation()}>
                  {content}
                </a>
              );
            }

            return content;
          })}
        </div>
      );
    },
  };
}
