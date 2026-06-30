"use client";

import { useEffect, useState } from "react";
import { loadJobs, saveJobs } from "@/features/jobs/services/jobStorage";
import type { Job } from "@/features/jobs/types/job";
import type { JobStatus, JobPriority } from "@/features/jobs/types/job";

type UseJobsResult = {
  jobs: Job[];
  addJob: (
    company: string,
    status: JobStatus,
    priority?: JobPriority,
    tags?: string[],
    notes?: string
  ) => void;
  updateJob: (updatedJob: Job) => void;
  deleteJob: (jobId: string) => void;
};

export function useJobs(): UseJobsResult {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [hasLoadedJobs, setHasLoadedJobs] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setJobs(loadJobs());
      setHasLoadedJobs(true);
    });
  }, []);

  useEffect(() => {
    if (!hasLoadedJobs) {
      return;
    }

    saveJobs(jobs);
  }, [hasLoadedJobs, jobs]);

  function addJob(
    company: string,
    status: JobStatus,
    priority: JobPriority = "Medium",
    tags: string[] = [],
    notes: string = ""
  ) {
    const job: Job = {
      id: crypto.randomUUID(),
      company,
      status,
      priority,
      tags,
      notes,
      createdAt: new Date().toISOString(),
    };

    setJobs((currentJobs) => [...currentJobs, job]);
  }

  function updateJob(updatedJob: Job) {
    setJobs((currentJobs) =>
      currentJobs.map((job) => (job.id === updatedJob.id ? updatedJob : job))
    );
  }

  function deleteJob(jobId: string) {
    setJobs((currentJobs) => currentJobs.filter((job) => job.id !== jobId));
  }

  return {
    jobs,
    addJob,
    updateJob,
    deleteJob,
  };
}

