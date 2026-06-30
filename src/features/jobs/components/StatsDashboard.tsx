"use client";

import type { Job, JobStatus } from "@/features/jobs/types/job";

type StatsDashboardProps = {
  jobs: Job[];
};

export default function StatsDashboard({ jobs }: StatsDashboardProps) {
  const totalCount = jobs.length;

  const getCountByStatus = (status: JobStatus) => {
    return jobs.filter((job) => job.status === status).length;
  };

  const statConfigs: {
    label: string;
    count: number;
    colorClass: string;
    borderAccent: string;
  }[] = [
    {
      label: "Total Applications",
      count: totalCount,
      colorClass: "text-zinc-100",
      borderAccent: "border-zinc-800 focus-within:border-zinc-700",
    },
    {
      label: "Applied",
      count: getCountByStatus("Applied"),
      colorClass: "text-blue-400",
      borderAccent: "border-blue-900/30 hover:border-blue-800/60",
    },
    {
      label: "Online Assessment (OA)",
      count: getCountByStatus("OA"),
      colorClass: "text-yellow-400",
      borderAccent: "border-yellow-900/30 hover:border-yellow-800/60",
    },
    {
      label: "Interview",
      count: getCountByStatus("Interview"),
      colorClass: "text-purple-400",
      borderAccent: "border-purple-900/30 hover:border-purple-800/60",
    },
    {
      label: "HR Round",
      count: getCountByStatus("HR Round"),
      colorClass: "text-orange-400",
      borderAccent: "border-orange-900/30 hover:border-orange-800/60",
    },
    {
      label: "Final Round",
      count: getCountByStatus("Final Round"),
      colorClass: "text-cyan-400",
      borderAccent: "border-cyan-900/30 hover:border-cyan-800/60",
    },
    {
      label: "Offer",
      count: getCountByStatus("Offer"),
      colorClass: "text-emerald-400 font-bold",
      borderAccent: "border-emerald-900/30 hover:border-emerald-800/60",
    },
    {
      label: "Rejected",
      count: getCountByStatus("Rejected"),
      colorClass: "text-rose-400",
      borderAccent: "border-rose-900/30 hover:border-rose-800/60",
    },
  ];

  return (
    <section className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statConfigs.map((cfg) => (
          <div
            key={cfg.label}
            className={`bg-zinc-950 border ${cfg.borderAccent} rounded-xl p-5 transition-all duration-300 hover:shadow-md hover:bg-zinc-900/40 hover:-translate-y-0.5 group`}
          >
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest block mb-1 group-hover:text-zinc-400 transition-colors">
              {cfg.label}
            </span>
            <div className={`text-3xl font-extrabold tracking-tight ${cfg.colorClass}`}>
              {cfg.count}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
