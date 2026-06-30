import { isJobStatus } from "@/features/jobs/types/job";
import type { Job } from "@/features/jobs/types/job";

const JOBS_STORAGE_KEY = "jobs";

import { isJobPriority } from "@/features/jobs/types/job";

function normalizeJob(value: unknown): Job | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const candidate = value as Record<string, unknown>;

  // Check required core fields (company name and a valid status are required)
  if (typeof candidate.company !== "string" || !isJobStatus(candidate.status)) {
    return null;
  }

  const id = typeof candidate.id === "string" ? candidate.id : crypto.randomUUID();
  const company = candidate.company;
  const status = candidate.status;
  const createdAt = typeof candidate.createdAt === "string" ? candidate.createdAt : new Date().toISOString();

  // Normalize new attributes with sensible defaults
  const priority = isJobPriority(candidate.priority) ? candidate.priority : "Medium";

  let tags: string[] = [];
  if (Array.isArray(candidate.tags)) {
    tags = candidate.tags.filter((tag): tag is string => typeof tag === "string");
  }

  const notes = typeof candidate.notes === "string" ? candidate.notes : "";

  return {
    id,
    company,
    status,
    priority,
    tags,
    notes,
    createdAt,
  };
}


export function loadJobs(): Job[] {
  const savedJobs = localStorage.getItem(JOBS_STORAGE_KEY);

  if (savedJobs === null) {
    return [];
  }

  try {
    const parsedJobs: unknown = JSON.parse(savedJobs);

    if (!Array.isArray(parsedJobs)) {
      return [];
    }

    return parsedJobs.reduce<Job[]>((jobs, parsedJob) => {
      const job = normalizeJob(parsedJob);

      if (job === null) {
        return jobs;
      }

      return [...jobs, job];
    }, []);
  } catch {
    return [];
  }
}

export function saveJobs(jobs: Job[]): void {
  localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
}
