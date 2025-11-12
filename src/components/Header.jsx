import React from "react";
import { NavLink } from "react-router-dom";
import { useMenuData } from "../hooks/useMenuData";
import { useNavScroll } from "../hooks/custom";
import { ScrollSmoother } from "gsap/ScrollSmoother";

export const Header = () => {
  const { data: menuItems } = useMenuData();

  // Animate the navbar on scroll
  const navRef = useNavScroll("#smooth-content", "top 0%", "+=200px", false);

  const handleNavClick = (e, path) => {
    if (path === "#footer") {
      e.preventDefault();
      const smoother = ScrollSmoother.get();
      if (smoother) {
        smoother.scrollTo("#footer", true, "top top");
      } else {
        document
          .querySelector("#footer")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <>
      <header id="header">
        <nav className="navbar navbar-expand-lg py-4 container" ref={navRef}>
          <div className="container-fluid justify-content-between">
            <div className="navbar-brand">
              <div
                className="text-uppercase lh-1 fs-3 d-flex flex-column"
                aria-label="Aaron Sanders"
              >
                <span className="d-flex flex-row" aria-hidden="true">
                  <span className="firstname">A4R0N</span>
                </span>

                <span className="lastname">
                  SAND
                  <span className="flip-me">3</span>RS
                </span>
              </div>
            </div>

            <div className="navbar custom">
              <ul className="navbar-nav">
                {(menuItems || []).map((item) => (
                  <li className="nav-item" key={item.id}>
                    <NavLink
                      to={item.path}
                      className={`nav-link text-uppercase fw-normal id-${item.id}`}
                      onClick={(e) => handleNavClick(e, item.path)}
                    >
                      {item.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};
