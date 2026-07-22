import { flexRender } from "@tanstack/react-table";

import { useDataTableContext } from "../data-table-context";
import { TableBody, TableCell, TableRow } from "../table";

export function DataTableBody<TData, TValue>() {
  const { table, columns } = useDataTableContext<TData, TValue>();
  const rows = table.getRowModel().rows;

  return (
    <TableBody>
      {rows.length > 0 ? (
        rows.map((row) => (
          <TableRow
            key={row.id}
            data-testid="data-table-row"
            data-state={row.getIsSelected() && "selected"}
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell
                key={cell.id}
                style={{
                  width: cell.column.getSize(),
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
