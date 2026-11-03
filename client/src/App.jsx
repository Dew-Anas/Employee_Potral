import { BrowserRouter, Routes, Route,Outlet } from "react-router-dom";

import Dashboard from "./pages/Dashboard/Dashboard";
import EmployeeNavigation from "./components/layout/EmployeeNavigation";
import Assignments from "./pages/Jobs/Assignments";
import JobDetails from "./pages/Jobs/JobDetails";
import Login from "./pages/Auth/Login";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Profile from "./pages/Profile/Profile";

function EmployeeLayout() {
  return (
    <>
      <div className="pb-24">
        <Outlet /> 
      </div>
      <EmployeeNavigation />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/login" element={<Login />} />

        
        <Route element={<ProtectedRoute />}>
          <Route element={<EmployeeLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/assignments/:id" element={<JobDetails />} />
            <Route
              path="/attendance"
              element={<h1 className="p-6 text-2xl font-bold">Attendance</h1>}
            />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;