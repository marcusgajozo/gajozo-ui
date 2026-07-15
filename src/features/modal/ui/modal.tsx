import "./theme.css";

import { Dialog } from "@base-ui/react/dialog";
import * as React from "react";

import styles from "./modal.module.css";

const ESCAPE_REASONS = ["escape-key", "close-watcher"];

const ModalContext = React.createContext<{
  hideCloseIcon: boolean;
  setHideCloseIcon: (val: boolean) => void;
} | null>(null);

type ModalRootProps = {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: React.ComponentPropsWithoutRef<typeof Dialog.Root>["onOpenChange"];
  defaultOpen?: boolean;
  disableOutsideClick?: boolean;
};

export function Root({
  children,
  open,
  onOpenChange,
  defaultOpen,
  disableOutsideClick = true,
}: ModalRootProps) {
  const [hideCloseIcon, setHideCloseIcon] = React.useState(false);

  const handleOpenChange: NonNullable<ModalRootProps["onOpenChange"]> = (isOpen, details) => {
    if (hideCloseIcon && ESCAPE_REASONS.includes(details.reason)) {
      details.cancel();
      return;
    }
    if (onOpenChange) {
      onOpenChange(isOpen, details);
    }
  };

  return (
    <ModalContext.Provider value={{ hideCloseIcon, setHideCloseIcon }}>
      <Dialog.Root
        open={open}
        onOpenChange={handleOpenChange}
        defaultOpen={defaultOpen}
        disablePointerDismissal={disableOutsideClick}
      >
        {children}
      </Dialog.Root>
    </ModalContext.Provider>
  );
}

type ModalTriggerProps = React.ComponentPropsWithoutRef<typeof Dialog.Trigger>;

export function Trigger(props: ModalTriggerProps) {
  return <Dialog.Trigger {...props} />;
}

type ModalPopupProps = React.ComponentPropsWithoutRef<typeof Dialog.Popup> & {
  hideBackdrop?: boolean;
  hideCloseIcon?: boolean;
};

export function Popup({
  children,
  className,
  hideBackdrop = false,
  hideCloseIcon = false,
  ...props
}: ModalPopupProps) {
  const ctx = React.useContext(ModalContext);

  React.useEffect(() => {
    if (ctx) {
      ctx.setHideCloseIcon(hideCloseIcon);
    }
  }, [hideCloseIcon, ctx]);

  return (
    <Dialog.Portal>
      {!hideBackdrop && <Dialog.Backdrop className={styles.backdrop} />}
      <Dialog.Popup className={`${styles.popup} ${className || ""}`} {...props}>
        {!hideCloseIcon && <CloseIcon />}
        {children}
      </Dialog.Popup>
    </Dialog.Portal>
  );
}

type ModalTitleProps = React.ComponentPropsWithoutRef<typeof Dialog.Title>;

export function Title({ className, ...props }: ModalTitleProps) {
  return <Dialog.Title className={`${styles.title} ${className || ""}`} {...props} />;
}

type ModalDescriptionProps = React.ComponentPropsWithoutRef<typeof Dialog.Description>;

export function Description({ className, ...props }: ModalDescriptionProps) {
  return <Dialog.Description className={`${styles.description} ${className || ""}`} {...props} />;
}

export function Body({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return <div className={`${styles.body} ${className || ""}`} {...props} />;
}

function CloseSvgIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

type ModalCloseIconProps = React.ComponentPropsWithoutRef<typeof Dialog.Close>;

function CloseIcon({ className, ...props }: ModalCloseIconProps) {
  return (
    <Dialog.Close
      className={`${styles.closeIcon} ${className || ""}`}
      aria-label="Close"
      {...props}
    >
      <CloseSvgIcon />
    </Dialog.Close>
  );
}

type ModalButtonCloseProps = React.ComponentPropsWithoutRef<typeof Dialog.Close>;

export function ButtonClose({ className, ...props }: ModalButtonCloseProps) {
  return <Dialog.Close className={`${styles.buttonClose} ${className || ""}`} {...props} />;
}

export function ButtonAction({ className, ...props }: React.ComponentPropsWithoutRef<"button">) {
  return <button className={`${styles.buttonAction} ${className || ""}`} {...props} />;
}

export function Buttons({ children, className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={`${styles.buttons} ${className || ""}`} {...props}>
      {children}
    </div>
  );
}
