
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

function Profile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  // Profile form state
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  // Logout modal state
  const [showConfirm, setShowConfirm] = useState(false);

  // Update profile
  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!firstName.trim() || !lastName.trim()) {
      setError("First name and last name are required.");
      return;
    }

    try {
      setSaving(true);

      const res = await api.put("/auth/profile", {
        firstName: firstName.trim(),
        lastName: lastName.trim()
      });

      updateUser({
        firstName: res.data.user.firstName,
        lastName: res.data.user.lastName
      });

      setSuccess("Profile updated successfully");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // Change password
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

      await api.put("/auth/change-password", {
        currentPassword,
        newPassword
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setPwSuccess("Password changed successfully.");
    } catch (err) {
      setPwError(
        err.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setPwSaving(false);
    }
  };

  // Logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="p-4">
      <h1 className="font-heading text-2xl font-semibold text-ink">
        Profile
      </h1>

      {/* Employee information */}
      <div className="mt-4 rounded-2xl border border-line bg-surface p-4">
        <p className="text-lg font-medium text-ink">
          {user.firstName} {user.lastName}
        </p>
        <p className="text-sm text-muted">{user.email}</p>
      </div>

      {/* Personal information form */}
      <form
        onSubmit={handleSave}
        className="mt-4 rounded-2xl border border-line bg-surface p-4"
      >
        <h2 className="font-heading text-lg font-semibold text-ink">
          Personal Information
        </h2>

        <label className="mt-3 block text-sm text-muted">
          First Name
        </label>
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="mt-1 w-full rounded-xl border border-line bg-elevated px-3 py-2.5 text-ink outline-none focus:border-primary"
        />

        <label className="mt-3 block text-sm text-muted">
          Last Name
        </label>
        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="mt-1 w-full rounded-xl border border-line bg-elevated px-3 py-2.5 text-ink outline-none focus:border-primary"
        />

        {error && (
          <p className="mt-3 text-sm text-red-400">{error}</p>
        )}

        {success && (
          <p className="mt-3 text-sm text-teal">{success}</p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="mt-4 w-full rounded-xl bg-primary py-2.5 font-medium text-white disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>

      {/* Change password form */}
      <form
        onSubmit={handlePasswordChange}
        className="mt-4 rounded-2xl border border-line bg-surface p-4"
      >
        <h2 className="font-heading text-lg font-semibold text-ink">
          Change Password
        </h2>

        <label className="mt-3 block text-sm text-muted">
          Current Password
        </label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="mt-1 w-full rounded-xl border border-line bg-elevated px-3 py-2.5 text-ink outline-none focus:border-primary"
        />

        <label className="mt-3 block text-sm text-muted">
          New Password
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mt-1 w-full rounded-xl border border-line bg-elevated px-3 py-2.5 text-ink outline-none focus:border-primary"
        />

        <label className="mt-3 block text-sm text-muted">
          Confirm New Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-1 w-full rounded-xl border border-line bg-elevated px-3 py-2.5 text-ink outline-none focus:border-primary"
        />

        {pwError && (
          <p className="mt-3 text-sm text-red-400">{pwError}</p>
        )}

        {pwSuccess && (
          <p className="mt-3 text-sm text-teal">{pwSuccess}</p>
        )}

        <button
          type="submit"
          disabled={pwSaving}
          className="mt-4 w-full rounded-xl bg-primary py-2.5 font-medium text-white disabled:opacity-60"
        >
          {pwSaving ? "Updating..." : "Change password"}
        </button>
      </form>

      {/* Logout button */}
      <button
        onClick={() => setShowConfirm(true)}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-elevated py-2.5 font-medium text-ink"
      >
        <LuLogOut /> Log out
      </button>

      {/* Logout confirmation */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-5">
            <h2 className="font-heading text-lg font-semibold text-ink">
              Log out?
            </h2>

            <p className="mt-1 text-sm text-muted">
              You will need to sign in again to continue.
            </p>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-xl border border-line py-2.5 text-ink"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="flex-1 rounded-xl bg-primary py-2.5 font-medium text-white"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
