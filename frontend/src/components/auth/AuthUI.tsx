"use client";

import { useId, useState } from "react";

/* ------------------------------------------------------------------ */
/* Ikon                                                                */
/* ------------------------------------------------------------------ */

type IconProps = React.SVGProps<SVGSVGElement>;

function baseIconProps(props: IconProps): IconProps {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    ...props,
  };
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...baseIconProps(props)}>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m3.5 7 7.3 5.2a2 2 0 0 0 2.4 0L20.5 7" />
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <svg {...baseIconProps(props)}>
      <rect x="4" y="10" width="16" height="11" rx="3" />
      <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
      <path d="M12 14.5v2" />
    </svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <svg {...baseIconProps(props)}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

export function StoreIcon(props: IconProps) {
  return (
    <svg {...baseIconProps(props)}>
      <path d="M4 9.5V20h16V9.5" />
      <path d="M3 9.5 5 4h14l2 5.5a3 3 0 0 1-5.5 1.6 3 3 0 0 1-5 0A3 3 0 0 1 3 9.5Z" />
      <path d="M9.5 20v-5h5v5" />
    </svg>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <svg {...baseIconProps(props)}>
      <path d="M19.5 10.5c0 6.2-7.5 10.5-7.5 10.5S4.5 16.7 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      <circle cx="12" cy="10.5" r="2.8" />
    </svg>
  );
}

