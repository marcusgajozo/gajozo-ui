# Componente Select

Um componente customizado de seleção (Select) construído usando a primitiva Combobox do `@base-ui/react`. Ele suporta filtro de busca por padrão, acessibilidade total via teclado e utiliza CSS modules padrão para estilização.

## Instalação

1. Certifique-se de que você tem o `@base-ui/react` instalado no seu projeto:
   ```bash
   pnpm add @base-ui/react
   ```
2. Copie a pasta inteira `select` para o seu projeto (ex: `src/features/select`).

## Estrutura

- `index.ts`: Arquivo de exportação (API pública).
- `select.tsx`: Arquivo principal do componente.
- `select-trigger.tsx`: Subcomponente responsável pelo botão de gatilho (trigger).
- `select-dropdown.tsx`: Subcomponente responsável pelo menu suspenso (popup/dropdown).
- `theme.css`: **API de Design!** Contém todos os tokens de design (variáveis CSS) para o componente. Edite este arquivo para customizar cores, bordas, tipografia, etc. facilmente.
- `select.module.css`: Estilos estruturais base (contêiner, rótulo).
- `select-trigger.module.css`: Estilos estruturais específicos do gatilho (trigger).
- `select-dropdown.module.css`: Estilos estruturais específicos do menu suspenso (dropdown).

## Como Usar

```tsx
import { Select } from "@/features/select/ui";

const options = [
  { value: "apple", label: "Maçã" },
  { value: "banana", label: "Banana" },
  { value: "orange", label: "Laranja", disabled: true },
];

export function MyForm() {
  return (
    <Select label="Escolha uma fruta" options={options} onChange={(value) => console.log(value)} />
  );
}
```
