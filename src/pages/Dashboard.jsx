import { Outlet } from "react-router-dom";
import SidebarLeft from "../components/layout/Sidebar";

const Dashboard = () => {
  return (
    <div className="flex h-screen w-full gap-3 p-2">
      <aside className="h-full w-20 md:w-56 shrink-0 rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-colors">
        <SidebarLeft />
      </aside>

      <main className="flex-1 overflow-y-auto rounded-3xl border border-gray-200 dark:border-gray-700 bg-[rgb(237,235,235)] dark:bg-gray-900 p-4 md:p-8 transition-colors">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
