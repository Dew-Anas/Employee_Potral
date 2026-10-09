import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import quotationRoutes from "./routes/quotationRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import employeeBookingRoutes from "./routes/employeeBookingRoutes.js";
import checklistRoutes from "./routes/checklistRoutes.js";
import path from "path";
import jobPhotoRoutes from "./routes/jobPhotoRoutes.js";
import completionRoutes from "./routes/completionRoutes.js";
import invoiceHandoffRoutes from "./routes/invoiceHandoffRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. Postman, server-to-server)
      if (!origin) return callback(null, true);
      // Allow any localhost port (covers all Vite dev server ports)
      if (/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
        return callback(null, true);
      }
      // Allow explicitly configured CLIENT_URL
      if (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ServicePro API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "ServicePro server is healthy",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/quotes", quotationRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/employee/bookings", employeeBookingRoutes);
app.use("/api/checklists", checklistRoutes);
app.use("/uploads",express.static(path.join(process.cwd(), "uploads")));
app.use("/api/job-photos", jobPhotoRoutes);
app.use("/api/completion",completionRoutes);
app.use("/api/invoice-handoff", invoiceHandoffRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/customer/invoices", invoiceRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);


export default app;