import { Combobox } from "@base-ui/react/combobox";

import type { Option } from "./multi-select";
import styles from "./multi-select-dropdown.module.css";

interface DropdownProps {
  options: Option[];
  noOptionsMessage: string;
  maxSelected?: number;
  currentSelectedCount: number;
  isAllSelected: boolean;
  isIndeterminate: boolean;
}

export function MultiSelectDropdown({
  options,
  noOptionsMessage,
  maxSelected,
  currentSelectedCount,
  isAllSelected,
  isIndeterminate,
}: DropdownProps) {
  const isAtMax = maxSelected !== undefined && currentSelectedCount >= maxSelected;

  return (
    <Combobox.Portal>
      <Combobox.Positioner sideOffset={4}>
        <Combobox.Popup className={styles.dropdown}>
          <Combobox.List className={styles.listbox}>
            {options.length > 0 && (
              <Combobox.Item
                value={{
                  value: "ALL_SELECT_TOGGLE",
                  label: isAllSelected ? "Desmarcar todos" : "Selecionar todos",
                }}
                className={`${styles.option} ${styles.selectAllOption}`}
              >
                <div
                  className={styles.checkbox}
                  data-state={
                    isAllSelected ? "checked" : isIndeterminate ? "indeterminate" : "unchecked"
                  }
                >
                  {isAllSelected && <CheckIcon />}
                  {isIndeterminate && <IndeterminateIcon />}
                </div>
                <span className={styles.optionLabel}>
                  {isAllSelected ? "Desmarcar todos" : "Selecionar todos"}
                </span>
              </Combobox.Item>
            )}
            {options.length === 0 ? (
              <div className={styles.noOptions}>{noOptionsMessage}</div>
            ) : (
              options.map((opt) => {
                return (
                  <Combobox.Item
                    key={opt.value}
                    value={opt}
                    disabled={opt.disabled || (isAtMax && true)}
                    className={styles.option}
                  >
                    <Combobox.ItemIndicator className={styles.checkbox}>
                      <CheckIcon />
                    </Combobox.ItemIndicator>
                    <div className={`${styles.checkbox} ${styles.checkboxUnselected}`} />
                    <span className={styles.optionLabel} title={opt.label}>
                      {opt.label}
                    </span>
                  </Combobox.Item>
                );
              })
            )}
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  );
}

function CheckIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="2 6 5 9 10 3" />
    </svg>
  );
}

function IndeterminateIcon() {
  return (
    <svg width="8" height="2" viewBox="0 0 8 2" fill="currentColor">
      <rect width="8" height="2" rx="1" />
    </svg>
  );
}
