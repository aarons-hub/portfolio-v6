import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import {
  useMagneticEffectForChildren,
  useButtonFillEffectForChildren,
  useStickyCursor,
} from "./custom";
gsap.registerPlugin(ScrollTrigger);

export const Home = () => {
  const imagesWrapperRef2 = useRef();

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

  // Apply ScrollTrigger: pin only the container and animate children sequentially
  useLayoutEffect(() => {
    const container = document.querySelector(".home-images-container");
    if (!container) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=8000", // long scene covering multiple animations
          pin: true, // pin the container
          scrub: true,
          markers: false,
        },
      });

      tl.from(".home-images-container .image01 .image", {
        x: 0,
        autoAlpha: 0,
        scale: 10,
      });
      tl.from(
        ".home-images-container .image01 .image-title",
        {
          autoAlpha: 0,
          scale: 10,
        },
        ">"
      );

      tl.to(".home-images-container .image01 .image", {
        autoAlpha: 0,
      });
      tl.to(
        ".home-images-container .image01 .image-title",
        {
          autoAlpha: 0,
        },
        ">"
      );

      tl.from(".home-images-container .image02 .image", {
        x: 0,
        autoAlpha: 0,
        scale: 10,
      });
      tl.from(
        ".home-images-container .image02 .image-title",
        {
          autoAlpha: 0,
          scale: 10,
        },
        ">"
      );

      tl.to(".home-images-container .image02 .image", {
        autoAlpha: 0,
      });
      tl.to(
        ".home-images-container .image02 .image-title",
        {
          autoAlpha: 0,
        },
        ">"
      );

      tl.from(".home-images-container .image03 .image", {
        x: 0,
        autoAlpha: 0,
        scale: 10,
      });
      tl.from(
        ".home-images-container .image03 .image-title",
        {
          autoAlpha: 0,
          scale: 10,
        },
        ">"
      );

      tl.to(".home-images-container .image03 .image", {
        autoAlpha: 0,
      });
      tl.to(
        ".home-images-container .image03 .image-title",
        {
          autoAlpha: 0,
        },
        ">"
      );

      tl.from(".home-images-container .image04 .image", {
        x: 0,
        autoAlpha: 0,
        scale: 10,
      });
      tl.from(
        ".home-images-container .image04 .image-title",
        {
          autoAlpha: 0,
          scale: 10,
        },
        ">"
      );

      tl.to(".home-images-container .image04 .image", {
        autoAlpha: 0,
      });
      tl.to(
        ".home-images-container .image04 .image-title",
        {
          autoAlpha: 0,
        },
        ">"
      );

      tl.from(".home-images-container .image05 .image", {
        x: 0,
        autoAlpha: 0,
        scale: 10,
      });
      tl.from(
        ".home-images-container .image05 .image-title",
        {
          autoAlpha: 0,
          scale: 10,
        },
        ">"
      );

      tl.to(".home-images-container .image05 .image", {
        autoAlpha: 0,
      });
      tl.to(
        ".home-images-container .image05 .image-title",
        {
          autoAlpha: 0,
        },
        ">"
      );
    });

    return () => ctx.revert();
  }, []);

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
    1000,
    []
  );

  return (
    <section id="home">
      <div className="container home">
        <div className="intro text-center">
          <h1 className="display-1 fw-normal">WE1COME</h1>
          <p className="lead mt-4">
            I'm a web developer and designer passionate about creating
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
            <div className="rounded-pill py-4 px-5 pill">
              <div className="scroll-icon-wrapper">
                <div className="icon"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="home-images-container" ref={imagesWrapperRef2}>
        <div className="images-wrapper">
          <div className="image-container image01">
            <div className="image">
              <img
                src={`${
                  import.meta.env.BASE_URL
                }images/portfolio/images/DSC_1862.jpg`}
                alt="Decoration"
                loading="lazy"
                className="thumb"
              />
            </div>
            <h2 className="fw-normal image-title">PH0TOGR4PHY</h2>
          </div>

          <div className="image-container image02">
            <div className="image">
              <img
                src={`${
                  import.meta.env.BASE_URL
                }images/portfolio/images/DSCF0252.jpg`}
                alt="Decoration"
                loading="lazy"
                className="thumb"
              />
            </div>
            <h2 className="fw-normal image-title">PHOTO5HOP</h2>
          </div>

          <div className="image-container image03">
            <div className="image">
              <img
                src={`${import.meta.env.BASE_URL}images/hydromet-hero.jpg`}
                alt="Decoration"
                loading="lazy"
                className="thumb"
              />
            </div>
            <h2 className="fw-normal image-title">FRON7-END W3B</h2>
          </div>

          <div className="image-container image04">
            <div className="image">
              <img
                src={`${
                  import.meta.env.BASE_URL
                }images/portfolio/images/CFA-Cat-2007-01.jpg`}
                alt="Decoration"
                loading="lazy"
                className="thumb"
              />
            </div>
            <h2 className="fw-normal image-title">PUBL1SHING</h2>
          </div>

          <div className="image-container image05">
            <div className="image">
              <img
                src={`${
                  import.meta.env.BASE_URL
                }images/portfolio/images/new-ansa-logo.jpg`}
                alt="Decoration"
                loading="lazy"
                className="thumb"
              />
            </div>
            <h2 className="fw-normal image-title">GR4PHIC DES1GN</h2>
          </div>
        </div>
      </div>
    </section>
  );
};
