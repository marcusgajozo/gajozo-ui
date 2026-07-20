import type { ReactNode } from "react";
import { useMemo } from "react";

// TODO: adicionar props de links

export interface DataTableAction<TData> {
  title: string;
  icon?: ReactNode;
  url?: string;
  onAction?: (row: TData) => void;
  omit?: boolean;
}

export function useCreateActionColumn<TData>(
  actions: DataTableAction<TData>[]
): DataTableAction<TData>[] {
  return useMemo(() => actions, [actions]);
}
