import { useState, useEffect, useRef, useCallback } from 'react';
import type { KeyboardEvent } from 'react';
import styles from './select.module.css';

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
  'aria-label'?: string;
  'aria-labelledby'?: string;
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

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find(o => o.value === selected);

  const close = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
  }, []);

  const open = useCallback(() => {
    const idx = selected !== undefined ? options.findIndex(o => o.value === selected) : -1;
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
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [isOpen, close]);

  useEffect(() => {
    if (isOpen) listboxRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (focusedIndex < 0 || !listboxRef.current) return;
    const opt = options[focusedIndex];
    if (!opt) return;
    const el = listboxRef.current.querySelector<HTMLLIElement>(`[id="${id}-option-${opt.value}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [focusedIndex, options, id]);

  const selectOption = useCallback(
    (optValue: string) => {
      if (!isControlled) setInternalValue(optValue);
      onChange?.(optValue);
      close();
      triggerRef.current?.focus();
    },
    [isControlled, onChange, close],
  );

  const handleTriggerClick = useCallback(() => {
    if (!disabled) {
      if (isOpen) close(); else open();
    }
  }, [disabled, isOpen, close, open]);

  const handleTriggerKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!disabled) { if (isOpen) close(); else open(); }
      } else if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !isOpen) {
        e.preventDefault();
        if (!disabled) open();
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        close();
        triggerRef.current?.focus();
      }
    },
    [disabled, isOpen, close, open],
  );

  const handleListboxKeyDown = useCallback(
    (e: KeyboardEvent<HTMLUListElement>) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => {
            let next = prev + 1;
            while (next < options.length && options[next]?.disabled) next++;
            return next < options.length ? next : prev;
          });
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => {
            let next = prev - 1;
            while (next >= 0 && options[next]?.disabled) next--;
            return next >= 0 ? next : prev;
          });
          break;
        case 'Enter':
        case ' ': {
          e.preventDefault();
          if (focusedIndex >= 0) {
            const opt = options[focusedIndex];
            if (opt && !opt.disabled) selectOption(opt.value);
          }
          break;
        }
        case 'Escape':
          e.preventDefault();
          close();
          triggerRef.current?.focus();
          break;
        case 'Tab':
          close();
          break;
      }
    },
    [options, focusedIndex, selectOption, close],
  );

  const focusedOptionId =
    focusedIndex >= 0 && options[focusedIndex]
      ? `${id}-option-${options[focusedIndex].value}`
      : undefined;

  return {
    id,
    selected,
    selectedOption,
    isOpen,
    focusedIndex,
    focusedOptionId,
    containerRef,
    triggerRef,
    listboxRef,
    setFocusedIndex,
    selectOption,
    handleTriggerClick,
    handleTriggerKeyDown,
    handleListboxKeyDown,
  };
}

export function Select({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = 'Select...',
  disabled = false,
  id: externalId,
  className,
  label,
  required = false,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: SelectProps) {
  const {
    id,
    selected,
    selectedOption,
    isOpen,
    focusedIndex,
    focusedOptionId,
    containerRef,
    triggerRef,
    listboxRef,
    setFocusedIndex,
    selectOption,
    handleTriggerClick,
    handleTriggerKeyDown,
    handleListboxKeyDown,
  } = useSelect({ options, value, defaultValue, onChange, disabled });

  const effectiveLabelledBy = ariaLabelledBy ?? (label ? `${id}-label` : undefined);

  return (
    <div
      ref={containerRef}
      className={[styles.container, disabled ? styles.disabled : '', className ?? '']
        .filter(Boolean)
        .join(' ')}
    >
      {label && (
        <label id={`${id}-label`} className={styles.label}>
          {label}
          {required && <span aria-hidden="true" className={styles.required}>*</span>}
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
        className={[styles.trigger, isOpen ? styles.triggerOpen : ''].filter(Boolean).join(' ')}
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
          className={[styles.chevron, isOpen ? styles.chevronUp : ''].filter(Boolean).join(' ')}
          aria-hidden="true"
        >
          ▾
        </span>
      </div>

      {isOpen && (
        <div className={styles.dropdown} role="presentation">
          <ul
            ref={listboxRef}
            id={`${id}-listbox`}
            role="listbox"
            aria-label={ariaLabel ?? placeholder}
            aria-activedescendant={focusedOptionId}
            tabIndex={-1}
            className={styles.listbox}
            onKeyDown={handleListboxKeyDown}
          >
            {options.map((opt, index) => {
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
                    isSelected ? styles.optionSelected : '',
                    isFocused ? styles.optionFocused : '',
                    opt.disabled ? styles.optionDisabled : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => { if (!opt.disabled) selectOption(opt.value); }}
                  onMouseEnter={() => setFocusedIndex(index)}
                >
                  <span className={styles.optionCheck} aria-hidden="true">
                    {isSelected ? '✓' : ''}
                  </span>
                  <span className={styles.optionLabel}>{opt.label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
