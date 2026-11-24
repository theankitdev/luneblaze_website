"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaBriefcase, FaPlus, FaSearch, FaEdit, FaArchive, FaExternalLinkAlt, FaSyncAlt } from "react-icons/fa";
import _sidebar from "@/components/admin/_sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isAuthenticated } from "@/services/admin-auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { Accept: "application/json" },
});

const emptyEditForm = {
  id: "",
  title: "",
  slug: "",
  department: "",
  employment_type: "Full-time",
  location: "",
  experience: "",
  short_description: "",
  about: [""],
  responsibilities: [""],
  requirements: [""],
  is_active: true,
};

const parseList = (value) => {
  if (Array.isArray(value)) return value.length ? value : [""];
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.length ? parsed : [""];
    } catch (_) {
      if (value.trim()) return [value];
    }
  }
  return [""];
};

const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

function EditList({ label, values, onChange }) {
  const update = (index, value) => onChange(values.map((item, i) => i === index ? value : item));
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <button type="button" onClick={() => onChange([...values, ""])} className="text-sm font-semibold text-teal-700 hover:text-teal-800">+ Add item</button>
      </div>
      <div className="space-y-2">
        {values.map((value, index) => (
          <div key={`${label}-${index}`} className="flex gap-2">
            <textarea rows={2} value={value} onChange={(e) => update(index, e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500" placeholder={`${label} ${index + 1}`} />
            <button type="button" disabled={values.length === 1} onClick={() => onChange(values.filter((_, i) => i !== index))} className="rounded-lg border border-red-200 px-3 text-xs font-semibold text-red-600 disabled:opacity-40">Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function JobsAdminPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(emptyEditForm);

  useEffect(() => {
    isAuthenticated("/admin/login", router, false);
  }, [router]);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("getJobs.json");
      if (response.data?.status === "success") {
        setJobs(Array.isArray(response.data.data) ? response.data.data : []);
      } else {
        setJobs([]);
        if (response.data?.message) toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Fetch jobs error:", error);
      toast.error(error.response?.data?.message || "Unable to load jobs. Check the API URL and server.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const filteredJobs = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return jobs;
    return jobs.filter((job) => [job.title, job.department, job.location, job.employment_type, job.slug].some((value) => String(value || "").toLowerCase().includes(term)));
  }, [jobs, search]);

  const openEdit = async (job) => {
    setSaving(true);
    try {
      const response = await api.get(`getJobBySlug/${encodeURIComponent(job.slug)}.json`);
      const data = response.data?.data;
      if (!data) throw new Error(response.data?.message || "Unable to load job details.");
      setForm({
        ...emptyEditForm,
        ...data,
        id: data.id,
        is_active: Boolean(Number(data.is_active ?? 1)),
        about: parseList(data.about),
        responsibilities: parseList(data.responsibilities),
        requirements: parseList(data.requirements),
      });
      setEditing(true);
    } catch (error) {
      console.error("Load job details error:", error);
      toast.error(error.response?.data?.message || error.message || "Unable to load job details.");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => setForm((previous) => ({ ...previous, [field]: value }));

  const saveEdit = async (event) => {
    event.preventDefault();
    const clean = (items) => items.map((item) => String(item).trim()).filter(Boolean);
    const about = clean(form.about);
    const responsibilities = clean(form.responsibilities);
    const requirements = clean(form.requirements);
    if (!form.title.trim() || !form.slug.trim() || !form.department.trim()) {
      toast.error("Title, slug and department are required.");
      return;
    }
    if (!about.length || !responsibilities.length || !requirements.length) {
      toast.error("Add at least one About, Responsibility and Requirement item.");
      return;
    }
    const payload = {
      id: form.id,
      title: form.title.trim(),
      slug: slugify(form.slug),
      department: form.department.trim(),
      employment_type: form.employment_type,
      location: form.location.trim(),
      experience: form.experience.trim(),
      short_description: form.short_description.trim(),
      about: JSON.stringify(about),
      responsibilities: JSON.stringify(responsibilities),
      requirements: JSON.stringify(requirements),
      is_active: form.is_active ? 1 : 0,
    };
    setSaving(true);
    try {
      const response = await api.post("updateJob.json", payload);
      if (response.data?.status !== "success") throw new Error(response.data?.message || "Job update failed.");
      toast.success(response.data.message || "Job updated successfully.");
      setEditing(false);
      await fetchJobs();
    } catch (error) {
      console.error("Update job error:", error);
      toast.error(error.response?.data?.message || error.message || "Unable to update job.");
    } finally {
      setSaving(false);
    }
  };

  const archiveJob = async (job) => {
    const confirmed = window.confirm(`Archive "${job.title}"? It will be removed from the public careers listing.`);
    if (!confirmed) return;
    try {
      const response = await api.post("deleteJob.json", { id: job.id });
      if (response.data?.status !== "success") throw new Error(response.data?.message || "Unable to archive job.");
      toast.success(response.data.message || "Job archived successfully.");
      await fetchJobs();
    } catch (error) {
      console.error("Archive job error:", error);
      toast.error(error.response?.data?.message || error.message || "Unable to archive job.");
    }
  };

  const inputClass = "mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100";

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        <_sidebar />
        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-teal-700">Admin Panel</p>
                <h1 className="mt-1 flex items-center gap-2 text-2xl font-bold text-gray-900"><FaBriefcase className="text-teal-600" /> Manage Jobs</h1>
                <p className="mt-1 text-sm text-gray-500">Create, edit and archive openings displayed on the careers page.</p>
              </div>
              <button onClick={() => router.push("/admin/add-job")} className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700"><FaPlus /> Add New Job</button>
            </div>

            <div className="mb-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"><p className="text-sm text-gray-500">Active jobs</p><p className="mt-1 text-2xl font-bold text-gray-900">{jobs.length}</p></div>
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"><p className="text-sm text-gray-500">Matching results</p><p className="mt-1 text-2xl font-bold text-gray-900">{filteredJobs.length}</p></div>
              <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm"><div><p className="text-sm text-gray-500">Manage listings</p><p className="mt-1 text-sm font-semibold text-gray-800">Refresh job data</p></div><button onClick={fetchJobs} disabled={loading} className="rounded-lg border border-gray-200 p-3 text-teal-700 hover:bg-teal-50 disabled:opacity-50" title="Refresh"><FaSyncAlt className={loading ? "animate-spin" : ""} /></button></div>
            </div>

            <div className="mb-4 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-md"><FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title, department, location..." className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-teal-500" /></div>
              <p className="text-sm text-gray-500">Showing {filteredJobs.length} of {jobs.length} active jobs</p>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              {loading ? (
                <div className="p-12 text-center text-sm text-gray-500">Loading jobs...</div>
              ) : filteredJobs.length === 0 ? (
                <div className="p-12 text-center"><FaBriefcase className="mx-auto text-3xl text-gray-300" /><h2 className="mt-3 font-semibold text-gray-800">No jobs found</h2><p className="mt-1 text-sm text-gray-500">Add a new job or change your search.</p><button onClick={() => router.push("/admin/add-job")} className="mt-4 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700">Create first job</button></div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50"><tr>{["Job", "Department", "Employment", "Location", "Experience", "Actions"].map((heading) => <th key={heading} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{heading}</th>)}</tr></thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredJobs.map((job) => (
                        <tr key={job.id} className="hover:bg-gray-50">
                          <td className="max-w-xs px-5 py-4"><p className="font-semibold text-gray-900">{job.title}</p><p className="mt-1 truncate text-xs text-gray-500">/career/{job.slug}</p></td>
                          <td className="px-5 py-4 text-sm text-gray-700">{job.department || "—"}</td>
                          <td className="px-5 py-4"><span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">{job.employment_type || "—"}</span></td>
                          <td className="px-5 py-4 text-sm text-gray-700">{job.location || "—"}</td>
                          <td className="px-5 py-4 text-sm text-gray-700">{job.experience || "—"}</td>
                          <td className="px-5 py-4"><div className="flex items-center gap-2"><button onClick={() => openEdit(job)} disabled={saving} className="inline-flex items-center gap-1.5 rounded-lg border border-teal-200 px-3 py-2 text-xs font-semibold text-teal-700 hover:bg-teal-50 disabled:opacity-50"><FaEdit /> Edit</button><button onClick={() => archiveJob(job)} className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"><FaArchive /> Archive</button><a href={`${process.env.NEXT_PUBLIC_SITE_URL || "https://www.luneblaze.com"}/career/${job.slug}`} target="_blank" rel="noreferrer" title="View public job" className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-100"><FaExternalLinkAlt /></a></div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4">
          <div className="mx-auto my-6 max-w-4xl rounded-2xl bg-white shadow-2xl">
            <form onSubmit={saveEdit}>
              <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b bg-white px-6 py-4"><div><h2 className="text-lg font-bold text-gray-900">Edit job</h2><p className="text-xs text-gray-500">Update the job information and publish status.</p></div><button type="button" onClick={() => setEditing(false)} className="rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-100">Close ✕</button></div>
              <div className="grid gap-5 p-6 md:grid-cols-2">
                <label className="text-sm font-medium text-gray-700">Job title *<input required value={form.title} onChange={(e) => updateField("title", e.target.value)} className={inputClass} /></label>
                <label className="text-sm font-medium text-gray-700">Slug *<input required value={form.slug} onChange={(e) => updateField("slug", slugify(e.target.value))} className={inputClass} /></label>
                <label className="text-sm font-medium text-gray-700">Department *<input required value={form.department} onChange={(e) => updateField("department", e.target.value)} className={inputClass} /></label>
                <label className="text-sm font-medium text-gray-700">Employment type<select value={form.employment_type} onChange={(e) => updateField("employment_type", e.target.value)} className={inputClass}>{["Full-time", "Part-time", "Contract", "Internship", "Freelance"].map((type) => <option key={type}>{type}</option>)}</select></label>
                <label className="text-sm font-medium text-gray-700">Location<input required value={form.location} onChange={(e) => updateField("location", e.target.value)} className={inputClass} /></label>
                <label className="text-sm font-medium text-gray-700">Experience<input required value={form.experience} onChange={(e) => updateField("experience", e.target.value)} className={inputClass} /></label>
                <label className="text-sm font-medium text-gray-700 md:col-span-2">Short description<textarea required rows={3} value={form.short_description} onChange={(e) => updateField("short_description", e.target.value)} className={inputClass} /></label>
                <div className="md:col-span-2"><EditList label="About the role" values={form.about} onChange={(v) => updateField("about", v)} /></div>
                <div className="md:col-span-2"><EditList label="Responsibilities" values={form.responsibilities} onChange={(v) => updateField("responsibilities", v)} /></div>
                <div className="md:col-span-2"><EditList label="Requirements" values={form.requirements} onChange={(v) => updateField("requirements", v)} /></div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 md:col-span-2"><input type="checkbox" checked={form.is_active} onChange={(e) => updateField("is_active", e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-teal-600" /> Published / Active</label>
              </div>
              <div className="flex justify-end gap-3 border-t bg-gray-50 px-6 py-4"><button type="button" onClick={() => setEditing(false)} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700">Cancel</button><button type="submit" disabled={saving} className="rounded-lg bg-teal-600 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50">{saving ? "Saving..." : "Save changes"}</button></div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer position="top-center" />
    </>
  );
}
