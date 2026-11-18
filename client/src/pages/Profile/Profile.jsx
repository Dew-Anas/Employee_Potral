// Employee profile: photo (change / remove) + details from registration, editable contact info,
// collapsible password change, and confirmation dialogs.
// Data: GET /auth/me, GET|PUT|DELETE /auth/me/photo, PUT /auth/profile, PUT /auth/change-password.

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuLogOut,
  LuUserRound,
  LuShieldCheck,
  LuLockKeyhole,
  LuPhone,
  LuMapPin,
  LuCreditCard,
  LuCalendarDays,
  LuWrench,
  LuMail,
  LuChevronDown,
  LuCamera,
  LuTrash2,
} from "react-icons/lu";

import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const phoneRegex = /^\+?\d{9,15}$/;
const MAX_PHOTO_SIZE = 3 * 1024 * 1024;

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-line bg-elevated px-3.5 py-3 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/15";

const labelClass = "block text-xs font-semibold uppercase tracking-wide text-muted";

const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon size={17} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">{label}</p>
        <p className="mt-0.5 break-words text-sm font-medium text-ink">{value || "—"}</p>
      </div>
    </div>
  );
}

function ConfirmDialog({ icon: Icon, title, message, confirmText, busy, onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/65 px-4 py-6"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-400/10 text-red-400">
          <Icon size={20} />
        </div>
        <h2 id="confirm-title" className="mt-4 font-heading text-lg font-bold">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted">{message}</p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="flex-1 rounded-xl border border-line py-3 text-sm font-semibold text-ink transition hover:bg-elevated disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60"
          >
            {busy ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

function Profile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Photo
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoVersion, setPhotoVersion] = useState(0);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [photoSuccess, setPhotoSuccess] = useState("");
  const [showRemovePhoto, setShowRemovePhoto] = useState(false);

  // Details form
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Password
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);

  const initials = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .map((n) => n.charAt(0).toUpperCase())
    .join("");

  // Keep form in sync if the user object finishes loading after mount
  useEffect(() => {
    setFirstName(user?.firstName || "");
    setLastName(user?.lastName || "");
    setPhone(user?.phone || "");
    setAddress(user?.address || "");
  }, [user?.id, user?.phone, user?.address]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load the photo (needs the auth header, so fetch as a blob)
  useEffect(() => {
    if (!user?.hasPhoto) {
      setPhotoUrl("");
      return undefined;
    }

    let objectUrl = "";
    let cancelled = false;

    api
      .get("/auth/me/photo", { responseType: "blob" })
      .then((res) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(res.data);
        setPhotoUrl(objectUrl);
      })
      .catch(() => {
        if (!cancelled) setPhotoUrl("");
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [user?.hasPhoto, user?.id, photoVersion]);

  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setPhotoError("");
    setPhotoSuccess("");

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setPhotoError("Please select a JPG or PNG image.");
      return;
    }
    if (file.size > MAX_PHOTO_SIZE) {
      setPhotoError("Image must be 2MB or smaller.");
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);

    try {
      setPhotoBusy(true);
      const res = await api.put("/auth/me/photo", formData);
      updateUser(res.data.user);
      setPhotoVersion((v) => v + 1);
      setPhotoSuccess("Photo updated.");
    } catch (err) {
      setPhotoError(err.response?.data?.message || "Could not update the photo. Try again.");
    } finally {
      setPhotoBusy(false);
    }
  };

  const handleRemovePhoto = async () => {
    setPhotoError("");
    setPhotoSuccess("");

    try {
      setPhotoBusy(true);
      const res = await api.delete("/auth/me/photo");
      updateUser(res.data.user);
      setPhotoUrl("");
      setPhotoSuccess("Photo removed.");
    } catch (err) {
      setPhotoError(err.response?.data?.message || "Could not remove the photo. Try again.");
    } finally {
      setPhotoBusy(false);
      setShowRemovePhoto(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!firstName.trim() || !lastName.trim()) {
      setError("First name and last name are required.");
      return;
    }

    const cleanPhone = phone.replace(/\s/g, "");
    if (cleanPhone && !phoneRegex.test(cleanPhone)) {
      setError("Enter a valid phone number (9-15 digits).");
      return;
    }

    const payload = { firstName: firstName.trim(), lastName: lastName.trim() };
    if (cleanPhone) payload.phone = cleanPhone;
    if (address.trim()) payload.address = address.trim();

    try {
      setSaving(true);
      const res = await api.put("/auth/profile", payload);
      updateUser(res.data.user);
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwError("All password fields are required.");
      return;
    }
    if (newPassword.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("Passwords do not match.");
      return;
    }

    try {
      setPwSaving(true);
      await api.put("/auth/change-password", { currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPwSuccess("Password changed successfully.");
    } catch (err) {
      setPwError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setPwSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const skills = user?.skills || [];

  return (
    <main className="min-h-screen bg-page px-4 pb-28 pt-5 text-ink sm:px-6 lg:px-10 lg:pb-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-heading text-xl font-bold tracking-tight sm:text-2xl">My Profile</h1>

        <div className="mt-5 grid items-start gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* Left: identity + details */}
          <div className="min-w-0 space-y-5">
            <section className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-primary/30 bg-elevated">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <span className="font-heading text-2xl font-bold text-primary">
                      {initials || <LuUserRound size={34} />}
                    </span>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />

                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={photoBusy}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-xs font-semibold text-ink transition hover:border-primary hover:text-primary disabled:opacity-60"
                  >
                    <LuCamera size={14} />
                    {photoBusy ? "Please wait..." : user?.hasPhoto ? "Change photo" : "Add photo"}
                  </button>

                  {user?.hasPhoto && (
                    <button
                      type="button"
                      onClick={() => setShowRemovePhoto(true)}
                      disabled={photoBusy}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-xs font-semibold text-muted transition hover:border-red-400 hover:text-red-400 disabled:opacity-60"
                    >
                      <LuTrash2 size={14} />
                      Remove
                    </button>
                  )}
                </div>

                {photoError && <p className="mt-2 text-xs text-red-400">{photoError}</p>}
                {photoSuccess && <p className="mt-2 text-xs text-teal">{photoSuccess}</p>}
                <p className="mt-2 text-[11px] text-muted">JPG or PNG, up to 2MB</p>

                <h2 className="mt-4 font-heading text-lg font-bold">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="mt-0.5 break-all text-sm text-muted">{user?.email}</p>

                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-teal/25 bg-teal/10 px-3 py-1 text-[11px] font-semibold text-teal">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal" />
                  Active employee
                </span>

                {skills.length > 0 && (
                  <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                    {skills.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-line bg-surface px-5 py-2">
              <div className="divide-y divide-line">
                <InfoRow icon={LuMail} label="Email" value={user?.email} />
                <InfoRow icon={LuPhone} label="Phone" value={user?.phone} />
                <InfoRow icon={LuMapPin} label="Address" value={user?.address} />
                <InfoRow icon={LuCreditCard} label="NIC" value={user?.nicMasked} />
                <InfoRow
                  icon={LuWrench}
                  label="Skills"
                  value={skills.length ? skills.join(", ") : ""}
                />
                <InfoRow
                  icon={LuCalendarDays}
                  label="Member since"
                  value={formatDate(user?.joinedAt)}
                />
              </div>
            </section>
          </div>

          {/* Right: edit, password, logout */}
          <div className="min-w-0 space-y-5">
            <section className="rounded-2xl border border-line bg-surface p-5">
              <h2 className="font-heading text-base font-bold">Edit details</h2>
              <p className="mt-1 text-sm text-muted">
                Keep your contact information up to date. Email and NIC can only be changed by an
                administrator.
              </p>

              <form onSubmit={handleSave} className="mt-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className={labelClass}>
                      First name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      autoComplete="given-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className={labelClass}>
                      Last name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      autoComplete="family-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={fieldClass}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="phone" className={labelClass}>
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0771234567"
                    className={fieldClass}
                  />
                </div>

                <div className="mt-4">
                  <label htmlFor="address" className={labelClass}>
                    Residential address
                  </label>
                  <input
                    id="address"
                    type="text"
                    autoComplete="street-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={fieldClass}
                  />
                </div>

                {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
                {success && <p className="mt-4 text-sm text-teal">{success}</p>}

                <button
                  type="submit"
                  disabled={saving}
                  className="mt-5 w-full rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </form>
            </section>

            <section className="rounded-2xl border border-line bg-surface">
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-expanded={showPassword}
                className="flex w-full items-center gap-3 p-5 text-left"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <LuLockKeyhole size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-heading text-base font-bold">Password & security</h2>
                  <p className="mt-0.5 text-sm text-muted">Change your sign-in password.</p>
                </div>
                <LuChevronDown
                  size={18}
                  className={`shrink-0 text-muted transition-transform ${
                    showPassword ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showPassword && (
                <form onSubmit={handlePasswordChange} className="border-t border-line p-5">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className={labelClass}>
                        Current password
                      </label>
                      <input
                        id="currentPassword"
                        type="password"
                        autoComplete="current-password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="newPassword" className={labelClass}>
                        New password
                      </label>
                      <input
                        id="newPassword"
                        type="password"
                        autoComplete="new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={fieldClass}
                      />
                      <p className="mt-1.5 text-xs text-muted">Use at least 8 characters.</p>
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className={labelClass}>
                        Confirm new password
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={fieldClass}
                      />
                    </div>
                  </div>

                  {pwError && <p className="mt-4 text-sm text-red-400">{pwError}</p>}
                  {pwSuccess && <p className="mt-4 text-sm text-teal">{pwSuccess}</p>}

                  <button
                    type="submit"
                    disabled={pwSaving}
                    className="mt-5 w-full rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {pwSaving ? "Updating..." : "Update password"}
                  </button>
                </form>
              )}
            </section>

            <section className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-5">
              <div className="flex min-w-0 items-start gap-3">
                <LuShieldCheck className="mt-0.5 shrink-0 text-teal" size={19} />
                <p className="text-sm text-muted">Sign out of this device when you are done.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-red-400/30 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:border-red-400 hover:bg-red-400/10"
              >
                <LuLogOut size={16} />
                Log out
              </button>
            </section>
          </div>
        </div>
      </div>

      {showConfirm && (
        <ConfirmDialog
          icon={LuLogOut}
          title="Log out?"
          message="You will need to sign in again to continue using ServicePro."
          confirmText="Log out"
          onConfirm={handleLogout}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {showRemovePhoto && (
        <ConfirmDialog
          icon={LuTrash2}
          title="Remove profile photo?"
          message="Your photo will be deleted and your initials will be shown instead. You can add a new photo any time."
          confirmText="Remove"
          busy={photoBusy}
          onConfirm={handleRemovePhoto}
          onCancel={() => setShowRemovePhoto(false)}
        />
      )}
    </main>
  );
}

export default Profile;