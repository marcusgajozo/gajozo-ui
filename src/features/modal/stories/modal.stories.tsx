import type { Meta } from "@storybook/react-vite";

import { DownloadZipButton } from "../../../storybook/download-zip";
import { Modal } from "../ui/index";
import { useModal } from "../ui/use-modal";

const uiFiles = import.meta.glob("../ui/*", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;
const zipFiles = Object.entries(uiFiles).map(([path, content]) => ({
  name: path.split("/").pop()!,
  content,
}));

const meta = {
  title: "Components/Modal",
  component: Modal.Root,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Modal.Root>;

export default meta;

export const Default = {
  render: () => (
    <div>
      <div style={{ padding: "32px 0", textAlign: "center" }}>
        <Modal.Root>
          <Modal.Trigger
            style={{
              padding: "8px 16px",
              cursor: "pointer",
              borderRadius: "4px",
              backgroundColor: "#0070C1",
              color: "white",
              border: "none",
            }}
          >
            Abrir Modal
          </Modal.Trigger>
          <Modal.Popup>
            <Modal.Title>Título do Modal</Modal.Title>
            <Modal.Body>
              <Modal.Description>
                Este é um modal simples construído com o padrão de composição e Base UI.
              </Modal.Description>
            </Modal.Body>
            <Modal.Buttons>
              <Modal.ButtonClose>Cancelar</Modal.ButtonClose>
              <Modal.ButtonAction>Confirmar</Modal.ButtonAction>
            </Modal.Buttons>
          </Modal.Popup>
        </Modal.Root>
      </div>
      <DownloadZipButton files={zipFiles} zipName="modal" />
    </div>
  ),
};

export const AllowOutsideClick = {
  render: () => (
    <Modal.Root disableOutsideClick={false}>
      <Modal.Trigger
        style={{
          padding: "8px 16px",
          cursor: "pointer",
          borderRadius: "4px",
          backgroundColor: "#10b981",
          color: "white",
          border: "none",
        }}
      >
        Abrir Modal (Clique fora para fechar)
      </Modal.Trigger>
      <Modal.Popup>
        <Modal.Title>Modal Dispensável</Modal.Title>
        <Modal.Body>
          <Modal.Description>
            Você pode fechar este modal simplesmente clicando no fundo escuro fora dele!
          </Modal.Description>
        </Modal.Body>
        <Modal.Buttons>
          <Modal.ButtonClose style={{ width: "100%" }}>Entendido</Modal.ButtonClose>
        </Modal.Buttons>
      </Modal.Popup>
    </Modal.Root>
  ),
};

export const ScrollingContent = {
  render: () => (
    <Modal.Root>
      <Modal.Trigger
        style={{
          padding: "8px 16px",
          cursor: "pointer",
          borderRadius: "4px",
          backgroundColor: "#8b5cf6",
          color: "white",
          border: "none",
        }}
      >
        Abrir Modal Longo
      </Modal.Trigger>
      <Modal.Popup>
        <Modal.Title>Termos e Condições</Modal.Title>
        <Modal.Body>
          {Array.from({ length: 15 }).map((_, i) => (
            <p key={i} style={{ marginBottom: "1rem" }}>
              Bacon ipsum dolor amet short ribs turducken pancetta bresaola picanha, jowl pastrami
              fatback porchetta biltong buffalo kevin. Corned beef spare ribs jowl leberkas
              prosciutto sirloin pastrami ribeye alcatra.
            </p>
          ))}
        </Modal.Body>
        <Modal.Buttons>
          <Modal.ButtonClose>Recusar</Modal.ButtonClose>
          <Modal.ButtonAction>Aceitar</Modal.ButtonAction>
        </Modal.Buttons>
      </Modal.Popup>
    </Modal.Root>
  ),
};

export const HideCloseIcon = {
  render: () => (
    <Modal.Root>
      <Modal.Trigger
        style={{
          padding: "8px 16px",
          cursor: "pointer",
          borderRadius: "4px",
          backgroundColor: "#f59e0b",
          color: "white",
          border: "none",
        }}
      >
        Abrir Modal (Sem X)
      </Modal.Trigger>
      <Modal.Popup hideCloseIcon>
        <Modal.Title>Alerta</Modal.Title>
        <Modal.Description>
          Este modal não tem o botão de fechar (X) padrão no canto superior direito e bloqueia a
          tecla Esc.
        </Modal.Description>
        <Modal.Buttons>
          <Modal.ButtonClose>Entendido</Modal.ButtonClose>
        </Modal.Buttons>
      </Modal.Popup>
    </Modal.Root>
  ),
};

const StoreModalExample = () => {
  const modal = useModal<{ name: string }>("story-modal");

  return (
    <div>
      <button
        onClick={() => modal.open({ name: "Usuário Zustand" })}
        style={{
          padding: "8px 16px",
          cursor: "pointer",
          borderRadius: "4px",
          backgroundColor: "#10b981",
          color: "white",
          border: "none",
        }}
      >
        Abrir Modal com Store
      </button>

      <Modal.Root open={modal.isOpen} onOpenChange={(open) => !open && modal.close()}>
        <Modal.Popup>
          <Modal.Title>Modal Controlado</Modal.Title>
          <Modal.Description>
            Olá, {modal.data?.name || "Visitante"}! O estado deste modal é gerenciado pelo Zustand.
          </Modal.Description>
          <Modal.Buttons>
            <Modal.ButtonClose>Fechar</Modal.ButtonClose>
          </Modal.Buttons>
        </Modal.Popup>
      </Modal.Root>
    </div>
  );
};

export const WithZustandStore = {
  render: () => <StoreModalExample />,
};
