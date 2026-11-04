import { BrowserRouter, Routes, Route,Outlet } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";

import Dashboard from "./pages/Dashboard/Dashboard";
import EmployeeNavigation from "./components/layout/EmployeeNavigation";
import Assignments from "./pages/Jobs/Assignments";
import JobDetails from "./pages/Jobs/JobDetails";
import Login from "./pages/Auth/Login";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Profile from "./pages/Profile/Profile";
import Register from "./pages/Auth/Register";


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
    <ThemeProvider>
    <BrowserRouter>
      <Routes>
        
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
        
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
    </ThemeProvider>
  );
}

export default App;