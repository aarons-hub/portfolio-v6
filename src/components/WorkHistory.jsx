import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrollSmoother } from "gsap/ScrollSmoother";
gsap.registerPlugin(ScrollTrigger, SplitText);

export const WorkHistory = () => {
  const [resumedata, setResumesdata] = useState([]);
  const listRef = useRef(null);

  useEffect(() => {
    const resume_URI = `${import.meta.env.BASE_URL}data/resume.json`;

    const fetchResume = async () => {
      try {
        const res = await fetch(resume_URI);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        const processed = data
          .sort((b, a) => Number(a.id || 0) - Number(b.id || 0))
          .map((item) => ({
            id: item.id,
            date: item.date,
            company: Array.isArray(item.company)
              ? item.company.join(" - ")
              : item.company,
            title: item.title,
            content: item.content,
            url: item.url,
          }));

        setResumesdata(processed);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };

    fetchResume();
  }, []);

  useLayoutEffect(() => {
    if (!listRef.current) return;

    const durations = listRef.current.querySelectorAll(".duration");
    const splits = [];

    durations.forEach((el) => {
      const split = new SplitText(el, {
        type: "chars",
        charsClass: "char++",
        mask: "chars",
      });
      splits.push(split);
    });

    return () => {
      splits.forEach((s) => s.revert());
    };
  }, [resumedata.length]);

  useLayoutEffect(() => {
    if (!listRef.current) return;

    const ctx = gsap.context(() => {
      const tlWork = gsap.timeline({
        scrollTrigger: {
          trigger: listRef.current,
          start: "top 25%",
          end: "+=2000",
          pin: true,
          scrub: 1,
          markers: false,
          pinSpacing: true,
        },
      });

      // timeline scrub indicator: animate left->right as user scrolls through tlWork
      const timelineEl = listRef.current.querySelector(
        ".timeline-progress-bar"
      );
      if (timelineEl) {
        gsap.set(timelineEl, { transformOrigin: "left center" });
        gsap.fromTo(
          timelineEl,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: listRef.current,
              start: "top 25%",
              end: "+=2000",
              scrub: true,
              markers: false,
            },
          }
        );
      }

      const addStepForId = (id) => {
        const inSelectors = [
          `.work-history-item.item-${id} .duration .char-mask .char3`,
          `.work-history-item.item-${id} .duration .char-mask .char4`,
          `.work-history-item.item-${id} .duration .char-mask .char8`,
          `.work-history-item.item-${id} .duration .char-mask .char9`,
        ];
        const inSelectors2 = [
          `.work-history-item.item-${id} .duration .char-mask .char1`,
          `.work-history-item.item-${id} .duration .char-mask .char2`,
          `.work-history-item.item-${id} .duration .char-mask .char6`,
          `.work-history-item.item-${id} .duration .char-mask .char7`,
        ];

        const inSelectorsHyphen = [
          `.work-history-item.item-${id} .duration .char-mask .char5`,
        ];

        const inTargetsHyphen = gsap.utils.toArray(inSelectorsHyphen.join(","));

        if (inTargetsHyphen.length) {
          tlWork.from(inTargetsHyphen, { autoAlpha: 0 }, "<");
        }

        const inTargets2 = gsap.utils.toArray(inSelectors2.join(","));

        if (inTargets2.length) {
          tlWork.from(inTargets2, { y: 96 }, "<");
        }

        const inTargets = gsap.utils.toArray(inSelectors.join(","));

        if (inTargets.length) {
          tlWork.from(inTargets, { y: 96 }, ">");
        }

        const colSelector = `.work-history-item.item-${id} .col.right`;

        const colTargets = gsap.utils.toArray(colSelector);
        if (colTargets.length) {
          tlWork.from(colTargets, { y: 400, autoAlpha: 0 }, "<");
        }

        const titleSelector = `.work-history-item.item-${id} .title`;
        const titleTargets = gsap.utils.toArray(titleSelector);
        if (titleTargets.length) {
          tlWork.from(titleTargets, { y: 50, autoAlpha: 0 }, "<");
        }

        tlWork.to(".timeline-progress", { scaleX: 0.5 }, "<");

        tlWork.to({}, { duration: 1 });

        if (inTargetsHyphen.length) {
          tlWork.to(inTargetsHyphen, { autoAlpha: 0 });
        }

        if (inTargets2.length) {
          tlWork.to(inTargets2, { y: -96 });
        }

        if (inTargets.length) {
          tlWork.to(inTargets, { y: -96 }, "<");
        }

        if (colTargets.length) {
          tlWork.to(colTargets, { y: -400, autoAlpha: 0 }, "<");
        }

        if (titleTargets.length) {
          tlWork.to(titleTargets, { y: 50, autoAlpha: 0 }, "<");
        }
      };

      resumedata.forEach((item) => addStepForId(item.id));
    }, listRef);

    return () => ctx.revert();
  }, [resumedata]);

  // ScrollSmoother effects via CSS selector method (no data-* attributes)
  useEffect(() => {
    const smoother = ScrollSmoother.get();
    if (!smoother) return;

    smoother.effects(".intro h1", { lag: 0.5 });
  }, []);

  return (
    <section id="work-history">
      <div className="container work-history">
        <div className="intro text-center">
          <h1 className="fw-normal">W0RK H/S7ORY</h1>
        </div>
      </div>

      <div className="container work-history-items" ref={listRef}>
        {resumedata.map((item) => (
          <div
            className={`work-history-item item-${item.id}`}
            data-id={item.id}
            key={item.id}
          >
            <div className="d-flex work-history-item-content">
              <div className="col left">
                <h2 className="duration">{item.date}</h2>
                <h5 className="title">{item.title}</h5>
              </div>
              <div className="col right">
                <h5 className="company">{item.company}</h5>
                <ul className="description">
                  {item.content.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}

        <div className="timeline-container">
          <div className="timeline-progress-bar"></div>
        </div>
      </div>
    </section>
  );
};
