import type { ColumnDef } from "@tanstack/react-table";
import type { ReactNode } from "react";
import { useMemo } from "react";

import styles from "./use-create-action-column.module.css";

export interface DataTableAction<TData> {
  title: string;
  icon?: ReactNode;
  url?: string;
  onAction?: (row: TData) => void;
  omit?: boolean;
}

export function useCreateActionColumn<TData>() {
  return useMemo(
    () =>
      (actions: DataTableAction<TData>[]): ColumnDef<TData, unknown> => ({
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
      }),
    []
  );
}
