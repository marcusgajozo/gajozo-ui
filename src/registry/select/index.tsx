import type { KeyboardEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import styles from "./select.module.css";

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
  searchPlaceholder?: string;
  noOptionsMessage?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

interface UseSelectParams {
  options: Option[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled: boolean;
}

function useSelect({ options, value, defaultValue, onChange, disabled }: UseSelectParams) {
  const [id] = useState(() => `sl-${Math.random().toString(36).slice(2, 9)}`);

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
  const selected = isControlled ? value : internalValue;

  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [searchQuery, setSearchQuery] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((o) => o.value === selected);

  const filteredOptions = useMemo(
    () =>
      options.filter(
        (o) => !searchQuery || o.label.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [options, searchQuery]
  );

  const close = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
  }, []);

  const open = useCallback(() => {
    setSearchQuery("");
    const idx = selected !== undefined ? options.findIndex((o) => o.value === selected) : -1;
    setFocusedIndex(idx);
    setIsOpen(true);
  }, [selected, options]);

  useEffect(() => {
    if (!isOpen) return;
    const handleMouseDown = (e: globalThis.MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [isOpen, close]);

  useEffect(() => {
    if (isOpen) searchRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (focusedIndex < 0 || !listboxRef.current) return;
    const opt = filteredOptions[focusedIndex];
    if (!opt) return;
    const el = listboxRef.current.querySelector<HTMLLIElement>(`[id="${id}-option-${opt.value}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [focusedIndex, filteredOptions, id]);

  const selectOption = useCallback(
    (optValue: string) => {
      if (!isControlled) setInternalValue(optValue);
      onChange?.(optValue);
      close();
      triggerRef.current?.focus();
    },
    [isControlled, onChange, close]
  );

  const handleTriggerClick = useCallback(() => {
    if (!disabled) {
      if (isOpen) close();
      else open();
    }
  }, [disabled, isOpen, close, open]);

  const handleTriggerKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (!disabled) {
          if (isOpen) close();
          else open();
        }
      } else if ((e.key === "ArrowDown" || e.key === "ArrowUp") && !isOpen) {
        e.preventDefault();
        if (!disabled) open();
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        close();
        triggerRef.current?.focus();
      }
    },
    [disabled, isOpen, close, open]
  );

  const handleSearchKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((prev) => {
            let next = prev + 1;
            while (next < filteredOptions.length && filteredOptions[next]?.disabled) next++;
            return next < filteredOptions.length ? next : prev;
          });
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((prev) => {
            let next = prev - 1;
            while (next >= 0 && filteredOptions[next]?.disabled) next--;
            return next >= 0 ? next : prev;
          });
          break;
        case "Enter":
        case " ": {
          e.preventDefault();
          if (focusedIndex >= 0) {
            const opt = filteredOptions[focusedIndex];
            if (opt && !opt.disabled) selectOption(opt.value);
          }
          break;
        }
        case "Escape":
          e.preventDefault();
          close();
          triggerRef.current?.focus();
          break;
        case "Tab":
          close();
          break;
      }
    },
    [filteredOptions, focusedIndex, selectOption, close]
  );

  const focusedOptionId =
    focusedIndex >= 0 && filteredOptions[focusedIndex]
      ? `${id}-option-${filteredOptions[focusedIndex].value}`
      : undefined;

  return {
    id,
    selected,
    selectedOption,
    isOpen,
    focusedIndex,
    focusedOptionId,
    searchQuery,
    setSearchQuery,
    filteredOptions,
    containerRef,
    triggerRef,
    listboxRef,
    searchRef,
    setFocusedIndex,
    selectOption,
    handleTriggerClick,
    handleTriggerKeyDown,
    handleSearchKeyDown,
  };
}

export function Select({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = "Select...",
  disabled = false,
  id: externalId,
  className,
  label,
  required = false,
  searchPlaceholder = "Buscar...",
  noOptionsMessage = "Nenhuma opção encontrada",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: SelectProps) {
  const {
    id,
    selected,
    selectedOption,
    isOpen,
    focusedIndex,
    focusedOptionId,
    searchQuery,
    setSearchQuery,
    filteredOptions,
    containerRef,
    triggerRef,
    listboxRef,
    searchRef,
    setFocusedIndex,
    selectOption,
    handleTriggerClick,
    handleTriggerKeyDown,
    handleSearchKeyDown,
  } = useSelect({ options, value, defaultValue, onChange, disabled });

  const effectiveLabelledBy = ariaLabelledBy ?? (label ? `${id}-label` : undefined);

  return (
    <div
      ref={containerRef}
      className={[styles.container, disabled ? styles.disabled : "", className ?? ""]
        .filter(Boolean)
        .join(" ")}
    >
      {label && (
        <label id={`${id}-label`} className={styles.label}>
          {label}
          {required && (
            <span aria-hidden="true" className={styles.required}>
              *
            </span>
          )}
        </label>
      )}
      <div
        ref={triggerRef}
        id={externalId}
        role="combobox"
        tabIndex={disabled ? -1 : 0}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${id}-listbox`}
        aria-disabled={disabled || undefined}
        aria-required={required || undefined}
        aria-label={effectiveLabelledBy ? undefined : (ariaLabel ?? placeholder)}
        aria-labelledby={effectiveLabelledBy}
        className={[styles.trigger, isOpen ? styles.triggerOpen : ""].filter(Boolean).join(" ")}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
      >
        <span className={styles.triggerLabel}>
          {selectedOption ? (
            selectedOption.label
          ) : (
            <span className={styles.placeholder}>{placeholder}</span>
          )}
        </span>
        <span
          className={[styles.chevron, isOpen ? styles.chevronUp : ""].filter(Boolean).join(" ")}
          aria-hidden="true"
        >
          ▾
        </span>
      </div>

      {isOpen && (
        <div className={styles.dropdown} role="presentation">
          <div className={styles.searchWrapper}>
            <input
              ref={searchRef}
              role="searchbox"
              type="text"
              className={styles.searchInput}
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              aria-label="Pesquisar opções"
              aria-autocomplete="list"
              aria-controls={`${id}-listbox`}
              aria-activedescendant={focusedOptionId}
            />
          </div>
          <ul
            ref={listboxRef}
            id={`${id}-listbox`}
            role="listbox"
            aria-label={ariaLabel ?? placeholder}
            tabIndex={-1}
            className={styles.listbox}
          >
            {filteredOptions.length === 0 ? (
              <li className={styles.noOptions}>{noOptionsMessage}</li>
            ) : (
              filteredOptions.map((opt, index) => {
                const isSelected = opt.value === selected;
                const isFocused = focusedIndex === index;
                return (
                  <li
                    key={opt.value}
                    id={`${id}-option-${opt.value}`}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={opt.disabled || undefined}
                    className={[
                      styles.option,
                      isSelected ? styles.optionSelected : "",
                      isFocused ? styles.optionFocused : "",
                      opt.disabled ? styles.optionDisabled : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => {
                      if (!opt.disabled) selectOption(opt.value);
                    }}
                    onMouseEnter={() => setFocusedIndex(index)}
                  >
                    <span className={styles.optionCheck} aria-hidden="true">
                      {isSelected ? "✓" : ""}
                    </span>
                    <span className={styles.optionLabel}>{opt.label}</span>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
