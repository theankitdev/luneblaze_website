
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  FaUsers,
  FaSearch,
  FaSyncAlt,
  FaEye,
  FaFilePdf,
  FaTimes,
  FaBriefcase,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";

import _sidebar from "@/components/admin/_sidebar";
import { isAuthenticated } from "@/services/admin-auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

const STATUSES = [
  "Pending",
  "Shortlisted",
  "Rejected",
  "Hired",
];

const statusStyles = {
  Pending: "bg-yellow-100 text-yellow-800",
  Shortlisted: "bg-blue-100 text-blue-800",
  Rejected: "bg-red-100 text-red-800",
  Hired: "bg-green-100 text-green-800",
};

export default function JobApplicationsPage() {
  const router = useRouter();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    isAuthenticated("/admin/login", router, false);
  }, [router]);

  const fetchApplications = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    else setRefreshing(true);

    try {
      const response = await api.get("getJobApplications.json");

      if (response.data?.status !== "success") {
        throw new Error(
          response.data?.message || "Unable to fetch applications."
        );
      }

      setApplications(
        Array.isArray(response.data.data) ? response.data.data : []
      );
    } catch (error) {
      console.error("Fetch applications error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to load applications."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const filteredApplications = useMemo(() => {
    const term = search.trim().toLowerCase();

    return applications.filter((application) => {
      const matchesStatus =
        statusFilter === "All" ||
        application.status === statusFilter;

      const matchesSearch =
        !term ||
        [
          application.name,
          application.email,
          application.phone,
          application.role,
          application.job_title,
          application.experience,
        ].some((value) =>
          String(value || "").toLowerCase().includes(term)
        );

      return matchesStatus && matchesSearch;
    });
  }, [applications, search, statusFilter]);

  const counts = useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter(
        (item) => item.status === "Pending"
      ).length,
      shortlisted: applications.filter(
        (item) => item.status === "Shortlisted"
      ).length,
      hired: applications.filter(
        (item) => item.status === "Hired"
      ).length,
    };
  }, [applications]);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);

    try {
      const response = await api.post(
        "updateJobApplicationStatus.json",
        { id, status }
      );

      if (response.data?.status !== "success") {
        throw new Error(
          response.data?.message || "Status update failed."
        );
      }

      setApplications((previous) =>
        previous.map((application) =>
          Number(application.id) === Number(id)
            ? { ...application, status }
            : application
        )
      );

      setSelectedApplication((previous) =>
        previous && Number(previous.id) === Number(id)
          ? { ...previous, status }
          : previous
      );

      toast.success("Application status updated.");
    } catch (error) {
      console.error("Update status error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to update status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const downloadResume = (application) => {
    if (!application?.id) {
      toast.error("Application ID not found.");
      return;
    }

    // This endpoint must be implemented in CakePHP.
    const url =
      `${API_BASE_URL}downloadJobApplicationResume.json?id=` +
      encodeURIComponent(application.id);

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return date;

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const openDetails = (application) => {
    setSelectedApplication(application);
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100";

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        <_sidebar />

        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

            {/* Header */}
            <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-teal-700">
                  Admin Panel
                </p>

                <h1 className="mt-1 flex items-center gap-2 text-2xl font-bold text-gray-900">
                  <FaUsers className="text-teal-600" />
                  Job Applications
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Review applicants and manage recruitment status.
                </p>
              </div>

              <button
                onClick={() => fetchApplications(false)}
                disabled={refreshing || loading}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <FaSyncAlt className={refreshing ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>

            {/* Statistics */}
            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: "Total Applications",
                  value: counts.total,
                  color: "text-gray-900",
                },
                {
                  label: "Pending",
                  value: counts.pending,
                  color: "text-yellow-600",
                },
                {
                  label: "Shortlisted",
                  value: counts.shortlisted,
                  color: "text-blue-600",
                },
                {
                  label: "Hired",
                  value: counts.hired,
                  color: "text-green-600",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <p className="text-sm text-gray-500">
                    {item.label}
                  </p>

                  <p className={`mt-2 text-2xl font-bold ${item.color}`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Search and Filter */}
            <div className="mb-5 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, email, phone or job..."
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-teal-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-teal-500"
              >
                <option value="All">All Statuses</option>

                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Applications Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              {loading ? (
                <div className="p-12 text-center text-sm text-gray-500">
                  Loading applications...
                </div>
              ) : filteredApplications.length === 0 ? (
                <div className="p-12 text-center">
                  <FaUsers className="mx-auto text-3xl text-gray-300" />

                  <h2 className="mt-3 font-semibold text-gray-800">
                    No applications found
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Try changing your search or status filter.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {[
                          "Applicant",
                          "Applied Job",
                          "Experience",
                          "Applied On",
                          "Status",
                          "Actions",
                        ].map((heading) => (
                          <th
                            key={heading}
                            className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {filteredApplications.map((application) => (
                        <tr
                          key={application.id}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-5 py-4">
                            <p className="font-semibold text-gray-900">
                              {application.name}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {application.email}
                            </p>

                            <p className="text-xs text-gray-500">
                              {application.phone}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-sm font-medium text-gray-800">
                              {application.job_title || "Job unavailable"}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {application.role || "—"}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-700">
                            {application.experience || "—"}
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-700">
                            {formatDate(application.created_at)}
                          </td>

                          <td className="px-5 py-4">
                            <select
                              value={application.status || "Pending"}
                              disabled={updatingId === application.id}
                              onChange={(e) =>
                                updateStatus(
                                  application.id,
                                  e.target.value
                                )
                              }
                              className={`rounded-full border-0 px-3 py-2 text-xs font-semibold outline-none ${
                                statusStyles[application.status] ||
                                statusStyles.Pending
                              } disabled:opacity-50`}
                            >
                              {STATUSES.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openDetails(application)}
                                title="View details"
                                className="rounded-lg border border-teal-200 p-2 text-teal-700 hover:bg-teal-50"
                              >
                                <FaEye />
                              </button>

                              <button
                                onClick={() => downloadResume(application)}
                                title="Download resume"
                                className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100"
                              >
                                <FaFilePdf />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="border-t border-gray-100 px-5 py-3 text-xs text-gray-500">
                Showing {filteredApplications.length} of{" "}
                {applications.length} applications
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Applicant Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4">
          <div className="mx-auto my-6 max-w-3xl rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Applicant Details
                </h2>

                <p className="text-xs text-gray-500">
                  Application #{selectedApplication.id}
                </p>
              </div>

              <button
                onClick={() => setSelectedApplication(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <FaTimes />
              </button>
            </div>

            <div className="grid gap-5 p-6 sm:grid-cols-2">

              {[
                ["Full Name", selectedApplication.name],
                ["Age", selectedApplication.age],
                ["Email", selectedApplication.email],
                ["Phone", selectedApplication.phone],
                ["Applied Job", selectedApplication.job_title],
                ["Applied Role", selectedApplication.role],
                ["Experience", selectedApplication.experience],
                ["Education", selectedApplication.education],
                ["Applied On", formatDate(selectedApplication.created_at)],
                ["Status", selectedApplication.status],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs font-semibold uppercase text-gray-400">
                    {label}
                  </p>

                  <p className="mt-1 break-words text-sm font-medium text-gray-800">
                    {value || "—"}
                  </p>
                </div>
              ))}

              <div className="sm:col-span-2">
                <p className="text-xs font-semibold uppercase text-gray-400">
                  LinkedIn / Portfolio
                </p>

                {selectedApplication.profile ? (
                  <a
                    href={selectedApplication.profile}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-2 break-all text-sm font-medium text-teal-700 hover:underline"
                  >
                    {selectedApplication.profile}
                    <FaExternalLinkAlt />
                  </a>
                ) : (
                  <p className="mt-1 text-sm text-gray-500">—</p>
                )}
              </div>

              {[
                ["Projects", selectedApplication.projects],
                ["Why do you want to join us?", selectedApplication.why],
                ["Additional Notes", selectedApplication.notes],
              ].map(([label, value]) => (
                <div key={label} className="sm:col-span-2">
                  <p className="text-xs font-semibold uppercase text-gray-400">
                    {label}
                  </p>

                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                    {value || "—"}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-between gap-3 border-t bg-gray-50 px-6 py-4">
              <button
                onClick={() => downloadResume(selectedApplication)}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                <FaFilePdf />
                Download Resume
              </button>

              <div className="flex flex-wrap gap-2">
                <select
                  value={selectedApplication.status || "Pending"}
                  disabled={updatingId === selectedApplication.id}
                  onChange={(e) =>
                    updateStatus(selectedApplication.id, e.target.value)
                  }
                  className={inputClass}
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setSelectedApplication(null)}
                  className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" />
    </>
  );
}
