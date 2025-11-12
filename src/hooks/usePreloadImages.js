import { useEffect, useRef, useState } from "react";

export default function usePreloadImages(urls = [], options = {}) {
  const { preloadLink = false } = options;
  const imgsRef = useRef([]);
  const linksRef = useRef([]);
  const mounted = useRef(true);
  const [state, setState] = useState({
    loaded: 0,
    total: urls.length,
    errors: 0,
  });

  useEffect(() => {
    mounted.current = true;
    imgsRef.current = [];
    linksRef.current = [];
    setState({ loaded: 0, total: urls.length, errors: 0 });

    if (!urls || urls.length === 0) return;

    urls.forEach((url) => {
      // Optionally add a preload link for browsers that honor it
      if (preloadLink && typeof document !== "undefined") {
        try {
          const link = document.createElement("link");
          link.rel = "preload";
          link.as = "image";
          link.href = url;
          document.head.appendChild(link);
          linksRef.current.push(link);
        } catch {
          // ignore
        }
      }

      const img = new Image();

      const onLoad = () => {
        if (!mounted.current) return;
        setState((s) => ({ ...s, loaded: s.loaded + 1 }));
      };

      const onError = () => {
        if (!mounted.current) return;
        setState((s) => ({ ...s, errors: s.errors + 1, loaded: s.loaded + 1 }));
      };

      img.addEventListener("load", onLoad, { once: true });
      img.addEventListener("error", onError, { once: true });
      img.src = url;

      imgsRef.current.push({ img, onLoad, onError });
    });

    return () => {
      mounted.current = false;
      imgsRef.current.forEach(({ img, onLoad, onError }) => {
        try {
          img.removeEventListener("load", onLoad);
          img.removeEventListener("error", onError);
        } catch {
          /* ignore errors while removing listeners */
        }
      });
      imgsRef.current = [];
      // remove any inserted preload links
      linksRef.current.forEach((link) => {
        try {
          if (link.parentNode) link.parentNode.removeChild(link);
        } catch {
          /* ignore errors while removing preload links */
        }
      });
      linksRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(urls), preloadLink]);

  return state;
}
