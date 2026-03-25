import { useState, useEffect, useMemo } from "react";
import { getAllJobs, type Job } from "@/services/jobs";
import { JobCard } from "@/components/JobCard";
import { JobCardSkeleton } from "@/components/Loader";
import { Search, MapPin, Filter } from "lucide-react";

const JOB_TYPES = ["All", "Full-time", "Part-time", "Remote", "Contract"];
const LOCATIONS = ["All Locations", "San Francisco, CA", "New York, NY", "Austin, TX", "Seattle, WA", "Chicago, IL", "Denver, CO", "Boston, MA", "Remote"];

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [page, setPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    getAllJobs().then((data) => { setJobs(data); setLoading(false); });
  }, []);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      const matchSearch = !debouncedSearch || job.title.toLowerCase().includes(debouncedSearch.toLowerCase()) || job.company.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchType = typeFilter === "All" || job.type === typeFilter;
      const matchLocation = locationFilter === "All Locations" || job.location === locationFilter;
      return matchSearch && matchType && matchLocation;
    });
  }, [jobs, debouncedSearch, typeFilter, locationFilter]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => { setPage(1); }, [debouncedSearch, typeFilter, locationFilter]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Browse Jobs</h1>
        <p className="mt-1 text-muted-foreground">{filtered.length} jobs found</p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs or companies..."
            className="w-full rounded-lg border border-input bg-card pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="rounded-lg border border-input bg-card pl-10 pr-8 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
          >
            {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
          </select>
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-input bg-card pl-10 pr-8 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
          >
            {JOB_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Job Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)}
        </div>
      ) : paginated.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium">No jobs found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginated.map((job) => <JobCard key={job.id} job={job} />)}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-input bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    page === i + 1 ? "gradient-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-lg border border-input bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
