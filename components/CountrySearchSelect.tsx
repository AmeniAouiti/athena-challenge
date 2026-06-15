"use client";

import { useEffect, useRef, useState } from "react";
import { COUNTRY_OPTIONS } from "@/lib/air-quality";

interface CountrySearchSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  exclude?: string;
}

export default function CountrySearchSelect({
  label,
  value,
  onChange,
  exclude,
}: CountrySearchSelectProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = COUNTRY_OPTIONS.find((c) => c.value === value);
  const filtered = COUNTRY_OPTIONS.filter((c) => {
    if (c.value === exclude) return false;
    const haystack = `${c.label} ${c.location}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={containerRef} className="relative min-w-0 w-full">
      <label className="mb-1.5 block text-xs font-medium tracking-wide text-[#5f6368] uppercase">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex w-full min-w-0 items-center gap-3 rounded-xl border border-[#dadce0] bg-white px-3 py-2.5 text-left shadow-sm transition hover:border-[#1a73e8] focus:border-[#1a73e8] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20 sm:px-4 sm:py-3"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f8f9fa] text-xl leading-none">
          {selected?.flag ?? "🌍"}
        </span>
        <span className="min-w-0 flex-1 overflow-hidden">
          <span className="block truncate text-sm font-medium text-[#202124]">
            {selected?.label ?? "Select country"}
          </span>
          <span className="block truncate text-xs text-[#5f6368]">
            {selected?.location ?? "—"}
          </span>
        </span>
        <svg
          className={`h-4 w-4 shrink-0 text-[#5f6368] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute z-30 mt-1.5 w-full min-w-[220px] overflow-hidden rounded-xl border border-[#dadce0] bg-white shadow-lg animate-fade-in">
          <div className="border-b border-[#e8eaed] p-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country…"
              className="w-full rounded-lg border border-[#dadce0] px-3 py-2 text-sm text-[#202124] placeholder:text-[#9aa0a6] focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]/30"
              autoFocus
            />
          </div>
          <ul className="max-h-52 overflow-y-auto py-1" role="listbox">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-[#5f6368]">No results</li>
            ) : (
              filtered.map((c) => (
                <li key={c.value} role="option" aria-selected={c.value === value}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(c.value);
                      setQuery("");
                      setOpen(false);
                    }}
                    className={`flex w-full min-w-0 items-center gap-3 px-3 py-2.5 text-left transition hover:bg-[#f1f3f4] ${
                      c.value === value ? "bg-[#e8f0fe]" : ""
                    }`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#f8f9fa] text-lg">
                      {c.flag}
                    </span>
                    <span className="min-w-0 flex-1 overflow-hidden">
                      <span className="block truncate text-sm font-medium text-[#202124]">
                        {c.label}
                      </span>
                      <span className="block truncate text-xs text-[#5f6368]">
                        {c.location}
                      </span>
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
