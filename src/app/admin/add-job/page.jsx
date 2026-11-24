"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import _sidebar from "@/components/admin/_sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isAuthenticated } from "@/services/admin-auth";

const initialForm = {
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

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function ListEditor({ title, description, items, onChange, placeholder }) {
  const updateItem = (index, value) => {
    onChange(items.map((item, i) => (i === index ? value : item)));
  };

  const addItem = () => onChange([...items, ""]);

  const removeItem = (index) => {
    onChange(items.length === 1 ? [""] : items.filter((_, i) => i !== index));
  };

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-gray-800">{title}</h2>
          {description && <p className="mt-1 text-xs text-gray-500">{description}</p>}
        </div>
        <button
          type="button"
          onClick={addItem}
          className="rounded-md bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-100"
        >
          + Add item
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <textarea
              rows={2}
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={`${placeholder} ${index + 1}`}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              disabled={items.length === 1}
              title="Remove item"
              className="h-10 shrink-0 rounded-md border border-red-200 px-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function AddJobPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  useEffect(() => {
    isAuthenticated("/admin/login", router, false);
  }, [router]);

  const apiUrl = useMemo(
    () => `${process.env.NEXT_PUBLIC_API_BASE_URL}addJob.json`,
    []
  );

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTitleChange = (value) => {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: slugManuallyEdited ? prev.slug : slugify(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanList = (items) => items.map((item) => item.trim()).filter(Boolean);
    const about = cleanList(form.about);
    const responsibilities = cleanList(form.responsibilities);
    const requirements = cleanList(form.requirements);

    if (!form.title.trim() || !form.slug.trim() || !form.department.trim()) {
      toast.error("Please fill in the job title, slug and department.");
      return;
    }

    if (!about.length || !responsibilities.length || !requirements.length) {
      toast.error("Add at least one item in About, Responsibilities and Requirements.");
      return;
    }

    const payload = {
      ...form,
      title: form.title.trim(),
      slug: slugify(form.slug),
      department: form.department.trim(),
      location: form.location.trim(),
      experience: form.experience.trim(),
      short_description: form.short_description.trim(),
      about: JSON.stringify(about),
      responsibilities: JSON.stringify(responsibilities),
      requirements: JSON.stringify(requirements),
      is_active: form.is_active ? 1 : 0,
    };

    setLoading(true);
    try {
      const response = await axios.post(apiUrl, payload, {
        headers: { Accept: "application/json" },
      });

      if (response.data?.status === "success" || response.status === 200) {
        toast.success(response.data?.message || "Job created successfully!");
        setForm(initialForm);
        setSlugManuallyEdited(false);
      } else {
        toast.error(response.data?.message || "Unable to create job.");
      }
    } catch (error) {
      console.error("Create job error:", error);
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Job creation failed. Please check the API endpoint and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "block w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100";

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        <_sidebar />
        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-teal-700">Admin Panel</p>
                <h1 className="mt-1 text-2xl font-bold text-gray-800">Create Job</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Add a new opening to the Luneblaze careers page.
                </p>
              </div>
              <button
                type="button"
                onClick={() => router.push("/admin/jobs")}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-100"
              >
                View all jobs
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="mb-5 text-base font-semibold text-gray-800">Basic information</h2>
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-gray-700">Job title *</span>
                    <input
                      required
                      value={form.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. Frontend Engineer"
                      className={inputClass}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-gray-700">URL slug *</span>
                    <input
                      required
                      value={form.slug}
                      onChange={(e) => {
                        setSlugManuallyEdited(true);
                        updateField("slug", slugify(e.target.value));
                      }}
                      placeholder="frontend-engineer"
                      className={inputClass}
                    />
                    <span className="mt-1 block text-xs text-gray-500">
                      URL: /career/{form.slug || "job-slug"}
                    </span>
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-gray-700">Department / Team *</span>
                    <input
                      required
                      value={form.department}
                      onChange={(e) => updateField("department", e.target.value)}
                      placeholder="Engineering, Consulting, Growth..."
                      className={inputClass}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-gray-700">Employment type *</span>
                    <select
                      required
                      value={form.employment_type}
                      onChange={(e) => updateField("employment_type", e.target.value)}
                      className={inputClass}
                    >
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                      <option>Internship</option>
                      <option>Freelance</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-gray-700">Location *</span>
                    <input
                      required
                      value={form.location}
                      onChange={(e) => updateField("location", e.target.value)}
                      placeholder="Faridabad / Remote"
                      className={inputClass}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-gray-700">Experience *</span>
                    <input
                      required
                      value={form.experience}
                      onChange={(e) => updateField("experience", e.target.value)}
                      placeholder="e.g. 2+ years"
                      className={inputClass}
                    />
                  </label>

                  <label className="block md:col-span-2">
                    <span className="mb-1.5 block text-sm font-medium text-gray-700">Short description *</span>
                    <textarea
                      required
                      rows={3}
                      maxLength={500}
                      value={form.short_description}
                      onChange={(e) => updateField("short_description", e.target.value)}
                      placeholder="A short summary displayed on the careers listing page."
                      className={inputClass}
                    />
                    <span className="mt-1 block text-right text-xs text-gray-400">
                      {form.short_description.length}/500
                    </span>
                  </label>
                </div>
              </section>

              <ListEditor
                title="About the role *"
                description="Add one or more paragraphs describing the role."
                items={form.about}
                onChange={(value) => updateField("about", value)}
                placeholder="About the role paragraph"
              />

              <ListEditor
                title="Responsibilities *"
                description="Add the key duties and responsibilities."
                items={form.responsibilities}
                onChange={(value) => updateField("responsibilities", value)}
                placeholder="Responsibility"
              />

              <ListEditor
                title="Requirements *"
                description="Add the skills, qualifications and experience required."
                items={form.requirements}
                onChange={(value) => updateField("requirements", value)}
                placeholder="Requirement"
              />

              <section className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => updateField("is_active", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  Publish job immediately
                </label>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setForm(initialForm);
                      setSlugManuallyEdited(false);
                    }}
                    disabled={loading}
                    className="rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-md bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Creating..." : "Create Job"}
                  </button>
                </div>
              </section>
            </form>
          </div>
        </main>
      </div>
      <ToastContainer position="top-center" />
    </>
  );
}
