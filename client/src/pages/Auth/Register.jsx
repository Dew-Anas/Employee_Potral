// Employee self-registration. POST /registrations (multipart): details, password, skill
// (category id), NIC front/back and profile photo. The account stays inactive until an
// admin activates it. Same validation rules as the backend registrationController.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LuCheck } from "react-icons/lu";
import api from "../../services/api";
import { isValidEmail } from "../../utils/validators";
import AuthShell from "../../components/auth/AuthShell";
import {
  TextField,
  PasswordField,
  SelectField,
  FileField,
} from "../../components/auth/AuthFields";

const phoneRegex = /^\+?\d{9,15}$/;
const nicRegex = /^(\d{9}[VvXx]|\d{12})$/;

const MAX_FILE_SIZE = 3 * 1024 * 1024;

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  nicNumber: "",
  skillCategory: "",
  password: "",
  confirmPassword: "",
};

const emptyImages = { nicFrontImage: null, nicBackImage: null, profilePhoto: null };

function SectionTitle({ children }) {
  return (
    <div className="border-t border-line pt-6">
      <h2 className="font-heading text-sm font-bold text-ink">{children}</h2>
    </div>
  );
}

function Register() {
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState(emptyImages);

  const [categories, setCategories] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data.categories || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Could not load skills. Please refresh the page."
        );
      } finally {
        setLoadingSkills(false);
      }
    };

    loadCategories();
  }, []);

  const setField = (name) => (value) => setForm((prev) => ({ ...prev, [name]: value }));
  const setImage = (name) => (file) => {
    setError("");
    setImages((prev) => ({ ...prev, [name]: file }));
  };

  const fail = (message) => {
    setError(message);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.replace(/\s/g, "");
    const address = form.address.trim();
    const nicNumber = form.nicNumber.trim().toUpperCase();

    if (!firstName || !lastName || !address) {
      return fail("First name, last name and address are required.");
    }
    if (!isValidEmail(email)) {
      return fail("Please enter a valid email address, e.g. name@example.com");
    }
    if (!phoneRegex.test(phone)) return fail("Please enter a valid phone number (9-15 digits).");
    if (!nicRegex.test(nicNumber)) return fail("Please enter a valid NIC number.");
    if (!form.skillCategory) return fail("Please select your skill.");
    if (form.password.length < 8) return fail("Password must be at least 8 characters.");
    if (form.password !== form.confirmPassword) return fail("Passwords do not match.");
    if (!images.nicFrontImage || !images.nicBackImage || !images.profilePhoto) {
      return fail("NIC front, NIC back and profile photo are required.");
    }

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("nicNumber", nicNumber);
    formData.append("skillCategory", form.skillCategory);
    formData.append("password", form.password);
    formData.append("nicFrontImage", images.nicFrontImage);
    formData.append("nicBackImage", images.nicBackImage);
    formData.append("profilePhoto", images.profilePhoto);

    try {
      setSubmitting(true);
      const res = await api.post("/registrations", formData);

      setSubmitted(
        res.data.message ||
          "Registration submitted. You will be able to sign in after admin approval."
      );
      setForm(emptyForm);
      setImages(emptyImages);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      fail(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Success screen
  if (submitted) {
    return (
      <AuthShell title="Registration submitted">
        <div className="rounded-2xl border border-line bg-surface p-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal/10 text-teal">
            <LuCheck size={28} />
          </div>
          <p className="mt-4 text-sm leading-6 text-ink">{submitted}</p>
          <p className="mt-2 text-sm leading-6 text-muted">
            An administrator will review your details and activate your account.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            Back to sign in
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      wide
      title="Register as Employee"
      subtitle="Fill in your details. An admin reviews every request before the account is activated."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {error && (
          <p
            role="alert"
            className="rounded-xl border border-red-500/40 bg-red-500/10 px-3.5 py-3 text-sm text-red-300"
          >
            {error}
          </p>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="First name"
            value={form.firstName}
            onChange={setField("firstName")}
            autoComplete="given-name"
          />
          <TextField
            label="Last name"
            value={form.lastName}
            onChange={setField("lastName")}
            autoComplete="family-name"
          />
          <TextField
            label="Email address"
            type="email"
            value={form.email}
            onChange={setField("email")}
            autoComplete="email"
          />
          <TextField
            label="Phone number"
            type="tel"
            inputMode="tel"
            value={form.phone}
            onChange={setField("phone")}
            autoComplete="tel"
            placeholder="0771234567"
          />
        </div>

        <TextField
          label="Residential address"
          value={form.address}
          onChange={setField("address")}
          autoComplete="street-address"
        />

        <SectionTitle>Identity & skill</SectionTitle>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="NIC number"
            value={form.nicNumber}
            onChange={setField("nicNumber")}
            placeholder="123456789V or 12 digits"
          />
          <SelectField
            label="Skill / service offered"
            value={form.skillCategory}
            onChange={setField("skillCategory")}
            disabled={loadingSkills}
          >
            <option value="">{loadingSkills ? "Loading skills..." : "Select your skill"}</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </SelectField>
        </div>

        <SectionTitle>Account password</SectionTitle>
        <div className="grid gap-5 sm:grid-cols-2">
          <PasswordField
            label="Password"
            value={form.password}
            onChange={setField("password")}
            autoComplete="new-password"
            hint="At least 8 characters."
          />
          <PasswordField
            label="Confirm password"
            value={form.confirmPassword}
            onChange={setField("confirmPassword")}
            autoComplete="new-password"
          />
        </div>

        <SectionTitle>Documents</SectionTitle>
        <div className="grid gap-5 sm:grid-cols-2">
          <FileField
            label="NIC front"
            hint="JPG or PNG, up to 3MB"
            accept="image/jpeg,image/png"
            maxSize={MAX_FILE_SIZE}
            file={images.nicFrontImage}
            onChange={setImage("nicFrontImage")}
            onError={fail}
          />
          <FileField
            label="NIC back"
            hint="JPG or PNG, up to 3MB"
            accept="image/jpeg,image/png"
            maxSize={MAX_FILE_SIZE}
            file={images.nicBackImage}
            onChange={setImage("nicBackImage")}
            onError={fail}
          />
          <div className="sm:col-span-2">
            <FileField
              label="Profile photo"
              hint="A clear photo of your face, JPG or PNG, up to 3MB"
              accept="image/jpeg,image/png"
              maxSize={MAX_FILE_SIZE}
              file={images.profilePhoto}
              onChange={setImage("profilePhoto")}
              onError={fail}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || loadingSkills}
          className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit registration"}
        </button>

        <p className="text-center text-sm text-muted">
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-primary hover:text-primary/80">
            Sign in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

export default Register;