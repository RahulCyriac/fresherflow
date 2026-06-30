"use client";

import type { Job } from "@/features/jobs/types/job";
import JobCard from "@/features/jobs/components/JobCard";

type JobListProps = {
  jobs: Job[];
  onJobClick: (job: Job) => void;
};

export default function JobList({ jobs, onJobClick }: JobListProps) {
  if (jobs.length === 0) {
    return (
      <section className="mt-6 text-center border border-zinc-800 border-dashed rounded-xl py-12 px-4 bg-zinc-950/20">
        <p className="text-zinc-400 text-sm">No applications found.</p>
        <p className="text-zinc-600 text-xs mt-1">
          Try adding a new job application or adjusting your search filters.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onClick={() => onJobClick(job)}
          />
        ))}
      </div>
    </section>
  );
}
