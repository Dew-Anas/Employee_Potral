import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard/Dashboard";
import EmployeeNavigation from "./components/layout/EmployeeNavigation";
import Assignments from "./pages/Jobs/Assignments";
import JobDetails from "./pages/Jobs/JobDetails";

function App() {
  return (
    <BrowserRouter>

      <div className="pb-24">

        <Routes>
          <Route path="/" element={<Dashboard />} />

          <Route
            path="/assignments"
            element={<Assignments/>}
          />
          <Route path="/assignments/:id" element={<JobDetails />} />

          <Route
            path="/attendance"
            element={<h1 className="p-6 text-2xl font-bold">Attendance</h1>}
          />

          <Route
            path="/profile"
            element={<h1 className="p-6 text-2xl font-bold">Profile</h1>}
          />
        </Routes>

      </div>

      <EmployeeNavigation />

    </BrowserRouter>
  );
}

export default App;