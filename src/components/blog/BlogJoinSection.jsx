// src/components/blog/BlogJoinSection.jsx
"use client";

export default function BlogJoinSection() {
  return (
    <section
      id="join"
      style={{
        position: "relative",
        padding: "clamp(42px,4.8vw,72px) clamp(20px,4vw,52px)",
        background: "#EDF7F8",
        overflow: "hidden",
      }}
    >
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.42,
            backgroundImage:
              "radial-gradient(circle,rgba(23,174,185,.18) 1.1px,transparent 1.1px)",
            backgroundSize: "28px 28px",
            animation: "lbGridPan 42s linear infinite",
          }}
        />
      </div>

      <div style={{ position: "relative", maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
        <span
          aria-hidden="true"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 56,
            height: 56,
            borderRadius: 10,
            background: "#25936B",
            color: "#fff",
            boxShadow: "0 16px 32px -14px rgba(37,147,107,.7)",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.04 2.5c-5.2 0-9.42 4.2-9.42 9.4 0 1.65.44 3.27 1.26 4.7L2.5 21.5l5.05-1.32a9.45 9.45 0 0 0 4.49 1.14c5.2 0 9.42-4.22 9.42-9.42 0-5.2-4.22-9.4-9.42-9.4Zm5.5 13.3c-.23.65-1.35 1.25-1.87 1.3-.52.06-1 .1-1.83-.22a13.6 13.6 0 0 1-4.06-2.6 10.6 10.6 0 0 1-2.2-3.1c-.24-.6-.26-1.12-.18-1.5.08-.4.5-.93.68-1.12.19-.2.36-.24.5-.24h.36c.13 0 .3-.03.47.35.17.4.6 1.46.65 1.57.05.1.08.23 0 .37-.07.14-.32.47-.47.63-.09.1-.2.2-.07.42.44.75.98 1.4 1.63 1.94.4.34.8.6 1.34.87.2.1.33.09.46-.05.13-.15.55-.63.7-.85.14-.22.28-.18.47-.11.2.07 1.24.6 1.46.7.21.11.35.17.4.26.05.1.05.55-.18 1.2Z" />
          </svg>
        </span>
        <h2 style={{ margin: "18px 0 0", fontSize: "clamp(24px,3vw,38px)", lineHeight: 1.1, letterSpacing: "-.032em", fontWeight: 800, color: "#152A2E" }}>
          New Posts on WhatsApp
        </h2>
        <p style={{ margin: "14px auto 0", maxWidth: "56ch", fontSize: "clamp(14px,1.08vw,16.5px)", lineHeight: 1.65, color: "#5F7175" }}>
          Join the Luneblaze quality group and get new guides, templates and practice notes as they are published — alongside coordinators working through the same problems.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 26 }}>
          <a
            href="https://wa.me/918810418840?text=Hi%20Luneblaze%2C%20please%20add%20me%20to%20the%20quality%20WhatsApp%20group."
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              background: "#25936B",
              color: "#fff",
              borderRadius: 10,
              padding: "15px 26px",
              fontSize: 15,
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 12px 28px -10px rgba(37,147,107,.8)",
              transition: "transform .28s cubic-bezier(.22,.8,.2,1)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
          >
            Join the WhatsApp Group
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12h14" />
              <path d="M12 6l6 6-6 6" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/newsletters/7125753253224493056/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              background: "#fff",
              color: "#152A2E",
              border: "1px solid #CFE8EA",
              borderRadius: 10,
              padding: "14px 24px",
              fontSize: 15,
              fontWeight: 700,
              textDecoration: "none",
              transition: "transform .28s cubic-bezier(.22,.8,.2,1),border-color .28s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.borderColor = "#17AEB9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.borderColor = "#CFE8EA";
            }}
          >
            Email newsletter instead
          </a>
        </div>
      </div>
    </section>
  );
}