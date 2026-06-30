"use server";

import { prisma } from "@/lib/db";
import type { Job, JobStatus, JobPriority } from "@/features/jobs/types/job";

export async function getJobsAction(): Promise<Job[]> {
  const dbJobs = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
  });

  return dbJobs.map((dbJob) => {
    let tags: string[] = [];
    try {
      tags = JSON.parse(dbJob.tags);
    } catch {
      tags = [];
    }

    return {
      id: dbJob.id,
      company: dbJob.company,
      status: dbJob.status as JobStatus,
      priority: dbJob.priority as JobPriority,
      tags,
      notes: dbJob.notes || "",
      createdAt: dbJob.createdAt.toISOString(),
    };
  });
}

export async function createJobAction(
  company: string,
  status: JobStatus,
  priority: JobPriority,
  tags: string[],
  notes: string
): Promise<Job> {
  const dbJob = await prisma.job.create({
    data: {
      company,
      status,
      priority,
      tags: JSON.stringify(tags),
      notes: notes || null,
    },
  });

  return {
    id: dbJob.id,
    company: dbJob.company,
    status: dbJob.status as JobStatus,
    priority: dbJob.priority as JobPriority,
    tags,
    notes: dbJob.notes || "",
    createdAt: dbJob.createdAt.toISOString(),
  };
}

export async function updateJobAction(job: Job): Promise<Job> {
  const dbJob = await prisma.job.update({
    where: { id: job.id },
    data: {
      company: job.company,
      status: job.status,
      priority: job.priority,
      tags: JSON.stringify(job.tags),
      notes: job.notes || null,
    },
  });

  return {
    id: dbJob.id,
    company: dbJob.company,
    status: dbJob.status as JobStatus,
    priority: dbJob.priority as JobPriority,
    tags: job.tags,
    notes: dbJob.notes || "",
    createdAt: dbJob.createdAt.toISOString(),
  };
}

export async function deleteJobAction(id: string): Promise<void> {
  await prisma.job.delete({
    where: { id },
  });
}

export async function syncLocalJobsAction(jobs: Job[]): Promise<Job[]> {
  const createdJobs = await prisma.$transaction(
    jobs.map((job) =>
      prisma.job.create({
        data: {
          id: job.id, // Preserve original UUID
          company: job.company,
          status: job.status,
          priority: job.priority,
          tags: JSON.stringify(job.tags),
          notes: job.notes || null,
          createdAt: new Date(job.createdAt), // Preserve original timestamp
        },
      })
    )
  );

  return createdJobs.map((dbJob, index) => {
    return {
      id: dbJob.id,
      company: dbJob.company,
      status: dbJob.status as JobStatus,
      priority: dbJob.priority as JobPriority,
      tags: jobs[index].tags,
      notes: dbJob.notes || "",
      createdAt: dbJob.createdAt.toISOString(),
    };
  });
}
