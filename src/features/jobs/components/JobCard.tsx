"use client";

import type { Job, JobStatus, JobPriority } from "@/features/jobs/types/job";

type JobCardProps = {
  job: Job;
  onClick: () => void;
};

function getRelativeTimeString(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  // Set times to midnight to calculate absolute day differences
  const dateCopy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const nowCopy = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffTime = nowCopy.getTime() - dateCopy.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

function getPriorityStyles(priority: JobPriority): string {
  switch (priority) {
    case "Urgent":
      return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    case "High":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "Medium":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "Low":
      return "bg-zinc-800/40 text-zinc-400 border-zinc-800/50";
    default:
      return "bg-zinc-800/40 text-zinc-400 border-zinc-800/50";
  }
}

function getStatusStyles(status: JobStatus): string {
  switch (status) {
    case "Applied":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "OA":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    case "Interview":
      return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "HR Round":
      return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    case "Final Round":
      return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
    case "Offer":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "Rejected":
      return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    default:
      return "bg-zinc-800/40 text-zinc-400 border-zinc-800/50";
  }
}

export default function JobCard({ job, onClick }: JobCardProps) {
  return (
    <article
      onClick={onClick}
      className="border border-zinc-800 bg-zinc-950 hover:bg-zinc-900/40 hover:border-zinc-700 transition-all rounded-xl p-4 text-left cursor-pointer group flex flex-col justify-between space-y-3"
    >
      <div className="flex justify-between items-start">
        {/* Company & Date */}
        <div>
          <h4 className="font-semibold text-zinc-100 group-hover:text-white transition-colors text-sm md:text-base">
            {job.company}
          </h4>
          <span className="text-[10px] text-zinc-500 font-medium block mt-0.5">
            {getRelativeTimeString(job.createdAt)}
          </span>
        </div>

        {/* Badges */}
        <div className="flex gap-1.5 items-center">
          <span
            className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getPriorityStyles(
              job.priority
            )}`}
          >
            {job.priority}
          </span>
          <span
            className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusStyles(
              job.status
            )}`}
          >
            {job.status}
          </span>
        </div>
      </div>

      {/* Notes Preview (Line clamped) */}
      {job.notes && (
        <p className="text-xs text-zinc-500 line-clamp-1 italic bg-zinc-900/30 border border-zinc-900/50 rounded-lg p-2 mt-1">
          "{job.notes}"
        </p>
      )}

      {/* Tags List */}
      {job.tags && job.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-1">
          {job.tags.map((tag) => (
            <span
              key={tag}
              className="text-[9px] font-medium bg-zinc-900 text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
