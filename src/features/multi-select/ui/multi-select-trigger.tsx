import { Combobox } from "@base-ui/react/combobox";
import * as React from "react";

import type { Option } from "./multi-select";
import styles from "./multi-select-trigger.module.css";

interface TriggerProps {
  id?: string;
  selectedObjs: Option[];
  placeholder: string;
  clearAll: (e: React.MouseEvent) => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function MultiSelectTrigger({
  id,
  selectedObjs,
  placeholder,
  clearAll,
  disabled,
  icon,
}: TriggerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const measureRef = React.useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = React.useState(selectedObjs.length);
  const [isFocused, setIsFocused] = React.useState(false);

  const handleWrapperClick = () => {
    if (disabled) return;
    const inputEl = containerRef.current?.querySelector("input");
    if (inputEl) {
      inputEl.focus();
    }
  };

  React.useLayoutEffect(() => {
    const container = containerRef.current;
    const measureArea = measureRef.current;
    if (!container || !measureArea) return;

    const calculate = () => {
      const chips = Array.from(
        measureArea.querySelectorAll("[data-measure-chip]")
      ) as HTMLElement[];
      if (chips.length === 0) {
        setVisibleCount(0);
        return;
      }

      const availableWidth = container.clientWidth;
      let count = 0;
      const badgeWidth = 45;
      const gap = 4;

      for (let i = 0; i < chips.length; i++) {
        // Use getBoundingClientRect().width for precise sub-pixel fractional width
        const chipWidth = chips[i].getBoundingClientRect().width;

        const isLast = i === chips.length - 1;
        const requiredWidth = isLast ? chipWidth : chipWidth + gap + badgeWidth;

        console.log(`[TEST-DEBUG] i=${i} chipWidth=${chipWidth} requiredWidth=${requiredWidth} availableWidth=${availableWidth}`);

        if (requiredWidth > availableWidth) {
          break;
        }
        count++;
      }

      setVisibleCount(count);
    };

    // Run synchronously immediately to ensure perfect first paint
    calculate();

    const observer = new ResizeObserver(() => calculate());

    observer.observe(container);
    return () => observer.disconnect();
  }, [selectedObjs]);

  const tooltipText =
    selectedObjs.length > 0 ? selectedObjs.map((o) => o.label).join(", ") : undefined;

  const renderedCount = Math.min(
    visibleCount < selectedObjs.length ? visibleCount + 1 : visibleCount,
    selectedObjs.length
  );
  const hiddenCount = selectedObjs.length <= 1 ? 0 : selectedObjs.length - visibleCount;

  return (
    <Combobox.InputGroup className={styles.triggerWrapper} title={tooltipText}>
      {icon && <span className={styles.iconWrapper}>{icon}</span>}
      <div className={styles.chipArea} ref={containerRef} onClick={handleWrapperClick}>
        <div ref={measureRef} className={styles.measureLayer} aria-hidden="true">
          {selectedObjs.map((_, i) => {
            const text = selectedObjs
              .slice(0, i + 1)
              .map((opt) => opt.label)
              .join(", ");
            return (
              <span
                key={i}
                data-measure-chip
                style={{
                  whiteSpace: "nowrap",
                  position: "absolute",
                  visibility: "hidden",
                  fontSize: "0.875rem",
                  fontFamily: "var(--ms-font-family, inherit)",
                }}
              >
                {text}
              </span>
            );
          })}
        </div>

        {!isFocused && selectedObjs.length > 0 && (
          <>
            <span
              style={{
                flex: 1,
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                color: "var(--ms-text-color, inherit)",
                fontSize: "0.875rem",
              }}
            >
              {selectedObjs
                .slice(0, renderedCount)
                .map((opt) => opt.label)
                .join(", ")}
            </span>
            {hiddenCount > 0 && (
              <span className={styles.badge} style={{ flexShrink: 0, marginLeft: "auto" }}>
                +{hiddenCount}
              </span>
            )}
          </>
        )}

        <Combobox.Input
          id={id}
          className={styles.searchInputTrigger}
          placeholder={isFocused || selectedObjs.length === 0 ? placeholder : ""}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={
            !isFocused && selectedObjs.length > 0
              ? { width: 0, minWidth: 0, padding: 0, border: "none", opacity: 0 }
              : undefined
          }
        />
      </div>
      <div className={styles.actions}>
        {selectedObjs.length > 0 && !disabled ? (
          <button
            type="button"
            aria-label="Clear all"
            className={styles.clearAll}
            onClick={clearAll}
            tabIndex={-1}
          >
            <ClearIcon />
          </button>
        ) : (
          <Combobox.Trigger className={styles.chevronButton} disabled={disabled} tabIndex={-1}>
            <ChevronIcon className={styles.chevron} />
          </Combobox.Trigger>
        )}
      </div>
    </Combobox.InputGroup>
  );
}

function ClearIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}

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
