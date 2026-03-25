import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getJobById, type Job } from "@/services/jobs";
import { Loader } from "@/components/Loader";
import { showSuccess, showInfo } from "@/components/Toast";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, MapPin, Building2, Clock, DollarSign, Bookmark, Send, CheckCircle } from "lucide-react";

function getStoredIds(key: string): string[] {
  try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; }
}

export default function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!id) return;
    getJobById(id).then((data) => {
      setJob(data || null);
      setLoading(false);
    });
    setApplied(getStoredIds("jobportal_applied").includes(id));
    setSaved(getStoredIds("jobportal_saved").includes(id));
  }, [id]);

  function handleApply() {
    if (!user) { showInfo("Please login to apply"); return; }
    if (!id || applied) return;
    const ids = getStoredIds("jobportal_applied");
    if (!ids.includes(id)) {
      localStorage.setItem("jobportal_applied", JSON.stringify([...ids, id]));
    }
    setApplied(true);
    showSuccess("Application submitted!");
  }

  function handleSave() {
    if (!user) { showInfo("Please login to save jobs"); return; }
    if (!id) return;
    const ids = getStoredIds("jobportal_saved");
    if (saved) {
      localStorage.setItem("jobportal_saved", JSON.stringify(ids.filter((i) => i !== id)));
      setSaved(false);
      showInfo("Job removed from saved");
    } else {
      localStorage.setItem("jobportal_saved", JSON.stringify([...ids, id]));
      setSaved(true);
      showSuccess("Job saved!");
    }
  }

  if (loading) return <Loader />;
  if (!job) return (
    <div className="container mx-auto px-4 py-16 text-center">
      <p className="text-lg text-muted-foreground">Job not found</p>
      <Link to="/jobs" className="mt-4 inline-flex items-center gap-1 text-primary hover:underline text-sm">
        <ArrowLeft className="h-4 w-4" /> Back to Jobs
      </Link>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl animate-fade-in">
      <Link to="/jobs" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Jobs
      </Link>

      <div className="rounded-xl border border-border bg-card p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-card-foreground">{job.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Building2 className="h-4 w-4" />{job.company}</span>
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{job.location}</span>
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{job.type}</span>
              <span className="flex items-center gap-1"><DollarSign className="h-4 w-4 text-accent" />{job.salary}</span>
            </div>
          </div>
          <span className="text-xs text-muted-foreground">Posted {job.postedDate}</span>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleApply}
            disabled={applied}
            className={`inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold transition-all ${
              applied
                ? "bg-accent text-accent-foreground"
                : "gradient-primary text-primary-foreground hover:opacity-90"
            } disabled:cursor-default`}
          >
            {applied ? <><CheckCircle className="h-4 w-4" /> Applied</> : <><Send className="h-4 w-4" /> Apply Now</>}
          </button>
          <button
            onClick={handleSave}
            className={`inline-flex items-center gap-2 rounded-lg border px-6 py-2.5 text-sm font-semibold transition-colors ${
              saved
                ? "border-primary bg-primary/10 text-primary"
                : "border-input text-foreground hover:bg-muted"
            }`}
          >
            <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
            {saved ? "Saved" : "Save Job"}
          </button>
        </div>

        <hr className="my-6 border-border" />

        <div>
          <h2 className="font-display text-lg font-semibold text-card-foreground mb-3">Description</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
        </div>

        <div className="mt-6">
          <h2 className="font-display text-lg font-semibold text-card-foreground mb-3">Requirements</h2>
          <ul className="space-y-2">
            {job.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                {req}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
