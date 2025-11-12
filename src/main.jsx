import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Global delegated image load handler so SPA navigation (paging) still
// marks `.portfolio-image` containers as loaded when images finish.
// Uses capture-phase 'load'/'error' events which fire for IMG elements
// even when they are dynamically inserted.
(() => {
  const markLoaded = (img) => {
    try {
      const wrap = img.closest?.(".portfolio-image");
      if (wrap) wrap.classList.add("loaded");
    } catch {
      // noop
    }
  };

  // Initial pass for already-cached images
  document.querySelectorAll(".portfolio-image img").forEach((img) => {
    if (img.complete && img.naturalWidth) markLoaded(img);
  });

  // Delegated load handler (capture) - works for images inserted later
  document.addEventListener(
    "load",
    (ev) => {
      const tgt = ev.target;
      if (tgt && tgt.tagName === "IMG") markLoaded(tgt);
    },
    true
  );

  // Delegated error handler to allow styling fallback
  document.addEventListener(
    "error",
    (ev) => {
      const tgt = ev.target;
      if (tgt && tgt.tagName === "IMG") {
        const wrap = tgt.closest?.(".portfolio-image");
        if (wrap) wrap.classList.add("error");
      }
    },
    true
  );
})();
