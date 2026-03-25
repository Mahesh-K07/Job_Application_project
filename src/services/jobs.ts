export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Part-time" | "Remote" | "Contract";
  description: string;
  salary: string;
  postedDate: string;
  requirements: string[];
}

let jobsData: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120k - $160k",
    postedDate: "2026-03-20",
    description: "We are looking for an experienced Frontend Developer to join our team and help build cutting-edge web applications using React, TypeScript, and modern tooling. You will collaborate with designers and backend engineers to deliver exceptional user experiences.",
    requirements: ["5+ years React experience", "TypeScript proficiency", "Experience with state management", "Strong CSS skills", "REST API integration"],
  },
  {
    id: "2",
    title: "Backend Engineer",
    company: "DataFlow Inc",
    location: "New York, NY",
    type: "Full-time",
    salary: "$130k - $170k",
    postedDate: "2026-03-18",
    description: "Join our backend team to design and build scalable microservices. You'll work with Node.js, PostgreSQL, and cloud infrastructure to power our data processing platform serving millions of users.",
    requirements: ["Node.js or Python", "PostgreSQL experience", "Cloud services (AWS/GCP)", "API design", "System design knowledge"],
  },
  {
    id: "3",
    title: "UX Designer",
    company: "CreativeHub",
    location: "Austin, TX",
    type: "Remote",
    salary: "$90k - $120k",
    postedDate: "2026-03-22",
    description: "We need a talented UX Designer to create intuitive and beautiful interfaces for our SaaS products. You'll conduct user research, create wireframes, and collaborate closely with developers.",
    requirements: ["Figma expertise", "User research skills", "Prototyping", "Design systems", "3+ years UX experience"],
  },
  {
    id: "4",
    title: "DevOps Engineer",
    company: "CloudScale",
    location: "Seattle, WA",
    type: "Full-time",
    salary: "$140k - $180k",
    postedDate: "2026-03-15",
    description: "Help us build and maintain robust CI/CD pipelines and cloud infrastructure. You'll work with Kubernetes, Docker, and Terraform to ensure our systems are reliable and scalable.",
    requirements: ["Kubernetes", "Docker", "Terraform/IaC", "CI/CD pipelines", "Linux administration"],
  },
  {
    id: "5",
    title: "Mobile Developer",
    company: "AppWorks",
    location: "Chicago, IL",
    type: "Contract",
    salary: "$100/hr",
    postedDate: "2026-03-21",
    description: "Build cross-platform mobile applications using React Native. You'll develop features, optimize performance, and ensure a seamless experience across iOS and Android platforms.",
    requirements: ["React Native", "iOS/Android knowledge", "TypeScript", "App Store deployment", "Mobile UI patterns"],
  },
  {
    id: "6",
    title: "Data Analyst",
    company: "InsightCo",
    location: "Denver, CO",
    type: "Part-time",
    salary: "$50k - $70k",
    postedDate: "2026-03-19",
    description: "Analyze business data and create actionable insights through dashboards and reports. Work with SQL, Python, and BI tools to support data-driven decision making.",
    requirements: ["SQL proficiency", "Python/R", "Data visualization", "Statistical analysis", "Business acumen"],
  },
  {
    id: "7",
    title: "Full Stack Developer",
    company: "StartupXYZ",
    location: "Remote",
    type: "Remote",
    salary: "$110k - $150k",
    postedDate: "2026-03-23",
    description: "Join our fast-growing startup as a Full Stack Developer. You'll own features end-to-end, from database design to frontend implementation, working with a modern tech stack.",
    requirements: ["React + Node.js", "Database design", "API development", "Git workflow", "Agile experience"],
  },
  {
    id: "8",
    title: "QA Engineer",
    company: "QualitySoft",
    location: "Boston, MA",
    type: "Full-time",
    salary: "$85k - $115k",
    postedDate: "2026-03-17",
    description: "Ensure product quality through automated and manual testing. Design test strategies, write test cases, and build automation frameworks to catch bugs before they reach production.",
    requirements: ["Test automation (Selenium/Playwright)", "Manual testing", "API testing", "CI/CD integration", "Bug tracking"],
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getAllJobs(): Promise<Job[]> {
  await delay(600);
  return [...jobsData];
}

export async function getJobById(id: string): Promise<Job | undefined> {
  await delay(400);
  return jobsData.find((job) => job.id === id);
}

export async function createJob(job: Omit<Job, "id" | "postedDate">): Promise<Job> {
  await delay(500);
  const newJob: Job = {
    ...job,
    id: String(Date.now()),
    postedDate: new Date().toISOString().split("T")[0],
  };
  jobsData = [newJob, ...jobsData];
  return newJob;
}

export async function deleteJob(id: string): Promise<void> {
  await delay(400);
  jobsData = jobsData.filter((job) => job.id !== id);
}
