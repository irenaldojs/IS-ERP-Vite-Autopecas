import { useEffect } from "react";

/**
 * Hook to handle dismissing/closing modals or overlays when the Escape key is pressed.
 * 
 * @param isOpen - Flag indicating if the modal/overlay is currently active/open.
 * @param onClose - Callback function triggered when the Escape key is pressed.
 */
export function useEscapeKey(isOpen: boolean, onClose: () => void) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);
}
