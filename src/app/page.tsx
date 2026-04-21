import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import StatCard from "@/components/dashboard/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import ClientTable from "@/components/dashboard/ClientTable";
import ProjectPipeline from "@/components/dashboard/ProjectPipeline";
import UsageRadar from "@/components/dashboard/UsageRadar";
import { stats } from "@/lib/data";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <TopBar />
      <main className="ml-60 pt-16 p-6 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2"><RevenueChart /></div>
          <UsageRadar />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2"><ClientTable /></div>
          <ProjectPipeline />
        </div>
      </main>
    </div>
  );
}