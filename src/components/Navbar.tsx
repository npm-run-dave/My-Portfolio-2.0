"use client";
import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = ["About", "Projects", "Services", "Experience", "Contact"];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)]"
      style={{ background: "rgba(8,13,24,0.92)", backdropFilter: "blur(14px)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            {/* Code icon */}
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: "rgba(20,184,166,0.18)",
                border: "1px solid rgba(20,184,166,0.35)",
              }}
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                className="w-4 h-4"
                stroke="#14b8a6"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 6L3 10l4 4M13 6l4 4-4 4" />
              </svg>
            </div>
            {/* Text */}
            <div className="leading-tight">
              <p className="text-sm font-bold text-white tracking-wider">
                DAVE<span className="text-[var(--accent)]">.</span>
                <span className="text-[var(--accent)]">DEV</span>
              </p>
              <p className="text-[9px] text-slate-500 tracking-[0.2em] uppercase font-medium">
                Web Architect
              </p>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </div>

          {/* ── Right side ── */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {/* Available badge */}
            <span className="flex items-center gap-1.5 text-xs text-slate-300 border border-[var(--border)] rounded-full px-3 py-1.5 bg-[var(--card)]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--accent)]" />
              </span>
              Available for work
            </span>

            {/* CTA */}
            <a
              href="#contact"
              className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:brightness-110"
              style={{ background: "#14b8a6", color: "#fff" }}
            >
              Let&apos;s Talk
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3.5 h-3.5"
              >
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </a>
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            className="md:hidden text-slate-400 hover:text-white transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {open && (
        <div
          className="md:hidden border-t border-[var(--border)] px-4 py-4 space-y-1"
          style={{ background: "rgba(8,13,24,0.97)" }}
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="block text-sm text-slate-400 hover:text-white py-2.5 border-b border-[var(--border)] last:border-0 transition-colors"
              onClick={() => setOpen(false)}
            >
              {item}
            </a>
          ))}
          <a
            href="#contact"
            className="block mt-3 text-sm font-semibold text-center py-2.5 rounded-lg transition-colors"
            style={{ background: "#14b8a6", color: "#fff" }}
            onClick={() => setOpen(false)}
          >
            Let&apos;s Talk →
          </a>
        </div>
      )}
    </nav>
  );
}
