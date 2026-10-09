import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { createRequest } from "../../services/requestService";
import { getServices } from "../../services/serviceCatalogService";
import Button from "../../components/ui/Button";

const CreateRequest = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    serviceId: searchParams.get("serviceId") || "",
    preferredDate: "",
    preferredTime: "",
    address: "",
    description: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getServices();
        setServices(data.services || []);
      } catch (error) {
        toast.error("Failed to load services.");
      }
    };

    load();
  }, []);

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
      await createRequest(formData);
      toast.success("Service request created successfully.");
      navigate("/customer/requests");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create service request."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Create Service Request
        </h1>
        <p className="mt-1 text-slate-500">
          Provide the details of the service you need.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Select Service
          </label>
          <select
            name="serviceId"
            value={formData.serviceId}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service._id} value={service._id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Preferred Date
              </label>
              <input
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Preferred Time
              </label>
              <input
                type="time"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Address
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            minLength={10}
            rows="3"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            minLength={10}
            rows="5"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/customer/requests")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateRequest;
