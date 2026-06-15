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
    <div ref={containerRef} className="relative">
      <label className="mb-1.5 block text-xs font-medium tracking-wide text-[#5f6368] uppercase">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-[#dadce0] bg-white px-4 py-3 text-left shadow-sm transition hover:border-[#1a73e8] focus:border-[#1a73e8] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20"
      >
        <span className="flex items-center gap-2.5 truncate">
          <span className="text-xl leading-none">{selected?.flag}</span>
          <span>
            <span className="block text-sm font-medium text-[#202124]">
              {selected?.label}
            </span>
            <span className="block text-xs text-[#5f6368]">
              {selected?.location}
            </span>
          </span>
        </span>
        <svg
          className={`h-4 w-4 shrink-0 text-[#5f6368] transition ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
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
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-[#dadce0] bg-white shadow-lg animate-fade-in">
          <div className="border-b border-[#e8eaed] p-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country…"
              className="w-full rounded-lg border border-[#dadce0] px-3 py-2 text-sm text-[#202124] placeholder:text-[#9aa0a6] focus:border-[#1a73e8] focus:outline-none"
              autoFocus
            />
          </div>
          <ul className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-[#5f6368]">No results</li>
            ) : (
              filtered.map((c) => (
                <li key={c.value}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(c.value);
                      setQuery("");
                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left transition hover:bg-[#f1f3f4] ${
                      c.value === value ? "bg-[#e8f0fe]" : ""
                    }`}
                  >
                    <span className="text-lg">{c.flag}</span>
                    <span>
                      <span className="block text-sm font-medium text-[#202124]">
                        {c.label}
                      </span>
                      <span className="block text-xs text-[#5f6368]">
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
