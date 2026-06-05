"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import FeatureCard from "@/components/FeatureCard";

export default function Home() {
  const [count, setCount] = useState(0);
  const [jobName, setJobName] = useState("");


  type Job = {
  company: string;
  status: string;
  };

  const [jobs, setJobs] = useState<Job[]>([]);
  

  const features = ["Applications", "Referrals", "Interviews", "Offers", "Resume Reviews"];

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <Navbar />

        <button
          onClick={() => setCount(count + 1)}
          className="bg-white text-black px-4 py-2 rounded-lg mt-6"
        >
          Clicked {count} times
        </button>

        <button
          onClick={() => setCount(0)}
          className="bg-white text-black px-4 py-2 rounded-lg mt-4 ml-4"
        >
          Reset to 0 - {count}
        </button>

        <div className="mt-8 flex justify-center gap-4">
          <input
            type="text"
            value={jobName}
            onChange={(e) => setJobName(e.target.value)}
            placeholder="Enter company name"
            className="border border-gray-600 bg-gray-900 text-white placeholder-gray-400 rounded-lg px-4 py-2"
          />

          <button
            onClick={() => {
  if (jobName.trim() !== "") {
    setJobs([
      ...jobs,
      {
        company: jobName,
        status: "Applied",
      },
    ]);

    setJobName("");
  }
}}
            className="bg-white text-black px-4 py-2 rounded-lg"
          >
            Add Job
          </button>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">My Applications</h2>

          {jobs.map((job, index) => (
  <div
    key={index}
    className="border border-gray-700 bg-gray-900 text-white rounded-lg p-3 mb-2"
  >
    <div className="font-semibold">
      {job.company}
    </div>

    <div className="text-gray-400 text-sm">
      {job.status}
    </div>
  </div>
))}
        </div>

        <p className="mt-6 text-xl text-gray-300">
          Organize your job search, track applications, manage referrals, and land your first tech role.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button className="bg-white text-black px-6 py-3 rounded-lg">
            Get Started
          </button>

          <button className="border border-gray-500 text-white px-6 py-3 rounded-lg">
            Learn More
          </button>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="bg-zinc-900 text-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-semibold">Track Everything</h2>

          <div className="grid md:grid-cols-4 gap-4 mt-6">
            {features.map((feature) => (
              <FeatureCard key={feature} title={feature} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}