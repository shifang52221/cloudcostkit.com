// Keep scenario inputs in the browser/share URL, not in analytics page metadata.
export function buildAnalyticsBootstrap(measurementId) {
  return `(function () {
  var MID = ${JSON.stringify(measurementId).replace(/</g, "\\u003c")};
  var SCRIPT_ID = "ga4-gtag-js";
  if (document.getElementById(SCRIPT_ID)) return;
  function cleanUrl(value) {
    try { var url = new URL(value); return url.origin + url.pathname; }
    catch (e) { return ""; }
  }
  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  window.gtag = window.gtag || gtag;
  var page = {
    page_location: cleanUrl(window.location.href),
    page_referrer: cleanUrl(document.referrer)
  };
  gtag("set", page);
  gtag("js", new Date());
  gtag("config", MID, {
    send_page_view: false,
    page_location: page.page_location,
    page_referrer: page.page_referrer,
    allow_google_signals: false
  });
  gtag("event", "page_view", {
    send_to: MID,
    page_location: page.page_location,
    page_referrer: page.page_referrer
  });
  var script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(MID);
  document.head.appendChild(script);
})();`;
}