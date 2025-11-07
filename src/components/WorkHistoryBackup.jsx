import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
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
          .sort((a, b) => Number(a.id || 0) - Number(b.id || 0))
          useEffect(() => {
            const resume_URI = `${import.meta.env.BASE_URL}data/resume.json`;
  
            const fetchResume = async () => {
              try {
                const res = await fetch(resume_URI);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  
                const data = await res.json();
                const processed = data
                  .sort((a, b) => Number(a.id || 0) - Number(b.id || 0))
                  .map((item) => ({
                    id: item.id,
                    date: item.date,
                    company: Array.isArray(item.company) ? item.company.join(" - ") : item.company,
                    title: item.title,
                    content: item.content,
                    url: item.url,
                  }));
  
                // console.log("Processed resume data:", processed);
  
                setResumesdata(processed);
              } catch (err) {
                console.error("Error fetching history:", err);
              }
            };
  
            fetchResume();
          }, []);
              // spacer
              tlWork.to({}, { duration: 1 });

              // exit tweens (only if entry targets existed or exit targets exist)
              if (inTargets.length) {
                tlWork.to(inTargets, { y: -96 });
              }

              if (colTargets.length) {
                tlWork.to(colTargets, { y: -400, autoAlpha: 0 }, "<");
              }

              if (titleTargets.length) {
                tlWork.to(titleTargets, { y: 50, autoAlpha: 0 }, "<");
              }
            };

            // add steps for items 1..4 (guarded)
            [1, 2, 3, 4].forEach((n) => addStep({ id: n }));
          ".work-history-item.item-3 .col.right",
          { y: 400, autoAlpha: 0 },
          "<"
        )
        .from(".work-history-item.item-3 .title", { y: 50, autoAlpha: 0 }, "<")
        .to({}, { duration: 1 })
        .to(
          [
            ".work-history-item.item-3 .duration .char-mask .char3",
            ".work-history-item.item-3 .duration .char-mask .char4",
            ".work-history-item.item-3 .duration .char-mask .char8",
            ".work-history-item.item-3 .duration .char-mask .char9",
          ],
          { y: -96 }
        )
        .to(
          ".work-history-item.item-3 .col.right",
          { y: -400, autoAlpha: 0 },
          "<"
        )
        .to(".work-history-item.item-3 .title", { y: 50, autoAlpha: 0 }, "<")

        ////////////////////////////////

        .from(
          [
            ".work-history-item.item-4 .duration .char-mask .char3",
            ".work-history-item.item-4 .duration .char-mask .char4",
            ".work-history-item.item-4 .duration .char-mask .char8",
            ".work-history-item.item-4 .duration .char-mask .char9",
          ],
          { y: 96 },
          "<"
        )
        .from(
          ".work-history-item.item-4 .col.right",
          { y: 400, autoAlpha: 0 },
          "<"
        )
        .from(".work-history-item.item-4 .title", { y: 50, autoAlpha: 0 }, "<")
        .to({}, { duration: 1 })
        .to(
          [
            ".work-history-item.item-4 .duration .char-mask .char3",
            ".work-history-item.item-4 .duration .char-mask .char4",
            ".work-history-item.item-4 .duration .char-mask .char8",
            ".work-history-item.item-4 .duration .char-mask .char9",
          ],
          { y: -96 }
        )
        .to(
          ".work-history-item.item-4 .col.right",
          { y: -400, autoAlpha: 0 },
          "<"
        )
        .to(".work-history-item.item-4 .title", { y: 50, autoAlpha: 0 }, "<")

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
                  .sort((a, b) => Number(a.id || 0) - Number(b.id || 0))
                  .map((item) => ({
                    id: item.id,
                    date: item.date,
                    company: Array.isArray(item.company) ? item.company.join(" - ") : item.company,
                    title: item.title,
                    content: item.content,
                    url: item.url,
                  }));

                // console.log("Processed resume data:", processed);

                setResumesdata(processed);
              } catch (err) {
                console.error("Error fetching history:", err);
              }
            };

            fetchResume();
          }, []);

          // Split the .duration texts into chars (keeps markup consistent for manual tweens)
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

          // Pin the work history and sequence manual selector-based animations
          // Use guarded additions so GSAP only animates elements that actually exist.
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

              const addStepForId = (id) => {
                const inSelectors = [
                  `.work-history-item.item-${id} .duration .char-mask .char3`,
                  `.work-history-item.item-${id} .duration .char-mask .char4`,
                  `.work-history-item.item-${id} .duration .char-mask .char8`,
                  `.work-history-item.item-${id} .duration .char-mask .char9`,
                ];

                const inTargets = gsap.utils.toArray(inSelectors.join(","));
                if (inTargets.length) {
                  tlWork.from(inTargets, { y: 96 }, "<");
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

                // spacer
                tlWork.to({}, { duration: 1 });

                // exit tweens
                if (inTargets.length) {
                  tlWork.to(inTargets, { y: -96 });
                }

                if (colTargets.length) {
                  tlWork.to(colTargets, { y: -400, autoAlpha: 0 }, "<");
                }

                if (titleTargets.length) {
                  tlWork.to(titleTargets, { y: 50, autoAlpha: 0 }, "<");
                }
              };

              // Add a step for each resume item by ID (guards prevent warnings)
              resumedata.forEach((item) => addStepForId(item.id));
            }, listRef);

            return () => ctx.revert();
          }, [resumedata]);

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
              </div>
            </section>
          );
        };
