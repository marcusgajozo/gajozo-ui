import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test } from "vitest";

import { Modal } from "../ui/index";
import { useModal } from "../ui/use-modal";
import { useModalStore } from "../ui/use-modal-store";

afterEach(() => {
  cleanup();
  useModalStore.getState().closeAllModals();
});

describe("Modal Component", () => {
  test("Basic render and open/close via Trigger", async () => {
    const user = userEvent.setup();
    render(
      <Modal.Root>
        <Modal.Trigger>Open Modal</Modal.Trigger>
        <Modal.Popup>
          <Modal.Title>My Modal</Modal.Title>
          <Modal.Body>
            <Modal.Description>This is a description</Modal.Description>
          </Modal.Body>
          <Modal.ButtonClose>Close Modal</Modal.ButtonClose>
        </Modal.Popup>
      </Modal.Root>
    );

    expect(screen.queryByText("My Modal")).toBeNull();

    await user.click(screen.getByText("Open Modal"));

    expect(screen.getByText("My Modal")).toBeTruthy();
    expect(screen.getByText("This is a description")).toBeTruthy();

    await user.click(screen.getByText("Close Modal"));

    await waitFor(() => {
      expect(screen.queryByText("My Modal")).toBeNull();
    });
  });

  test("Zustand store integration", async () => {
    const TestComponent = () => {
      const modal = useModal<{ id: number }>("test-modal");
      return (
        <div>
          <button onClick={() => modal.open({ id: 123 })}>Open Store Modal</button>
          <Modal.Root open={modal.isOpen} onOpenChange={(open) => !open && modal.close()}>
            <Modal.Popup>
              <Modal.Title>Store Modal</Modal.Title>
              <Modal.Body>
                <Modal.Description>Data ID: {modal.data?.id}</Modal.Description>
              </Modal.Body>
              <Modal.ButtonClose>Close Store Modal</Modal.ButtonClose>
            </Modal.Popup>
          </Modal.Root>
        </div>
      );
    };

    const user = userEvent.setup();
    render(<TestComponent />);

    await user.click(screen.getByText("Open Store Modal"));

    expect(screen.getByText("Store Modal")).toBeTruthy();
    expect(screen.getByText("Data ID: 123")).toBeTruthy();

    await user.click(screen.getByText("Close Store Modal"));

    await waitFor(() => {
      expect(screen.queryByText("Store Modal")).toBeNull();
    });
  });
});
