import { Outlet } from "react-router-dom";
import SidebarLeft from "../components/SidebarLeft";

const Dashboard = () => {
  return (
    <div className="flex h-screen w-full gap-3 p-2">
      <aside className="h-full w-20 md:w-56 shrink-0 rounded-3xl border border-gray-200 bg-white shadow-sm">
        <SidebarLeft />
      </aside>

      <main className="flex-1 overflow-y-auto rounded-3xl border border-gray-200 bg-[rgb(237,235,235)] p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
