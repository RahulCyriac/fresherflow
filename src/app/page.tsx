"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import StatsDashboard from "@/features/jobs/components/StatsDashboard";
import JobFilters from "@/features/jobs/components/JobFilters";
import JobList from "@/features/jobs/components/JobList";
import JobForm from "@/features/jobs/components/JobForm";
import JobDetailModal from "@/features/jobs/components/JobDetailModal";
import { useJobs } from "@/features/jobs/hooks/useJobs";
import type { Job } from "@/features/jobs/types/job";

export default function Home() {
  const { jobs, addJob, updateJob, deleteJob } = useJobs();

  // Filters state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("NEWEST");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  // Toggle tag filter helper
  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Filter & Sort logic
  const filteredJobs = jobs.filter((job) => {
    // 1. Search Query (Company name)
    const matchesSearch = job.company.toLowerCase().includes(search.toLowerCase());

    // 2. Status Filter
    const matchesStatus = statusFilter === "ALL" || job.status === statusFilter;

    // 3. Priority Filter
    const matchesPriority = priorityFilter === "ALL" || job.priority === priorityFilter;

    // 4. Date Applied Filter
    let matchesDate = true;
    if (dateFilter !== "ALL") {
      const createdAtDate = new Date(job.createdAt);
      const now = new Date();
      const diffTime = now.getTime() - createdAtDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (dateFilter === "TODAY") {
        // Match today calendar day
        matchesDate =
          createdAtDate.getDate() === now.getDate() &&
          createdAtDate.getMonth() === now.getMonth() &&
          createdAtDate.getFullYear() === now.getFullYear();
      } else if (dateFilter === "PAST_WEEK") {
        matchesDate = diffDays <= 7;
      } else if (dateFilter === "PAST_MONTH") {
        matchesDate = diffDays <= 30;
      }
    }

    // 5. Tags Filter (match all selected filters)
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => job.tags?.includes(tag));

    return matchesSearch && matchesStatus && matchesPriority && matchesDate && matchesTags;
  });

  // Sort logic
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === "COMPANY_AZ") {
      return a.company.localeCompare(b.company);
    }
    if (sortBy === "COMPANY_ZA") {
      return b.company.localeCompare(a.company);
    }
    if (sortBy === "NEWEST") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === "OLDEST") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 flex flex-col font-sans selection:bg-zinc-800 selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Subtle background glow effect (Vercel Style) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[300px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/40 via-transparent to-transparent pointer-events-none -z-10" />

        {/* Dashboard Header */}
        <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Applications Tracker
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              Organize your job search, log interview preparation notes, and monitor your pipelines.
            </p>
          </div>
          <div>
            <button
              onClick={() => setIsAddOpen(true)}
              className="w-full sm:w-auto bg-zinc-100 text-zinc-950 hover:bg-zinc-200 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm active:scale-[0.98] cursor-pointer"
            >
              Add Application
            </button>
          </div>
        </section>

        {/* Statistics Section */}
        <StatsDashboard jobs={jobs} />

        {/* Filters and List Grid */}
        <section className="space-y-6">
          <JobFilters
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
          />

          <JobList jobs={sortedJobs} onJobClick={setEditingJob} />
        </section>
      </main>

      {/* Footer info */}
      <footer className="border-t border-zinc-900 bg-zinc-950/20 py-8 text-center text-xs text-zinc-600">
        <p>© {new Date().getFullYear()} FresherFlow. Built for students and graduates.</p>
      </footer>

      {/* Add Job Modal Dialog */}
      <JobForm
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAddJob={addJob}
      />

      {/* Edit Job Modal Dialog */}
      <JobDetailModal
        job={editingJob}
        isOpen={editingJob !== null}
        onClose={() => setEditingJob(null)}
        onSave={updateJob}
        onDelete={deleteJob}
      />
    </div>
  );
}

