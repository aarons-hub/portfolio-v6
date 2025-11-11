import React from "react";
import { useEffect, useState, useRef } from "react";
import useImageProgress from "../hooks/useImageProgress";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useNavigate } from "react-router-dom";
import {
  useMagneticEffectForChildren,
  useButtonFillEffectForChildren,
  useStickyCursor,
  useImageCursor,
} from "./custom";

export const Portfolio = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Web");

  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  const categories = ["Web", "Photography", "Graphics", "Print", "All"];
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const PORT_API_URI = `${import.meta.env.BASE_URL}data/portfolio.json`;

    const fetchPortfolio = async () => {
      try {
        const res = await fetch(PORT_API_URI);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        // Fix all image paths for deployment
        const processed = data.map((item) => ({
          ...item,
          image: `${import.meta.env.BASE_URL}${item.image.replace(/^\/+/, "")}`,
          thumbnail: `${import.meta.env.BASE_URL}${item.thumbnail.replace(
            /^\/+/,
            ""
          )}`,
        }));

        setData(processed);
        setFiltered(processed);
      } catch (err) {
        console.error("Error fetching portfolio:", err);
      }
    };

    fetchPortfolio();
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFiltered(data);
    } else {
      setFiltered(data.filter((item) => item.category === selectedCategory));
    }
    setCurrentPage(1);
  }, [selectedCategory, data]);

  const navigate = useNavigate();

  const handleClick = (item) => {
    // Navigate to details page for this portfolio item
    // we use the item id as the route param
    navigate(`/portfolio/${item.id}`);
  };

  // rotation handlers removed; details page handles navigation between items

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered
    .slice()
    .sort((a, b) => a.sortorder - b.sortorder)
    .slice(startIndex, startIndex + itemsPerPage);

  // Magnetic effect for filter buttons (button and text animate separately)
  const filterButtonRefs = useMagneticEffectForChildren(
    ".btn.magnetic",
    40,
    false
  );
  const filterTextRefs = useMagneticEffectForChildren(".btn-text", 50, false);

  // Button fill effect for filter buttons
  const buttonFillRef = useButtonFillEffectForChildren("button.magnetic");

  // Magnetic and fill effects for view selection buttons
  const viewButtonRefs = useMagneticEffectForChildren(
    "button.magnetic",
    50,
    false
  );
  const viewTextRefs = useMagneticEffectForChildren(".btn-text", 50, false);
  const viewButtonFillRef = useButtonFillEffectForChildren("button.magnetic");

  // Magnetic and fill effects for pagination buttons
  const paginationButtonRefs = useMagneticEffectForChildren(
    "button.magnetic",
    50,
    false,
    [totalPages]
  );
  const paginationTextRefs = useMagneticEffectForChildren(
    ".btn-text",
    50,
    false,
    [totalPages]
  );
  const paginationButtonFillRef = useButtonFillEffectForChildren(
    "button.magnetic",
    0.6,
    [totalPages]
  );

  // Get count for each category
  const getCategoryCount = (category) => {
    if (category === "All") return data.length;
    return data.filter((item) => item.category === category).length;
  };

  // Sticky cursor effect - re-initializes when currentItems changes
  useStickyCursor(".sticky-cursor", ".sticky-cursor-container", 5, 500, [
    currentItems.length,
    selectedCategory,
    currentPage,
  ]);

  // Image cursor effect - only active in list view
  useImageCursor(
    ".image-cursor",
    ".image-cursor-container",
    7,
    500,
    viewMode === "listview", // isActive parameter
    [currentItems.length, selectedCategory, currentPage]
  );

  // ScrollSmoother effects via CSS selector method (no data-* attributes)
  useEffect(() => {
    const smoother = ScrollSmoother.get();
    if (!smoother) return;

    smoother.effects(".intro h1", { lag: 0.5 });
  }, []);

  // (moved) shimmer handling replaced below to scope to itemsRef

  // Adding a body class
  useEffect(() => {
    document.body.classList.add("portfoliopage");
    return () => {
      document.body.classList.remove("portfoliopage");
    };
  }, []);

  // Progress bar ref (scoped to this component)
  const portfolioRef = useRef(null);
  const itemsRef = useRef(null);

  // Use reusable hook to compute image loading progress inside the portfolio items container
  const { pct, done } = useImageProgress(itemsRef, {
    selector: ".portfolio-image img",
    approxSize: 40000,
    deps: [filtered, currentPage, viewMode],
  });

  // Shimmer handling scoped to the itemsRef container so listeners don't run globally
  useEffect(() => {
    const container = itemsRef?.current;
    if (!container) return;

    const wrappers = Array.from(container.querySelectorAll(".portfolio-image"));
    const listeners = [];

    wrappers.forEach((wrapper) => {
      const img = wrapper.querySelector("img");
      if (!img) return;
      if (img.complete && img.naturalWidth) {
        wrapper.classList.add("loaded");
        return;
      }

      const onLoad = () => wrapper.classList.add("loaded");
      const onError = () => wrapper.classList.add("error");

      img.addEventListener("load", onLoad);
      img.addEventListener("error", onError);

      listeners.push({ img, onLoad, onError });
    });

    return () => {
      listeners.forEach(({ img, onLoad, onError }) => {
        img.removeEventListener("load", onLoad);
        img.removeEventListener("error", onError);
      });
    };
  }, [filtered, currentPage, viewMode]);

  return (
    <section id="portfolio" className="portfolio-section">
      <div className="container portfolio">
        <div className="intro text-center">
          <h1 className="fw-normal">P0R7FOL/O</h1>
        </div>
        <div className="d-flex justify-content-between pb-4 btn-group-wrapper">
          <div
            className="p-0 gap-3 btn-group"
            ref={(el) => {
              // Attach the same container to all hooks
              if (filterButtonRefs) filterButtonRefs.current = el;
              if (filterTextRefs) filterTextRefs.current = el;
              if (buttonFillRef) buttonFillRef.current = el;
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                className={`btn btn-primary rounded-pill py-4 px-5 custom-filter-btn magnetic ${
                  selectedCategory === cat ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                <span className="btn-text magnetic">{cat}</span>
                <div className="button-fill"></div>
                <span className="badge cat-count">{getCategoryCount(cat)}</span>
              </button>
            ))}
          </div>
          <div
            className="d-flex gap-3 p-0 view-selections"
            ref={(el) => {
              if (viewButtonRefs) viewButtonRefs.current = el;
              if (viewTextRefs) viewTextRefs.current = el;
              if (viewButtonFillRef) viewButtonFillRef.current = el;
            }}
          >
            <button
              className={`btn btn-primary rounded-pill p-4 list-view magnetic ${
                viewMode === "listview" ? "active" : ""
              }`}
              onClick={() => setViewMode("listview")}
            >
              <span className="btn-text magnetic">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M0 0.5H24" stroke="#511124" />
                  <path d="M0 8.16663H24" stroke="#511124" />
                  <path d="M0 15.8334H24" stroke="#511124" />
                  <path d="M0 23.5H24" stroke="#511124" />
                </svg>
              </span>
              <div className="button-fill"></div>
            </button>
            <button
              className={`btn btn-primary rounded-pill p-4 grid-view magnetic ${
                viewMode === "grid" ? "active" : ""
              }`}
              onClick={() => setViewMode("grid")}
            >
              <span className="btn-text magnetic">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="0.5"
                    y="0.5"
                    width="9.10526"
                    height="9.10526"
                    stroke="#fff"
                  />
                  <rect
                    x="14.3945"
                    y="0.5"
                    width="9.10526"
                    height="9.10526"
                    stroke="#fff"
                  />
                  <rect
                    x="0.5"
                    y="14.3948"
                    width="9.10526"
                    height="9.10526"
                    stroke="#fff"
                  />
                  <rect
                    x="14.3945"
                    y="14.3948"
                    width="9.10526"
                    height="9.10526"
                    stroke="#fff"
                  />
                </svg>
              </span>
              <div className="button-fill"></div>
            </button>
          </div>
        </div>
        <div
          className={`portfolio-global-progress ${done ? "done" : ""}`}
          ref={portfolioRef}
          aria-hidden="true"
        >
          <div className="bar" style={{ width: `${pct}%` }} />
        </div>

        <div
          className={`d-flex w-100 px-0 py-3 text-uppercase header-container ${
            viewMode === "listview" ? "is-listview" : ""
          }`}
        >
          <p className="flex-fill m-0 title">Client</p>
          <p className="flex-fill m-0 description">Description</p>
        </div>

        <div
          ref={(el) => {
            itemsRef.current = el;
          }}
          className={`position-relative portfolio-items ${
            viewMode === "listview" ? "listview" : "gridview"
          }`}
        >
          {currentItems.map((item, index) => (
            <div
              key={item.id || item.sortorder || index}
              className="d-flex overflow-hidden position-relative custom-card sticky-cursor-container image-cursor-container"
            >
              <div className="d-flex w-100 headings-container">
                <div className="flex-fill title">
                  <h6
                    className="text-uppercase"
                    role="button"
                    tabIndex={0}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleClick(item)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") handleClick(item);
                    }}
                  >
                    {item.title}
                  </h6>
                </div>
                <div className="flex-fill description">
                  <p>{item.content}</p>
                </div>
              </div>

              <div className="portfolio-image image-cursor">
                <img
                  className="img-fluid"
                  src={item.thumbnail}
                  alt={item.title}
                  onClick={() => handleClick(item)}
                  data-sortorder={item.sortorder}
                  data-id={item.id}
                  data-category={item.category}
                  data-url={item.url}
                  loading="lazy"
                  style={{
                    transform: `translateY(${item.objectposition})`,
                    width: "100%",
                  }}
                />
              </div>
            </div>
          ))}

          <div
            className="prev-next-btns-wrapper"
            ref={(el) => {
              if (paginationButtonRefs) paginationButtonRefs.current = el;
              if (paginationTextRefs) paginationTextRefs.current = el;
              if (paginationButtonFillRef) paginationButtonFillRef.current = el;
            }}
          >
            <button
              className={`btn btn-primary rounded-circle p-4 position-absolute top-50 start-0 translate-middle z-1 custom-pagination-btn magnetic ${
                currentPage === 1 ? "disabled" : ""
              }`}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              <div className="button-fill"></div>
              <span className="btn-text magnetic">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15 7.5C15 7.22386 14.7761 7 14.5 7L2.70711 7L5.85355 3.85355C6.04882 3.65829 6.04882 3.34171 5.85355 3.14645C5.65829 2.95118 5.34171 2.95118 5.14645 3.14645L1.14645 7.14645C0.951184 7.34171 0.951184 7.65829 1.14645 7.85355L5.14645 11.8536C5.34171 12.0488 5.65829 12.0488 5.85355 11.8536C6.04882 11.6583 6.04882 11.3417 5.85355 11.1464L2.70711 8L14.5 8C14.7761 8 15 7.77614 15 7.5Z"
                    fill="#fff"
                  />
                </svg>
              </span>
            </button>
            <button
              className={`btn btn-primary rounded-circle p-4 position-absolute top-50 start-100 translate-middle z1 custom-pagination-btn magnetic ${
                currentPage === totalPages ? "disabled" : ""
              }`}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            >
              <div className="button-fill"></div>
              <span className="btn-text magnetic">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1 7.5C1 7.22386 1.22386 7 1.5 7L13.2929 7L10.1464 3.85355C9.95118 3.65829 9.95118 3.34171 10.1464 3.14645C10.3417 2.95118 10.6583 2.95118 10.8536 3.14645L14.8536 7.14645C15.0488 7.34171 15.0488 7.65829 14.8536 7.85355L10.8536 11.8536C10.6583 12.0488 10.3417 12.0488 10.1464 11.8536C9.95118 11.6583 9.95118 11.3417 10.1464 11.1464L13.2929 8L1.5 8C1.22386 8 1 7.77614 1 7.5Z"
                    fill="#fff"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="d-flex w-100 justify-content-center pt-4 pagination-wrapper">
            <div className="btn-group gap-3 pt-4">
              <button
                className={`btn btn-primary rounded-pill py-4 px-5 custom-pagination-btn previous ${
                  currentPage === 1 ? "disabled" : ""
                }`}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              >
                <span className="btn-text">Previous</span>
              </button>

              <div className="d-flex gap-1 overflow-x-auto p-2 custom-paging-numbers">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`btn btn-primary rounded-circle btn-sm custom-pagination-btn ${
                      currentPage === i + 1 ? "active" : ""
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    <span className="btn-text">{i + 1}</span>
                  </button>
                ))}
              </div>
              <button
                className={`btn btn-primary rounded-pill py-4 px-5 custom-pagination-btn next ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
              >
                <span className="btn-text">Next</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
