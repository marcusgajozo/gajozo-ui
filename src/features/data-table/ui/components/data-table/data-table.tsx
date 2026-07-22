import { DataTableBody } from "../data-table-body";
import { DataTableContentTable, type DataTableProps } from "../data-table-content";
import { DataTableHeader } from "../data-table-header";
import { DataTablePagination } from "../data-table-pagination";
import { DataTableRoot } from "../data-table-root";

export type { DataTableProps };

function DataTableComponent<TData = unknown, TValue = unknown>(
  props: DataTableProps<TData, TValue>
) {
  return (
    <DataTableRoot isLoading={props.isLoading}>
      <DataTableContentTable<TData, TValue> {...props}>
        <DataTableHeader<TData, TValue> />
        <DataTableBody<TData, TValue> />
      </DataTableContentTable>
      <DataTablePagination
        totalItems={props.totalItems ?? props.data.length}
        optionsPerPage={props.optionsPerPage}
      />
    </DataTableRoot>
  );
}

export const DataTable = Object.assign(DataTableComponent, {
  Root: DataTableRoot,
  ContentTable: DataTableContentTable,
  Header: DataTableHeader,
  Body: DataTableBody,
  Pagination: DataTablePagination,
});