export function EyeIcon(props: IconProps) {
  return (
    <svg {...baseIconProps(props)}>
      <path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function EyeOffIcon(props: IconProps) {
  return (
    <svg {...baseIconProps(props)}>
      <path d="m4 4 16 16" />
      <path d="M9.9 5.8A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.2 3" />
      <path d="M6.2 8.1A16.7 16.7 0 0 0 2.5 12S6 18.5 12 18.5a9.4 9.4 0 0 0 3.9-.8" />
      <path d="M10.2 10.3a2.4 2.4 0 0 0 3.4 3.4" />
    </svg>
  );
}

export function CapsLockIcon(props: IconProps) {
  return (
    <svg {...baseIconProps(props)}>
      <path d="M12 4 5.5 10.5H9V14h6v-3.5h3.5L12 4Z" />
      <path d="M9 18h6" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...baseIconProps(props)}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

export function SparkIcon(props: IconProps) {
  return (
    <svg {...baseIconProps(props)}>
      <path d="M13 2 6.5 13.5H11l-1 8.5 7-12h-4.5L13 2Z" />
    </svg>
  );
}

export function GoogleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.68-.06-1.33-.18-1.96H12v3.71h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.23c1.89-1.74 2.99-4.3 2.99-7.27Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.61-2.43l-3.23-2.5c-.9.6-2.04.95-3.38.95-2.6 0-4.8-1.75-5.59-4.11H3.07v2.58A9.99 9.99 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.41 13.91a6 6 0 0 1 0-3.82V7.51H3.07a10 10 0 0 0 0 8.98l3.34-2.58Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.98c1.47 0 2.8.5 3.84 1.5l2.87-2.87A9.63 9.63 0 0 0 12 2a9.99 9.99 0 0 0-8.93 5.51l3.34 2.58C7.2 7.73 9.4 5.98 12 5.98Z"
      />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="10" fill="#1877F2" />
      <path
        fill="#fff"
        d="M15.6 12.6h-2.3V21h-3.2v-8.4H8.4V9.5h1.7V7.9c0-1.9 1.1-3.4 3.7-3.4h2.3v3.1h-1.6c-.8 0-1.1.4-1.1 1.1v.8h2.8l-.6 3.1Z"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Komponen form                                                       */
/* ------------------------------------------------------------------ */

interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "className" | "size"> {
  label: string;
  trailing?: React.ReactNode;
  hint?: React.ReactNode;
  error?: string;
  inputRef?: React.Ref<HTMLInputElement>;
}

export function TextField({
  label,
  trailing,
  hint,
  error,
  inputRef,
  id,
  value,
  onFocus,
  onBlur,
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? props.name ?? generatedId;
  const describedById = `${fieldId}-description`;
  const [focused, setFocused] = useState(false);

  const hasValue =
    value !== undefined && value !== null && String(value).length > 0;
  const floated = focused || hasValue;

  return (
    <div>
      <div className="relative">
        <input
          id={fieldId}
          ref={inputRef}
          {...props}
          value={value}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? describedById : undefined}
          className={`h-[3.4rem] w-full border-0 border-b bg-transparent pb-1 pt-[1.15rem] text-[13px] text-[#111827] outline-none transition focus:ring-0 disabled:cursor-not-allowed disabled:text-[#9CA3AF] ${
            error
              ? "border-rose-400 hover:border-rose-500 focus:border-rose-500"
              : "border-[#D1D5DB] hover:border-[#9CA3AF] focus:border-[#FF8F00]"
          } ${trailing ? "pr-10" : ""}`}
        />
        <label
          htmlFor={fieldId}
          className={`pointer-events-none absolute left-0 transition-all duration-150 ${
            floated
              ? "top-0 text-[10px] font-semibold uppercase tracking-[0.08em]"
              : "top-1/2 -translate-y-1/2 text-[13px]"
          } ${
            error
              ? "text-rose-500"
              : focused
                ? "text-[#FF8F00]"
                : "text-[#9CA3AF]"
          }`}
        >
          {label}
        </label>
        {trailing && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            {trailing}
          </div>
        )}
      </div>

      {(error || hint) && (
        <p
          id={describedById}
          className={`mt-1.5 text-[10.5px] leading-snug ${
            error ? "font-medium text-rose-500" : "text-[#9CA3AF]"
          }`}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}

interface PasswordFieldProps extends Omit<TextFieldProps, "trailing"> {
  label: string;
}

export function PasswordField({
  label,
  hint,
  onKeyDown,
  onKeyUp,
  onBlur,
  ...props
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  const syncCapsLock = (event: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLock(event.getModifierState("CapsLock"));
  };

  return (
    <TextField
      {...props}
      label={label}
      onKeyDown={(event) => {
        syncCapsLock(event);
        onKeyDown?.(event);
      }}
      onKeyUp={(event) => {
        syncCapsLock(event);
        onKeyUp?.(event);
      }}
      onBlur={(event) => {
        setCapsLock(false);
        onBlur?.(event);
      }}
      hint={
        capsLock ? (
          <span className="inline-flex items-center gap-1.5 font-medium text-[#B45309]">
            <CapsLockIcon className="h-3 w-3" />
            Caps Lock sedang aktif
          </span>
        ) : (
          hint
        )
      }
      type={visible ? "text" : "password"}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? "Sembunyikan password" : "Tampilkan password"}
          aria-pressed={visible}
          className="grid h-8 w-8 place-items-center rounded-full text-[#9CA3AF] transition-colors hover:bg-[#F3F4F6] hover:text-[#4B5563] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8F00]/40"
        >
          {visible ? (
            <EyeOffIcon className="h-[17px] w-[17px]" />
          ) : (
            <EyeIcon className="h-[17px] w-[17px]" />
          )}
        </button>
      }
    />
  );
}

type AlertTone = "error" | "success" | "info";

export function FormAlert({
  tone = "error",
  children,
}: {
  tone?: AlertTone;
  children: React.ReactNode;
}) {
  const styles: Record<AlertTone, string> = {
    error: "border-rose-200/80 bg-rose-50 text-rose-800",
    success: "border-emerald-200/80 bg-emerald-50 text-emerald-800",
    info: "border-[#FF8F00]/20 bg-[#FFF7ED] text-[#8A4A00]",
  };

  const iconStyles: Record<AlertTone, string> = {
    error: "bg-rose-100 text-rose-600",
    success: "bg-emerald-100 text-emerald-600",
    info: "bg-[#FFEBCF] text-[#FF8F00]",
  };

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-[11px] font-medium leading-relaxed ${styles[tone]}`}
    >
      <span
        className={`mt-px grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full ${iconStyles[tone]}`}
      >
        {tone === "success" ? (
          <CheckIcon className="h-2.5 w-2.5" strokeWidth={2.8} />
        ) : tone === "info" ? (
          <SparkIcon className="h-2.5 w-2.5" strokeWidth={2} />
        ) : (
          <svg
            className="h-2.5 w-2.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M12 7.5v5.5" />
            <path d="M12 17v.01" />
          </svg>
        )}
      </span>
      <span className="pt-0.5">{children}</span>
    </div>
  );
}

export function SubmitButton({
  loading,
  loadingText,
  children,
}: {
  loading: boolean;
  loadingText: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#FF8F00] text-[12.5px] font-semibold text-white transition-colors hover:bg-[#F08300] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FF8F00]/30 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading && (
        <svg
          className="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="3"
            className="opacity-25"
          />
          <path
            d="M21 12a9 9 0 0 0-9-9"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )}
      {loading ? loadingText : children}
    </button>
  );
}

export function FormDivider({ label = "atau" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-[#E9EAEC]" />
      <span className="text-[10px] font-medium text-[#9CA3AF]">
        {label}
      </span>
      <span className="h-px flex-1 bg-[#E9EAEC]" />
    </div>
  );
}

export function SocialButton({
  icon,
  children,
  onClick,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#D1D5DB] bg-white text-[11.5px] font-semibold text-[#111827] transition-colors hover:border-[#9CA3AF] hover:bg-[#FAFAFA] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FF8F00]/20"
    >
      {icon}
      {children}
    </button>
  );
}
