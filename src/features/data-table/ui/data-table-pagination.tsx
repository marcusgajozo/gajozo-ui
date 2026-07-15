import { Select } from "@base-ui/react";
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
          <Select.Root
            value={pageSize.toString()}
            onValueChange={(val) => {
              if (val) table.setPageSize(Number(val));
            }}
          >
            <Select.Trigger
              className={styles.selectTrigger}
              aria-label="Itens por página"
              data-testid="page-size-select"
            >
              <Select.Value />
              <div className={styles.selectIcon} />
            </Select.Trigger>
            <Select.Portal>
              <Select.Positioner>
                <Select.Popup className={styles.selectPopup}>
                  {[10, 20, 30, 40, 50].map((size) => (
                    <Select.Item key={size} value={size.toString()} className={styles.selectItem}>
                      <Select.ItemText>{size}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Popup>
              </Select.Positioner>
            </Select.Portal>
          </Select.Root>
        </div>
        <div className={styles.itemCount}>
          {totalItems > 0 ? `${startItem}-${endItem} de ${totalItems} itens` : "0 itens"}
        </div>
      </div>

      <div className={styles.footerRight}>
        <div className={styles.pageSelectGroup}>
          <span>Página</span>
          <Select.Root
            value={(pageIndex + 1).toString()}
            onValueChange={(val) => {
              if (val) table.setPageIndex(Number(val) - 1);
            }}
          >
            <Select.Trigger
              className={styles.selectTrigger}
              aria-label="Página atual"
              data-testid="page-index-select"
            >
              <Select.Value />
              <div className={styles.selectIcon} />
            </Select.Trigger>
            <Select.Portal>
              <Select.Positioner>
                <Select.Popup className={styles.selectPopup}>
                  {Array.from({ length: Math.max(1, table.getPageCount()) }, (_, i) => i + 1).map(
                    (page) => (
                      <Select.Item key={page} value={page.toString()} className={styles.selectItem}>
                        <Select.ItemText>{page}</Select.ItemText>
                      </Select.Item>
                    )
                  )}
                </Select.Popup>
              </Select.Positioner>
            </Select.Portal>
          </Select.Root>
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
