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
    homeMid: (
      import.meta.env.PUBLIC_ADSENSE_SLOT_HOME_MID ||
      import.meta.env.PUBLIC_ADSENSE_SLOT_DEFAULT ||
      ""
    ).trim(), // e.g. "1234567890"
    guidesMid: (
      import.meta.env.PUBLIC_ADSENSE_SLOT_GUIDES_MID ||
      import.meta.env.PUBLIC_ADSENSE_SLOT_DEFAULT ||
      ""
    ).trim(),
    calculatorsListMid: (
      import.meta.env.PUBLIC_ADSENSE_SLOT_CALCULATORS_LIST_MID ||
      import.meta.env.PUBLIC_ADSENSE_SLOT_DEFAULT ||
      ""
    ).trim(),
    calculatorMid: (
      import.meta.env.PUBLIC_ADSENSE_SLOT_CALCULATOR_MID ||
      import.meta.env.PUBLIC_ADSENSE_SLOT_DEFAULT ||
      ""
    ).trim(),
    calculatorBottom: (
      import.meta.env.PUBLIC_ADSENSE_SLOT_CALCULATOR_BOTTOM ||
      import.meta.env.PUBLIC_ADSENSE_SLOT_DEFAULT ||
      ""
    ).trim(),
  },
  email: (import.meta.env.PUBLIC_CONTACT_EMAIL || "admin@example.com").trim(),
} as const;

export type SiteConfig = typeof SITE;
