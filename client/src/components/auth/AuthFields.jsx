// Shared form fields for the auth pages: text, password (show/hide), select, image upload tile.
// The upload tile truncates long file names so nothing overflows the card.
// Used by: pages/Auth/Login.jsx, pages/Auth/Register.jsx

import { useEffect, useId, useRef, useState } from "react";
import { LuEye, LuEyeOff, LuChevronDown, LuUpload, LuX } from "react-icons/lu";

export const inputClass =
  "w-full rounded-xl border border-line bg-elevated px-3.5 py-3 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60";

export const labelClass = "block text-xs font-semibold uppercase tracking-wide text-muted";

export function TextField({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  placeholder,
  inputMode,
  hint,
}) {
  const id = useId();

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="mt-1.5">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          inputMode={inputMode}
          className={inputClass}
        />
      </div>
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function PasswordField({ label, value, onChange, autoComplete, hint }) {
  const id = useId();
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="relative mt-1.5">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          className={`${inputClass} pr-12`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted transition hover:text-ink"
        >
          {visible ? <LuEyeOff size={18} /> : <LuEye size={18} />}
        </button>
      </div>
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function SelectField({ label, value, onChange, disabled, children }) {
  const id = useId();

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="relative mt-1.5">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`${inputClass} appearance-none pr-10`}
        >
          {children}
        </select>
        <LuChevronDown
          size={18}
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted"
        />
      </div>
    </div>
  );
}

export function FileField({ label, hint, file, onChange, onError, maxSize, accept }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!file) {
      setPreview("");
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleSelect = (e) => {
    const picked = e.target.files?.[0];
    e.target.value = "";
    if (!picked) return;

    if (!["image/jpeg", "image/png"].includes(picked.type)) {
      onError("Only JPG or PNG images are allowed.");
      return;
    }
    if (picked.size > maxSize) {
      onError(`Each image must be ${Math.round(maxSize / (1024 * 1024))}MB or smaller.`);
      return;
    }
    onChange(picked);
  };

  return (
    <div>
      <span className={labelClass}>{label}</span>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleSelect}
        className="hidden"
        tabIndex={-1}
      />

      {file ? (
        <div className="mt-1.5 flex items-center gap-3 rounded-xl border border-line bg-elevated p-2.5">
          {preview && (
            <img src={preview} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">{file.name}</p>
            <p className="mt-0.5 text-xs text-muted">{Math.max(1, Math.round(file.size / 1024))} KB</p>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label={`Remove ${label}`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted transition hover:bg-surface hover:text-red-400"
          >
            <LuX size={18} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-1.5 flex w-full items-center gap-3 rounded-xl border border-dashed border-line bg-elevated px-3.5 py-4 text-left transition hover:border-primary"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <LuUpload size={18} />
          </div>
          <span className="min-w-0">
            <span className="block text-sm font-medium text-ink">Upload image</span>
            <span className="block text-xs text-muted">{hint}</span>
          </span>
        </button>
      )}
    </div>
  );
}