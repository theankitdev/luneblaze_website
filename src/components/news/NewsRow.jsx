// src/components/blog/NewsRow.jsx
"use client";

export default function NewsRow({ item }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "clamp(14px,1.8vw,22px)",
        background: "#fff",
        border: "1px solid #E4EEEF",
        borderRadius: 10,
        padding: "clamp(14px,1.6vw,20px)",
        transition: "transform .3s cubic-bezier(.22,.8,.2,1),border-color .3s ease,box-shadow .3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateX(4px)";
        e.currentTarget.style.borderColor = "#17AEB9";
        e.currentTarget.style.boxShadow = "0 22px 44px -28px rgba(15,60,66,.45)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.borderColor = "#E4EEEF";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          position: "relative",
          flex: "none",
          width: "clamp(96px,11vw,132px)",
          aspectRatio: "1 / 1",
          borderRadius: 8,
          overflow: "hidden",
          background: "#EDF4F5",
        }}
      >
        <img
          src={item.img}
          alt=""
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "4px 10px",
              borderRadius: 4,
              background: "#E4F5F6",
              fontSize: 9.5,
              fontWeight: 800,
              letterSpacing: ".09em",
              color: "#0E8B95",
            }}
          >
            {item.tag}
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#66787C" }}>{item.meta}</span>
        </div>
        <h3
          style={{
            margin: 0,
            fontSize: "clamp(15px,1.35vw,18px)",
            fontWeight: 800,
            letterSpacing: "-.018em",
            lineHeight: 1.3,
            color: "#152A2E",
          }}
        >
          {item.title}
        </h3>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.58, color: "#5F7175" }}>
          {item.desc}
        </p>
      </div>
      <div
        style={{
          flex: "none",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 9,
        }}
      >
        <a
          href={item.href}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            background: "#17AEB9",
            color: "#fff",
            borderRadius: 9,
            padding: "11px 18px",
            fontSize: 12.5,
            fontWeight: 700,
            whiteSpace: "nowrap",
            textDecoration: "none",
            transition: "transform .28s cubic-bezier(.22,.8,.2,1)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
        >
          {item.cta ?? "Read update"}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12h14" />
            <path d="M12 6l6 6-6 6" />
          </svg>
        </a>
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <button
            aria-label="Share on WhatsApp"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 30,
              height: 30,
              flex: "none",
              borderRadius: 8,
              background: "#F2F9FA",
              border: "1px solid #E4EEEF",
              color: "#25936B",
              cursor: "pointer",
              transition: "background .25s ease,color .25s ease,border-color .25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#25936B";
              e.currentTarget.style.borderColor = "#25936B";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#F2F9FA";
              e.currentTarget.style.borderColor = "#E4EEEF";
              e.currentTarget.style.color = "#25936B";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.04 2.5c-5.2 0-9.42 4.2-9.42 9.4 0 1.65.44 3.27 1.26 4.7L2.5 21.5l5.05-1.32a9.45 9.45 0 0 0 4.49 1.14c5.2 0 9.42-4.22 9.42-9.42 0-5.2-4.22-9.4-9.42-9.4Zm5.5 13.3c-.23.65-1.35 1.25-1.87 1.3-.52.06-1 .1-1.83-.22a13.6 13.6 0 0 1-4.06-2.6 10.6 10.6 0 0 1-2.2-3.1c-.24-.6-.26-1.12-.18-1.5.08-.4.5-.93.68-1.12.19-.2.36-.24.5-.24h.36c.13 0 .3-.03.47.35.17.4.6 1.46.65 1.57.05.1.08.23 0 .37-.07.14-.32.47-.47.63-.09.1-.2.2-.07.42.44.75.98 1.4 1.63 1.94.4.34.8.6 1.34.87.2.1.33.09.46-.05.13-.15.55-.63.7-.85.14-.22.28-.18.47-.11.2.07 1.24.6 1.46.7.21.11.35.17.4.26.05.1.05.55-.18 1.2Z" />
            </svg>
          </button>
          <button
            aria-label="Copy link"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 30,
              height: 30,
              flex: "none",
              borderRadius: 8,
              background: "#F2F9FA",
              border: "1px solid #E4EEEF",
              color: "#3E5257",
              cursor: "pointer",
              transition: "background .25s ease,color .25s ease,border-color .25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#17AEB9";
              e.currentTarget.style.borderColor = "#17AEB9";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#F2F9FA";
              e.currentTarget.style.borderColor = "#E4EEEF";
              e.currentTarget.style.color = "#3E5257";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 14a4 4 0 0 0 5.7 0l2.8-2.8a4 4 0 0 0-5.7-5.7l-1 1" />
              <path d="M14 10a4 4 0 0 0-5.7 0L5.5 12.8a4 4 0 0 0 5.7 5.7l1-1" />
            </svg>
          </button>
        </span>
      </div>
    </div>
  );
}