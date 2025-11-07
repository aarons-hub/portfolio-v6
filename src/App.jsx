import "bootstrap/dist/css/bootstrap.min.css";
import "./custom.scss";
import { useLayoutEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { Header } from "./components/Header";
import { Home } from "./components/Home";
import { About } from "./components/About";
import { WorkHistory } from "./components/WorkHistory";
import { Skills } from "./components/Skills";
import { Portfolio } from "./components/portfolio.jsx";
import { PortfolioDetailsPage } from "./components/PortfolioDetailsPage";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { NavBurger } from "./components/NavBurger";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// Quick toggle for ScrollSmoother during development:
// - Option: toggle this boolean for quick on/off in dev
const ENABLE_SMOOTHER = true; // set to false to disable ScrollSmoother

function App() {
  useLayoutEffect(() => {
    if (!ENABLE_SMOOTHER) return; // easily disable smoother

    // Create ScrollSmoother instance
    const smoother = ScrollSmoother.create({
      smooth: 2, // seconds it takes to "catch up" to native scroll position
      effects: true, // look for data-speed and data-lag attributes on elements
      smoothTouch: 0.1, // enable smooth scrolling on touch devices
    });

    return () => {
      smoother.kill();
    };
  }, []);

  return (
    <>
      <HashRouter>
        <div className="sticky-images-container"></div>
        <div className="sticky-cursor">View</div>
        <div className="sticky-cursor scroll-down">Scroll down</div>
        <NavBurger />
        <div id="smooth-wrapper">
          <div id="smooth-content">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/workhistory" element={<WorkHistory />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/portfolio/:id" element={<PortfolioDetailsPage />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
            <Footer />
          </div>
        </div>
      </HashRouter>
    </>
  );
}

export default App;
