import type { Meta } from "@storybook/react-vite";

import { Modal } from "../ui/index";
import { useModal } from "../ui/use-modal";

const meta = {
  title: "Features/Modal",
  component: Modal.Root,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Modal.Root>;

export default meta;

export const Default = {
  render: () => (
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
        Open Modal
      </Modal.Trigger>
      <Modal.Popup>
        <Modal.Title>Modal Title</Modal.Title>
        <Modal.Body>
          <Modal.Description>
            This is a simple modal built with the composition pattern and Base UI.
          </Modal.Description>
        </Modal.Body>
        <Modal.Buttons>
          <Modal.ButtonClose>Cancel</Modal.ButtonClose>
          <Modal.ButtonAction>Confirm</Modal.ButtonAction>
        </Modal.Buttons>
      </Modal.Popup>
    </Modal.Root>
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
        Open Modal (Click outside to close)
      </Modal.Trigger>
      <Modal.Popup>
        <Modal.Title>Dismissible Modal</Modal.Title>
        <Modal.Body>
          <Modal.Description>
            You can close this modal by simply clicking on the dark backdrop outside!
          </Modal.Description>
        </Modal.Body>
        <Modal.Buttons>
          <Modal.ButtonClose style={{ width: "100%" }}>Got it</Modal.ButtonClose>
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
        Open Long Modal
      </Modal.Trigger>
      <Modal.Popup>
        <Modal.Title>Terms and Conditions</Modal.Title>
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
          <Modal.ButtonClose>Decline</Modal.ButtonClose>
          <Modal.ButtonAction>Accept</Modal.ButtonAction>
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
        Open Modal (No X Icon)
      </Modal.Trigger>
      <Modal.Popup hideCloseIcon>
        <Modal.Title>Alert</Modal.Title>
        <Modal.Description>
          This modal does not have the default close icon in the top right.
        </Modal.Description>
        <Modal.Buttons>
          <Modal.ButtonClose>Understood</Modal.ButtonClose>
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
        onClick={() => modal.open({ name: "Zustand User" })}
        style={{
          padding: "8px 16px",
          cursor: "pointer",
          borderRadius: "4px",
          backgroundColor: "#10b981",
          color: "white",
          border: "none",
        }}
      >
        Open Store Modal
      </button>

      <Modal.Root open={modal.isOpen} onOpenChange={(open) => !open && modal.close()}>
        <Modal.Popup>
          <Modal.Title>Controlled Modal</Modal.Title>
          <Modal.Description>
            Hello, {modal.data?.name || "Guest"}! This modal state is managed by Zustand.
          </Modal.Description>
          <Modal.Buttons>
            <Modal.ButtonClose>Close</Modal.ButtonClose>
          </Modal.Buttons>
        </Modal.Popup>
      </Modal.Root>
    </div>
  );
};

export const WithZustandStore = {
  render: () => <StoreModalExample />,
};
