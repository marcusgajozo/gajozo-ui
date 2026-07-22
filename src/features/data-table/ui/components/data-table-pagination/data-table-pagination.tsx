import { useSearchParams } from "../../hooks/use-search-params";
import styles from "./data-table-pagination.module.css";
import { DataTablePaginationSelect } from "./data-table-pagination-select";

export interface DataTablePaginationProps {
  totalItems: number;
  optionsPerPage?: number[];
}

export function DataTablePagination({
  totalItems,
  optionsPerPage = [10, 20, 30, 40, 50],
}: DataTablePaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPageParam = searchParams.get("currentPage");
  const perPageParam = searchParams.get("perPage");

  const currentPage = currentPageParam ? parseInt(currentPageParam, 10) : 1;
  const pageSize = perPageParam ? parseInt(perPageParam, 10) : 10;

  const validCurrentPage = isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;
  const validPageSize = isNaN(pageSize) || pageSize < 1 ? 10 : pageSize;

  const pageCount = Math.max(1, Math.ceil(totalItems / validPageSize));

  const startItem = totalItems > 0 ? (validCurrentPage - 1) * validPageSize + 1 : 0;
  const endItem = Math.min(validCurrentPage * validPageSize, totalItems);

  const canPreviousPage = validCurrentPage > 1;
  const canNextPage = validCurrentPage < pageCount;

  const setPageSize = (newSize: number) => {
    setSearchParams((prev: URLSearchParams) => {
      const newParams = new URLSearchParams(prev.toString());
      newParams.set("perPage", newSize.toString());
      newParams.set("currentPage", "1");
      return newParams;
    });
  };

  const setPageIndex = (newIndex: number) => {
    setSearchParams((prev: URLSearchParams) => {
      const newParams = new URLSearchParams(prev.toString());
      newParams.set("currentPage", (newIndex + 1).toString());
      if (!newParams.has("perPage")) {
        newParams.set("perPage", validPageSize.toString());
      }
      return newParams;
    });
  };

  const previousPage = () => {
    if (canPreviousPage) {
      setPageIndex(validCurrentPage - 2);
    }
  };

  const nextPage = () => {
    if (canNextPage) {
      setPageIndex(validCurrentPage);
    }
  };

  const allPages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <div className={styles.footer}>
      <div className={styles.footerLeft}>
        <div className={styles.displaySelectGroup}>
          <span>Exibir</span>
          <DataTablePaginationSelect
            value={validPageSize.toString()}
            onChange={(val) => setPageSize(Number(val))}
            options={optionsPerPage}
            ariaLabel="Itens por página"
            testId="page-size-select"
            emptyMessage="Nenhum"
          />
        </div>
        <div className={styles.itemCount}>
          {totalItems > 0 ? `${startItem}-${endItem} de ${totalItems} itens` : "0 itens"}
        </div>
      </div>

      <div className={styles.footerRight}>
        <div className={styles.pageSelectGroup}>
          <span>Página</span>
          <DataTablePaginationSelect
            value={validCurrentPage.toString()}
            onChange={(val) => setPageIndex(Number(val) - 1)}
            options={allPages}
            ariaLabel="Página atual"
            testId="page-index-select"
            emptyMessage="Nenhuma"
          />
        </div>
        <div className={styles.paginationButtons}>
          <button
            className={styles.iconButton}
            onClick={previousPage}
            disabled={!canPreviousPage}
            data-testid="prev-page-button"
            title="Página anterior"
          >
            <ChevronLeftIcon />
          </button>
          <button
            className={styles.iconButton}
            onClick={nextPage}
            disabled={!canNextPage}
            data-testid="next-page-button"
            title="Próxima página"
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
