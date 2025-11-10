import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useImageCursor } from "./custom";
import { ScrollSmoother } from "gsap/ScrollSmoother";
gsap.registerPlugin(ScrollTrigger, SplitText);

export const Skills = () => {
  const [skillsdata, setSkillsdata] = useState([]);

  useEffect(() => {
    const SKILLS_URI = `${import.meta.env.BASE_URL}data/skills.json`;

    const fetchSkills = async () => {
      try {
        const res = await fetch(SKILLS_URI);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        const processed = data.map((item) => ({
          ...item,
          image: `${import.meta.env.BASE_URL}${item.image.replace(/^\/+/, "")}`,
        }));

        setSkillsdata(processed);
      } catch (err) {
        console.error("Error fetching skills:", err);
      }
    };

    fetchSkills();
  }, []);

  // Image cursor effect
  useImageCursor(
    ".image-cursor", // image selector (defaults already match)
    ".image-cursor-container", // trigger selector (defaults already match)
    7, // lag
    200, // small init delay to allow DOM paint
    true, // isActive
    [skillsdata.length] // re-init when data count changes
  );

  // ScrollSmoother effects via CSS selector method (no data-* attributes)
  useEffect(() => {
    const smoother = ScrollSmoother.get();
    if (!smoother) return;

    smoother.effects(".intro h1", { lag: 0.5 });
  }, []);

  // Adding a body class
  useEffect(() => {
    document.body.classList.add("skillspage");
    return () => {
      document.body.classList.remove("skillspage");
    };
  }, []);

  return (
    <section id="skills" className="skills-section">
      <div className="container skills">
        <div className="intro text-center">
          <h1 className="fw-normal">SK/11S</h1>
        </div>

        <div className="skills-items">
          {skillsdata.map((item) => (
            <div
              className="skill-item-container image-cursor-container sticky-cursor-container"
              id={`skill-${item.id}`}
              key={item.id}
            >
              <div className="skill-image image-cursor">
                <img
                  className="img-fluid"
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                />
              </div>
              <div className="d-flex skill-content">
                <div className="me-4 skill-number">
                  <h6>0{item.id}.</h6>
                </div>
                <div className="me-4 skill-title">
                  <h6 className="title">{item.title}</h6>
                </div>
                <div className="me-4 skill-description">
                  <p>{item.description}</p>
                </div>
                <div className="skill-percentage">
                  <p>{item.percentage}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
