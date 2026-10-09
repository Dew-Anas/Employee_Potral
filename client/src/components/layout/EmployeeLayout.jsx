import { Outlet } from "react-router-dom";
import EmployeeSidebar from "../employee/EmployeeSidebar";
import EmployeeHeader from "../employee/EmployeeHeader";

const EmployeeLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <EmployeeSidebar />

      <div className="md:ml-64">
        <EmployeeHeader />

        <main className="min-h-screen p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout;