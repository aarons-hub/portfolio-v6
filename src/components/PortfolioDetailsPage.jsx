import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export const PortfolioDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Adding a body class
  useEffect(() => {
    document.body.classList.add("detailspage");
    return () => {
      document.body.classList.remove("detailspage");
    };
  }, []);

  useEffect(() => {
    if (!id) return;
    const PORT_API_URI = `${import.meta.env.BASE_URL}data/portfolio.json`;
    let cancelled = false;

    const fetchItems = async () => {
      try {
        const res = await fetch(PORT_API_URI);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        const processed = data.map((it) => ({
          ...it,
          image: `${import.meta.env.BASE_URL}${it.image.replace(/^\/+/, "")}`,
          thumbnail: `${import.meta.env.BASE_URL}${it.thumbnail.replace(
            /^\/+/,
            ""
          )}`,
        }));

        if (cancelled) return;
        setAllItems(processed);
        const found = processed.find((p) => String(p.id) === String(id));
        setItem(found || null);
      } catch (err) {
        console.error("Error loading portfolio item:", err);
        if (!cancelled) setItem(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchItems();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const findIndexById = useCallback(
    (itemId) => allItems.findIndex((it) => String(it.id) === String(itemId)),
    [allItems]
  );

  const goToIndex = useCallback(
    (idx) => {
      if (!allItems.length) return;
      const wrapped =
        ((idx % allItems.length) + allItems.length) % allItems.length;
      const target = allItems[wrapped];
      if (target) navigate(`/portfolio/${target.id}`);
    },
    [allItems, navigate]
  );

  const goPrev = useCallback(() => {
    const i = findIndexById(id);
    if (i === -1) return;
    goToIndex(i - 1);
  }, [findIndexById, goToIndex, id]);

  const goNext = useCallback(() => {
    const i = findIndexById(id);
    if (i === -1) return;
    goToIndex(i + 1);
  }, [findIndexById, goToIndex, id]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "Escape") navigate("/portfolio");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext, navigate]);

  if (loading) return <div className="container pt-5">Loading…</div>;
  if (!item)
    return (
      <div className="container pt-5">
        <p>Item not found.</p>
        <p>
          <Link to="/portfolio">Back to Portfolio</Link>
        </p>
      </div>
    );

  return (
    <section className="container portfolio-details pt-5">
      <div className="d-flex justify-content-between portfolio-navigation-header">
        <Link
          className="btn btn-primary rounded-pill py-4 px-5 me-4"
          to="/portfolio"
        >
          Back to Portfolio
        </Link>

        <div className="portfolio-navigation">
          <button
            className="btn btn-primary rounded-pill py-4 px-5 me-4 prev"
            onClick={goPrev}
            aria-label="Previous"
          >
            Previous
          </button>
          <button
            className="btn btn-primary rounded-pill py-4 px-5 me-4 next"
            onClick={goNext}
            aria-label="Next"
          >
            Next
          </button>
        </div>
      </div>

      <h3 className="d-flex justify-content-center p-4">{item.title}</h3>

      <div className="d-flex justify-content-center portfolio-image-detail">
        <img
          className="img-fluid"
          src={item.image}
          alt={item.title}
          loading="eager"
        />
      </div>
      <div className="d-flex justify-content-between pt-4 details-footer">
        <p className="flex-grow-1">{item.content}</p>
        {item.url && (
          <p className="flex-grow-2 ms-4">
            <a href={item.url} target="_blank" rel="noreferrer">
              Visit&nbsp;site
            </a>
          </p>
        )}
      </div>
    </section>
  );
};
