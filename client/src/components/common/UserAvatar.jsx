// Reusable round avatar: shows the employee's profile photo (GET /auth/me/photo),
// falls back to initials when there is no photo.
// Used by: Dashboard header (and any page that shows the logged-in employee).

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

function UserAvatar({ size = 44, className = "" }) {
  const { user } = useAuth();
  const [photoUrl, setPhotoUrl] = useState("");

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
  }, [user?.hasPhoto, user?.id]);

  const initials = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .map((n) => n.charAt(0).toUpperCase())
    .join("");

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-primary/30 bg-elevated ${className}`}
      style={{ width: size, height: size }}
    >
      {photoUrl ? (
        <img src={photoUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <span
          className="font-heading font-bold text-primary"
          style={{ fontSize: Math.round(size * 0.36) }}
        >
          {initials || "?"}
        </span>
      )}
    </div>
  );
}

export default UserAvatar;