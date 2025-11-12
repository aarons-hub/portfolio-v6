import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

import usePreloadImages from "../hooks/usePreloadImages";

export const HomePageImages = () => {
  const imagesWrapperRef = useRef();
  const imagesWrapperRef2 = useRef();

  // Preload the home hero images early and add rel=preload hints for capable browsers
  usePreloadImages(
    [
      `${import.meta.env.BASE_URL}images/portfolio/images/DSC1862.jpg`,
      `${import.meta.env.BASE_URL}images/portfolio/images/DSCF0252.jpg`,
      `${import.meta.env.BASE_URL}images/hydromet-hero.jpg`,
      `${import.meta.env.BASE_URL}images/portfolio/images/CFA-Cat-2007-01.jpg`,
      `${import.meta.env.BASE_URL}images/portfolio/images/new-ansa-logo.jpg`,
    ],
    { preloadLink: true }
  );

  // Apply new ScrollTrigger: pin only the container and animate children sequentially
  useLayoutEffect(() => {
    const container = document.querySelector(".home-image-cards");
    if (!container) return;

    const ctx2 = gsap.context(() => {
      const tl2 = gsap.timeline({
        defaults: { ease: "power4.inOut" },
        scrollTrigger: {
          trigger: container,
          start: "top 0%",
          end: "+=500", // scene covering multiple animations
          pin: false, // pin the container
          scrub: true,
          markers: false,
        },
      });

      tl2.to(".home-image-cards .image01", {
        xPercent: -500,
      });
      tl2.to(
        ".home-image-cards .image05",
        {
          xPercent: 500,
        },
        "<"
      );
      tl2.to(
        ".home-image-cards .image02",
        {
          xPercent: -500,
        },
        "<0.3"
      );
      tl2.to(
        ".home-image-cards .image04",
        {
          xPercent: 500,
        },
        "<"
      );
      tl2.to(
        ".home-image-cards .image03",
        {
          yPercent: 0,
          autoAlpha: 0,
        },
        "<0.2"
      );
    });
    return () => ctx2.revert();
  }, []);

  // Apply ScrollTrigger: pin only the container and animate children sequentially
  useLayoutEffect(() => {
    const container = document.querySelector(".home-images-container");
    if (!container) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.inOut" },
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

  return (
    <>
      <div className="home-image-cards" ref={imagesWrapperRef}>
        <div className="card-image image01" data-lag="2">
          <img
            src={`${
              import.meta.env.BASE_URL
            }images/portfolio/images/DSC1862.jpg`}
            alt="Decoration"
            loading="eager"
            className="thumb"
            decoding="async"
          />
        </div>
        <div className="card-image image02" data-lag="3">
          <img
            src={`${
              import.meta.env.BASE_URL
            }images/portfolio/images/CFA-Cat-2007-01.jpg`}
            alt="Decoration"
            loading="eager"
            className="thumb"
            decoding="async"
          />
        </div>
        <div className="card-image image03" data-lag="1">
          <img
            src={`${import.meta.env.BASE_URL}images/hydromet-hero.jpg`}
            alt="Decoration"
            loading="eager"
            className="thumb"
            decoding="async"
          />
        </div>
        <div className="card-image image04" data-lag="4">
          <img
            src={`${
              import.meta.env.BASE_URL
            }images/portfolio/images/DSCF0252.jpg`}
            alt="Decoration"
            loading="eager"
            className="thumb"
            decoding="async"
          />
        </div>
        <div className="card-image image05" data-lag="2.6">
          <img
            src={`${
              import.meta.env.BASE_URL
            }images/portfolio/images/new-ansa-logo.jpg`}
            alt="Decoration"
            loading="eager"
            className="thumb"
            decoding="async"
          />
        </div>
      </div>

      <div className="home-images-container" ref={imagesWrapperRef2}>
        <div className="images-wrapper">
          <div className="image-container image01">
            <div className="image">
              <img
                src={`${
                  import.meta.env.BASE_URL
                }images/portfolio/images/DSC1862.jpg`}
                alt="Decoration"
                loading="eager"
                className="thumb"
                decoding="async"
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
                loading="eager"
                className="thumb"
                decoding="async"
              />
            </div>
            <h2 className="fw-normal image-title">PHOTO5HOP</h2>
          </div>

          <div className="image-container image03">
            <div className="image">
              <img
                src={`${import.meta.env.BASE_URL}images/hydromet-hero.jpg`}
                alt="Decoration"
                loading="eager"
                className="thumb"
                decoding="async"
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
                loading="eager"
                className="thumb"
                decoding="async"
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
                loading="eager"
                className="thumb"
                decoding="async"
              />
            </div>
            <h2 className="fw-normal image-title">GR4PHIC DES1GN</h2>
          </div>
        </div>
      </div>
    </>
  );
};
