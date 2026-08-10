(() => {
  const measurementId = "G-6YH88E4CFP";

  if (window.__geosangGa4Loaded) {
    return;
  }

  window.__geosangGa4Loaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", measurementId);

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  script.dataset.geosangGa4 = measurementId;
  document.head.appendChild(script);
})();
