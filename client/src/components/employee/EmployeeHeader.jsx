import { useAuth } from "../../context/AuthContext";

const EmployeeHeader = () => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Employee Portal
        </h2>
      </div>
      <p className="text-sm text-slate-600">
        {user ? `${user.firstName} ${user.lastName}` : "Employee"}
      </p>
    </header>
  );
};

export default EmployeeHeader;
