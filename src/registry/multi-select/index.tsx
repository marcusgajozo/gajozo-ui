import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import type { KeyboardEvent, MouseEvent } from "react";
import styles from "./multi-select.module.css";

export interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface MultiSelectProps {
  options: Option[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
  searchPlaceholder?: string;
  noOptionsMessage?: string;
  maxSelected?: number;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

export function MultiSelect({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = "Select...",
  disabled = false,
  id: externalId,
  className,
  searchPlaceholder = "Search...",
  noOptionsMessage = "No options found",
  maxSelected,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: MultiSelectProps) {
  const [id] = useState(() => `ms-${Math.random().toString(36).slice(2, 9)}`);

  const isControlled = value !== undefined;
  const [internalSelected, setInternalSelected] = useState<string[]>(
    defaultValue ?? [],
  );
  const selected = useMemo(
    () => (isControlled ? (value ?? []) : internalSelected),
    [isControlled, value, internalSelected],
  );

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const isAtMax = maxSelected !== undefined && selected.length >= maxSelected;

  const close = useCallback(() => {
    setIsOpen(false);
    setSearchQuery("");
    setFocusedIndex(-1);
  }, []);

  // Click-outside detection
  useEffect(() => {
    if (!isOpen) return;
    const handleMouseDown = (e: globalThis.MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [isOpen, close]);

  // Autofocus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      searchRef.current?.focus();
    }
  }, [isOpen]);

  // Scroll focused option into view
  useEffect(() => {
    if (focusedIndex < 0 || !listboxRef.current) return;
    const opt = filteredOptions[focusedIndex];
    if (!opt) return;
    const el = listboxRef.current.querySelector<HTMLLIElement>(
      `[id="${id}-option-${opt.value}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [focusedIndex, filteredOptions, id]);

  const updateSelected = useCallback(
    (next: string[]) => {
      if (!isControlled) setInternalSelected(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const toggleOption = useCallback(
    (optValue: string) => {
      const isSelected = selected.includes(optValue);
      if (!isSelected && isAtMax) return;
      const next = isSelected
        ? selected.filter((v) => v !== optValue)
        : [...selected, optValue];
      updateSelected(next);
    },
    [selected, isAtMax, updateSelected],
  );

  const clearAll = useCallback(() => {
    updateSelected([]);
  }, [updateSelected]);

  const removeChip = useCallback(
    (optValue: string, e: MouseEvent) => {
      e.stopPropagation();
      toggleOption(optValue);
    },
    [toggleOption],
  );

  const handleTriggerClick = useCallback(() => {
    if (!disabled) setIsOpen((prev) => !prev);
  }, [disabled]);

  const handleTriggerKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (!disabled) setIsOpen((prev) => !prev);
      } else if (e.key === "ArrowDown" && !isOpen) {
        e.preventDefault();
        if (!disabled) setIsOpen(true);
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        close();
      }
    },
    [disabled, isOpen, close],
  );

  const handleSearchKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case "Enter":
        case " ": {
          if (focusedIndex >= 0) {
            const opt = filteredOptions[focusedIndex];
            if (opt && !opt.disabled) {
              e.preventDefault();
              toggleOption(opt.value);
            }
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
    [filteredOptions, focusedIndex, toggleOption, close],
  );

  const focusedOptionId =
    focusedIndex >= 0 && filteredOptions[focusedIndex]
      ? `${id}-option-${filteredOptions[focusedIndex].value}`
      : undefined;

  return (
    <div
      ref={containerRef}
      className={[
        styles.container,
        disabled ? styles.disabled : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Trigger */}
      <div
        ref={triggerRef}
        id={externalId}
        role="combobox"
        tabIndex={disabled ? -1 : 0}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${id}-listbox`}
        aria-disabled={disabled || undefined}
        aria-label={ariaLabelledBy ? undefined : (ariaLabel ?? placeholder)}
        aria-labelledby={ariaLabelledBy}
        className={[styles.trigger, isOpen ? styles.triggerOpen : ""]
          .filter(Boolean)
          .join(" ")}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
      >
        <div className={styles.chipArea}>
          {selected.length === 0 && (
            <span className={styles.placeholder}>{placeholder}</span>
          )}
          {selected.map((val) => {
            const opt = options.find((o) => o.value === val);
            if (!opt) return null;
            return (
              <span key={val} className={styles.chip}>
                <span className={styles.chipLabel}>{opt.label}</span>
                <button
                  type="button"
                  aria-label={`Remove ${opt.label}`}
                  className={styles.chipRemove}
                  onClick={(e) => removeChip(val, e)}
                  tabIndex={-1}
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>

        <div className={styles.actions}>
          {selected.length > 0 && !disabled && (
            <button
              type="button"
              aria-label="Clear all"
              className={styles.clearAll}
              onClick={(e) => {
                e.stopPropagation();
                clearAll();
              }}
              tabIndex={-1}
            >
              ×
            </button>
          )}
          <svg
            className={[styles.chevron, isOpen ? styles.chevronUp : ""]
              .filter(Boolean)
              .join(" ")}
            aria-hidden="true"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 4l4 4 4-4" />
          </svg>
        </div>
      </div>

      {/* Dropdown — always in DOM so aria-controls always resolves */}
      <div
        className={[styles.dropdown, !isOpen ? styles.dropdownHidden : ""]
          .filter(Boolean)
          .join(" ")}
        role="presentation"
        aria-hidden={!isOpen}
      >
        <div className={styles.searchWrapper}>
          <input
            ref={searchRef}
            type="text"
            role="searchbox"
            aria-label={searchPlaceholder}
            aria-controls={`${id}-listbox`}
            aria-activedescendant={focusedOptionId}
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setFocusedIndex(-1); }}
            onKeyDown={handleSearchKeyDown}
            placeholder={searchPlaceholder}
            className={styles.searchInput}
            tabIndex={isOpen ? 0 : -1}
          />
        </div>

        <ul
          ref={listboxRef}
          id={`${id}-listbox`}
          role="listbox"
          aria-multiselectable="true"
          aria-label={placeholder}
          className={styles.listbox}
        >
          {filteredOptions.length === 0 ? (
            <li className={styles.noOptions} role="presentation">
              {noOptionsMessage}
            </li>
          ) : (
            filteredOptions.map((opt, index) => {
              const isSelected = selected.includes(opt.value);
              const isFocused = focusedIndex === index;
              const isDisabledOption =
                opt.disabled || (isAtMax && !isSelected);
              return (
                <li
                  key={opt.value}
                  id={`${id}-option-${opt.value}`}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={isDisabledOption || undefined}
                  className={[
                    styles.option,
                    isSelected ? styles.optionSelected : "",
                    isFocused ? styles.optionFocused : "",
                    isDisabledOption ? styles.optionDisabled : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    if (!isDisabledOption) toggleOption(opt.value);
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
    </div>
  );
}
