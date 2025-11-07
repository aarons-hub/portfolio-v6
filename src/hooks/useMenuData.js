import { useEffect, useState } from "react";

/**
 * Fetch menu data from public/data/menu.json once and return it.
 * Uses Vite's BASE_URL so it works in dev and production subpaths.
 */
export const useMenuData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const url = `${import.meta.env.BASE_URL}data/menu.json`;

    const load = async () => {
      try {
        const res = await fetch(url, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok)
          throw new Error(`Failed to load menu.json (${res.status})`);
        const json = await res.json();
        if (!cancelled) {
          setData(Array.isArray(json) ? json : []);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
};
