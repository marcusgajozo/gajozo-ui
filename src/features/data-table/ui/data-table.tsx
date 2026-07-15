import "./theme.css";

import type { ColumnDef } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";

import styles from "./data-table.module.css";
import { DataTablePagination } from "./data-table-pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalItems?: number;
  onSelectRow?: (rows: TData[]) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalItems,
  onSelectRow,
}: DataTableProps<TData, TValue>) {
  const finalColumns = React.useMemo(() => {
    if (!onSelectRow) return columns;
    return [getSelectColumn<TData>(), ...columns];
  }, [columns, onSelectRow]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: finalColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const actualTotal = totalItems ?? data.length;

  const selectedRows = table.getSelectedRowModel().rows;

  React.useEffect(() => {
    if (onSelectRow) {
      onSelectRow(selectedRows.map((r) => r.original));
    }
  }, [selectedRows, onSelectRow]);

  return (
    <div className={styles.container}>
      <Table>
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
              <TableCell colSpan={finalColumns.length} style={{ textAlign: "center" }}>
                Nenhum resultado encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <DataTablePagination table={table} totalItems={actualTotal} />
    </div>
  );
}

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
