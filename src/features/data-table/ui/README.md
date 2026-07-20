# DataTable

O componente `DataTable` é uma tabela de dados flexível e reutilizável, baseada no `@tanstack/react-table`.

## Dependências

- `@tanstack/react-table`
- `@fortawesome/react-fontawesome` (para os ícones)
- Vanilla CSS (`data-table.module.css`) para estilização

## Como Usar

### Uso Padrão (Componente Único)

Para o uso tradicional, basta passar as `columns` e `data` diretamente para o componente principal:

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

### Uso com Composition Pattern (Flexível)

Se você precisa de mais flexibilidade (por exemplo, para injetar componentes visuais como barras de carregamento ou alertas no meio da tabela), o `DataTable` suporta o **Composition Pattern**:

```tsx
import { DataTable } from "@/features/data-table/ui";
// ...definições de columns e data...

export function MinhaPagina() {
  const isLoading = false; // Exemplo de estado

  return (
    <DataTable.Root data={data} columns={columns}>
      <DataTable.Header />

      {/* Flexibilidade total! */}
      {isLoading && (
        <tr>
          <td colSpan={columns.length}>Carregando...</td>
        </tr>
      )}

      <DataTable.Body />

      <DataTable.Pagination totalItems={100} />
    </DataTable.Root>
  );
}
```

_Observação: Ao utilizar a composição, os componentes filhos se comunicam por baixo dos panos através de Contexto (Context API), não sendo necessário passar a propriedade `table` para cada um._

## Estilização

A estilização foi feita utilizando CSS Modules puros (Vanilla CSS) para garantir que as classes não sofram conflitos com o restante do projeto e mantenham consistência com a aparência de referência.
