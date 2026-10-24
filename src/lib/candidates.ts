export const STAGES = ["Sourced", "Screening", "Interview", "Hired"] as const;
export type Stage = (typeof STAGES)[number];

export type Candidate = {
  id: number;
  name: string;
  role: string;
  email: string;
  stage: Stage;
};

export function isStage(value: unknown): value is Stage {
  return typeof value === "string" && STAGES.some((stage) => stage === value);
}

export const SAMPLE_CANDIDATES: Candidate[] = [
  {
    id: 1,
    name: "Amara Okafor",
    role: "Product Designer",
    email: "amara.okafor@example.com",
    stage: "Interview",
  },
  {
    id: 2,
    name: "Daniel Mensah",
    role: "Full-Stack Engineer",
    email: "daniel.mensah@example.com",
    stage: "Screening",
  },
  {
    id: 3,
    name: "Sofia Chen",
    role: "Frontend Engineer",
    email: "sofia.chen@example.com",
    stage: "Sourced",
  },
  {
    id: 4,
    name: "Tobi Adeyemi",
    role: "Product Manager",
    email: "tobi.adeyemi@example.com",
    stage: "Interview",
  },
  {
    id: 5,
    name: "Maya Patel",
    role: "Full-Stack Engineer",
    email: "maya.patel@example.com",
    stage: "Hired",
  },
  {
    id: 6,
    name: "James Osei",
    role: "Frontend Engineer",
    email: "james.osei@example.com",
    stage: "Sourced",
  },
  {
    id: 7,
    name: "Leila Hassan",
    role: "Product Designer",
    email: "leila.hassan@example.com",
    stage: "Screening",
  },
  {
    id: 8,
    name: "Ethan Williams",
    role: "Backend Engineer",
    email: "ethan.williams@example.com",
    stage: "Sourced",
  },
  {
    id: 9,
    name: "Nneka Eze",
    role: "Product Manager",
    email: "nneka.eze@example.com",
    stage: "Hired",
  },
  {
    id: 10,
    name: "Oliver Kim",
    role: "Backend Engineer",
    email: "oliver.kim@example.com",
    stage: "Screening",
  },
];
