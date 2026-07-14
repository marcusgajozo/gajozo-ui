import { Combobox } from "@base-ui/react/combobox";

import styles from "./select-trigger.module.css";

function ChevronIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 4l4 4 4-4" />
    </svg>
  );
}

interface TriggerProps {
  id?: string;
  placeholder: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function SelectTrigger({ id, placeholder, disabled, icon }: TriggerProps) {
  return (
    <Combobox.InputGroup className={styles.triggerWrapper}>
      {icon && <span className={styles.iconWrapper}>{icon}</span>}
      <Combobox.Input
        id={id}
        className={styles.searchInputTrigger}
        placeholder={placeholder}
        disabled={disabled}
      />
      <Combobox.Trigger className={styles.chevronButton} disabled={disabled} tabIndex={-1}>
        <ChevronIcon className={styles.chevron} />
      </Combobox.Trigger>
    </Combobox.InputGroup>
  );
}
