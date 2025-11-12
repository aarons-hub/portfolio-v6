import React, { useLayoutEffect, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import {
  useMagneticEffectForChildren,
  useButtonFillEffectForChildren,
  useStickyCursor,
} from "../hooks/custom";
import { HomePageImages } from "./HomePageImages";

gsap.registerPlugin(ScrollTrigger);

export const Home = () => {
  // Magnetic and fill effects for CTA buttons
  const homeBtnRefs = useMagneticEffectForChildren(
    "button.magnetic",
    50,
    false
  );
  const homeBtnTextRefs = useMagneticEffectForChildren(".btn-text", 50, false);
  const homeBtnFillRef = useButtonFillEffectForChildren("button.magnetic");

  const handleGetInTouch = (e) => {
    e.preventDefault();
    const smoother = ScrollSmoother.get();
    if (smoother) {
      smoother.scrollTo("#footer", true, "top top");
    } else {
      document
        .querySelector("#footer")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Infinite vertical animation for scroll-down pill
  useLayoutEffect(() => {
    const pill = document.querySelector(
      ".scroll-down-cta .pill .scroll-icon-wrapper .icon"
    );
    if (!pill) return;

    const ctx = gsap.context(() => {
      gsap.to(pill, {
        y: 30,
        duration: 1,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
      });
    });

    return () => ctx.revert();
  }, []);

  // Sticky cursor effect
  useStickyCursor(
    ".sticky-cursor.scroll-down",
    ".container.home .scroll-down-cta .pill",
    5,
    500,
    []
  );

  // Adding a body class
  useEffect(() => {
    document.body.classList.add("homepage");
    return () => {
      document.body.classList.remove("homepage");
    };
  }, []);

  return (
    <section id="home">
      <div className="container home">
        <div className="intro text-center">
          <h1 className="display-1 fw-normal">WE1COME</h1>
          <p className="lead mt-4">
            I'm a digital specialist and designer passionate about creating
            functional digital experiences.
          </p>

          <div
            className="cta-buttons d-flex justify-content-center gap-4 mt-5"
            ref={(el) => {
              if (homeBtnRefs) homeBtnRefs.current = el;
              if (homeBtnTextRefs) homeBtnTextRefs.current = el;
              if (homeBtnFillRef) homeBtnFillRef.current = el;
            }}
          >
            <Link className="mx-auto" to="/portfolio">
              <button className="btn btn-primary rounded-pill py-4 px-5 mx-auto magnetic">
                <span className="btn-text magnetic">View my work</span>
                <div className="button-fill"></div>
              </button>
            </Link>
            <button
              type="button"
              onClick={handleGetInTouch}
              className="btn btn-primary rounded-pill py-4 px-5 mx-auto magnetic"
            >
              <span className="btn-text magnetic">Get in touch</span>
              <div className="button-fill"></div>
            </button>
          </div>
          <div className="down-button scroll-down-cta">
            <span className="home-scroll-text">Scroll down</span>
            <div className="rounded-pill py-4 px-5 pill">
              <div className="scroll-icon-wrapper">
                <div className="icon"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <HomePageImages />
    </section>
  );
};
