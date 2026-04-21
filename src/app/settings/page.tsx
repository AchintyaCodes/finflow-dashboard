import AppShell from "@/components/layout/AppShell";
import { requireUser } from "@/lib/auth";
import SettingsForm from "@/components/settings/SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await requireUser();
  return (
    <AppShell>
      <SettingsForm user={user} />
    </AppShell>
  );
}
