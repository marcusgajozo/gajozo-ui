import { type ReactNode, useMemo } from "react";

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
      (actions: DataTableAction<TData>[]): DataTableAction<TData>[] =>
        actions,
    []
  );
}
