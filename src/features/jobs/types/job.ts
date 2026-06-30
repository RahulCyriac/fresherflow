export const JOB_STATUSES = [
  "Applied",
  "OA",
  "Interview",
  "HR Round",
  "Final Round",
  "Offer",
  "Rejected",
] as const;

export type JobStatus = (typeof JOB_STATUSES)[number];

export const JOB_PRIORITIES = ["Low", "Medium", "High", "Urgent"] as const;

export type JobPriority = (typeof JOB_PRIORITIES)[number];

export type Job = {
  id: string;
  company: string;
  status: JobStatus;
  priority: JobPriority;
  tags: string[];
  notes?: string;
  createdAt: string;
};

export function isJobStatus(value: unknown): value is JobStatus {
  return typeof value === "string" && JOB_STATUSES.some((status) => status === value);
}

export function isJobPriority(value: unknown): value is JobPriority {
  return typeof value === "string" && JOB_PRIORITIES.some((priority) => priority === value);
}
