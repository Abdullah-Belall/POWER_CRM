"use client";
import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function BlackLayer({
  onClick,
  transparent = false,
  children,
}: {
  onClick: () => void;
  transparent?: boolean
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
      className={` flex justify-center items-center w-full h-full fixed left-0 top-0 !z-[99999]
        ${transparent ? 'bg-transparent' : 'backdrop-blur-[1px] bg-[#00000066]'}
        `}
    >
      {children}
    </div>,
    document.body
  );
}
