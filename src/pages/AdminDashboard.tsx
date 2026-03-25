import { useState, useEffect } from "react";
import { getAllJobs, createJob, deleteJob, type Job } from "@/services/jobs";
import { Loader } from "@/components/Loader";
import { showSuccess, showError } from "@/components/Toast";
import { Plus, Trash2, X, Building2, MapPin } from "lucide-react";

export default function AdminDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "", company: "", location: "", type: "Full-time" as Job["type"],
    salary: "", description: "", requirements: "",
  });

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    setLoading(true);
    const data = await getAllJobs();
    setJobs(data);
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.company || !form.location || !form.description) {
      showError("Please fill all required fields");
      return;
    }
    setSubmitting(true);
    try {
      await createJob({
        title: form.title,
        company: form.company,
        location: form.location,
        type: form.type,
        salary: form.salary,
        description: form.description,
        requirements: form.requirements.split("\n").filter(Boolean),
      });
      showSuccess("Job created!");
      setForm({ title: "", company: "", location: "", type: "Full-time", salary: "", description: "", requirements: "" });
      setShowForm(false);
      await loadJobs();
    } catch {
      showError("Failed to create job");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    await deleteJob(id);
    showSuccess("Job deleted");
    setJobs(jobs.filter((j) => j.id !== id));
  }

  const inputClass = "w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="mt-1 text-muted-foreground">{jobs.length} jobs posted</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-lg gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancel" : "Add Job"}
        </button>
      </div>

      {/* Add Job Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="mb-8 rounded-xl border border-border bg-card p-6 space-y-4 animate-fade-in">
          <h2 className="font-display text-lg font-semibold text-card-foreground">New Job Posting</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Title *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} placeholder="e.g. Senior Developer" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Company *</label>
              <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={inputClass} placeholder="e.g. TechCorp" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Location *</label>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass} placeholder="e.g. San Francisco, CA" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Salary</label>
              <input value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} className={inputClass} placeholder="e.g. $120k - $160k" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Job["type"] })} className={inputClass}>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Remote</option>
                <option>Contract</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Description *</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputClass} min-h-[100px]`} placeholder="Job description..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Requirements (one per line)</label>
            <textarea value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} className={`${inputClass} min-h-[80px]`} placeholder="React experience&#10;TypeScript&#10;3+ years" />
          </div>
          <button type="submit" disabled={submitting} className="rounded-lg gradient-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
            {submitting ? "Creating..." : "Create Job"}
          </button>
        </form>
      )}

      {/* Jobs List */}
      <div className="space-y-3">
        {jobs.map((job) => (
          <div key={job.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4 card-hover">
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-card-foreground truncate">{job.title}</h3>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{job.company}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
                <span className="text-xs">{job.type}</span>
              </div>
            </div>
            <button
              onClick={() => handleDelete(job.id)}
              className="ml-4 shrink-0 rounded-lg p-2 text-destructive hover:bg-destructive/10 transition-colors"
              title="Delete job"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
