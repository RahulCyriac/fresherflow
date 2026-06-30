"use client";

import { useEffect, useState } from "react";
import type { Job, JobStatus, JobPriority } from "@/features/jobs/types/job";
import {
  getJobsAction,
  createJobAction,
  updateJobAction,
  deleteJobAction,
  syncLocalJobsAction,
} from "@/features/jobs/actions/jobActions";

type UseJobsResult = {
  jobs: Job[];
  isLoading: boolean;
  addJob: (
    company: string,
    status: JobStatus,
    priority?: JobPriority,
    tags?: string[],
    notes?: string
  ) => Promise<void>;
  updateJob: (updatedJob: Job) => Promise<void>;
  deleteJob: (jobId: string) => Promise<void>;
  syncLocalData: (localJobs: Job[]) => Promise<void>;
};

export function useJobs(): UseJobsResult {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getJobsAction()
      .then((loadedJobs) => {
        if (isMounted) {
          setJobs(loadedJobs);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load jobs", err);
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function addJob(
    company: string,
    status: JobStatus,
    priority: JobPriority = "Medium",
    tags: string[] = [],
    notes: string = ""
  ) {
    setIsLoading(true);
    try {
      const newJob = await createJobAction(company, status, priority, tags, notes);
      setJobs((currentJobs) => [newJob, ...currentJobs]);
    } catch (err) {
      console.error("Failed to add job", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateJob(updatedJob: Job) {
    setIsLoading(true);
    try {
      const savedJob = await updateJobAction(updatedJob);
      setJobs((currentJobs) =>
        currentJobs.map((job) => (job.id === savedJob.id ? savedJob : job))
      );
    } catch (err) {
      console.error("Failed to update job", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteJob(jobId: string) {
    setIsLoading(true);
    try {
      await deleteJobAction(jobId);
      setJobs((currentJobs) => currentJobs.filter((job) => job.id !== jobId));
    } catch (err) {
      console.error("Failed to delete job", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function syncLocalData(localJobs: Job[]) {
    if (localJobs.length === 0) return;
    setIsLoading(true);
    try {
      const syncedJobs = await syncLocalJobsAction(localJobs);
      setJobs((currentJobs) => {
        const serverJobIds = new Set(syncedJobs.map((j) => j.id));
        const filteredCurrent = currentJobs.filter((j) => !serverJobIds.has(j.id));
        return [...syncedJobs, ...filteredCurrent];
      });
      localStorage.removeItem("jobs");
    } catch (err) {
      console.error("Failed to sync local data", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    jobs,
    isLoading,
    addJob,
    updateJob,
    deleteJob,
    syncLocalData,
  };
}
