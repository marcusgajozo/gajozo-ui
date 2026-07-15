# Componentes de UI Reutilizáveis

Uma biblioteca de componentes React estilo copiar-colar. Sem pacotes npm, sem dependência rígida de frameworks — apenas copie a pasta do componente para o seu projeto.

## Filosofia

- **Copiar-colar:** Cada componente é uma pasta autônoma com um `index.tsx` e um `*.module.css`. Copie-o, use-o.
- **Zero dependências de execução (runtime):** Os componentes dependem apenas do React e utilitários headless (como `@base-ui/react`). Sem bibliotecas de UI pesadas, sem utilitários compartilhados, sem CSS-in-JS no runtime.
- **Acessibilidade:** Padrões WAI-ARIA, navegação completa pelo teclado e gerenciamento de foco incluídos por padrão.
- **Tematizável:** CSS Modules em conjunto com propriedades customizadas (variáveis CSS) para fácil sobrescrita de tokens de design.
- **Composição:** Usamos o padrão de composição para manter sua UI adaptável e flexível.

## Tecnologias (Stack)

| Ferramenta          | Propósito                                |
| ------------------- | ---------------------------------------- |
| React               | Biblioteca de UI (apenas peer dep)       |
| TypeScript          | Tipagem estática e segurança             |
| Vite                | Empacotador (Bundler) & servidor de dev  |
| CSS Modules         | Estilos com escopo, sem peso em execução |
| Storybook           | Explorador de componentes & documentação |
| Vitest + Playwright | Testes de interação no navegador         |

## Componentes Disponíveis

| Componente    | Pasta                        | Descrição                                                                          |
| ------------- | ---------------------------- | ---------------------------------------------------------------------------------- |
| `Select`      | `src/features/select/`       | Dropdown de valor único com navegação por teclado, rótulo e estado obrigatório     |
| `MultiSelect` | `src/features/multi-select/` | Dropdown multi-valores com pesquisa, chips, limpar tudo e limite de seleção máxima |
| `Modal`       | `src/features/modal/`        | Janela sobreposta acessível, com gestão de estado local ou global (via Zustand)    |

## Começando

```bash
pnpm install
pnpm storybook         # servidor de desenvolvimento em http://localhost:6006
pnpm build-storybook   # build estático → storybook-static/
```

## Como Usar um Componente

1. Abra o componente no Storybook.
2. Acesse a aba Code Viewer para visualizar o código fonte.
3. Instale as dependências do componente caso haja alguma (ex: `@base-ui/react`).
4. Jogue os arquivos no seu projeto e importe o componente.

Nenhuma configuração ou utilitário compartilhado é necessário — cada componente é inteiramente autônomo.

## Implantação (Deployment)

O build estático do Storybook pode ser servido como um site comum:

```bash
# Build (Construir a imagem)
docker build -t reusable-ui-components .

# Run (Rodar o container)
docker run -p 8080:80 reusable-ui-components
```

O `Dockerfile` usa um build em três estágios (deps → build do Storybook → nginx:alpine) para manter o tamanho mínimo da imagem.

## Licença

Apache License 2.0
