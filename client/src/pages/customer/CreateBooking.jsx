import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createBooking } from "../../services/bookingService";
import { formatMoney } from "../../utils/format";

const CreateBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const quotation = location.state?.quotation;

  const [formData, setFormData] = useState({
    preferredDate: quotation?.request?.preferredDate
      ? String(quotation.request.preferredDate).slice(0, 10)
      : "",
    preferredTime: quotation?.request?.preferredTime || "",
    address: quotation?.request?.address || "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  if (!quotation) {
    return (
      <div>
        <p>Quotation information is missing.</p>
        <Link to="/customer/quotations" className="mt-4 inline-block text-blue-600">
          Back to Quotations
        </Link>
      </div>
    );
  }

  const handleChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await createBooking({
        quotationId: quotation._id || quotation.id,
        ...formData,
      });
      toast.success("Booking created successfully.");
      navigate("/customer/bookings");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/customer/quotations" className="text-sm font-medium text-blue-600">
        ← Back to Quotations
      </Link>
      <h1 className="mt-6 text-2xl font-bold">Create Booking</h1>

      <div className="mt-6 rounded-xl border bg-white p-6">
        <p className="text-sm text-slate-500">Service</p>
        <p className="font-semibold">{quotation.service?.name || quotation.service}</p>
        <p className="mt-2 font-bold">{formatMoney(quotation.amount)}</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-xl border bg-white p-6">
        <input
          type="date"
          name="preferredDate"
          value={formData.preferredDate}
          onChange={handleChange}
          required
          className="w-full rounded-lg border px-4 py-2.5"
        />
        <input
          type="time"
          name="preferredTime"
          value={formData.preferredTime}
          onChange={handleChange}
          required
          className="w-full rounded-lg border px-4 py-2.5"
        />
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          rows="4"
          className="w-full rounded-lg border px-4 py-2.5"
        />
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          placeholder="Optional notes"
          className="w-full rounded-lg border px-4 py-2.5"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white"
        >
          {loading ? "Creating..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
};

export default CreateBooking;
