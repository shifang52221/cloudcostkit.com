export const SITE = {
  name: "CloudCostKit",
  url: (import.meta.env.PUBLIC_SITE_URL || "https://cloudcostkit.com").replace(
    /\/+$/,
    "",
  ),
  locale: "en-US",
  adsenseClient: (import.meta.env.PUBLIC_ADSENSE_CLIENT || "").trim(), // e.g. "ca-pub-1234567890123456"
  ga4MeasurementId: (import.meta.env.PUBLIC_GA4_MEASUREMENT_ID || "").trim(), // e.g. "G-XXXXXXXXXX"
  adsenseSlots: {
    homeMid: (import.meta.env.PUBLIC_ADSENSE_SLOT_HOME_MID || "").trim(), // e.g. "1234567890"
    calculatorsListMid: (import.meta.env.PUBLIC_ADSENSE_SLOT_CALCULATORS_LIST_MID || "").trim(),
    calculatorMid: (import.meta.env.PUBLIC_ADSENSE_SLOT_CALCULATOR_MID || "").trim(),
    calculatorBottom: (import.meta.env.PUBLIC_ADSENSE_SLOT_CALCULATOR_BOTTOM || "").trim(),
  },
  email: (import.meta.env.PUBLIC_CONTACT_EMAIL || "admin@example.com").trim(),
} as const;

export type SiteConfig = typeof SITE;
