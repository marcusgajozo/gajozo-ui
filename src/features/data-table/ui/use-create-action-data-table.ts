import type { ReactNode } from "react";
import { useMemo } from "react";

export interface DataTableAction<TData> {
  title: string;
  icon?: ReactNode;
  url?: string;
  onAction?: (row: TData) => void;
}

export function useCreateActionDataTable<TData>(
  actions: DataTableAction<TData>[]
): DataTableAction<TData>[] {
  return useMemo(() => actions, [actions]);
}
