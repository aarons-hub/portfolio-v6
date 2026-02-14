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

  // ScrollSmoother effects via CSS selector method (no data-* attributes)
  useEffect(() => {
    const smoother = ScrollSmoother.get();
    if (!smoother) return;

    smoother.effects(".intro h1", { lag: 0.5 });
  }, []);

  // Adding a body class
  useEffect(() => {
    document.body.classList.add("workhistorypage");
    return () => {
      document.body.classList.remove("workhistorypage");
    };
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
      </div>
    </section>
  );
};
