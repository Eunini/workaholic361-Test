import { AppShell } from "@/components/layout/app-shell";
import { TalentDashboard } from "@/components/dashboard/talent-dashboard";

export default function Home() {
  return (
    <AppShell>
      <TalentDashboard />
    </AppShell>
  );
}
