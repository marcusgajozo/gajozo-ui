import { Combobox } from "@base-ui/react/combobox";
import * as React from "react";

import styles from "./data-table-pagination.module.css";

export interface DataTablePaginationSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: (string | number)[];
  ariaLabel: string;
  testId?: string;
  emptyMessage?: string;
}

export function DataTablePaginationSelect({
  value,
  onChange,
  options,
  ariaLabel,
  testId,
  emptyMessage = "Nenhum",
}: DataTablePaginationSelectProps) {
  const [inputValue, setInputValue] = React.useState(value);
  const [prevValue, setPrevValue] = React.useState(value);

  if (value !== prevValue) {
    setPrevValue(value);
    setInputValue(value);
  }

  const filteredOptions =
    inputValue === value || inputValue === ""
      ? options
      : options.filter((opt) => opt.toString().includes(inputValue));

  return (
    <Combobox.Root
      value={value}
      onValueChange={(val) => {
        if (val) {
          onChange(val);
          setInputValue(val);
        }
      }}
      inputValue={inputValue}
      onInputValueChange={setInputValue}
    >
      <Combobox.InputGroup className={styles.selectTriggerGroup}>
        <Combobox.Input
          className={styles.selectInput}
          aria-label={ariaLabel}
          data-testid={testId}
        />
        <Combobox.Trigger className={styles.selectIconTrigger} tabIndex={-1}>
          <div className={styles.selectIcon} />
        </Combobox.Trigger>
      </Combobox.InputGroup>
      <Combobox.Portal>
        <Combobox.Positioner>
          <Combobox.Popup className={styles.selectPopup}>
            <Combobox.List className={styles.selectList}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <Combobox.Item
                    key={opt.toString()}
                    value={opt.toString()}
                    className={styles.selectItem}
                  >
                    {opt}
                  </Combobox.Item>
                ))
              ) : (
                <div className={styles.selectItem} style={{ opacity: 0.5 }}>
                  {emptyMessage}
                </div>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}
