import { flexRender } from "@tanstack/react-table";

import { useDataTableContext } from "../data-table-context";
import { TableHead, TableHeader, TableRow } from "../table";

export function DataTableHeader<TData, TValue>() {
  const { table } = useDataTableContext<TData, TValue>();

  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <TableHead
              key={header.id}
              style={{
                width: header.getSize(),
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
