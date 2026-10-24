import {
  BadgeCheck,
  ClipboardList,
  MessagesSquare,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import type { Stage } from "@/lib/candidates";

export const STAGE_INFO: Record<Stage, { icon: LucideIcon; hint: string }> = {
  Sourced: { icon: UserPlus, hint: "Not yet reviewed" },
  Screening: { icon: ClipboardList, hint: "Initial review" },
  Interview: { icon: MessagesSquare, hint: "Interview in progress" },
  Hired: { icon: BadgeCheck, hint: "Hiring complete" },
};
