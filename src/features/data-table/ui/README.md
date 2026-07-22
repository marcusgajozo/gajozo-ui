# DataTable

O componente `DataTable` é uma tabela de dados flexível e reutilizável, baseada no `@tanstack/react-table`.

## Dependências

- `@tanstack/react-table`
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

### Uso com Compound Components (Componentes Compostos)

O arquivo `data-table.tsx` exporta o componente de forma especial utilizando a função `Object.assign`:

```tsx
export const DataTable = Object.assign(DataTableComponent, {
  Root: DataTableRoot,
  ContentTable: DataTableContentTable,
  Header: DataTableHeader,
  Body: DataTableBody,
  Pagination: DataTablePagination,
});
```

Esse padrão, conhecido como **Compound Components**, anexa os "subcomponentes" (`Root`, `Header`, etc.) como propriedades ao componente monolítico principal (`DataTableComponent`).

Isso existe para oferecer duas formas de uso com Inversão de Controle:

1. **Uso Monolítico (rápido):** Usar apenas `<DataTable />` chama o `DataTableComponent`, que renderiza o cabeçalho, corpo e paginação todos de uma vez e em ordem estática.
2. **Uso Composto (flexível):** Usar as tags via notação de ponto (`<DataTable.Root>`, `<DataTable.ContentTable>`, etc.) permite desmontar e reorganizar a tabela. Você pode, por exemplo, injetar um filtro, botões ou qualquer elemento visual. Nesta estrutura, o `Root` controla o estado global da tabela (como `isLoading`), enquanto o `ContentTable` inicializa os dados (`columns` e `data`). A paginação é 100% independente do contexto dos dados da tabela.

Exemplo de uso composto:

```tsx
import { DataTable } from "@/features/data-table/ui";
// ...definições de columns e data...

export function MinhaPagina() {
  const isLoading = false; // Exemplo de estado global de carregamento

  return (
    <DataTable.Root isLoading={isLoading}>
      {/* O ContentTable abraça os dados e disponibiliza o contexto da tabela para o Header e Body */}
      <DataTable.ContentTable data={data} columns={columns}>
        <DataTable.Header />
        <DataTable.Body />
      </DataTable.ContentTable>

      {/* A Paginação é independente e renderizada fora do ContentTable */}
      <DataTable.Pagination totalItems={100} />
    </DataTable.Root>
  );
}
```

_Observação: Ao utilizar a composição, os componentes filhos se comunicam por baixo dos panos através de Contexto (Context API), não sendo necessário passar a propriedade `table` para cada um._

## Estilização

A estilização foi feita utilizando CSS Modules puros (Vanilla CSS) para garantir que as classes não sofram conflitos com o restante do projeto e mantenham consistência com a aparência de referência.
