# Componente Modal

A funcionalidade `Modal` fornece uma janela de diálogo flexível, acessível e baseada em composição, construída sobre o `@base-ui/react/dialog`. Suporta tanto uso não-controlado (estado interno) quanto gerenciamento de estado global via `Zustand`.

## Funcionalidades (Features)

- **Padrão de Composição**: Estruture facilmente o conteúdo do modal usando `Modal.Root`, `Modal.Popup`, `Modal.Title`, etc.
- **Acessível**: Construído com Base UI para garantir navegação por teclado, captura de foco (focus trap) e atributos ARIA.
- **Gerenciamento de Estado Global**: Inclui um hook customizado `useModal` integrado ao Zustand para gerenciar facilmente o estado de modais de forma global.
- **CSS Modules**: Totalmente estilizado com CSS modules, oferecendo customização fácil de temas.

## Instalação

Esta funcionalidade utiliza `@base-ui/react/dialog` para acessibilidade e `zustand` para estado. Certifique-se de ter instalado:

```bash
pnpm install @base-ui/react zustand
```

## Como Usar

### 1. Estado Local / Não-controlado (Padrão de Composição)

Você pode usar o modal puramente com estado local ou baseando-se no estado interno não-controlado fornecido pelo `Modal.Trigger`.

```tsx
import { Modal } from "@/features/modal/ui";

function MyComponent() {
  return (
    <Modal.Root>
      <Modal.Trigger>Abrir Modal</Modal.Trigger>

      <Modal.Popup>
        <Modal.Title>Alerta</Modal.Title>

        <Modal.Body>
          <Modal.Description>Tem certeza de que deseja continuar?</Modal.Description>
          <p>Qualquer conteúdo extra com rolagem entra aqui!</p>
        </Modal.Body>

        <Modal.Buttons>
          <Modal.ButtonClose>Cancelar</Modal.ButtonClose>
          <Modal.ButtonAction>Confirmar</Modal.ButtonAction>
        </Modal.Buttons>
      </Modal.Popup>
    </Modal.Root>
  );
}
```

### 2. Controlado via Estado Global (Zustand)

Em aplicações complexas, geralmente queremos abrir um modal a partir de um componente diferente ou passar dados específicos para ele. Use o hook `useModal` para isso.

```tsx
import { Modal } from "@/features/modal/ui";
import { useModal } from "@/features/modal/ui/use-modal";

// 1. O componente que renderiza o modal
function EditUserModal() {
  const modal = useModal<{ userId: string }>("edit-user");

  return (
    <Modal.Root open={modal.isOpen} onOpenChange={(open) => !open && modal.close()}>
      <Modal.Popup>
        <Modal.Title>Editar Usuário</Modal.Title>
        <Modal.Body>
          <Modal.Description>Editando o usuário: {modal.data?.userId}</Modal.Description>
        </Modal.Body>
        <Modal.Buttons>
          <Modal.ButtonClose>Cancelar</Modal.ButtonClose>
          <Modal.ButtonAction>Salvar Alterações</Modal.ButtonAction>
        </Modal.Buttons>
      </Modal.Popup>
    </Modal.Root>
  );
}

// 2. O componente que dispara o modal
function UserList() {
  const modal = useModal("edit-user");

  return <button onClick={() => modal.open({ userId: "123" })}>Editar Usuário</button>;
}
```

## Estilização

Os estilos são aplicados via CSS Modules no arquivo `ui/modal.module.css`. Um conjunto de variáveis CSS está disponível no `ui/theme.css` para customizar facilmente a aparência:

- `--modal-backdrop-bg`
- `--modal-bg`
- `--modal-radius`
- `--modal-title-color`
- `--modal-desc-color`

Por padrão, o modal se adapta à largura e altura do seu conteúdo interno. Ele automaticamente previne colar nas bordas da tela usando um limite máximo de `calc(100vh - 2rem)` e `calc(100vw - 2rem)`.

## Estrutura de Componentes

- `Modal.Root`: O componente provedor. Por padrão, ele impede o fechamento do modal ao clicar no fundo (backdrop). Você pode passar `disableOutsideClick={false}` para permitir.
- `Modal.Trigger`: O botão que abre o modal nativamente.
- `Modal.Popup`: A janela do modal (já inclui o fundo escuro automaticamente). Aceita a propriedade `hideCloseIcon` para remover o botão "X" superior direito e, ao mesmo tempo, bloquear o fechamento via tecla Escape (Esc).
- `Modal.Title`: O texto de título (fixo no topo).
- `Modal.Body`: Envoltório para conteúdos internos que excedem a altura máxima do modal. Adiciona rolagem vertical automaticamente enquanto mantém o Título e Botões fixos.
- `Modal.Description`: O texto de descrição (geralmente colocado dentro do Body).
- `Modal.ButtonClose`: Um botão secundário estilizado que fecha o modal.
- `Modal.ButtonAction`: Um botão primário estilizado para ações principais.
- `Modal.CloseIcon`: O componente de ícone "X" em SVG (renderizado por padrão dentro do `Popup`).
- `Modal.Buttons`: Um container flexível para o alinhamento dos botões de ação (centralizados e fixos na parte inferior por padrão).
