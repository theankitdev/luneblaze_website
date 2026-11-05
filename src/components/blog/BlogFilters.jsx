// src/components/blog/BlogFilters.jsx
"use client";

export default function BlogFilters({ filters = [], resultLabel = "", filtered = false, onClear }) {
  return (
    <div style={{ marginBottom: "clamp(22px,2.6vw,32px)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 13 }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: ".14em",
            textTransform: "uppercase",
            color: "#66787C",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", color: "#0E8B95" }}>
            <path d="M4 6h16" />
            <path d="M7 12h10" />
            <path d="M10 18h4" />
          </svg>
          Filter
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#3E5257" }}>{resultLabel}</span>
        {filtered && (
          <button
            onClick={onClear}
            style={{
              marginLeft: "auto",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "transparent",
              border: "none",
              padding: "6px 2px",
              fontFamily: "inherit",
              fontSize: 11.5,
              fontWeight: 700,
              color: "#0E8B95",
              cursor: "pointer",
              transition: "color .25s ease",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M6 6l12 12" />
              <path d="M18 6L6 18" />
            </svg>
            Clear filter
          </button>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: 2,
          padding: 5,
          background: "#F1F7F8",
          border: "1px solid #E2EEEF",
          borderRadius: 10,
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
      >
        {filters.map((f) => {
          const on = f.on;
          return (
            <button
              key={f.key}
              onClick={f.pick}
              aria-pressed={on}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                flex: "none",
                background: on ? "#fff" : "transparent",
                border: "none",
                borderRadius: 8,
                padding: "10px clamp(11px,1.2vw,17px)",
                fontFamily: "inherit",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "-.01em",
                whiteSpace: "nowrap",
                cursor: "pointer",
                color: on ? "#0B3A40" : "#6B7C80",
                boxShadow: on ? "0 1px 2px rgba(15,60,66,.08),0 8px 18px -12px rgba(15,60,66,.45)" : "none",
                transition: "color .3s ease, background .3s ease, box-shadow .3s ease",
              }}
            >
              {f.label}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: 18,
                  height: 18,
                  padding: "0 5px",
                  borderRadius: 4,
                  background: on ? "#E4F5F6" : "rgba(15,60,66,.06)",
                  fontSize: 10,
                  fontWeight: 800,
                  color: on ? "#0E8B95" : "#8A9B9E",
                  transition: "background .3s ease, color .3s ease",
                }}
              >
                {f.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}