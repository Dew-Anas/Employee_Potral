
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?\d{9,15}$/;
const nicRegex = /^(\d{9}[VvXx]|\d{12})$/;

const TEXT_FIELDS = [
  { name: "firstName", label: "First name", type: "text" },
  { name: "lastName", label: "Last name", type: "text" },
  { name: "email", label: "Email address", type: "email" },
  { name: "phone", label: "Phone number", type: "tel" },
  { name: "address", label: "Residential address", type: "text" },
  { name: "nicNumber", label: "NIC number", type: "text" },
];

const inputClass =
  "mt-1 w-full rounded-xl border border-line bg-elevated px-3 py-2.5 text-ink outline-none focus:border-primary";

const MAX_FILE_SIZE = 1 * 1024 * 1024;

const IMAGE_FIELDS = [
  { name: "nicFrontImage", label: "NIC Front Image" },
  { name: "nicBackImage", label: "NIC Back Image" },
  { name: "profilePhoto", label: "Profile Photo" },
];

function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    nicNumber: "",
    skillCategory: "",
  });

  const [images, setImages] = useState({
    nicFrontImage: null,
    nicBackImage: null,
    profilePhoto: null,
  });

  const [categories, setCategories] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data.categories || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Could not load skills. Please refresh the page."
        );

        window.scrollTo({ top: 0, behavior: "smooth" });
      } finally {
        setLoadingSkills(false);
      }
    };

    loadCategories();
  }, []);

  // Text input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Image change
  const handleImageChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (!file) return;

    setError("");
    setSuccess("");

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("Only JPG or PNG images are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Each image must be less than or equal to 1MB.");
      e.target.value = "";
      return;
    }

    setImages((prev) => ({
      ...prev,
      [name]: file,
    }));
  };

  // Submit registration
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.replace(/\s/g, "");
    const address = form.address.trim();
    const nicNumber = form.nicNumber.trim().toUpperCase();

    // Required fields
    if (!firstName || !lastName || !address) {
      setError("First name, last name and address are required.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Email
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Phone
    if (!phoneRegex.test(phone)) {
      setError("Please enter a valid phone number (9-15 digits).");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // NIC
    if (!nicRegex.test(nicNumber)) {
      setError("Please enter a valid NIC number.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Skill
    if (!form.skillCategory) {
      setError("Please select your skill.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Images
    if (
      !images.nicFrontImage ||
      !images.nicBackImage ||
      !images.profilePhoto
    ) {
      setError("NIC front, NIC back and profile photo are required.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // FormData
    const formData = new FormData();

    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("nicNumber", nicNumber);
    formData.append("skillCategory", form.skillCategory);

    formData.append("nicFrontImage", images.nicFrontImage);
    formData.append("nicBackImage", images.nicBackImage);
    formData.append("profilePhoto", images.profilePhoto);

    try {
      setSubmitting(true);

      const res = await api.post("/registrations", formData);

      setSuccess(
        res.data.message ||
          "Registration submitted successfully. Please wait for admin approval."
      );

      window.scrollTo({ top: 0, behavior: "smooth" });

      // Reset form
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        nicNumber: "",
        skillCategory: "",
      });

      setImages({
        nicFrontImage: null,
        nicBackImage: null,
        profilePhoto: null,
      });

      e.target.reset();

    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );

      window.scrollTo({ top: 0, behavior: "smooth" });

    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-line bg-surface p-6"
      >
        <h1 className="font-heading text-2xl font-semibold text-ink">
          Register as Employee
        </h1>

        <p className="mt-1 text-sm text-muted">
          Your request will be reviewed by an admin before your account
          is activated.
        </p>

        {/* Error */}
        {error && (
          <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        {/* Success */}
        {success && (
          <p className="mt-4 rounded-lg border border-green-500/40 bg-green-500/10 px-3 py-2 text-sm text-green-400">
            {success}
          </p>
        )}

        {/* Text fields */}
        {TEXT_FIELDS.map((f) => (
          <div key={f.name} className="mt-4">
            <label className="block text-sm text-muted">
              {f.label}
            </label>

            <input
              type={f.type}
              name={f.name}
              value={form[f.name]}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
        ))}

        {/* Skills */}
        <div className="mt-4">
          <label className="block text-sm text-muted">
            Skill / service offered
          </label>

          <select
            name="skillCategory"
            value={form.skillCategory}
            onChange={handleChange}
            disabled={loadingSkills}
            className={inputClass}
            required
          >
            <option value="">
              {loadingSkills
                ? "Loading skills..."
                : "Select your skill"}
            </option>

            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Image uploads */}
        {IMAGE_FIELDS.map((f) => (
          <div key={f.name} className="mt-4">
            <label className="block text-sm text-muted">
              {f.label}
            </label>

            <input
              type="file"
              name={f.name}
              accept="image/jpeg,image/png"
              onChange={handleImageChange}
              className="mt-1 w-full text-sm text-ink"
              required
            />

            {images[f.name] && (
              <p className="mt-1 text-xs text-green-400">
                Selected: {images[f.name].name}
              </p>
            )}
          </div>
        ))}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting || loadingSkills}
          className="mt-6 w-full rounded-xl bg-primary py-2.5 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Registration"}
        </button>

        {/* Login link */}
        <p className="mt-4 text-center text-sm text-muted">
          Already registered?{" "}
          <Link to="/login" className="font-medium text-primary">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
