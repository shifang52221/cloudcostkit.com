const FULL_HELPER_TEXT =
  "If the button does not open your email app, copy the address manually and send your note from any mailbox.";

const COMPACT_HELPER_TEXT =
  "If the button does not open your email app, copy the address below and contact us from any mailbox.";

export function buildContactSurface(email, options = {}) {
  const normalizedEmail = String(email || "").trim();
  const variant = options.variant === "compact" ? "compact" : "full";

  return {
    email: normalizedEmail,
    mailtoHref: `mailto:${normalizedEmail}`,
    variant,
    helperText: variant === "compact" ? COMPACT_HELPER_TEXT : FULL_HELPER_TEXT,
    openLabel: "Open email app",
    copyLabel: "Copy email",
    statusIdle: "Copy email if the button above does not open your mail app.",
    statusSuccess: "Email copied.",
  };
}
