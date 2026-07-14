import "./theme.css";

import { Combobox } from "@base-ui/react/combobox";
import * as React from "react";

import styles from "./select.module.css";
import { SelectDropdown } from "./select-dropdown";
import { SelectTrigger } from "./select-trigger";

export interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: Option[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
  label?: string;
  required?: boolean;
  noOptionsMessage?: string;
  icon?: React.ReactNode;
}

export function Select({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = "Select...",
  disabled = false,
  id,
  className,
  label,
  required = false,
  noOptionsMessage = "Nenhuma opção encontrada",
  icon,
}: SelectProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const selectedValue = isControlled ? value : internalValue;

  const selectedObj = React.useMemo(
    () => options.find((o) => o.value === selectedValue) || null,
    [options, selectedValue]
  );

  const [inputValue, setInputValue] = React.useState("");

  const handleValueChange = React.useCallback(
    (val: Option | null) => {
      const newVal = val ? val.value : "";
      if (!isControlled) setInternalValue(newVal);
      if (onChange) onChange(newVal);
    },
    [isControlled, onChange]
  );

  const filteredOptions = React.useMemo(() => {
    if (selectedObj && inputValue === selectedObj.label) {
      return options;
    }
    return options.filter((o) => o.label.toLowerCase().includes(inputValue.toLowerCase()));
  }, [options, inputValue, selectedObj]);

  return (
    <div
      className={[styles.container, disabled ? styles.disabled : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label} {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <Combobox.Root
        value={selectedObj}
        onValueChange={handleValueChange}
        inputValue={inputValue}
        onInputValueChange={setInputValue}
        disabled={disabled}
      >
        <SelectTrigger id={id} placeholder={placeholder} disabled={disabled} icon={icon} />
        {!disabled && (
          <SelectDropdown options={filteredOptions} noOptionsMessage={noOptionsMessage} />
        )}
      </Combobox.Root>
    </div>
  );
}
