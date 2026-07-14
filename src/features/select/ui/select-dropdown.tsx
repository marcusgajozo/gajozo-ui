import { Combobox } from "@base-ui/react/combobox";

import type { Option } from "./select";
import styles from "./select-dropdown.module.css";

interface SelectDropdownProps {
  options: Option[];
  noOptionsMessage: string;
}

export function SelectDropdown({ options, noOptionsMessage }: SelectDropdownProps) {
  return (
    <Combobox.Portal>
      <Combobox.Positioner sideOffset={4}>
        <Combobox.Popup className={styles.dropdown}>
          <Combobox.List className={styles.listbox}>
            {options.length === 0 ? (
              <div className={styles.noOptions}>{noOptionsMessage}</div>
            ) : (
              options.map((opt) => (
                <Combobox.Item
                  key={opt.value}
                  value={opt}
                  disabled={opt.disabled}
                  className={styles.option}
                >
                  <span className={styles.optionLabel} title={opt.label}>
                    {opt.label}
                  </span>
                </Combobox.Item>
              ))
            )}
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  );
}
