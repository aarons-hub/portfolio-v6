import React, { useRef, useEffect } from "react";
import { animateScroll as scroll } from "react-scroll";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const UpArrow = () => {
  const arrowWrapperRef = useRef(null);
  const arrowRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          arrowRef.current,
          {
            y: 20,
            autoAlpha: 0,
          },
          {
            y: 0,
            autoAlpha: 1,
            scrollTrigger: {
              trigger: arrowWrapperRef.current,
              start: "top 50%",
              end: "+=100px",
              scrub: 1,
              markers: false,
            },
          }
        );
      }, arrowWrapperRef);

      return () => ctx.revert();
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const scrollToTop = () => {
    scroll.scrollToTop({
      duration: 500,
      smooth: "easeOutQuart",
    });
  };

  return (
    <div
      className="d-flex justify-content-center py-5 up-btn-wrapper"
      ref={arrowWrapperRef}
    >
      <button
        ref={arrowRef}
        onClick={scrollToTop}
        className="btn btn-secondary rounded-pill py-3 px-4 up-btn"
        alt="Go to top"
      >
        <svg
          width="9"
          height="14"
          viewBox="0 0 9 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.5 14C4.22386 14 4 13.7761 4 13.5L4 1.70711L0.853553 4.85355C0.658291 5.04882 0.341708 5.04882 0.146446 4.85355C-0.0488166 4.65829 -0.0488166 4.34171 0.146446 4.14645L4.14645 0.146446C4.34171 -0.0488155 4.65829 -0.0488155 4.85355 0.146446L8.85355 4.14645C9.04882 4.34171 9.04882 4.65829 8.85355 4.85355C8.65829 5.04882 8.34171 5.04882 8.14645 4.85355L5 1.70711L5 13.5C5 13.7761 4.77614 14 4.5 14Z"
            fill="#fff"
          />
        </svg>

        <span className="ps-2">Back to top</span>
      </button>
    </div>
  );
};
