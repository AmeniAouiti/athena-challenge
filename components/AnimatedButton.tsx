"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "icon";

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  function AnimatedButton(
    { variant = "primary", className = "", children, ...props },
    ref
  ) {
    const base =
      variant === "primary"
        ? "btn-animated btn-primary w-full rounded-full bg-[#1a73e8] px-6 py-3 text-sm font-medium text-white shadow-sm"
        : "btn-animated btn-icon mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-[#dadce0] bg-white text-[#5f6368] shadow-sm sm:mb-0.5";

    return (
      <button ref={ref} className={`${base} ${className}`} {...props}>
        {children}
      </button>
    );
  }
);

export default AnimatedButton;
