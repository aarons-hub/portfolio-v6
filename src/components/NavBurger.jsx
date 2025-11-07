import React, { useRef } from "react";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useMenuData } from "../hooks/useMenuData";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import {
  useButtonFillEffectWithRef,
  useButtonScrollScale,
  useNavStaggerGsap,
  useMagneticEffectForChildren,
  useMenuSlideGsap,
  useSvgCurveGsap,
  useOverlayCloseMenu,
  useNavLinkCloseMenu,
} from "./custom";

export const NavBurger = () => {
  const { data: menuItems } = useMenuData();
  const [isActive, setIsActive] = useState(false);
  const menuRef = useRef(null);
  const pathRef = useRef(null);
  const navContainerRef = useMagneticEffectForChildren("a.nav-link", 30, true, [
    menuItems,
  ]);

  // GSAP-driven effects
  useMenuSlideGsap(menuRef, isActive);
  useSvgCurveGsap(pathRef, isActive);
  useNavStaggerGsap(navContainerRef, isActive, ".nav-item");

  // Close menu on overlay click and on nav link click
  useOverlayCloseMenu(".menu-overlay", () => setIsActive(false));
  useNavLinkCloseMenu("a.nav-link", () => setIsActive(false));

  // Body class toggle based on menu state
  useEffect(() => {
    const rootElement = document.querySelector("body");
    if (rootElement) {
      rootElement.classList.toggle("menu-active", isActive);
    }
    return () => {
      if (rootElement) {
        rootElement.classList.remove("menu-active");
      }
    };
  }, [isActive]);

  // Use ref-based hooks with GSAP scope
  // Disable magnetic effect for the outer burger button by using plain refs
  // instead of the magnetic hooks. Keep the button-fill hook so the visual
  // fill effect remains.
  const magnetButtonRef = useRef(null);
  const buttonFillRef = useButtonFillEffectWithRef();
  const burgerRef = useRef(null);
  const scrollButtonRef = useButtonScrollScale(
    "#smooth-content", // trigger element that scrolls
    "top 0%", // start when trigger's top hits 20% of viewport
    "+=400", // end when trigger's top hits 50% of viewport
    ".button.burger-btn", // target selector to animate
    false, // markers
    true // scrub - links scale to scroll position
  );

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
      setIsActive(false);
    }
  };

  return (
    <>
      <div className="menu-overlay"></div>
      <div className="menu-wrapper">
        <div
          ref={(el) => {
            magnetButtonRef.current = el;
            buttonFillRef.current = el;
            scrollButtonRef.current = el;
          }}
          className={`button burger-btn ${isActive ? "burger-active" : ""}`}
          onClick={() => setIsActive(!isActive)}
        >
          <div className="button-fill"></div>
          <div
            ref={burgerRef}
            className={`burger ${isActive ? "active" : "not-active"}`}
          >
            <div className="burger-line line01"></div>
            <div className="burger-line line02"></div>
            <div className="burger-line line03"></div>
          </div>
        </div>

        <div className="menu-body" ref={menuRef}>
          <svg className="svgCurve">
            <path ref={pathRef}></path>
          </svg>
          <div className="menu-inner">
            <div className="nav" ref={navContainerRef}>
              {(menuItems || []).map((item) => (
                <div key={item.id} className="nav-item">
                  <NavLink
                    to={item.path}
                    className="nav-link"
                    onClick={(e) => handleNavClick(e, item.path)}
                  >
                    {item.title}
                  </NavLink>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
