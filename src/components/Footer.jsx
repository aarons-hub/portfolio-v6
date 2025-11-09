import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useScrollAnimation } from "./custom";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import {
  useMagneticEffectForChildren,
  useButtonFillEffectForChildren,
} from "./custom";

export const Footer = () => {
  const form = useRef();
  const [done, setDone] = useState(false);
  const location = useLocation();

  // Magnetic and fill effects for view selection buttons
  const footerBtnRefs = useMagneticEffectForChildren(
    "button.magnetic",
    50,
    false
  );
  const footerBtnTextRefs = useMagneticEffectForChildren(
    ".btn-text",
    50,
    false
  );
  const footerBtnFillRef = useButtonFillEffectForChildren("button.magnetic");

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("service_g21pr8h", "template_4m4a8ys", form.current, {
        publicKey: "WEnSV56Aows6oYiBB",
      })
      .then(
        () => {
          console.log("SUCCESS!");
          setDone(true);
          toast.success("Message sent successfully!");
          form.current.reset();

          setTimeout(() => setDone(false), 5000);
        },
        (error) => {
          console.log("FAILED...", error.text);
          toast.error("Failed to send message. Try again later.");
        }
      );
  };

  const footerCalloutRef = useScrollAnimation(
    { x: -400 }, // from
    { x: 0 }, // to
    ".footer", // trigger
    "top 80%", // start
    "bottom  0%", // end
    "play none none reverse", // toggleActions
    false, // markers
    "power4.out", // ease
    1, // duration
    true // scrub
  );

  const footerInnerRef = useScrollAnimation(
    { y: -400 },
    { y: 0 },
    ".footer-inner",
    "top 80%",
    "bottom  0%",
    "play none none reverse",
    false, // markers
    "power4.out",
    1, // duration
    true // scrub
  );

  // Go to top handler using ScrollSmoother with graceful fallback
  const handleGoToTop = (e) => {
    e.preventDefault();
    const smoother = ScrollSmoother?.get?.();
    if (smoother) {
      smoother.scrollTo(0, true);
    } else if (
      typeof window !== "undefined" &&
      typeof window.scrollTo === "function"
    ) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Refresh ScrollTrigger on route change
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <footer id="footer">
        <div className="footer container-fluid p-0 custom-footer">
          <div
            className="footer-inner"
            ref={(el) => {
              if (footerInnerRef) footerInnerRef.current = el;
              if (footerBtnRefs) footerBtnRefs.current = el;
              if (footerBtnTextRefs) footerBtnTextRefs.current = el;
              if (footerBtnFillRef) footerBtnFillRef.current = el;
            }}
          >
            <div className="container">
              <h2 className="fw-normal">
                <div className="contact-text">
                  <img
                    src={`${
                      import.meta.env.BASE_URL
                    }images/profile-picture.png`}
                    alt="Profile"
                    className="img-fluid profile-picture"
                  />
                  I'd love to hear
                </div>
                <div className="contact-text"> your thoughts.</div>
              </h2>
            </div>
            <div className="container d-flex align-items-center justify-content-center position-relative custom-pill">
              <div className="footer-line"></div>
              <div
                className="d-flex align-items-center justify-content-center rounded-pill p-4 footer-callout"
                ref={footerCalloutRef}
              >
                <span className="fw-normal callout-text">Contact me</span>
              </div>
            </div>

            <div className="container d-flex align-items-center custom-details">
              <button className="btn btn-primary rounded-pill py-4 px-5 me-4 footer-email-btn magnetic">
                <span className="btn-text magnetic">
                  <a
                    href="mailto:aaron.leigh.sanders@gmail.com"
                    title="aaron.leigh.sanders@gmail.com"
                  >
                    aaron.leigh.sanders@gmail.com
                  </a>
                </span>
                <div className="button-fill"></div>
              </button>
              <button className="btn btn-primary rounded-pill py-4 px-5 footer-phone-btn magnetic">
                <span className="btn-text magnetic">
                  <a href="tel:0424 854 390">0424 854 390</a>
                </span>
                <div className="button-fill"></div>
              </button>
            </div>

            <div className="container p-5 position-relative contact">
              <h2 className="display-1 fw-normal text-uppercase pb-4 custom">
                C0N7ACT
              </h2>
              <div className="form-wrapper py-3">
                <form ref={form} onSubmit={sendEmail}>
                  <div className="row form-inner">
                    <div className="col d-flex flex-column left">
                      <label htmlFor="inputName" className="form-label">
                        What's' your full name
                      </label>
                      <input
                        type="text"
                        name="from_name"
                        className="form-control mb-5 p-3"
                        id="inputName"
                      />

                      <label htmlFor="inputEmail" className="form-label">
                        What's your email
                      </label>
                      <input
                        type="email"
                        name="from_email"
                        className="form-control mb-5 p-3"
                        id="inputEmail"
                      />
                    </div>
                    <div className="col d-flex flex-column right">
                      <label htmlFor="inputSubject" className="form-label">
                        Your subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        className="form-control mb-5 p-3"
                        id="inputSubject"
                      />
                      <label htmlFor="inputMessage" className="form-label">
                        Your message
                      </label>
                      <textarea
                        type="text"
                        name="message"
                        className="form-control mb-5 p-3 message align-self-stretch"
                        id="inputMessage"
                      />
                    </div>
                  </div>
                  <div className="row send-row">
                    <div className="col left-col"></div>
                    <div className="col send-btn">
                      <button
                        type="submit"
                        className="btn btn-primary rounded-pill mt-4 py-4 px-5 contact-btn magnetic"
                        disabled={done}
                      >
                        <span className="fw-medium btn-text magnetic">
                          {done ? "Sent" : "Send your message"}
                        </span>
                        <div className="button-fill"></div>
                      </button>
                    </div>
                  </div>
                  <ToastContainer position="bottom-right" autoClose={3000} />
                </form>
              </div>
            </div>
            <div className="d-flex justify-content-center container top">
              <button
                type="button"
                onClick={handleGoToTop}
                className="btn btn-primary rounded-pill py-4 px-5 go-to-top-btn magnetic"
              >
                <span className="btn-text magnetic">Go to top</span>
                <div className="button-fill"></div>
              </button>
            </div>
          </div>
          <div className="footer-shadow"></div>
        </div>
      </footer>
    </>
  );
};
