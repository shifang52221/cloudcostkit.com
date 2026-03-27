function envFlag(value: string | undefined, defaultValue = false) {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) return defaultValue;
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;
  return defaultValue;
}

function getPublisherId(client: string) {
  const explicit = (
    import.meta.env.PUBLIC_ADSENSE_PUBLISHER_ID ||
    import.meta.env.ADSENSE_PUBLISHER_ID ||
    ""
  ).trim();
  if (explicit) return explicit;
  if (client.startsWith("ca-pub-")) return `pub-${client.slice("ca-pub-".length)}`;
  return "";
}

function getSlotValue(enabled: boolean, slot: string) {
  return enabled ? slot.trim() : "";
}

const adsenseClient = (import.meta.env.PUBLIC_ADSENSE_CLIENT || "").trim();
const adsEnabled = envFlag(import.meta.env.PUBLIC_ENABLE_ADS, false);
const enableHomeMid = envFlag(import.meta.env.PUBLIC_ENABLE_ADS_HOME_MID, false);
const enableGuidesMid = envFlag(import.meta.env.PUBLIC_ENABLE_ADS_GUIDES_MID, false);
const enableCalculatorsListMid = envFlag(import.meta.env.PUBLIC_ENABLE_ADS_CALCULATORS_LIST_MID, false);
const enableCalculatorMid = envFlag(import.meta.env.PUBLIC_ENABLE_ADS_CALCULATOR_MID, false);
const enableCalculatorBottom = envFlag(import.meta.env.PUBLIC_ENABLE_ADS_CALCULATOR_BOTTOM, false);
const defaultSlot = (import.meta.env.PUBLIC_ADSENSE_SLOT_DEFAULT || "").trim();

export const SITE = {
  name: "CloudCostKit",
  url: (import.meta.env.PUBLIC_SITE_URL || "https://cloudcostkit.com").replace(
    /\/+$/,
    "",
  ),
  locale: "en-US",
  adsenseClient, // e.g. "ca-pub-1234567890123456"
  ga4MeasurementId: (import.meta.env.PUBLIC_GA4_MEASUREMENT_ID || "").trim(), // e.g. "G-XXXXXXXXXX"
  ads: {
    enabled: adsEnabled,
    publisherId: getPublisherId(adsenseClient),
  },
  adsenseSlots: {
    homeMid: getSlotValue(
      adsEnabled && enableHomeMid,
      import.meta.env.PUBLIC_ADSENSE_SLOT_HOME_MID || defaultSlot || "",
    ), // e.g. "1234567890"
    guidesMid: getSlotValue(
      adsEnabled && enableGuidesMid,
      import.meta.env.PUBLIC_ADSENSE_SLOT_GUIDES_MID || defaultSlot || "",
    ),
    calculatorsListMid: getSlotValue(
      adsEnabled && enableCalculatorsListMid,
      import.meta.env.PUBLIC_ADSENSE_SLOT_CALCULATORS_LIST_MID || defaultSlot || "",
    ),
    calculatorMid: getSlotValue(
      adsEnabled && enableCalculatorMid,
      import.meta.env.PUBLIC_ADSENSE_SLOT_CALCULATOR_MID || defaultSlot || "",
    ),
    calculatorBottom: getSlotValue(
      adsEnabled && enableCalculatorBottom,
      import.meta.env.PUBLIC_ADSENSE_SLOT_CALCULATOR_BOTTOM || defaultSlot || "",
    ),
  },
  email: (import.meta.env.PUBLIC_CONTACT_EMAIL || "contact@cloudcostkit.com").trim(),
  editorial: {
    teamName: "CloudCostKit Editorial Team",
    reviewLabel: "Reviewed against CloudCostKit methodology and current provider documentation.",
  },
} as const;

export type SiteConfig = typeof SITE;
