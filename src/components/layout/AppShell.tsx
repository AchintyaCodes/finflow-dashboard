import { requireUser } from "@/lib/auth";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default async function AppShell({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userName={user.name} />
      <TopBar />
      <main className="ml-60 pt-16 p-6 space-y-6">{children}</main>
    </div>
  );
}
