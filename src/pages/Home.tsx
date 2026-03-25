import { Link } from "react-router-dom";
import { Search, Briefcase, Users, TrendingUp, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="gradient-hero py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-extrabold text-primary-foreground leading-tight">
            Find Your Dream
            <span className="block text-primary"> Job Today</span>
          </h1>
          <p className="mt-4 text-lg text-primary-foreground/70 max-w-2xl mx-auto">
            Browse thousands of job listings from top companies. Your next career move starts here.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 rounded-lg gradient-primary px-8 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Search className="h-4 w-4" />
              Browse Jobs
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-lg border border-primary-foreground/20 px-8 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Briefcase, stat: "2,500+", label: "Active Jobs" },
              { icon: Users, stat: "10,000+", label: "Happy Users" },
              { icon: TrendingUp, stat: "95%", label: "Success Rate" },
            ].map(({ icon: Icon, stat, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div className="rounded-full bg-primary/10 p-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <span className="font-display text-3xl font-bold text-foreground">{stat}</span>
                <span className="text-sm text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground">Ready to start?</h2>
          <p className="mt-2 text-muted-foreground">Create an account and apply to jobs in minutes.</p>
          <Link
            to="/register"
            className="mt-6 inline-flex items-center gap-2 rounded-lg gradient-primary px-8 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Create Free Account
          </Link>
          <p className="mt-4 text-xs text-muted-foreground">
            Demo login: <code className="bg-muted px-1.5 py-0.5 rounded">admin@jobportal.com / admin123</code>
          </p>
        </div>
      </section>
    </div>
  );
}
