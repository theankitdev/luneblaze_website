
"use client";

import { useEffect, useState } from "react";

import BlogHero from "@/components/blog/BlogHero";
import WebinarListSection from "@/components/webinar/WebinarListSection";
import BlogJoinSection from "@/components/blog/BlogJoinSection";
import webinarService from "@/services/webinarService";

const formatDate = (date) => {
  if (!date) return "Date to be announced";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date to be announced";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getWebinarStatus = (date) => {
  if (!date) return "UPCOMING";

  const webinarDate = new Date(date);

  if (Number.isNaN(webinarDate.getTime())) {
    return "UPCOMING";
  }

  return webinarDate >= new Date() ? "UPCOMING" : "ON DEMAND";
};

const getDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return "Session";

  const parseTime = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const start = parseTime(startTime);
  const end = parseTime(endTime);

  if (Number.isNaN(start) || Number.isNaN(end)) {
    return "Session";
  }

  let duration = end - start;

  // Handle sessions that continue past midnight.
  if (duration < 0) duration += 24 * 60;

  return duration > 0 ? `${duration} min` : "Session";
};

const getAssetUrl = (path, host) => {
  if (!path) return "/assets/blog-5.png";

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const baseUrl = (host || "").replace(/\/+$/, "");
  const imagePath = path.replace(/^\/+/, "");

  return baseUrl ? `${baseUrl}/${imagePath}` : `/${imagePath}`;
};

const mapWebinar = (webinar, host) => {
  const status = getWebinarStatus(webinar.session_date);
  const category = webinar.subtitle || "Webinar";

  return {
    id: webinar.id,
    slug: String(webinar.id),

    img: getAssetUrl(webinar.image, host),

    title: webinar.title || "Untitled Webinar",
    desc: webinar.description || "",

    tag: category,
    cat: category.toLowerCase().trim().replace(/\s+/g, "-"),

    status,
    meta: formatDate(webinar.session_date),
    length: getDuration(webinar.start_time, webinar.end_time),

    cta: status === "UPCOMING" ? "Register interest" : "Watch session",
    href: `/webinars/${webinar.id}`,

    speaker: webinar.speaker || "",
    designation: webinar.designation || "",
    speakerImage: getAssetUrl(webinar.speaker_image, host),

    youtubeLink: webinar.youtube_link || "",
    webinarLink: webinar.webinar_link || "",

    startTime: webinar.start_time || "",
    endTime: webinar.end_time || "",
  };
};

export default function WebinarsPage() {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchWebinars = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await webinarService.getWebinars({
          offset: 1,
          limit: 20,
        });

        if (!isMounted) return;

        if (
          response?.status === "success" &&
          Array.isArray(response.data)
        ) {
          const formattedWebinars = response.data.map((webinar) =>
            mapWebinar(webinar, response.host)
          );

          setWebinars(formattedWebinars);
        } else {
          setWebinars([]);
        }
      } catch (err) {
        console.error("Failed to fetch webinars:", err);

        if (isMounted) {
          setError("Unable to load webinars. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchWebinars();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <BlogHero
        breadcrumb="Webinars"
        title="Practical Sessions."
        highlight="Better-Prepared Teams"
        subtitle="Explore session topics for principals, coordinators, IQAC members and institutional quality teams."
      />

      <section className="min-h-[300px]">
        {loading && (
          <div className="py-16 text-center">
            <p>Loading webinars...</p>
          </div>
        )}

        {!loading && error && (
          <div className="py-16 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && webinars.length === 0 && (
          <div className="py-16 text-center">
            <p>No webinars available at the moment.</p>
          </div>
        )}

        {!loading && !error && webinars.length > 0 && (
          <WebinarListSection items={webinars} />
        )}
      </section>

      <BlogJoinSection
        title="Get Session Invites on WhatsApp"
        description="Join the Luneblaze quality group and get webinar invites, framework updates and templates the moment they are out — alongside coordinators and principals working through the same cycles."
        whatsappLabel="Join the WhatsApp Group"
      />
    </>
  );
}
