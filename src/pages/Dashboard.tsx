import { useState, useEffect } from "react";
import { getAllJobs, type Job } from "@/services/jobs";
import { JobCard } from "@/components/JobCard";
import { Loader } from "@/components/Loader";
import { showInfo } from "@/components/Toast";
import { useAuth } from "@/context/AuthContext";
import { Briefcase, Bookmark, Trash2 } from "lucide-react";

function getStoredIds(key: string): string[] {
  try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; }
}

export default function Dashboard() {
  const { user } = useAuth();
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"applied" | "saved">("applied");

  useEffect(() => {
    getAllJobs().then((data) => { setAllJobs(data); setLoading(false); });
  }, []);

  const appliedIds = getStoredIds("jobportal_applied");
  const savedIds = getStoredIds("jobportal_saved");
  const appliedJobs = allJobs.filter((j) => appliedIds.includes(j.id));
  const savedJobs = allJobs.filter((j) => savedIds.includes(j.id));

  function removeSaved(id: string) {
    const updated = savedIds.filter((i) => i !== id);
    localStorage.setItem("jobportal_saved", JSON.stringify(updated));
    showInfo("Removed from saved");
    // Force re-render
    setAllJobs([...allJobs]);
  }

  if (loading) return <Loader />;

  const currentJobs = tab === "applied" ? appliedJobs : savedJobs;

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Welcome back, {user?.name}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-border">
        <button
          onClick={() => setTab("applied")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            tab === "applied" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Briefcase className="h-4 w-4" />
          Applied ({appliedJobs.length})
        </button>
        <button
          onClick={() => setTab("saved")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            tab === "saved" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Bookmark className="h-4 w-4" />
          Saved ({savedJobs.length})
        </button>
      </div>

      {currentJobs.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium">No {tab} jobs yet</p>
          <p className="text-sm">Start browsing jobs to {tab === "applied" ? "apply" : "save"} them</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentJobs.map((job) => (
            <div key={job.id} className="relative">
              <JobCard job={job} />
              {tab === "saved" && (
                <button
                  onClick={(e) => { e.preventDefault(); removeSaved(job.id); }}
                  className="absolute top-4 right-4 rounded-full p-1.5 bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                  title="Remove from saved"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
