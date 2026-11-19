// src/app/webinars/[slug]/page.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import webinarService from "@/services/webinarService";
import paymentService from "@/services/paymentService";

/* ───────────── Share row ───────────── */
function ShareRow({ title }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  const on = (kind) => {
    if (kind === "wa") {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`, "_blank", "noopener");
      return;
    }
    if (kind === "li") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank", "noopener");
      return;
    }
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(
        () => { setCopied(true); setTimeout(() => setCopied(false), 2000); },
        () => setCopied(false)
      );
    }
  };

  return (
    <span className="flex items-center justify-end gap-[7px]">
      <span className="mr-0.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#9BABAE]">Share</span>
      <button type="button" onClick={() => on("wa")} aria-label="Share on WhatsApp" className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] border border-[#DCEAEC] bg-white text-[#25936B] transition-colors hover:bg-[#25936B] hover:text-white">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2.5c-5.2 0-9.42 4.2-9.42 9.4 0 1.65.44 3.27 1.26 4.7L2.5 21.5l5.05-1.32a9.45 9.45 0 0 0 4.49 1.14c5.2 0 9.42-4.22 9.42-9.42 0-5.2-4.22-9.4-9.42-9.4Zm5.5 13.3c-.23.65-1.35 1.25-1.87 1.3-.52.06-1 .1-1.83-.22a13.6 13.6 0 0 1-4.06-2.6 10.6 10.6 0 0 1-2.2-3.1c-.24-.6-.26-1.12-.18-1.5.08-.4.5-.93.68-1.12.19-.2.36-.24.5-.24h.36c.13 0 .3-.03.47.35.17.4.6 1.46.65 1.57.05.1.08.23 0 .37-.07.14-.32.47-.47.63-.09.1-.2.2-.07.42.44.75.98 1.4 1.63 1.94.4.34.8.6 1.34.87.2.1.33.09.46-.05.13-.15.55-.63.7-.85.14-.22.28-.18.47-.11.2.07 1.24.6 1.46.7.21.11.35.17.4.26.05.1.05.55-.18 1.2Z" /></svg>
      </button>
      <button type="button" onClick={() => on("li")} aria-label="Share on LinkedIn" className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] border border-[#DCEAEC] bg-white text-[#0A66C2] transition-colors hover:bg-[#0A66C2] hover:text-white">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3 9.5h4V21H3V9.5Zm6.5 0h3.8v1.6h.05c.53-.95 1.83-1.95 3.76-1.95 4.02 0 4.76 2.5 4.76 5.76V21h-4v-5.2c0-1.24-.02-2.84-1.76-2.84-1.76 0-2.03 1.35-2.03 2.75V21h-4V9.5Z" /></svg>
      </button>
      <button type="button" onClick={() => on("copy")} aria-label="Copy link" className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] border border-[#DCEAEC] bg-white text-[#3E5257] transition-colors hover:border-[#17AEB9] hover:bg-[#17AEB9] hover:text-white">
        {copied ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M10 14a4 4 0 0 0 5.7 0l2.8-2.8a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0L5.5 12.8a4 4 0 0 0 5.7 5.7l1-1" /></svg>
        )}
      </button>
    </span>
  );
}

/* ───────────── Webinar helpers and styles ───────────── */
const TAG_STYLES = {
  SQAAF: { label: "SQAAF", bg: "#E4F5F6", color: "#0E8B95" },
  NAAC: { label: "NAAC", bg: "#EEEFFB", color: "#5B5BD6" },
  NBA: { label: "NBA", bg: "#FDF4DC", color: "#9A6A00" },
  NABET: { label: "NABET", bg: "#E8F7EF", color: "#0E9F6E" },
  NIRF: { label: "NIRF", bg: "#FCEBE7", color: "#B65B43" },
  QUALITY: { label: "QUALITY", bg: "#E8F7EF", color: "#0E9F6E" },
};

const FALLBACK_IMAGE = "/assets/blog-1.webp";
const FALLBACK_SPEAKER_IMAGE = "/assets/advisor-1.png";

function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getCategory(item = {}) {
  const value = String(item.type || item.category || item.subtitle || "").toUpperCase();

  if (value.includes("SQAAF")) return "SQAAF";
  if (value.includes("NAAC")) return "NAAC";
  if (value.includes("NBA")) return "NBA";
  if (value.includes("NABET")) return "NABET";
  if (value.includes("NIRF")) return "NIRF";
  return "QUALITY";
}

function getAssetUrl(path, host = "") {
  if (!path) return "";

  const value = String(path).trim();
  if (/^(https?:)?\/\//i.test(value) || value.startsWith("data:")) {
    return value;
  }

  const cleanHost = String(host || "").replace(/\/+$/, "");
  const cleanPath = value.replace(/^\/+/, "");

  if (!cleanHost) return `/${cleanPath}`;
  return `${cleanHost}/${cleanPath}`;
}

function formatDate(value) {
  if (!value) return "To be announced";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(value) {
  if (!value) return "";
  const raw = String(value);

  // Keep already formatted values readable.
  if (/[ap]m/i.test(raw)) return raw;

  const match = raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!match) return raw;

  const date = new Date();
  date.setHours(Number(match[1]), Number(match[2]), 0, 0);
  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getDuration(start, end) {
  if (!start || !end) return "To be announced";

  const toMinutes = (value) => {
    const parts = String(value).split(":").map(Number);
    return (parts[0] || 0) * 60 + (parts[1] || 0);
  };

  let minutes = toMinutes(end) - toMinutes(start);
  if (minutes < 0) minutes += 24 * 60;
  if (!minutes) return "To be announced";

  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return [hours ? `${hours} hr${hours > 1 ? "s" : ""}` : "", remaining ? `${remaining} min` : ""]
    .filter(Boolean)
    .join(" ");
}

function getStatus(item = {}) {
  const status = String(item.status || "").toLowerCase();

  if (["completed", "complete", "past", "closed", "on demand", "ondemand"].includes(status)) {
    return "completed";
  }

  if (item.session_date) {
    const date = new Date(item.session_date);
    if (!Number.isNaN(date.getTime()) && date.getTime() < Date.now()) {
      return "completed";
    }
  }

  return "upcoming";
}

function getText(value) {
  if (value == null) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

function mapWebinar(item = {}, host = "") {
  const category = getCategory(item);
  const status = getStatus(item);
  const title = getText(item.title) || "Webinar";
  const description =
    getText(item.description) ||
    getText(item.subtitle) ||
    "Webinar details will be updated soon.";

  const image = getAssetUrl(item.image, host) || FALLBACK_IMAGE;
  const speakerImage = getAssetUrl(item.speaker_image, host) || FALLBACK_SPEAKER_IMAGE;
  const speakerName = getText(item.speaker) || "Speaker details to be announced";
  const speakerRole = getText(item.designation) || "Speaker information will be updated soon.";
  const startTime = formatTime(item.start_time);
  const endTime = formatTime(item.end_time);
  const time = startTime && endTime
    ? `${startTime} – ${endTime}`
    : startTime || endTime || "To be announced";
  const duration = getDuration(item.start_time, item.end_time);
  const date = formatDate(item.session_date);
  const content = getText(item.content);

  return {
    id: item.id,
    slug: `${item.id}-${slugify(title)}`,
    status,
    tags: [TAG_STYLES[category] || TAG_STYLES.QUALITY],
    title,
    dek: description,
    image,
    youtubeLink: getText(item.youtube_link),
    webinarLink: getText(item.webinar_link),
    speaker: {
      name: speakerName,
      role: speakerRole,
      avatar: speakerImage,
      placeholder: !getText(item.speaker) && !getText(item.designation),
    },
    schedule: {
      date,
      time,
      timeNote: "",
      format: status === "completed" ? "Recorded webinar" : "Live online session",
      formatNote: status === "completed" ? "Available on demand" : "Joining details will be shared after registration",
    },
    attendees: {
      count: item.attendees !== undefined && item.attendees !== null && item.attendees !== ""
        ? Number(item.attendees) || item.attendees
        : null,
      roles: ["Institution leaders", "IQAC teams", "Quality coordinators"],
    },
    overview: [description, content].filter(Boolean),
    takeaways: [
      "Understand the key topics covered in this session.",
      "Review the relevant institutional processes and supporting documentation.",
      "Identify practical next steps for your institution.",
    ],
    price: item.fees !== undefined && item.fees !== null && item.fees !== ""
      ? Number(item.fees)
      : null,
    glance: [
      ["Framework", category],
      ["Duration", duration],
      ["Availability", status === "completed" ? "On demand" : "Upcoming"],
      ["Language", "To be announced"],
    ],
  };
}

function getApiErrorMessage(error) {
  return error?.message || "Unable to load this webinar. Please try again later.";
}

/* ───────────── Page ───────────── */
export default function WebinarDetailPage({ params }) {
  const [slug, setSlug] = useState(null);
  const [webinar, setWebinar] = useState(null);
  const [otherWebinars, setOtherWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [regOpen, setRegOpen] = useState(false);
  const [regSent, setRegSent] = useState(false);

  const [certLoading, setCertLoading] = useState(false);
  const [certEmail, setCertEmail] = useState("");
  const [certError, setCertError] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleCertificateRequest = async (event) => {
    event.preventDefault();
    setCertError("");

    const email = certEmail.trim();
    if (!email || !webinar?.id) {
      setCertError("Please enter the email address you used to register.");
      return;
    }

    setCertLoading(true);

    try {
      const response = await webinarService.generateCertificate({
        email,
        webinar_id: webinar.id,
      });

      const blob =
        response?.data instanceof Blob
          ? response.data
          : response instanceof Blob
            ? response
            : null;

      if (!blob || blob.size === 0) {
        throw new Error("The server did not return a valid certificate PDF.");
      }

      // Check the PDF signature instead of relying only on the MIME type.
      const signature = await blob.slice(0, 5).text();
      if (signature !== "%PDF-") {
        let message = "The server returned an invalid certificate response.";

        try {
          const responseText = await blob.text();
          const errorData = JSON.parse(responseText);
          message = errorData.message || message;
        } catch {
          // Keep the fallback message when the response is not JSON.
        }

        throw new Error(message);
      }

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      const safeEmail = email.replace(/[^a-zA-Z0-9_-]/g, "_");

      link.href = downloadUrl;
      link.download = `Certificate_${safeEmail}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.setTimeout(() => {
        window.URL.revokeObjectURL(downloadUrl);
      }, 1000);
    } catch (err) {
      console.error("Certificate Download Error:", err);

      let message = err?.message || "Unable to download your certificate. Please try again.";

      if (err?.response?.data instanceof Blob) {
        try {
          const errorData = JSON.parse(await err.response.data.text());
          message = errorData.message || message;
        } catch {
          // Keep the original error message.
        }
      }

      setCertError(message);
    } finally {
      setCertLoading(false);
    }
  };

  const handleRegistrationSubmit = async (event) => {
    event.preventDefault();
    setPaymentError("");

    if (!webinar?.id || !webinar?.price || Number(webinar.price) < 1) {
      setPaymentError("Payment amount is not available for this webinar.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const details = {
      name: String(formData.get("name") || "").trim(),
      school: String(formData.get("school") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      contact: String(formData.get("contact") || "").trim(),
      designation: String(formData.get("designation") || "").trim(),
      referralSource: String(formData.get("referralSource") || "").trim(),
    };
    if (Object.values(details).some((value) => !value)) {
      setPaymentError("Please complete all registration fields.");
      return;
    }

    setPaymentLoading(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error("Razorpay Checkout could not be loaded.");

      const orderResponse = await paymentService.createRazorpayOrder({
        amount: Number(webinar.price),
      });
      if (orderResponse?.status !== "success" || !orderResponse?.data?.id) {
        throw new Error(orderResponse?.message || "Unable to create payment order.");
      }

      const order = orderResponse.data;
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKey) throw new Error("Razorpay Key ID is not configured.");

      const checkout = new window.Razorpay({
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "Luneblaze",
        description: webinar.title,
        order_id: order.id,
        prefill: {
          name: details.name,
          email: details.email,
          contact: details.contact,
        },
        theme: { color: "#17AEB9" },
        handler: async (paymentResponse) => {
          try {
            const verification = await paymentService.verifyWebinarPayment({
              webinarId: webinar.id,
              webinarTitle: webinar.title,
              ...details,
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
              amount: Number(webinar.price),
            });
            if (verification?.status !== "success") {
              throw new Error(verification?.message || "Payment verification failed.");
            }
            setRegSent(true);
            setPaymentError("");
          } catch (err) {
            setPaymentError(err.message || "Payment verification failed. Contact support.");
          } finally {
            setPaymentLoading(false);
          }
        },
        modal: { ondismiss: () => setPaymentLoading(false) },
      });

      checkout.on("payment.failed", (response) => {
        console.error("RAZORPAY PAYMENT FAILED:", response);
        console.error("Error Details:", {
          code: response?.error?.code,
          description: response?.error?.description,
          source: response?.error?.source,
          step: response?.error?.step,
          reason: response?.error?.reason,
          metadata: response?.error?.metadata,
        });

        const errorMessage =
          response?.error?.description ||
          response?.error?.reason ||
          "Payment failed. Please try again.";

        setPaymentError(errorMessage);
        setPaymentLoading(false);
      });

      checkout.open();
    } catch (err) {
      setPaymentError(err.message || "Unable to start payment.");
      setPaymentLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    Promise.resolve(params)
      .then((value) => {
        if (active) setSlug(value?.slug || null);
      })
      .catch(() => {
        if (active) {
          setError("Invalid webinar URL.");
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    let active = true;

    async function loadWebinar() {
      setLoading(true);
      setError("");

      try {
        const listResponse = await webinarService.getWebinars({
          offset: 1,
          limit: 100,
        });

        const rows = Array.isArray(listResponse?.data) ? listResponse.data : [];
        const host = listResponse?.host || "";

        const selectedRow = rows.find((item) => {
          const itemId = String(item.id ?? "");
          const itemTitleSlug = slugify(item.title);
          const itemSubtitleSlug = slugify(item.subtitle);

          return (
            slug === itemId ||
            slug === `${itemId}-${itemTitleSlug}` ||
            slug === itemTitleSlug ||
            (itemSubtitleSlug && slug === itemSubtitleSlug)
          );
        });

        if (!selectedRow) {
          throw new Error("This webinar could not be found.");
        }

        const detailResponse = await webinarService.getWebinarById(selectedRow.id);
        const detailItem = detailResponse?.data || selectedRow;

        if (detailResponse?.status === "error") {
          throw new Error(detailResponse?.message || "Unable to load webinar details.");
        }

        const mapped = mapWebinar({ ...selectedRow, ...detailItem }, host);

        const related = rows
          .filter((item) => String(item.id) !== String(selectedRow.id))
          .slice(0, 3)
          .map((item) => {
            const mappedItem = mapWebinar(item, host);
            return {
              image: mappedItem.image,
              tag: mappedItem.tags[0],
              meta: mappedItem.status === "completed"
                ? `On demand · ${getDuration(item.start_time, item.end_time)}`
                : `Upcoming · ${mappedItem.schedule.date}`,
              title: mappedItem.title,
              href: `/webinars/${mappedItem.slug}`,
            };
          });

        if (active) {
          setWebinar(mapped);
          setOtherWebinars(related);
        }
      } catch (loadError) {
        if (active) setError(getApiErrorMessage(loadError));
      } finally {
        if (active) setLoading(false);
      }
    }

    loadWebinar();

    return () => {
      active = false;
    };
  }, [slug]);

  if (!slug || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FBFCFC] font-[Manrope,ui-sans-serif,system-ui,sans-serif] text-[#172326]">
        <p className="text-sm font-semibold text-[#5F7175]">Loading webinar details...</p>
      </main>
    );
  }

  if (error || !webinar) {
    return (
      <main className="min-h-screen bg-[#FBFCFC] font-[Manrope,ui-sans-serif,system-ui,sans-serif] text-[#172326]">
        <div className="mx-auto max-w-[1100px] px-5 pb-20 pt-32">
          <Link href="/webinars" className="inline-flex items-center gap-2 text-xs font-bold text-[#5F7175] hover:text-[#0E8B95]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12H6" /><path d="M12 6l-6 6 6 6" /></svg>
            Back to Webinars
          </Link>
          <h1 className="mt-6 text-[clamp(27px,3.4vw,44px)] font-extrabold leading-[1.1] tracking-[-0.034em] text-[#152A2E]">
            Webinar not found
          </h1>
          <p className="mt-4 text-base text-[#4C6165]">
            {error || "This webinar is no longer available."}{" "}
            <Link href="/webinars" className="font-semibold text-[#0E8B95] hover:underline">See all webinars</Link>.
          </p>
        </div>
      </main>
    );
  }

  const isCompleted = webinar.status === "completed";

  return (
    <main className="min-h-screen bg-[#FBFCFC] font-[Manrope,ui-sans-serif,system-ui,sans-serif] text-[#172326]">
      {/* ── Hero ──────────────────────────────────── */}
      <section
        id="hero"
        className="relative overflow-hidden border-b border-[#D6E3E5] bg-white px-[clamp(20px,4vw,52px)] pb-[clamp(24px,2.8vw,36px)] pt-[clamp(100px,10.5vw,132px)]"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#F8FDFD] via-[#F1FAFB] to-[#EDF7F8]" />
          <div className="absolute inset-0 opacity-[0.26] [background-image:radial-gradient(circle,rgba(23,174,185,0.22)_1.1px,transparent_1.1px)] [background-size:30px_30px]" />
        </div>

        <div className="relative mx-auto max-w-[1100px]">
          <div className="flex flex-wrap items-center gap-3.5">
            <Link href="/webinars" className="inline-flex items-center gap-2 text-xs font-bold text-[#5F7175] transition-colors hover:text-[#0E8B95]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M20 12H6" /><path d="M12 6l-6 6 6 6" /></svg>
              Back to Webinars
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <span
              className="inline-flex items-center gap-1.5 rounded-[4px] border px-[13px] py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em]"
              style={{
                background: isCompleted ? "#E4F5F6" : "#E8F7EF",
                borderColor: isCompleted ? "#CFE8EA" : "#CFE9DC",
                color: isCompleted ? "#0E7A83" : "#0E7A55",
              }}
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: isCompleted ? "#17AEB9" : "#10B981" }}
              />
              {isCompleted ? "On demand" : "Upcoming"}
            </span>
            {webinar.tags.map((t) => (
              <span
                key={t.label}
                className="inline-flex items-center rounded-[4px] px-3 py-1.5 text-[10px] font-extrabold tracking-[0.1em]"
                style={{ background: t.bg, color: t.color }}
              >
                {t.label}
              </span>
            ))}
          </div>

          <h1 className="mt-4 max-w-[26ch] text-[clamp(27px,3.4vw,44px)] font-extrabold leading-[1.1] tracking-[-0.034em] text-[#152A2E]">
            {webinar.title}
          </h1>
          <p className="mt-[15px] max-w-[64ch] text-[clamp(14.5px,1.15vw,17px)] leading-[1.64] text-[#4C6165]">
            {webinar.dek}
          </p>
        </div>
      </section>

      {/* ── Body ──────────────────────────────────── */}
      <section
        id="body"
        className="relative mx-[clamp(10px,1.5vw,20px)] overflow-hidden rounded-[10px] border border-[#E4EEEF] bg-[#FCFDFD] px-[clamp(20px,4vw,52px)] pb-[clamp(40px,4.6vw,68px)] pt-[clamp(26px,3vw,44px)]"
      >
        <div className="relative mx-auto max-w-[1100px]">
          <div className="grid items-start gap-[clamp(20px,2.6vw,40px)] lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            {/* main column */}
            <div>
              <div className="mb-3.5 flex justify-end">
                <ShareRow title={webinar.title} />
              </div>

              {/* still with play button */}
              <div className="relative aspect-video w-full overflow-hidden rounded-[10px] border border-[#DCEAEC] bg-[#EDF4F5]">
                <Image src={webinar.image} alt={webinar.title} fill priority sizes="(max-width:900px) 100vw, 700px" className="object-contain" unoptimized />
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 inline-flex h-[66px] w-[66px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(23,174,185,0.95)] text-white shadow-[0_18px_36px_-14px_rgba(0,0,0,0.5)]"
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5L8 5.5Z" /></svg>
                </span>
              </div>

              {/* speaker */}
              <div className="mt-[clamp(20px,2.2vw,28px)] flex items-center gap-[15px] rounded-[10px] border border-[#DCEAEC] bg-white px-[19px] py-[17px] text-left">
                <span className="relative shrink-0">
                  <span aria-hidden="true" className="absolute -inset-1 rounded-full border-[1.5px] border-[rgba(23,174,185,0.35)]" />
                  <Image
                    src={webinar.speaker.avatar}
                    alt={webinar.speaker.name}
                    width={62}
                    height={62}
                    className="block h-[62px] w-[62px] rounded-full object-cover"
                    unoptimized
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block whitespace-nowrap text-[9.5px] font-extrabold uppercase tracking-[0.16em] text-[#0E7A83]">Speaker</span>
                  <span className="mt-1 block text-base font-extrabold tracking-[-0.02em] text-[#152A2E]">{webinar.speaker.name}</span>
                  <span className="mt-0.5 block text-[12.5px] leading-[1.55] text-[#5F7175]">{webinar.speaker.role}</span>
                </span>
                {webinar.speaker.placeholder && (
                  <span className="shrink-0 rounded-[4px] bg-[#FDF4DC] px-[11px] py-[5px] text-[9px] font-extrabold tracking-[0.07em] text-[#8A6200]">PLACEHOLDER</span>
                )}
              </div>

              {/* About */}
              <h2 className="mt-[clamp(28px,3.2vw,42px)] text-[clamp(20px,2.1vw,27px)] font-extrabold leading-[1.18] tracking-[-0.03em] text-[#152A2E]">
                About This Webinar
              </h2>
              <p className="mb-2 mt-3 text-[13.5px] leading-[1.62] text-[#5F7175]">
                Schedule, who is coming, what the session covers and what you leave with.
              </p>

              {/* Schedule */}
              <div className="mt-[clamp(20px,2.2vw,28px)] border-t border-[#EDF4F5] pt-[clamp(20px,2.2vw,28px)]">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#E4F5F6] text-[#0E8B95] shadow-[0_0_0_5px_rgba(228,245,246,0.4)]">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="5" width="16" height="15" rx="2.5" /><path d="M8 3.5v3M16 3.5v3M4 10h16" /></svg>
                  </span>
                  <h3 className="text-[clamp(15px,1.5vw,17px)] font-extrabold tracking-[-0.018em] text-[#152A2E]">Schedule</h3>
                </div>
                <div className="mt-3">
                  {[
                    ["Date", webinar.schedule.date],
                    ["Time", webinar.schedule.time, webinar.schedule.timeNote],
                    ["Format", webinar.schedule.format, webinar.schedule.formatNote],
                  ].map(([k, v, note]) => (
                    <div key={k} className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1.5 border-b border-[#F4F9FA] py-[11px]">
                      <span className="w-[76px] shrink-0 text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#9BABAE]">{k}</span>
                      <span className="min-w-0 flex-1 text-[14.5px] font-extrabold tracking-[-0.015em] text-[#152A2E]">
                        {v}
                        {note && <span className="mt-0.5 block text-[11.5px] font-semibold text-[#8A9B9E]">{note}</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Who is attending */}
              <div className="mt-[clamp(20px,2.2vw,28px)] border-t border-[#EDF4F5] pt-[clamp(20px,2.2vw,28px)]">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#EEEFFB] text-[#5B5BD6] shadow-[0_0_0_5px_rgba(238,239,251,0.4)]">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8.5" r="3.2" /><path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5" /><path d="M16 6.8a3 3 0 0 1 0 5.9" /></svg>
                  </span>
                  <h3 className="text-[clamp(15px,1.5vw,17px)] font-extrabold tracking-[-0.018em] text-[#152A2E]">Who Is Attending</h3>
                </div>
                <div className="mt-3.5 flex flex-wrap items-baseline gap-2.5">
                  <span className="text-[clamp(26px,2.6vw,34px)] font-extrabold leading-none tracking-[-0.035em] text-[#5B5BD6]">{webinar.attendees.count ?? "—"}</span>
                  <span className="text-[12.5px] font-bold text-[#8A9B9E]">{webinar.attendees.count == null ? "registration details to be announced" : "registered so far"}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {webinar.attendees.roles.map((r) => (
                    <span key={r} className="rounded-[4px] bg-[#F2F9FA] px-3 py-[5px] text-[11.5px] font-bold text-[#3E5257]">
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              {/* Overview */}
              <div className="mt-[clamp(20px,2.2vw,28px)] border-t border-[#EDF4F5] pt-[clamp(20px,2.2vw,28px)]">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#E8F7EF] text-[#0E9F6E] shadow-[0_0_0_5px_rgba(232,247,239,0.4)]">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3v5h5" /><path d="M19 8v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5Z" /><path d="M9 13h6" /><path d="M9 17h4" /></svg>
                  </span>
                  <h3 className="text-[clamp(15px,1.5vw,17px)] font-extrabold tracking-[-0.018em] text-[#152A2E]">Overview</h3>
                </div>
                {webinar.overview.map((p, i) => (
                  <p key={i} className="mt-3 text-[clamp(14px,1.1vw,15.5px)] leading-[1.76] text-[#3E5257]">{p}</p>
                ))}
              </div>

              {/* Takeaways */}
              <div className="mt-[clamp(20px,2.2vw,28px)] border-t border-[#EDF4F5] pt-[clamp(20px,2.2vw,28px)]">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#FDF4DC] text-[#B98200] shadow-[0_0_0_5px_rgba(253,244,220,0.4)]">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v6c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6l7-3Z" /><path d="M9 12l2.2 2.2L15.5 10" /></svg>
                  </span>
                  <h3 className="text-[clamp(15px,1.5vw,17px)] font-extrabold tracking-[-0.018em] text-[#152A2E]">What You Will Take Away</h3>
                </div>
                <ul className="mt-3 grid list-none gap-3 p-0">
                  {webinar.takeaways.map((t, i) => (
                    <li key={i} className="flex gap-3 text-[14.5px] leading-[1.68] text-[#3E5257]">
                      <span className="mt-0.5 inline-flex h-[23px] w-[23px] shrink-0 items-center justify-center rounded-full bg-[#FDF4DC] text-[10.5px] font-extrabold text-[#B98200]">
                        {i + 1}
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* aside */}
            <aside className="grid max-h-[calc(100vh-124px)] gap-3 self-start overflow-y-auto pr-0.5 lg:sticky lg:top-24">
              {/* Registration card — Upcoming only */}
              {!isCompleted && (
                <div className="rounded-[10px] border border-[#DCEAEC] bg-white p-[clamp(18px,2vw,24px)] shadow-[0_2px_4px_rgba(23,35,38,0.03),0_26px_52px_-34px_rgba(15,60,66,0.45)]">
                  <div className="whitespace-nowrap text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#0E7A83]">Registration</div>
                  <div className="mt-2.5 flex items-baseline gap-2">
                    <span className="text-[clamp(26px,2.6vw,34px)] font-extrabold tracking-[-0.035em] text-[#152A2E]">{webinar.price != null ? `₹${webinar.price}` : "To be announced"}</span>
                    <span className="text-[12px] font-bold text-[#8A9B9E]">per participant</span>
                  </div>
                  <p className="mt-2.5 text-[12.5px] leading-[1.6] text-[#5F7175]">
                    Includes the live session, the slide deck, the policy templates and a participation certificate.
                  </p>
                  <button
                    type="button"
                    onClick={() => setRegOpen(true)}
                    disabled={webinar.price == null}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-[4px] bg-[#17AEB9] px-[22px] py-3.5 text-[14px] font-extrabold tracking-[0.02em] text-white shadow-[0_12px_28px_-10px_rgba(23,174,185,0.85)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                  >
                    {webinar.price == null ? "REGISTRATION COMING SOON" : "REGISTER & PAY"}
                    {webinar.price != null && (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h14" /><path d="M12 6l6 6-6 6" /></svg>
                    )}
                  </button>
                  <div className="mt-2.5 flex items-center justify-center gap-[7px] text-[10.5px] font-bold text-[#8A9B9E]">
                    Registration and payment details will be updated soon.
                  </div>
                </div>
              )}

              {/* Certificate card — Completed only */}
              {isCompleted && (
                <div className="rounded-[10px] border border-[#0E5A62] bg-gradient-to-br from-[#12454C] via-[#0E5A62] to-[#12707A] p-[clamp(18px,2vw,24px)] shadow-[0_2px_4px_rgba(23,35,38,0.05),0_30px_58px_-34px_rgba(15,60,66,0.6)]">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-white/[0.14] text-[#9FE4EB]">
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="9.5" r="5" /><path d="M9 14 7.5 21 12 18.8 16.5 21 15 14" /></svg>
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#9FE4EB]">Certificate</span>
                      <span className="mt-0.5 block text-[15px] font-extrabold tracking-[-0.018em] text-white">You attended this webinar</span>
                    </span>
                  </div>
                  <p className="mt-3 text-[12.5px] leading-[1.6] text-[rgba(214,240,243,0.86)]">
                    Enter the email address you used to register. Your participation certificate will be generated and downloaded as a PDF.
                  </p>

                  <form
                    onSubmit={handleCertificateRequest}
                    className="mt-4 grid gap-2.5"
                  >
                    <input required type="email" value={certEmail} onChange={(e) => setCertEmail(e.target.value)} placeholder="name@school.edu" className="w-full rounded-[10px] border border-white/40 bg-white px-3.5 py-3 text-[13.5px] text-[#0B2A2E] outline-none transition-shadow focus:shadow-[0_0_0_3px_rgba(159,228,235,0.4)]" />
                    <button type="submit" disabled={certLoading} className="flex w-full items-center justify-center gap-2 rounded-[4px] bg-[#17D6DE] disabled:cursor-not-allowed disabled:opacity-60 px-[22px] py-3.5 text-[13.5px] font-extrabold tracking-[0.06em] text-[#08343A] shadow-[0_14px_30px_-12px_rgba(23,214,222,0.6)] transition-transform hover:-translate-y-0.5">
                      {certLoading ? "GENERATING PDF..." : "GET YOUR CERTIFICATE"}
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v12" /><path d="M7 11l5 5 5-5" /><path d="M5 20h14" /></svg>
                    </button>
                    {certError && <p role="alert" className="text-xs font-semibold text-red-200">{certError}</p>}
                  </form>
                </div>
              )}

              {/* At a glance */}
              <div className="rounded-[10px] border border-[#E4EEEF] bg-white px-[18px] py-[17px]">
                <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#8A9B9E]">At a glance</div>
                <div className="mt-3 grid gap-[11px]">
                  {webinar.glance.map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between gap-2.5">
                      <span className="text-[12.5px] font-semibold text-[#5F7175]">{k}</span>
                      <span className="text-[12.5px] font-extrabold text-[#152A2E]">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── Other Webinars ─────────────────────────── */}
      <section className="relative mx-[clamp(10px,1.5vw,20px)] mt-[clamp(10px,1.5vw,20px)] overflow-hidden rounded-[10px] border border-[#DBEDEF] bg-[#EDF7F8] px-[clamp(20px,4vw,52px)] py-[clamp(42px,4.8vw,70px)]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.34] [background-image:radial-gradient(circle,rgba(23,174,185,0.18)_1.1px,transparent_1.1px)] [background-size:28px_28px]" />
        </div>
        <div className="relative mx-auto max-w-[1320px]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-[560px]">
              <h2 className="m-0 text-[clamp(22px,2.6vw,34px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#152A2E]">Other Webinars</h2>
              <p className="mt-3 text-[clamp(13.5px,1.05vw,15.5px)] leading-[1.62] text-[#5F7175]">
                More working sessions from the Luneblaze quality team.
              </p>
            </div>
            <Link href="/webinars" className="inline-flex items-center gap-2 rounded-[4px] border border-[#DCEAEC] bg-white px-5 py-3 text-[13.5px] font-bold text-[#152A2E] transition-colors hover:border-[#17AEB9]">
              View all
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h14" /><path d="M12 6l6 6-6 6" /></svg>
            </Link>
          </div>

          <div className="mt-[clamp(24px,2.8vw,36px)] grid grid-cols-1 gap-[clamp(11px,1.3vw,16px)] sm:grid-cols-2 lg:grid-cols-3">
            {otherWebinars.map((w) => (
              <Link key={w.href} href={w.href} className="group flex flex-col overflow-hidden rounded-[10px] border border-[#DCEAEC] bg-white transition-transform hover:-translate-y-1.5 hover:border-[#17AEB9] hover:shadow-[0_24px_48px_-30px_rgba(15,60,66,0.5)]">
                <span className="relative block aspect-video w-full shrink-0 overflow-hidden bg-[#EDF4F5]">
                  <Image src={w.image} alt={w.title} fill sizes="(max-width:768px) 100vw, 400px" className="object-contain" unoptimized />
                  <span aria-hidden="true" className="absolute left-1/2 top-1/2 inline-flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(23,174,185,0.95)] text-white shadow-[0_14px_28px_-12px_rgba(0,0,0,0.5)]">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5L8 5.5Z" /></svg>
                  </span>
                  <span className="absolute left-[11px] top-[11px] inline-flex items-center rounded-[4px] px-[11px] py-[5px] text-[9.5px] font-extrabold tracking-[0.09em]" style={{ background: w.tag.bg, color: w.tag.color }}>
                    {w.tag.label}
                  </span>
                </span>
                <span className="flex flex-1 flex-col gap-[7px] px-[17px] pb-[18px] pt-4">
                  <span className="text-[11px] font-bold text-[#8A9B9E]">{w.meta}</span>
                  <span className="block text-[15px] font-extrabold leading-[1.3] tracking-[-0.018em] text-[#152A2E] group-hover:text-[#0E8B95]">
                    {w.title}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Registration modal ──────────────────── */}
      {regOpen && (
        <div className="fixed inset-0 z-[122] flex items-start justify-center overflow-y-auto bg-[rgba(11,32,35,0.44)] p-4 backdrop-blur-[7px] sm:p-6">
          <div className="relative w-full max-w-[560px] overflow-hidden rounded-[10px] border border-[#DCEAEC] bg-white shadow-[0_44px_96px_-32px_rgba(11,32,35,0.6)]">
            <div className="flex items-start gap-3.5 px-5 pt-6 sm:px-7">
              <div className="min-w-0 flex-1">
                <h2 className="text-[clamp(20px,2.1vw,26px)] font-extrabold leading-[1.18] tracking-[-0.028em] text-[#152A2E]">
                  {regSent ? "You are registered" : "Register for this webinar"}
                </h2>
                <p className="mt-2 text-[13.5px] leading-[1.6] text-[#5F7175]">
                  {regSent
                    ? "The joining link is on its way to your email. Your certificate will be available here once the session has run."
                    : `${webinar.price != null ? `₹${webinar.price} per participant.` : "Registration details will be announced soon."} You will receive the joining link and session information by email.`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setRegOpen(false); setRegSent(false); }}
                aria-label="Close"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E4EEEF] bg-[#F4F9FA] text-[#3E5257] transition-colors hover:bg-[#E4F5F6] hover:text-[#0E8B95]"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><path d="M6 6l12 12" /><path d="M18 6L6 18" /></svg>
              </button>
            </div>

            {!regSent ? (
              <form
                onSubmit={handleRegistrationSubmit}
                className="grid gap-3 px-5 pb-6 pt-5 sm:px-7"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { label: "Full name", name: "name", type: "text", placeholder: "Your name" },
                    { label: "School or college", name: "school", type: "text", placeholder: "Institution name" },
                  ].map((f) => (
                    <label key={f.name} className="grid gap-1.5">
                      <span className="text-[12px] font-bold text-[#3E5257]">{f.label}</span>
                      <input required type={f.type} name={f.name} placeholder={f.placeholder} className="w-full rounded-[10px] border border-[#DCEAEC] bg-[#FCFEFE] px-3.5 py-3 text-[14px] text-[#152A2E] outline-none transition-[border-color,box-shadow] focus:border-[#17AEB9] focus:shadow-[0_0_0_3px_rgba(23,174,185,0.14)]" />
                    </label>
                  ))}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { label: "Email", name: "email", type: "email", placeholder: "name@institution.edu" },
                    { label: "Phone", name: "contact", type: "text", placeholder: "+91" },
                  ].map((f) => (
                    <label key={f.name} className="grid gap-1.5">
                      <span className="text-[12px] font-bold text-[#3E5257]">{f.label}</span>
                      <input required type={f.type} name={f.name} placeholder={f.placeholder} className="w-full rounded-[10px] border border-[#DCEAEC] bg-[#FCFEFE] px-3.5 py-3 text-[14px] text-[#152A2E] outline-none transition-[border-color,box-shadow] focus:border-[#17AEB9] focus:shadow-[0_0_0_3px_rgba(23,174,185,0.14)]" />
                    </label>
                  ))}
                </div>
                <label className="grid gap-1.5">
                  <span className="text-[12px] font-bold text-[#3E5257]">Your role</span>
                  <select required name="designation" className="w-full rounded-[10px] border border-[#DCEAEC] bg-[#FCFEFE] px-3.5 py-3 text-[14px] text-[#152A2E] outline-none focus:border-[#17AEB9] focus:shadow-[0_0_0_3px_rgba(23,174,185,0.14)]">
                    <option value="">Select your role</option>
                    <option>Principal / Head of Institution</option>
                    <option>IQAC / Quality Coordinator</option>
                    <option>Trust / Group Management</option>
                    <option>Teacher / Faculty</option>
                    <option>HR / Administration</option>
                    <option>Other</option>
                  </select>
                </label>
                <label className="grid gap-1.5">
                  <span className="text-[12px] font-bold text-[#3E5257]">How did you hear about us?</span>
                  <select required name="referralSource" defaultValue="Website" className="w-full rounded-[10px] border border-[#DCEAEC] bg-[#FCFEFE] px-3.5 py-3 text-[14px] text-[#152A2E] outline-none focus:border-[#17AEB9]">
                    <option value="Website">Website</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Email">Email</option>
                    <option value="Referral">Referral</option>
                    <option value="Other">Other</option>
                  </select>
                </label>

                <div className="flex items-center justify-between gap-3 rounded-[10px] border border-[#E4EEEF] bg-[#F7FCFC] px-4 py-3.5">
                  <span className="text-[12.5px] font-bold text-[#3E5257]">Amount payable</span>
                  <span className="text-lg font-extrabold tracking-[-0.03em] text-[#152A2E]">
                    {webinar.price != null ? `₹${webinar.price}` : "To be announced"}
                  </span>
                </div>
                {paymentError && <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">{paymentError}</p>}
                <button type="submit" disabled={paymentLoading} className="flex w-full items-center justify-center gap-2 rounded-[4px] bg-[#17AEB9] disabled:cursor-not-allowed disabled:opacity-60 px-6 py-3.5 text-[14.5px] font-extrabold tracking-[0.02em] text-white shadow-[0_12px_26px_-12px_rgba(23,174,185,0.85)] transition-transform hover:-translate-y-0.5">
                  {paymentLoading ? "PLEASE WAIT..." : "PROCEED TO PAYMENT"}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h14" /><path d="M12 6l6 6-6 6" /></svg>
                </button>
                <p className="mt-0.5 text-center text-[11.5px] leading-[1.55] text-[#8A9B9E]">
                  Payment is handled securely. Questions?{" "}
                  <a href="tel:+918810418840" className="font-bold text-[#0E8B95]">+91 88104 18840</a>
                </p>
              </form>
            ) : (
              <div className="flex flex-col items-center px-5 pb-7 pt-6 text-center sm:px-7">
                <span className="mt-2 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F7EF] text-[#0E9F6E]">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                </span>
                <button
                  type="button"
                  onClick={() => { setRegOpen(false); setRegSent(false); }}
                  className="mt-5 inline-flex items-center gap-2 rounded-[4px] border border-[#CFE8EA] bg-white px-6 py-3 text-[14.5px] font-bold text-[#152A2E] transition-colors hover:border-[#17AEB9]"
                >
                  Back to the webinar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}