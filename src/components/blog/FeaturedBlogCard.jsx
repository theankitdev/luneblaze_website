// src/components/blog/FeaturedBlogCard.jsx
"use client";

export default function FeaturedBlogCard({
  image = "/assets/blog-1.webp",
  title = "Understanding the Seven SQAAF Domains",
  description = "The framework looks daunting until you see how the seven domains actually fit together. This is the piece we send every new coordinator — domains, sub-domains, the 84 standards beneath them, and where the real work sits.",
  href = "/blog-domains.html",
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0,1.16fr) minmax(0,.84fr)",
        gap: "clamp(18px,2.2vw,32px)",
        alignItems: "center",
        background: "#fff",
        border: "1px solid #DCEAEC",
        borderRadius: 10,
        padding: "clamp(16px,1.8vw,22px)",
        marginBottom: "clamp(20px,2.4vw,30px)",
        boxShadow: "0 2px 4px rgba(23,35,38,.03),0 34px 68px -44px rgba(15,60,66,.45)",
      }}
    >
      <div style={{ position: "relative", borderRadius: 8, overflow: "hidden", background: "#EDF4F5", minHeight: "clamp(220px,26vw,300px)" }}>
        <img
          src={image}
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", background: "#EDF7F8", display: "block" }}
        />
        <span
          style={{
            position: "absolute",
            top: 13,
            left: 13,
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            padding: "6px 12px",
            background: "rgba(196,55,60,.96)",
            borderRadius: 4,
            fontSize: 9.5,
            fontWeight: 800,
            letterSpacing: ".1em",
            color: "#fff",
          }}
        >
          GUIDE
        </span>
      </div>
      <div style={{ minWidth: 0 }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            padding: "5px 12px",
            background: "#E4F5F6",
            borderRadius: 4,
            fontSize: 9.5,
            fontWeight: 800,
            letterSpacing: ".12em",
            color: "#0E7A83",
          }}
        >
          EDITOR&apos;S PICK
        </span>
        <h2 style={{ margin: "14px 0 0", fontSize: "clamp(20px,2.2vw,29px)", lineHeight: 1.16, letterSpacing: "-.028em", fontWeight: 800, color: "#152A2E" }}>
          {title}
        </h2>
        <p style={{ margin: "12px 0 0", fontSize: "clamp(13.5px,1.05vw,15.5px)", lineHeight: 1.64, color: "#5F7175" }}>
          {description}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 18 }}>
          {[
            { label: "8 min read", icon: "cal" },
            { label: "Beginner friendly", icon: "clock" },
            { label: "Updated for this cycle", icon: "user" },
          ].map((m) => (
            <span key={m.label} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12.5, fontWeight: 600, color: "#3E5257" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0E8B95" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {m.icon === "cal" && <><rect x="4" y="5" width="16" height="15" rx="2.5" /><path d="M8 3.5v3M16 3.5v3M4 10h16" /></>}
                {m.icon === "clock" && <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>}
                {m.icon === "user" && <><circle cx="9" cy="8.5" r="3.2" /><path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5" /><path d="M16 6.8a3 3 0 0 1 0 5.9" /></>}
              </svg>
              {m.label}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 22 }}>
          <a
            href={href}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              background: "#17AEB9",
              color: "#fff",
              borderRadius: 10,
              padding: "13px 22px",
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 12px 26px -12px rgba(23,174,185,.85)",
              transition: "transform .28s cubic-bezier(.22,.8,.2,1)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
          >
            Read the guide
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12h14" />
              <path d="M12 6l6 6-6 6" />
            </svg>
          </a>
          <button
            type="button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#fff",
              color: "#25936B",
              border: "1px solid #C7E7D9",
              borderRadius: 10,
              padding: "12px 18px",
              fontSize: 13.5,
              fontWeight: 700,
              cursor: "pointer",
              transition: "background .28s ease, color .28s ease, border-color .28s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#25936B";
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.borderColor = "#25936B";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.color = "#25936B";
              e.currentTarget.style.borderColor = "#C7E7D9";
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.04 2.5c-5.2 0-9.42 4.2-9.42 9.4 0 1.65.44 3.27 1.26 4.7L2.5 21.5l5.05-1.32a9.45 9.45 0 0 0 4.49 1.14c5.2 0 9.42-4.22 9.42-9.42 0-5.2-4.22-9.4-9.42-9.4Zm5.5 13.3c-.23.65-1.35 1.25-1.87 1.3-.52.06-1 .1-1.83-.22a13.6 13.6 0 0 1-4.06-2.6 10.6 10.6 0 0 1-2.2-3.1c-.24-.6-.26-1.12-.18-1.5.08-.4.5-.93.68-1.12.19-.2.36-.24.5-.24h.36c.13 0 .3-.03.47.35.17.4.6 1.46.65 1.57.05.1.08.23 0 .37-.07.14-.32.47-.47.63-.09.1-.2.2-.07.42.44.75.98 1.4 1.63 1.94.4.34.8.6 1.34.87.2.1.33.09.46-.05.13-.15.55-.63.7-.85.14-.22.28-.18.47-.11.2.07 1.24.6 1.46.7.21.11.35.17.4.26.05.1.05.55-.18 1.2Z" />
            </svg>
            Share
          </button>
        </div>
      </div>
    </div>
  );
}