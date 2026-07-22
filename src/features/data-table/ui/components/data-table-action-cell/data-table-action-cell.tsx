import type { DataTableAction } from "../../hooks/use-create-action-column";
import { DataTableActionDropdown } from "../data-table-action-dropdown";
import styles from "./data-table-action-cell.module.css";

export interface DataTableActionCellProps<TData> {
  actions: DataTableAction<TData>[];
  row: TData;
}

export function DataTableActionCell<TData>({ actions, row }: DataTableActionCellProps<TData>) {
  const activeActions = actions.filter((a) => !a.omit);
  if (activeActions.length === 0) return null;

  return (
    <div
      className={styles.actionCell}
      style={{ display: "flex", justifyContent: "center", gap: "8px" }}
    >
      {activeActions.length === 1 ? (
        (() => {
          const action = activeActions[0];
          const content = (
            <button
              className={styles.actionButton}
              onClick={(e) => {
                if (action.onAction) {
                  e.stopPropagation();
                  action.onAction(row);
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
              <a href={action.url} onClick={(e) => e.stopPropagation()}>
                {content}
              </a>
            );
          }

          return content;
        })()
      ) : (
        <DataTableActionDropdown actions={activeActions} row={row} />
      )}
    </div>
  );
}
