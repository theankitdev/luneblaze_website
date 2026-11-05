// src/components/legal/LegalBody.jsx
"use client";

export default function LegalBody({ sections = [], contactEmail = "contact@luneblaze.com" }) {
  return (
    <section
      id="body"
      style={{
        position: "relative",
        padding:
          "clamp(24px,2.8vw,40px) clamp(20px,4vw,52px) clamp(40px,4.6vw,68px)",
        background: "#FCFDFD",
      }}
    >
      <style>{`
        [data-legalnav]::-webkit-scrollbar { width: 0; height: 0; }
        [data-legalnav] { -ms-overflow-style: none; }
      `}</style>
      <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto" }}>
        <div
          data-legalgrid=""
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,244px) minmax(0,1fr)",
            gap: "clamp(20px,2.6vw,44px)",
            alignItems: "start",
          }}
        >
          {/* Contents rail — locked, self-scrolling only, scrollbar hidden */}
          <aside
            data-legalnav=""
            style={{
              position: "sticky",
              top: 96,
              alignSelf: "start",
              background: "#fff",
              border: "1px solid #E4EEEF",
              borderRadius: 10,
              padding: "18px 14px",
              maxHeight: "calc(100vh - 130px)",
              overflowY: "auto",
              overscrollBehavior: "contain",
              scrollbarWidth: "none",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: ".16em",
                textTransform: "uppercase",
                color: "#8A9B9E",
                padding: "0 10px 12px",
              }}
            >
              Contents
            </div>
            <nav style={{ display: "grid", gap: 2 }}>
              {sections.map((s, i) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  style={{
                    display: "flex",
                    gap: 10,
                    padding: "9px 10px",
                    borderRadius: 4,
                    fontSize: 13,
                    fontWeight: 600,
                    lineHeight: 1.45,
                    color: "#5F7175",
                    textDecoration: "none",
                    transition: "background .22s ease,color .22s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#F1F7F8";
                    e.currentTarget.style.color = "#0E8B95";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#5F7175";
                  }}
                >
                  <span style={{ flex: "none", fontWeight: 800, color: "#9BABAE" }}>
                    {i + 1}
                  </span>
                  {s.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Article body — the only thing that scrolls with the page */}
          <div data-legalbody="" style={{ display: "grid", minWidth: 0 }}>
            {sections.map((s) => (
              <div
                key={s.id}
                id={s.id}
                data-legalsec=""
                style={{
                  scrollMarginTop: 104,
                  paddingTop: "clamp(28px,3.2vw,44px)",
                }}
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                  <span
                    aria-hidden="true"
                    style={{
                      flex: "none",
                      fontSize: "clamp(17px,1.7vw,21px)",
                      fontWeight: 800,
                      letterSpacing: "-.02em",
                      color: "#17AEB9",
                    }}
                  >
                    {s.num}
                  </span>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "clamp(20px,2.1vw,27px)",
                      lineHeight: 1.22,
                      letterSpacing: "-.028em",
                      fontWeight: 800,
                      color: "#152A2E",
                    }}
                  >
                    {s.title}
                  </h2>
                </div>
                {s.lede && (
                  <p
                    style={{
                      margin: "13px 0 0",
                      fontSize: "clamp(14.5px,1.15vw,16px)",
                      lineHeight: 1.62,
                      fontWeight: 700,
                      color: "#0E7A83",
                    }}
                  >
                    {s.lede}
                  </p>
                )}
                {s.blocks?.map((b, bi) => {
                  if (b.type === "para") {
                    return (
                      <p
                        key={bi}
                        style={{
                          margin: "14px 0 0",
                          fontSize: "clamp(15px,1.2vw,17px)",
                          lineHeight: 1.78,
                          color: "#3E5257",
                        }}
                      >
                        {b.lead && (
                          <strong style={{ color: "#152A2E" }}>{b.lead} </strong>
                        )}
                        {b.text}
                      </p>
                    );
                  }
                  if (b.type === "list") {
                    return (
                      <ul
                        key={bi}
                        style={{
                          margin: "14px 0 0",
                          padding: 0,
                          listStyle: "none",
                          display: "grid",
                          gap: 11,
                        }}
                      >
                        {b.items.map((li, li_i) => (
                          <li
                            key={li_i}
                            style={{
                              display: "flex",
                              gap: 11,
                              fontSize: "clamp(15px,1.2vw,17px)",
                              lineHeight: 1.74,
                              color: "#3E5257",
                            }}
                          >
                            <span
                              aria-hidden="true"
                              style={{
                                flex: "none",
                                width: 5,
                                height: 5,
                                marginTop: 10,
                                borderRadius: "50%",
                                background: "#17AEB9",
                              }}
                            />
                            {li}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return null;
                })}
              </div>
            ))}

            {/* Contact CTA */}
            <div
              style={{
                marginTop: "clamp(32px,3.6vw,48px)",
                padding: "20px 22px",
                background: "#F7FCFC",
                border: "1px solid #E4EEEF",
                borderRadius: 10,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 14,
              }}
            >
              <span
                style={{
                  flex: 1,
                  minWidth: 0,
                  fontSize: 14,
                  lineHeight: 1.62,
                  fontWeight: 600,
                  color: "#3E5257",
                }}
              >
                Questions about this document? Write to us and we will respond.
              </span>
              <a
                href={`mailto:${contactEmail}`}
                style={{
                  flex: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#17AEB9",
                  color: "#fff",
                  borderRadius: 10,
                  padding: "12px 20px",
                  fontSize: 13,
                  fontWeight: 700,
                  textDecoration: "none",
                  transition: "transform .28s cubic-bezier(.22,.8,.2,1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                }}
              >
                {contactEmail}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}