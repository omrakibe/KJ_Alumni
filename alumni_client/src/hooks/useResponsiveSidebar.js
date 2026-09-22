import { useEffect, useState } from "react";

const MOBILE_NAVIGATION = "(max-width: 850px)";

function storedPreference(storageKey) {
  try {
    return localStorage.getItem(storageKey) === "true";
  } catch {
    return false;
  }
}

export default function useResponsiveSidebar(storageKey) {
  const [collapsed, setCollapsed] = useState(() => window.matchMedia(MOBILE_NAVIGATION).matches || storedPreference(storageKey));

  useEffect(() => {
    const media = window.matchMedia(MOBILE_NAVIGATION);
    const handleViewportChange = (event) => setCollapsed(event.matches ? true : storedPreference(storageKey));
    media.addEventListener("change", handleViewportChange);
    return () => media.removeEventListener("change", handleViewportChange);
  }, [storageKey]);

  const toggle = () => {
    setCollapsed((current) => {
      const next = !current;
      try { localStorage.setItem(storageKey, String(next)); } catch { /* no-op */ }
      return next;
    });
  };

  const closeMobileNavigation = () => {
    if (window.matchMedia(MOBILE_NAVIGATION).matches) setCollapsed(true);
  };

  return { collapsed, toggle, closeMobileNavigation };
}
