# DataTable

O componente `DataTable` é uma tabela de dados flexível e reutilizável, baseada no `@tanstack/react-table`.

## Dependências

- `@tanstack/react-table`
- `@fortawesome/react-fontawesome` (para os ícones)
- Vanilla CSS (`data-table.module.css`) para estilização

## Como Usar

Para usar o componente, importe a funcionalidade através do arquivo de barril `ui/index.ts`:

```tsx
import { DataTable } from "@/features/data-table/ui";
import { ColumnDef } from "@tanstack/react-table";

type User = {
  id: string;
  name: string;
  email: string;
};

const columns: ColumnDef<User>[] = [
  { accessorKey: "name", header: "Nome" },
  { accessorKey: "email", header: "E-mail" },
];

const data: User[] = [{ id: "1", name: "João", email: "joao@example.com" }];

export function UsersPage() {
  return <DataTable columns={columns} data={data} totalItems={100} />;
}
```

## Estilização

A estilização foi feita utilizando CSS Modules puros (Vanilla CSS) para garantir que as classes não sofram conflitos com o restante do projeto e mantenham consistência com a aparência de referência.
