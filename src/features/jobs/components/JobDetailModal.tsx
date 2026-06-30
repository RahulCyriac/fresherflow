"use client";

import { useState, useEffect } from "react";
import type { Job, JobStatus, JobPriority } from "@/features/jobs/types/job";
import { JOB_STATUSES, JOB_PRIORITIES } from "@/features/jobs/types/job";

type JobDetailModalProps = {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedJob: Job) => void;
  onDelete: (jobId: string) => void;
};

const AVAILABLE_TAGS = [
  "Frontend",
  "Backend",
  "AI",
  "Cloud",
  "Remote",
  "Internship",
  "Full Time",
];

export default function JobDetailModal({
  job,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: JobDetailModalProps) {
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<JobStatus>("Applied");
  const [priority, setPriority] = useState<JobPriority>("Medium");
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  // Sync state with selected job
  useEffect(() => {
    if (job) {
      setCompany(job.company);
      setStatus(job.status);
      setPriority(job.priority);
      setTags(job.tags);
      setNotes(job.notes || "");
    }
  }, [job]);

  if (!isOpen || !job) {
    return null;
  }

  function handleSave() {
    if (!job) {
      return;
    }

    const trimmedCompany = company.trim();
    if (trimmedCompany === "") {
      return;
    }

    onSave({
      id: job.id,
      company: trimmedCompany,
      status,
      priority,
      tags,
      notes,
      createdAt: job.createdAt,
    });
    onClose();
  }


  function handleTagToggle(tag: string) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  // Format date readable
  const formattedDate = new Date(job.createdAt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Modal Card */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl max-w-lg w-full shadow-2xl flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
        {/* Header */}
        <div className="border-b border-zinc-900 p-4 flex justify-between items-center bg-zinc-950/80">
          <div>
            <h3 className="text-base font-semibold text-zinc-100">
              Edit Application
            </h3>
            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
              ID: {job.id.slice(0, 8)}...
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 text-lg cursor-pointer"
            type="button"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 space-y-4 overflow-y-auto max-h-[70vh] text-left">
          {/* Company Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Company Name
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-700 transition-colors"
            />
          </div>

          {/* Status & Priority Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as JobStatus)}
                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-700 transition-colors cursor-pointer"
              >
                {JOB_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as JobPriority)}
                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-700 transition-colors cursor-pointer"
              >
                {JOB_PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_TAGS.map((tag) => {
                const isSelected = tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 text-xs rounded-full border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-zinc-100 text-zinc-950 border-zinc-100 font-medium"
                        : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Referral from LinkedIn, Revise DSA before coding round..."
              rows={4}
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-700 transition-colors resize-none"
            />
          </div>

          {/* Created Date Display */}
          <div className="text-[11px] text-zinc-500 font-medium flex justify-between items-center pt-2">
            <span>Date Added:</span>
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-900 p-4 flex justify-between items-center bg-zinc-950/80">
          <button
            type="button"
            onClick={() => {
              onDelete(job.id);
              onClose();
            }}
            className="text-xs bg-rose-950/40 text-rose-400 border border-rose-950 hover:bg-rose-950/80 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer"
          >
            Delete Application
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs border border-zinc-800 text-zinc-400 hover:text-zinc-200 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="text-xs bg-zinc-100 text-zinc-950 hover:bg-zinc-200 px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
