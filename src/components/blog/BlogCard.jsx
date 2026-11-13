
import Link from "next/link";

export default function BlogCard({ item }) {
  return (
    <Link
      href={item.href || `/blog/${item.slug}`}
      style={{
        display: "flex",
        flexDirection: "column",
        background: "#fff",
        border: "1px solid #E4EEEF",
        borderRadius: 10,
        overflow: "hidden",
        textDecoration: "none",
        transition:
          "transform .32s cubic-bezier(.22,.8,.2,1),border-color .32s ease,box-shadow .32s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.borderColor = "#17AEB9";
        e.currentTarget.style.boxShadow =
          "0 28px 54px -32px rgba(15,60,66,.5)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.borderColor = "#E4EEEF";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Blog Image */}
      <span
        style={{
          position: "relative",
          display: "block",
          width: "100%",
          aspectRatio: "1 / 1",
          background: "#EDF4F5",
          flex: "none",
          overflow: "hidden",
        }}
      >
        <img
          src={item.img}
          alt={item.title}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />

        {/* Category Badge */}
        <span
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            display: "inline-flex",
            alignItems: "center",
            padding: "5px 11px",
            borderRadius: 4,
            background: "rgba(255,255,255,.94)",
            backdropFilter: "blur(6px)",
            fontSize: 9.5,
            fontWeight: 800,
            letterSpacing: ".09em",
            color: "#0E8B95",
          }}
        >
          {item.tag}
        </span>
      </span>

      {/* Blog Information */}
      <span
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          padding: "clamp(16px,1.8vw,22px)",
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#8A9B9E",
          }}
        >
          {item.meta}
        </span>

        <span
          style={{
            display: "block",
            fontSize: "clamp(14.5px,1.15vw,16.5px)",
            fontWeight: 800,
            letterSpacing: "-.02em",
            lineHeight: 1.3,
            color: "#101E21",
          }}
        >
          {item.title}
        </span>

        <span
          style={{
            display: "block",
            fontSize: 13,
            lineHeight: 1.6,
            color: "#5F7175",
            flex: 1,
          }}
        >
          {item.desc}
        </span>

        {/* Read Article */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginTop: 4,
            fontSize: 12.5,
            fontWeight: 700,
            color: "#0E8B95",
          }}
        >
          Read article

          <svg
            width="14"
            height="14"
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
        </span>
      </span>
    </Link>
  );
}
