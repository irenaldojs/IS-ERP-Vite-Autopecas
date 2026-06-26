import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

export interface AutocompleteInputProps {
  label: string;
  placeholder: string;
  items: Array<{ id: string; label: string }>;
  selectedValue: string;
  onSelect: (id: string) => void;
  onClear: () => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  nextInputRef?: React.RefObject<HTMLInputElement | null>;
  onSubmit?: () => void;
  resetTrigger?: number;
  onInputChange?: (value: string) => void;
}

export default function AutocompleteInput({
  label,
  placeholder,
  items,
  selectedValue,
  onSelect,
  onClear,
  inputRef,
  nextInputRef,
  onSubmit,
  resetTrigger,
  onInputChange,
}: AutocompleteInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync initial/selected value with text
  useEffect(() => {
    if (selectedValue) {
      const match = items.find((item) => item.id === selectedValue);
      if (match) {
        setInputValue(match.label);
        if (onInputChange) {
          onInputChange(match.label);
        }
      }
    } else {
      // Apenas limpa se o input não estiver focado (indica reset programático externo, não digitação ativa)
      if (document.activeElement !== containerRef.current?.querySelector("input")) {
        setInputValue("");
        if (onInputChange) {
          onInputChange("");
        }
      }
    }
  }, [selectedValue, items]);

  // Reset internal input value when resetTrigger updates
  useEffect(() => {
    if (resetTrigger && resetTrigger > 0) {
      setInputValue("");
      onClear();
      if (onInputChange) {
        onInputChange("");
      }
    }
  }, [resetTrigger]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredItems = inputValue.trim() === ""
    ? []
    : items.filter((item) =>
        item.label.toLowerCase().includes(inputValue.toLowerCase())
      );

  const showDropdown = isOpen && filteredItems.length > 0 && inputValue.trim() !== "";

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation(); // Prevent keyboard shortcuts from firing
    if (!isOpen) {
      if (e.key === "Enter") {
        if (onSubmit) {
          onSubmit();
        }
      } else if (e.key === "ArrowDown" && inputValue.trim() !== "") {
        setIsOpen(true);
        setActiveIndex(0);
        e.preventDefault();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[activeIndex]) {
        onSelect(filteredItems[activeIndex].id);
        setInputValue(filteredItems[activeIndex].label);
        if (onInputChange) {
          onInputChange(filteredItems[activeIndex].label);
        }
      }
      setIsOpen(false);
      if (nextInputRef?.current) {
        nextInputRef.current.focus();
      } else if (onSubmit) {
        onSubmit();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (onInputChange) {
      onInputChange(val);
    }
    if (val.trim() === "") {
      setIsOpen(false);
      onClear();
    } else {
      setIsOpen(true);
      setActiveIndex(0);
    }
  };

  const handleSelectItem = (item: { id: string; label: string }) => {
    onSelect(item.id);
    setInputValue(item.label);
    if (onInputChange) {
      onInputChange(item.label);
    }
    setIsOpen(false);
    if (nextInputRef?.current) {
      nextInputRef.current.focus();
    }
  };

  return (
    <div ref={containerRef} className="space-y-1 relative w-full">
      <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--colorNeutralForeground3)]">
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (inputValue.trim() !== "") {
              setIsOpen(true);
            }
          }}
          className="w-full px-3 py-1.5 bg-[var(--colorNeutralBackground1)] border border-[var(--colorNeutralStroke1)] rounded text-xs text-[var(--colorNeutralForeground1)] focus:outline-none focus:border-[var(--colorBrandStroke1)] transition-colors h-[32px] pr-8"
        />
        {inputValue && (
          <button
            type="button"
            onClick={() => {
              setInputValue("");
              onClear();
              if (onInputChange) {
                onInputChange("");
              }
              setIsOpen(false);
            }}
            className="absolute right-2.5 top-2 text-[var(--colorNeutralForeground3)] hover:text-[var(--colorNeutralForeground1)] cursor-pointer"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {showDropdown && (
        <ul className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-[var(--colorNeutralBackground3)] border border-[var(--colorNeutralStroke1)] rounded shadow-xl z-50 divide-y divide-[var(--colorNeutralStroke1)]/30">
          {filteredItems.map((item, idx) => {
            const isActive = idx === activeIndex;
            return (
              <li
                key={item.id}
                onClick={() => handleSelectItem(item)}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`px-3 py-2 text-xs cursor-pointer transition-colors ${
                  isActive 
                    ? "bg-[var(--colorSubtleBackgroundSelected)] text-[var(--colorNeutralForeground1Selected)] font-semibold" 
                    : "text-[var(--colorNeutralForeground1)] hover:bg-[var(--colorSubtleBackgroundHover)]"
                }`}
              >
                {item.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
