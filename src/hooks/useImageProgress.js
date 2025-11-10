import { useEffect, useRef, useState } from "react";

export default function useImageProgress(containerRef, options = {}) {
  const {
    selector = ".portfolio-image img",
    approxSize = 40000,
    deps = [],
  } = options;
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;
    // Reset visual state when dependencies change (e.g. paging)
    // so the progress bar is visible again for the new set of images.
    setPct(0);
    setDone(false);

    let imgs = Array.from(container.querySelectorAll(selector));
    let totalBytes = imgs.length * approxSize;
    let loadedBytes = 0;
    let completedCount = 0;

    function setProgressFromBytes() {
      const percent = totalBytes
        ? Math.min(100, Math.round((loadedBytes / totalBytes) * 100))
        : 100;
      if (!mounted.current) return;
      setPct(percent);
      if (percent >= 100) setDone(true);
    }

    function handleImage(img) {
      const size = approxSize;
      if (img.complete && img.naturalWidth) {
        const perf = performance
          .getEntriesByName(img.currentSrc || img.src)
          .pop();
        const perfSize = perf && perf.transferSize ? perf.transferSize : 0;
        const used = perfSize >= 2048 ? perfSize : size;
        loadedBytes += used;
        completedCount += 1;
        setProgressFromBytes();
        if (completedCount >= imgs.length) {
          loadedBytes = totalBytes;
          setProgressFromBytes();
        }
      } else {
        img.addEventListener(
          "load",
          () => {
            const perf = performance
              .getEntriesByName(img.currentSrc || img.src)
              .pop();
            const perfSize = perf && perf.transferSize ? perf.transferSize : 0;
            const gained = perfSize >= 2048 ? perfSize : size;
            loadedBytes += gained;
            completedCount += 1;
            setProgressFromBytes();
            if (completedCount >= imgs.length) {
              loadedBytes = totalBytes;
              setProgressFromBytes();
            }
          },
          { once: true }
        );
        img.addEventListener(
          "error",
          () => {
            loadedBytes += size;
            completedCount += 1;
            setProgressFromBytes();
            if (completedCount >= imgs.length) {
              loadedBytes = totalBytes;
              setProgressFromBytes();
            }
          },
          { once: true }
        );
      }
    }

    imgs.forEach(handleImage);

    // Recalculate only when the number of images changes
    let prevCount = imgs.length;
    const debounce = (fn, wait = 150) => {
      let t = null;
      return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), wait);
      };
    };

    const refresh = () => {
      const newImgs = Array.from(container.querySelectorAll(selector));
      if (newImgs.length === prevCount) return;
      // reset
      loadedBytes = 0;
      imgs = newImgs;
      prevCount = imgs.length;
      totalBytes = imgs.length * approxSize;
      completedCount = 0;
      setPct(0);
      setDone(false);
      imgs.forEach(handleImage);
    };

    const mo = new MutationObserver(debounce(refresh, 200));
    mo.observe(container, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, selector, approxSize, ...deps]);

  return { pct, done };
}
