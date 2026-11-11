// src/components/blog/FeaturedBlogCard.jsx
"use client";

import { useEffect, useState } from "react";

export default function FeaturedBlogCard({
  image = "/assets/blog-1.webp",
  title = "Understanding the Seven SQAAF Domains",
  description = "The framework looks daunting until you see how the seven domains actually fit together. This is the piece we send every new coordinator — domains, sub-domains, the 84 standards beneath them, and where the real work sits.",
  href = "/blog-domains.html",
  onShare, // optional: parent can observe/log the share
}) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Scroll lock + Escape to close
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const openModal = () => {
    setSent(false);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setSent(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // TODO: POST to your real endpoint
    await new Promise((r) => setTimeout(r, 400));
    setSubmitting(false);
    setSent(true);
  };

  /**
   * Share the featured guide.
   * Order of preference:
   *  1. Native Web Share API (mobile / supported desktop browsers)
   *  2. WhatsApp share URL (same as the DC page's data-sh="wa" behaviour)
   *  3. Clipboard copy with a toast fallback
   */
  const handleShare = async () => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}${href}`
        : `https://www.luneblaze.com${href}`;

    // 1. Native share sheet
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
        setToast("Shared");
        onShare?.({ title, url });
        return;
      } catch (err) {
        // User cancelled (AbortError) → do nothing.
        // Other errors fall through to WhatsApp.
        if (err && err.name === "AbortError") return;
      }
    }

    // 2. WhatsApp share (matches the DC page's behaviour)
    try {
      const waUrl = `https://wa.me/?text=${encodeURIComponent(
        `${title} — ${url}`
      )}`;
      const w = window.open(waUrl, "_blank", "noopener,noreferrer");
      if (!w) throw new Error("popup blocked");
      setToast("Opening WhatsApp…");
      onShare?.({ title, url });
      return;
    } catch {
      // fall through
    }

    // 3. Clipboard
    try {
      await navigator.clipboard.writeText(url);
      setToast("Link copied");
      onShare?.({ title, url });
    } catch {
      setToast(`Copy this link: ${url}`);
    }
  };

  return (
    <>
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
          boxShadow:
            "0 2px 4px rgba(23,35,38,.03),0 34px 68px -44px rgba(15,60,66,.45)",
        }}
      >
        <div
          style={{
            position: "relative",
            borderRadius: 8,
            overflow: "hidden",
            background: "#EDF4F5",
            minHeight: "clamp(220px,26vw,300px)",
          }}
        >
          <img
            src={image}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              background: "#EDF7F8",
              display: "block",
            }}
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
          <h2
            style={{
              margin: "14px 0 0",
              fontSize: "clamp(20px,2.2vw,29px)",
              lineHeight: 1.16,
              letterSpacing: "-.028em",
              fontWeight: 800,
              color: "#152A2E",
            }}
          >
            {title}
          </h2>
          <p
            style={{
              margin: "12px 0 0",
              fontSize: "clamp(13.5px,1.05vw,15.5px)",
              lineHeight: 1.64,
              color: "#5F7175",
            }}
          >
            {description}
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              marginTop: 18,
            }}
          >
            {[
              { label: "8 min read", icon: "cal" },
              { label: "Beginner friendly", icon: "clock" },
              { label: "Updated for this cycle", icon: "user" },
            ].map((m) => (
              <span
                key={m.label}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: "#3E5257",
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0E8B95"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {m.icon === "cal" && (
                    <>
                      <rect x="4" y="5" width="16" height="15" rx="2.5" />
                      <path d="M8 3.5v3M16 3.5v3M4 10h16" />
                    </>
                  )}
                  {m.icon === "clock" && (
                    <>
                      <circle cx="12" cy="12" r="8.5" />
                      <path d="M12 7.5V12l3 2" />
                    </>
                  )}
                  {m.icon === "user" && (
                    <>
                      <circle cx="9" cy="8.5" r="3.2" />
                      <path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5" />
                      <path d="M16 6.8a3 3 0 0 1 0 5.9" />
                    </>
                  )}
                </svg>
                {m.label}
              </span>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginTop: 22,
            }}
          >
            {/* Opens the "Get new posts" subscribe modal — matches DC openDemo */}
            <button
              type="button"
              onClick={openModal}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                background: "#17AEB9",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "13px 22px",
                fontFamily: "inherit",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 12px 26px -12px rgba(23,174,185,.85)",
                transition: "transform .28s cubic-bezier(.22,.8,.2,1)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-3px)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
            >
              Read the guide
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12h14" />
                <path d="M12 6l6 6-6 6" />
              </svg>
            </button>

            {/* Share button — self-contained, works with or without onShare */}
            <button
              type="button"
              onClick={handleShare}
              aria-label="Share this guide"
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
                transition:
                  "background .28s ease, color .28s ease, border-color .28s ease",
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
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12.04 2.5c-5.2 0-9.42 4.2-9.42 9.4 0 1.65.44 3.27 1.26 4.7L2.5 21.5l5.05-1.32a9.45 9.45 0 0 0 4.49 1.14c5.2 0 9.42-4.22 9.42-9.42 0-5.2-4.22-9.4-9.42-9.4Zm5.5 13.3c-.23.65-1.35 1.25-1.87 1.3-.52.06-1 .1-1.83-.22a13.6 13.6 0 0 1-4.06-2.6 10.6 10.6 0 0 1-2.2-3.1c-.24-.6-.26-1.12-.18-1.5.08-.4.5-.93.68-1.12.19-.2.36-.24.5-.24h.36c.13 0 .3-.03.47.35.17.4.6 1.46.65 1.57.05.1.08.23 0 .37-.07.14-.32.47-.47.63-.09.1-.2.2-.07.42.44.75.98 1.4 1.63 1.94.4.34.8.6 1.34.87.2.1.33.09.46-.05.13-.15.55-.63.7-.85.14-.22.28-.18.47-.11.2.07 1.24.6 1.46.7.21.11.35.17.4.26.05.1.05.55-.18 1.2Z" />
              </svg>
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Inline toast for share feedback */}
      {toast && (
        <div
          role="status"
          style={{
            position: "fixed",
            left: "50%",
            bottom: "clamp(88px,11vh,110px)",
            transform: "translateX(-50%)",
            zIndex: 118,
            display: "inline-flex",
            alignItems: "center",
            gap: 9,
            background: "#152A2E",
            color: "#fff",
            borderRadius: 999,
            padding: "11px 19px",
            fontSize: 12.5,
            fontWeight: 700,
            boxShadow: "0 20px 40px -18px rgba(11,32,35,.6)",
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6EE7B7"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
          {toast}
        </div>
      )}

      {/* "Get new posts" modal */}
      {open && (
        <div
          role="presentation"
          onClick={closeModal}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 120,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "clamp(16px,4vh,48px) 16px",
            overflowY: "auto",
            background: "rgba(11,32,35,.44)",
            backdropFilter: "blur(7px)",
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Get new posts"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 520,
              background: "#fff",
              border: "1px solid #DCEAEC",
              borderRadius: 26,
              boxShadow: "0 44px 96px -32px rgba(11,32,35,.6)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                padding: "24px clamp(20px,3vw,30px) 0",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "clamp(20px,2.1vw,25px)",
                    fontWeight: 800,
                    letterSpacing: "-.028em",
                    color: "#152A2E",
                    lineHeight: 1.18,
                  }}
                >
                  Get new posts
                </h2>
                <p
                  style={{
                    margin: "9px 0 0",
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: "#5F7175",
                  }}
                >
                  Tell us where to send new writing.
                </p>
              </div>
              <button
                onClick={closeModal}
                aria-label="Close"
                style={{
                  flex: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  background: "#F4F9FA",
                  border: "1px solid #E4EEEF",
                  borderRadius: "50%",
                  cursor: "pointer",
                  color: "#3E5257",
                  transition: "background .2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#E4F5F6";
                  e.currentTarget.style.color = "#0E8B95";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#F4F9FA";
                  e.currentTarget.style.color = "#3E5257";
                }}
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                >
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </svg>
              </button>
            </div>

            {!sent && (
              <form
                onSubmit={submit}
                style={{
                  padding: "22px clamp(20px,3vw,30px) clamp(22px,3vw,30px)",
                  display: "grid",
                  gap: 13,
                }}
              >
                {[
                  {
                    name: "name",
                    label: "Full name",
                    placeholder: "Your name",
                    type: "text",
                  },
                  {
                    name: "institution",
                    label: "Institution",
                    placeholder: "School or college name",
                    type: "text",
                  },
                  {
                    name: "email",
                    label: "Work email",
                    placeholder: "name@institution.edu",
                    type: "email",
                  },
                ].map((f) => (
                  <label key={f.name} style={{ display: "grid", gap: 7 }}>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#3E5257",
                      }}
                    >
                      {f.label}
                    </span>
                    <input
                      required
                      name={f.name}
                      type={f.type}
                      placeholder={f.placeholder}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        fontSize: 14,
                        color: "#152A2E",
                        background: "#FCFEFE",
                        border: "1px solid #DCEAEC",
                        borderRadius: 12,
                        outline: "none",
                        transition:
                          "border-color .2s ease, box-shadow .2s ease",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#17AEB9";
                        e.currentTarget.style.boxShadow =
                          "0 0 0 3px rgba(23,174,185,.14)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#DCEAEC";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </label>
                ))}
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 9,
                    width: "100%",
                    marginTop: 4,
                    background: "#17AEB9",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    padding: "15px 24px",
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: submitting ? "not-allowed" : "pointer",
                    opacity: submitting ? 0.7 : 1,
                    boxShadow: "0 12px 26px -12px rgba(23,174,185,.85)",
                  }}
                >
                  {submitting ? "Subscribing…" : "Subscribe"}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 12h14" />
                    <path d="M12 6l6 6-6 6" />
                  </svg>
                </button>
              </form>
            )}

            {sent && (
              <div
                style={{
                  padding: "26px clamp(20px,3vw,30px) 30px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "#E8F7EF",
                    color: "#0E9F6E",
                    marginTop: 8,
                  }}
                >
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </span>
                <h3
                  style={{
                    margin: "18px 0 0",
                    fontSize: 21,
                    fontWeight: 800,
                    letterSpacing: "-.025em",
                    color: "#152A2E",
                  }}
                >
                  You are subscribed
                </h3>
                <p
                  style={{
                    margin: "9px 0 0",
                    fontSize: 14.5,
                    lineHeight: 1.62,
                    color: "#5F7175",
                    maxWidth: "40ch",
                  }}
                >
                  New guides and practice notes will land in your inbox.
                </p>
                <button
                  onClick={closeModal}
                  style={{
                    marginTop: 22,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 9,
                    background: "#fff",
                    color: "#152A2E",
                    border: "1px solid #CFE8EA",
                    borderRadius: 10,
                    padding: "13px 24px",
                    fontSize: 14.5,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "border-color .25s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "#17AEB9")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "#CFE8EA")
                  }
                >
                  Back to blogs
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}