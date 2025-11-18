"use client";
import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function BlackLayer({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  const isBrowser = typeof window !== "undefined";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if(onClick) {
          onClick();
        }
      }
    };

    if (isBrowser) {
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [onClick]);

  if (!isBrowser) return null;

  return createPortal(
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          if(onClick) {
            onClick();
          }
        }
      }}
      className="backdrop-blur-[1px] flex justify-center items-center w-full h-full fixed left-0 top-0 bg-[#00000066] !z-[99999]"
    >
      {children}
    </div>,
    document.body
  );
}
