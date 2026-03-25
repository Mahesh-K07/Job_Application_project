import { Link } from "react-router-dom";
import { MapPin, Building2, Clock, DollarSign } from "lucide-react";
import type { Job } from "@/services/jobs";

function getTypeBadgeClass(type: string) {
  switch (type) {
    case "Full-time": return "badge-fulltime";
    case "Part-time": return "badge-parttime";
    case "Remote": return "badge-remote";
    case "Contract": return "badge-contract";
    default: return "badge-type bg-muted text-muted-foreground";
  }
}

export function JobCard({ job }: { job: Job }) {
  return (
    <Link
      to={`/jobs/${job.id}`}
      className="block rounded-lg border border-border bg-card p-6 card-hover animate-fade-in"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg font-semibold text-card-foreground truncate">
            {job.title}
          </h3>
          <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" />
              {job.company}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {job.location}
            </span>
          </div>
        </div>
        <span className={getTypeBadgeClass(job.type)}>{job.type}</span>
      </div>

      <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
        {job.description}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <span className="flex items-center gap-1 text-sm font-medium text-foreground">
          <DollarSign className="h-3.5 w-3.5 text-accent" />
          {job.salary}
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {job.postedDate}
        </span>
      </div>
    </Link>
  );
}
