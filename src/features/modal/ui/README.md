# Modal Component

The `Modal` feature provides a flexible, accessible, and composition-based dialog window, built on top of `@base-ui/react/dialog`. It supports uncontrolled usage as well as global state management via `Zustand`.

## Features

- **Composition Pattern**: Easily structure the modal content using `Modal.Root`, `Modal.Popup`, `Modal.Title`, etc.
- **Accessible**: Built with Base UI to ensure keyboard navigation, focus trap, and ARIA attributes.
- **Global State Management**: Includes a custom hook `useModal` powered by Zustand to easily manage modal states globally.
- **CSS Modules**: Fully styled with CSS modules, offering easy theme customization.

## Installation

This feature uses `@base-ui/react/dialog` for accessibility and `zustand` for state management. Ensure you have installed:

```bash
pnpm install @base-ui/react zustand
```

## Usage

### 1. Uncontrolled / Local State (Composition Pattern)

You can use the modal purely with local state or by relying on the internal uncontrolled state provided by `Modal.Trigger`.

```tsx
import { Modal } from "@/features/modal";

function MyComponent() {
  return (
    <Modal.Root>
      <Modal.Trigger>Open Modal</Modal.Trigger>

      <Modal.Popup>
        <Modal.Title>Alert</Modal.Title>

        <Modal.Body>
          <Modal.Description>Are you sure you want to proceed?</Modal.Description>
          <p>Any extra scrolling content goes here!</p>
        </Modal.Body>

        <Modal.Buttons>
          <Modal.ButtonClose>Cancel</Modal.ButtonClose>
          <Modal.ButtonAction>Confirm</Modal.ButtonAction>
        </Modal.Buttons>
      </Modal.Popup>
    </Modal.Root>
  );
}
```

### 2. Controlled via Global State (Zustand)

For complex applications, you often want to open a modal from a different component or pass specific data to it. Use the `useModal` hook for this.

```tsx
import { Modal, useModal } from "@/features/modal";

// 1. The component that renders the modal
function EditUserModal() {
  const modal = useModal<{ userId: string }>("edit-user");

  return (
    <Modal.Root open={modal.isOpen} onOpenChange={(open) => !open && modal.close()}>
      <Modal.Popup>
        <Modal.Title>Edit User</Modal.Title>
        <Modal.Body>
          <Modal.Description>Editing user ID: {modal.data?.userId}</Modal.Description>
        </Modal.Body>
        <Modal.Buttons>
          <Modal.ButtonClose>Cancel</Modal.ButtonClose>
          <Modal.ButtonAction>Save Changes</Modal.ButtonAction>
        </Modal.Buttons>
      </Modal.Popup>
    </Modal.Root>
  );
}

// 2. The component that triggers the modal
function UserList() {
  const modal = useModal("edit-user");

  return <button onClick={() => modal.open({ userId: "123" })}>Edit User</button>;
}
```

## Styling

Styles are applied via CSS Modules in `ui/modal.module.css`. A set of CSS variables are available in `ui/theme.css` to easily customize the appearance:

- `--modal-backdrop-bg`
- `--modal-bg`
- `--modal-radius`
- `--modal-title-color`
- `--modal-desc-color`

By default, the modal adapts to the width and height of its internal content. It will automatically prevent sticking to the screen edges via a `calc(100vh - 2rem)` maximum constraint.

## Components Structure

- `Modal.Root`: The provider component. By default, it blocks closing the modal when clicking on the backdrop. You can pass `disableOutsideClick={false}` to allow it.
- `Modal.Trigger`: The button that opens the modal natively.
- `Modal.Popup`: The modal window (includes the backdrop automatically). Accepts `hideCloseIcon` to remove the default top-right "X" button.
- `Modal.Title`: The title text (fixed at top).
- `Modal.Body`: Wrapper for internal content that exceeds the modal max-height. Automatically adds vertical scrolling while keeping Title and Buttons fixed.
- `Modal.Description`: The description text (usually placed inside Body).
- `Modal.ButtonClose`: A styled secondary button that closes the modal.
- `Modal.ButtonAction`: A styled primary button for main actions.
- `Modal.CloseIcon`: The SVG "X" icon component (rendered by default inside `Popup`).
- `Modal.Buttons`: A flex container for alignment of action buttons (centered and fixed at bottom by default).
