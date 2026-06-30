"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import type { Job, JobStatus, JobPriority } from "@/features/jobs/types/job";

async function getRequiredSessionUserId(): Promise<string> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("Unauthorized: Access denied.");
  }
  return userId;
}

export async function getJobsAction(): Promise<Job[]> {
  const userId = await getRequiredSessionUserId();

  const dbJobs = await prisma.job.findMany({
    where: { userId },
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
  const userId = await getRequiredSessionUserId();

  const dbJob = await prisma.job.create({
    data: {
      userId,
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
  const userId = await getRequiredSessionUserId();

  // Verify ownership before modifying
  const existingJob = await prisma.job.findFirst({
    where: { id: job.id, userId },
  });

  if (!existingJob) {
    throw new Error("Unauthorized: Job not found or access denied.");
  }

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
  const userId = await getRequiredSessionUserId();

  // Verify ownership
  const existingJob = await prisma.job.findFirst({
    where: { id, userId },
  });

  if (!existingJob) {
    throw new Error("Unauthorized: Job not found or access denied.");
  }

  await prisma.job.delete({
    where: { id },
  });
}

export async function syncLocalJobsAction(jobs: Job[]): Promise<Job[]> {
  const userId = await getRequiredSessionUserId();

  const createdJobs = await prisma.$transaction(
    jobs.map((job) =>
      prisma.job.create({
        data: {
          id: job.id,
          userId,
          company: job.company,
          status: job.status,
          priority: job.priority,
          tags: JSON.stringify(job.tags),
          notes: job.notes || null,
          createdAt: new Date(job.createdAt),
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
