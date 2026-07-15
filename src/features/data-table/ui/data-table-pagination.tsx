import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Table } from "@tanstack/react-table";

import styles from "./data-table-pagination.module.css";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  totalItems: number;
}

export function DataTablePagination<TData>({ table, totalItems }: DataTablePaginationProps<TData>) {
  const pagination = table.getState().pagination;
  const pageIndex = pagination.pageIndex;
  const pageSize = pagination.pageSize;

  const startItem = pageIndex * pageSize + 1;
  const endItem = Math.min((pageIndex + 1) * pageSize, totalItems);

  return (
    <div className={styles.footer}>
      <div className={styles.footerLeft}>
        <div className={styles.displaySelectGroup}>
          <span>Exibir</span>
          <select
            className={styles.nativeSelect}
            value={pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            data-testid="page-size-select"
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.itemCount}>
          {totalItems > 0 ? `${startItem}-${endItem} de ${totalItems} itens` : "0 itens"}
        </div>
      </div>

      <div className={styles.footerRight}>
        <div className={styles.pageSelectGroup}>
          <span>Página</span>
          <select
            className={styles.nativeSelect}
            value={pageIndex + 1}
            onChange={(e) => {
              table.setPageIndex(Number(e.target.value) - 1);
            }}
            data-testid="page-index-select"
          >
            {Array.from({ length: table.getPageCount() }, (_, i) => i + 1).map((page) => (
              <option key={page} value={page}>
                {page}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.paginationButtons}>
          <button
            className={styles.iconButton}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            data-testid="prev-page-button"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button
            className={styles.iconButton}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            data-testid="next-page-button"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
    </div>
  );
}
