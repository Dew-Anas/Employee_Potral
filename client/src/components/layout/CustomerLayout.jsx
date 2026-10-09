import { Outlet } from "react-router-dom";
import CustomerSidebar from "../customer/CustomerSidebar";
import CustomerHeader from "../customer/CustomerHeader";

const CustomerLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <CustomerSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <CustomerHeader />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;