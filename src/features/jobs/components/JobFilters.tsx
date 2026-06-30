"use client";

import { JOB_STATUSES, JOB_PRIORITIES } from "@/features/jobs/types/job";
import type { JobStatus, JobPriority } from "@/features/jobs/types/job";

type JobFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  priorityFilter: string;
  onPriorityFilterChange: (value: string) => void;
  dateFilter: string;
  onDateFilterChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
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

export default function JobFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  dateFilter,
  onDateFilterChange,
  sortBy,
  onSortByChange,
  selectedTags,
  onTagToggle,
}: JobFiltersProps) {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-4">
      {/* Search and Dropdowns Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search company..."
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 rounded-lg pl-3 pr-4 py-2 text-sm focus:outline-none focus:border-zinc-700 transition-colors"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-700 transition-colors cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            {JOB_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityFilterChange(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-700 transition-colors cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            {JOB_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                Priority: {priority}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <select
            value={dateFilter}
            onChange={(e) => onDateFilterChange(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-700 transition-colors cursor-pointer"
          >
            <option value="ALL">All Time</option>
            <option value="TODAY">Added Today</option>
            <option value="PAST_WEEK">Past 7 Days</option>
            <option value="PAST_MONTH">Past 30 Days</option>
          </select>
        </div>

        {/* Sort selector */}
        <div>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-700 transition-colors cursor-pointer"
          >
            <option value="NEWEST">Newest First</option>
            <option value="OLDEST">Oldest First</option>
            <option value="COMPANY_AZ">Company (A-Z)</option>
            <option value="COMPANY_ZA">Company (Z-A)</option>
          </select>
        </div>
      </div>


      {/* Tags Filter Row */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-900">
        <span className="text-xs font-semibold text-zinc-500 mr-2 uppercase tracking-wider">
          Filter by tag:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {AVAILABLE_TAGS.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => onTagToggle(tag)}
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
    </div>
  );
}
