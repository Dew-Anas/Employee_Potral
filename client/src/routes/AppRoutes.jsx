import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
} from "react-router-dom";

import Home from "../pages/public/Home";
import Services from "../pages/public/Services";
import ServiceDetails from "../pages/public/ServiceDetails";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Dashboard from "../pages/customer/Dashboard";
import Requests from "../pages/customer/Requests";
import Quotations from "../pages/customer/Quotations";
import Bookings from "../pages/customer/Bookings";
import Invoices from "../pages/customer/Invoices";
import CustomerReviews from "../pages/customer/CustomerReviews";
import CustomerInvoices from "../pages/customer/CustomerInvoices";
import CustomerInvoiceDetails from "../pages/customer/CustomerInvoiceDetails";

import CustomerLayout from "../components/layout/CustomerLayout";
import ProtectedRoute from "./ProtectedRoute";

import CreateRequest from "../pages/customer/CreateRequest";
import RequestDetails from "../pages/customer/RequestDetails";
import QuotationResponse from "../pages/customer/QuotationResponse";
import CreateBooking from "../pages/customer/CreateBooking";
import BookingDetails from "../pages/customer/BookingDetails";
import InvoiceDetails from "../pages/customer/InvoiceDetails";
import SubmitReview from "../pages/customer/SubmitReview";

import EmployeeLayout from "../components/layout/EmployeeLayout";
import Jobs from "../pages/employee/Jobs";
import JobDetails from "../pages/employee/JobDetails";
import EmployeeProfile from "../pages/employee/Profile";
import StartService from "../pages/employee/StartService";
import CompleteService from "../pages/employee/CompleteService";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import EmployeeBookingDetails from "../pages/employee/EmployeeBookingDetails";
import EmployeeJobExecution from "../pages/employee/EmployeeJobExecution";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route
          path="/services/:serviceId"
          element={<ServiceDetails />}
        />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route
            path="dashboard"
            element={<Dashboard />}
          />

          <Route
            path="requests"
            element={<Requests />}
          />

          <Route
            path="quotations"
            element={<Quotations />}
          />

          <Route
            path="bookings"
            element={<Bookings />}
          />

          <Route
            path="invoices"
            element={<Invoices />}
          />

          <Route
            path="reviews"
            element={<CustomerReviews />}
          />

          <Route
            path="requests/new"
            element={<CreateRequest />}
          />
          
          <Route
            path="requests/:requestId"
            element={<RequestDetails />}
          />

          <Route
            path="quotations/:quotationId/respond"
            element={<QuotationResponse />}
          />

          <Route
            path="bookings/new"
            element={<CreateBooking />}
          />

          <Route
            path="bookings/:bookingId"
            element={<BookingDetails />}
          />


          <Route
            path="invoices/:invoiceId"
            element={<InvoiceDetails />}
          />

          <Route
            path="bookings/:bookingId/review"
            element={<SubmitReview />}
          />

          <Route
            path="/customer/invoices"
            element={<CustomerInvoices />}
          />

          <Route
            path="/customer/invoices/:id"
            element={<CustomerInvoiceDetails />}
          />

          <Route
            path="/customer/reviews"
            element={<CustomerReviews />}
          />
        </Route>

        {/* Employee */}
          <Route
            path="/employee"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <EmployeeLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<EmployeeDashboard />} />

            <Route
              path="jobs"
              element={<Jobs />}
            />

            <Route
              path="jobs/:jobId"
              element={<EmployeeJobExecution />}
            />

            <Route
              path="profile"
              element={<EmployeeProfile />}
            />

            <Route
              path="jobs/:jobId/start"
              element={<StartService />}
            />

            <Route
              path="jobs/:jobId/complete"
              element={<CompleteService />}
            />

            <Route
              path="bookings/:id"
              element={<EmployeeBookingDetails />}
            />

            <Route
              path="bookings/:id/execute"
              element={<EmployeeJobExecution />}
            />
          </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;