import "../../theme.css";

import * as React from "react";

import styles from "./data-table-root.module.css";

export interface DataTableRootProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

export function DataTableRoot({ children, isLoading }: DataTableRootProps) {
  return (
    <div className={styles.container} data-loading={isLoading ? "" : undefined}>
      {children}
    </div>
  );
}
