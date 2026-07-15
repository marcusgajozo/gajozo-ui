# Componente MultiSelect

Um componente customizado de seleção múltipla (MultiSelect) construído usando a primitiva Combobox do `@base-ui/react`. Ele suporta filtro de busca por padrão, acessibilidade total via teclado e utiliza CSS modules padrão para estilização.

## Instalação

1. Certifique-se de que você tem o `@base-ui/react` instalado no seu projeto:
   ```bash
   pnpm add @base-ui/react
   ```
2. Copie a pasta inteira `multi-select` para o seu projeto (ex: `src/features/multi-select`).

## Estrutura

- `index.ts`: Arquivo de exportação (API pública).
- `multi-select.tsx`: Arquivo principal do componente.
- `multi-select-trigger.tsx`: Subcomponente responsável pelo botão de gatilho e exibição das opções selecionadas (chips).
- `multi-select-dropdown.tsx`: Subcomponente responsável pelo menu suspenso (popup) e campo de busca.
- `theme.css`: **API de Design!** Contém todos os tokens de design (variáveis CSS) para o componente. Edite este arquivo para customizar cores, bordas, tipografia, etc. facilmente.
- `multi-select.module.css`: Estilos estruturais base (contêiner, rótulo).
- `multi-select-trigger.module.css`: Estilos estruturais específicos do gatilho (trigger).
- `multi-select-dropdown.module.css`: Estilos estruturais específicos do menu suspenso (dropdown).

## Como Usar

```tsx
import { MultiSelect } from "@/features/multi-select/ui";

const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular", disabled: true },
];

export function MyForm() {
  return (
    <MultiSelect
      label="Escolha os frameworks"
      options={options}
      onChange={(value) => console.log(value)}
      maxSelected={2}
    />
  );
}
```
