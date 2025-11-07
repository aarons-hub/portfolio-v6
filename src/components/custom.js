import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

// Ref-based magnetic effect using GSAP scope
export const useMagneticEffectWithRef = (strength = 50) => {
  const magnetRef = useRef(null);

  useGSAP(
    () => {
      const magnet = magnetRef.current;
      if (!magnet) return;

      const moveMagnet = (event) => {
        const bounding = magnet.getBoundingClientRect();

        gsap.to(magnet, {
          duration: 1,
          x:
            ((event.clientX - bounding.left) / magnet.offsetWidth - 0.5) *
            strength,
          y:
            ((event.clientY - bounding.top) / magnet.offsetHeight - 0.5) *
            strength,
          ease: "power4.out",
        });
      };

      const resetMagnet = () => {
        gsap.to(magnet, {
          duration: 1,
          x: 0,
          y: 0,
          ease: "power4.out",
        });
      };

      magnet.addEventListener("mousemove", moveMagnet);
      magnet.addEventListener("mouseout", resetMagnet);

      // Cleanup handled by useGSAP
      return () => {
        magnet.removeEventListener("mousemove", moveMagnet);
        magnet.removeEventListener("mouseout", resetMagnet);
      };
    },
    { scope: magnetRef, dependencies: [strength] }
  );

  return magnetRef;
};

// Ref-based button fill effect using GSAP scope
export const useButtonFillEffectWithRef = () => {
  const buttonRef = useRef(null);

  useGSAP(
    () => {
      const button = buttonRef.current;
      if (!button) return;

      const handleMouseEnter = () => {
        const fill = button.querySelector(".button-fill");

        if (fill) {
          gsap.killTweensOf(fill);
          gsap.fromTo(
            fill,
            { y: "120px" },
            { y: "0px", duration: 0.6, ease: "power2.inOut" }
          );
        }
      };

      const handleMouseLeave = () => {
        const fill = button.querySelector(".button-fill");

        if (fill) {
          gsap.killTweensOf(fill);
          gsap.to(fill, {
            y: "-120px",
            duration: 0.6,
            ease: "power2.inOut",
          });
        }
      };

      button.addEventListener("mouseenter", handleMouseEnter);
      button.addEventListener("mouseleave", handleMouseLeave);

      // Cleanup handled by useGSAP
      return () => {
        button.removeEventListener("mouseenter", handleMouseEnter);
        button.removeEventListener("mouseleave", handleMouseLeave);
      };
    },
    { scope: buttonRef }
  );

  return buttonRef;
};

// Button fill effect for multiple buttons (works like useMagneticEffectForChildren)
export const useButtonFillEffectForChildren = (
  buttonSelector = "button",
  duration = 0.6,
  additionalDeps = []
) => {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const buttons = Array.from(container.querySelectorAll(buttonSelector));
      if (!buttons.length) return;

      const listeners = buttons.map((button) => {
        const handleMouseEnter = () => {
          const fill = button.querySelector(".button-fill");

          if (fill) {
            gsap.killTweensOf(fill);
            gsap.fromTo(
              fill,
              { y: "100%" },
              { y: "0%", duration, ease: "power2.inOut" }
            );
          }
        };

        const handleMouseLeave = () => {
          const fill = button.querySelector(".button-fill");

          if (fill) {
            gsap.killTweensOf(fill);
            gsap.to(fill, {
              y: "-100%",
              duration,
              ease: "power2.inOut",
            });
          }
        };

        button.addEventListener("mouseenter", handleMouseEnter);
        button.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          button.removeEventListener("mouseenter", handleMouseEnter);
          button.removeEventListener("mouseleave", handleMouseLeave);
        };
      });

      // Cleanup all listeners
      return () => listeners.forEach((off) => off());
    },
    {
      scope: containerRef,
      dependencies: [buttonSelector, duration, ...additionalDeps],
    }
  );

  return containerRef;
};

// React hook for button scale animation on scroll
export const useButtonScrollScale = (
  trigger = ".default",
  start = "top 20%",
  end = "bottom 50%",
  target = ".default",
  markers = false,
  scrub = false
) => {
  const buttonRef = useRef(null);

  useGSAP(
    () => {
      const button = buttonRef.current;
      if (!button) return;

      // Resolve trigger if it's a selector string; fall back to the button itself
      const resolvedTrigger =
        typeof trigger === "string" ? document.querySelector(trigger) : trigger;

      const triggerEl = resolvedTrigger || button;

      // Resolve the target to animate.
      // If target is a selector string, prefer finding it inside the ref element first, then fall back to a global query. If it's an Element, use it directly.
      const resolvedTarget =
        typeof target === "string"
          ? button.querySelector?.(target) || document.querySelector(target)
          : target;

      const animEl = resolvedTarget || button;

      // Set initial state to scale 0
      gsap.set(animEl, { scale: 0 });

      gsap.fromTo(
        animEl,
        { scale: 0, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          scrollTrigger: {
            trigger: triggerEl,
            start,
            end,
            markers,
            scrub: scrub,
            toggleActions: scrub ? "none" : "play none none reverse",
          },
        }
      );
    },
    {
      scope: buttonRef,
      dependencies: [trigger, start, end, target, markers, scrub],
    }
  );

  return buttonRef;
};

// Apply magnetic effect to all matching children inside a container
export const useMagneticEffectForChildren = (
  childSelector = "a.nav-link",
  strength = 50,
  animateParentIfAnchor = true,
  additionalDeps = []
) => {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const children = Array.from(container.querySelectorAll(childSelector));
      if (!children.length) return;

      const listeners = children.map((el) => {
        const animatedEl =
          animateParentIfAnchor && el.tagName === "A" && el.parentElement
            ? el.parentElement
            : el;

        const moveMagnet = (event) => {
          const rect = animatedEl.getBoundingClientRect();
          gsap.to(animatedEl, {
            duration: 1,
            x:
              ((event.clientX - rect.left) / animatedEl.offsetWidth - 0.5) *
              strength,
            y:
              ((event.clientY - rect.top) / animatedEl.offsetHeight - 0.5) *
              strength,
            ease: "power4.out",
          });
        };

        const resetMagnet = () => {
          gsap.to(animatedEl, { duration: 1, x: 0, y: 0, ease: "power4.out" });
        };

        el.addEventListener("mousemove", moveMagnet);
        el.addEventListener("mouseout", resetMagnet);

        return () => {
          el.removeEventListener("mousemove", moveMagnet);
          el.removeEventListener("mouseout", resetMagnet);
        };
      });

      // Cleanup all listeners
      return () => listeners.forEach((off) => off());
    },
    {
      scope: containerRef,
      dependencies: [
        childSelector,
        strength,
        animateParentIfAnchor,
        ...additionalDeps,
      ],
    }
  );

  return containerRef;
};

// GSAP replacement for menu slide in/out
export const useMenuSlideGsap = (menuRef, isActive, duration = 0.8) => {
  const hasInitialized = useRef(false);

  useGSAP(
    () => {
      const menu = menuRef?.current;
      if (!menu) return;

      if (!hasInitialized.current) {
        // initial positioning is handled by CSS; don't set here to avoid
        // mixing JS and CSS responsibilities. Mark initialized so we
        // don't repeatedly run any one-time setup.
        hasInitialized.current = true;
      }
      gsap.to(menu, {
        x: isActive ? 0 : 700,
        duration,
        ease: "cubic-bezier(0.76, 0, 0.24, 1)",
      });
    },
    { dependencies: [menuRef?.current, isActive, duration] }
  );
};

// GSAP stagger for nav list items
export const useNavStaggerGsap = (
  containerRef,
  isActive,
  itemSelector = ".nav-item",
  duration = 0.8,
  delayStep = 0.2
) => {
  useGSAP(
    () => {
      const container = containerRef?.current;
      if (!container) return;

      const items = Array.from(container.querySelectorAll(itemSelector));
      if (!items.length) return;

      if (isActive) {
        gsap.to(items, {
          x: 0,
          duration,
          ease: "cubic-bezier(0.76, 0, 0.24, 1)",
          stagger: (i) => i * delayStep,
        });
      } else {
        gsap.to(items, {
          x: 80,
          duration,
          ease: "cubic-bezier(0.76, 0, 0.24, 1)",
          stagger: (i) => i * delayStep,
        });
      }
    },
    {
      dependencies: [
        containerRef?.current,
        isActive,
        itemSelector,
        duration,
        delayStep,
      ],
    }
  );
};

// GSAP animation for the SVG curve path 'd' attribute
export const useSvgCurveGsap = (pathRef, isActive, duration = 1.5) => {
  useGSAP(
    () => {
      const path = pathRef?.current;
      if (!path) return;
      const h = window.innerHeight;
      const initialPath = `M100 0 L100 ${h} Q0 ${h / 2} 100 0`;
      const targetPath = `M100 0 L100 ${h} Q100 ${h / 2} 100 0`;

      gsap.to(path, {
        attr: { d: isActive ? targetPath : initialPath },
        duration,
        ease: "cubic-bezier(0.76, 0, 0.24, 1)",
      });
    },
    { dependencies: [pathRef?.current, isActive, duration] }
  );
};

// Hook to close menu when overlay is clicked
export const useOverlayCloseMenu = (overlaySelector, onClose) => {
  useGSAP(
    () => {
      const overlay = document.querySelector(overlaySelector);
      if (!overlay) return;

      const handleClick = () => {
        if (onClose) onClose();
      };

      overlay.addEventListener("click", handleClick);

      return () => {
        overlay.removeEventListener("click", handleClick);
      };
    },
    { dependencies: [overlaySelector, onClose] }
  );
};

// Hook to close menu when nav links are clicked
export const useNavLinkCloseMenu = (linkSelector, onClose) => {
  useGSAP(
    () => {
      const links = document.querySelectorAll(linkSelector);
      if (!links.length) return;

      const handleClick = () => {
        if (onClose) onClose();
      };

      links.forEach((link) => {
        link.addEventListener("click", handleClick);
      });

      return () => {
        links.forEach((link) => {
          link.removeEventListener("click", handleClick);
        });
      };
    },
    { dependencies: [linkSelector, onClose] }
  );
};

// Sticky cursor with delay - follows mouse with smooth easing
export const useStickyCursor = (
  cursorSelector = ".sticky-cursor",
  triggerSelector = ".sticky-cursor-container",
  lag = 7,
  delay = 0,
  dependencies = []
) => {
  const cursorRef = useRef(null);
  const hasInitialized = useRef(false);

  useGSAP(
    () => {
      // Only apply delay on first initialization
      const initDelay = hasInitialized.current ? 0 : delay;

      const timeout = setTimeout(() => {
        hasInitialized.current = true;

        const cursor = document.querySelector(cursorSelector);
        const triggers = document.querySelectorAll(triggerSelector);

        if (!cursor || !triggers.length) return;

        let posX = 0;
        let posY = 0;
        let mouseX = 0;
        let mouseY = 0;

        // Smooth follow animation loop
        const ticker = gsap.ticker.add(() => {
          posX += (mouseX - posX) / lag;
          posY += (mouseY - posY) / lag;
          gsap.set(cursor, {
            left: posX,
            top: posY,
          });
        });

        const handleMouseMove = (e) => {
          mouseX = e.clientX;
          mouseY = e.clientY;
        };

        const handleMouseEnter = () => {
          cursor.classList.add("active");
        };

        const handleMouseLeave = () => {
          cursor.classList.remove("active");
        };

        document.addEventListener("mousemove", handleMouseMove);
        triggers.forEach((trigger) => {
          trigger.addEventListener("mouseenter", handleMouseEnter);
          trigger.addEventListener("mouseleave", handleMouseLeave);
        });

        return () => {
          clearTimeout(timeout);
          gsap.ticker.remove(ticker);
          document.removeEventListener("mousemove", handleMouseMove);
          triggers.forEach((trigger) => {
            trigger.removeEventListener("mouseenter", handleMouseEnter);
            trigger.removeEventListener("mouseleave", handleMouseLeave);
          });
        };
      }, initDelay);

      return () => clearTimeout(timeout);
    },
    {
      dependencies: [
        cursorSelector,
        triggerSelector,
        lag,
        delay,
        ...dependencies,
      ],
    }
  );

  return cursorRef;
};

/**
 * Custom hook for image cursor that follows mouse and shows on hover
 * @param {string} imageSelector - Selector for image elements (default: ".image-cursor")
 * @param {string} triggerSelector - Selector for trigger elements (default: ".image-cursor-container")
 * @param {number} lag - Smoothness of follow effect (default: 7)
 * @param {number} delay - Initialization delay in ms (default: 1000)
 * @param {boolean} isActive - Whether the cursor effect should be active (default: true)
 * @param {array} dependencies - Additional dependencies to trigger re-initialization (default: [])
 */
export const useImageCursor = (
  imageSelector = ".image-cursor",
  triggerSelector = ".image-cursor-container",
  lag = 7,
  delay = 1000,
  isActive = true,
  dependencies = []
) => {
  const imageRef = useRef(null);
  const hasInitialized = useRef(false);
  const cleanupRef = useRef(null);
  useGSAP(
    () => {
      // If not active, run cleanup and return
      // Respect a global opt-out body class so pages can disable the image cursor
      const bodyDisabled =
        typeof document !== "undefined" &&
        document.body.classList.contains("no-image-cursor");

      const effectiveIsActive = isActive && !bodyDisabled;

      if (!effectiveIsActive) {
        // Call previous cleanup if it exists
        if (cleanupRef.current) {
          cleanupRef.current();
          cleanupRef.current = null;
        }

        // Hide all images
        const images = gsap.utils.toArray(imageSelector);
        images.forEach((image) => {
          gsap.set(image, { opacity: 0, scale: 0.8 });
        });
        return;
      }

      // Only apply delay on first initialization
      const initDelay = hasInitialized.current ? 0 : delay;

      const timeout = setTimeout(() => {
        hasInitialized.current = true;

        const images = gsap.utils.toArray(imageSelector);
        const triggers = gsap.utils.toArray(triggerSelector);

        const overlayContainer = document.querySelector(
          ".sticky-images-container"
        );
        const useMultiOverlay = !!overlayContainer; // render all overlays outside smoother

        if (!triggers.length || (!useMultiOverlay && !images.length)) return;

        let posX = 0;
        let posY = 0;
        let mouseX = 0;
        let mouseY = 0;
        let currentImage = null;

        // Smooth follow animation loop
        const ticker = gsap.ticker.add(() => {
          if (!currentImage) return;

          posX += (mouseX - posX) / lag;
          posY += (mouseY - posY) / lag;

          // Get image dimensions to center it on cursor
          const rect = currentImage.getBoundingClientRect();
          gsap.set(currentImage, {
            x: posX - rect.width / 2,
            y: posY - rect.height / 2,
          });
        });

        const handleMouseMove = (e) => {
          mouseX = e.clientX;
          mouseY = e.clientY;
        };

        // Store handlers for cleanup
        const handlers = [];

        // Attach hover handlers to each trigger/image pair
        const singleOverlay = !useMultiOverlay && images.length === 1;

        // If using multi-overlay mode, create one overlay IMG per trigger in the fixed container
        let overlayImages = [];
        if (useMultiOverlay) {
          overlayImages = triggers.map((trigger) => {
            const explicit = trigger.getAttribute("data-cursor-src");
            const nestedImg = trigger.querySelector("img");
            const src = explicit || nestedImg?.src;
            if (!src) return null;
            const el = new Image();
            el.className = "image-cursor overlay";
            el.src = src; // browser will start loading immediately
            overlayContainer.appendChild(el);
            // initial hidden/fixed state
            gsap.set(el, {
              position: "fixed",
              pointerEvents: "none",
              zIndex: 9999,
              opacity: 0,
              scale: 0.8,
            });
            return el;
          });
        }

        // Preload nested <img> sources for faster swaps
        if (!useMultiOverlay) {
          const preloadSrcs = [];
          triggers.forEach((trigger) => {
            const dsrc = trigger.getAttribute("data-cursor-src");
            const nestedImg = trigger.querySelector("img");
            const src = dsrc || nestedImg?.src;
            if (src) preloadSrcs.push(src);
          });
          preloadSrcs.forEach((src) => {
            const pre = new Image();
            pre.src = src;
          });
        }

        triggers.forEach((trigger, index) => {
          const image = useMultiOverlay
            ? overlayImages[index]
            : singleOverlay
            ? images[0]
            : images[index];
          if (!image) return;

          const handleMouseEnter = () => {
            currentImage = image;

            // If using a single overlay image outside smoother, set its src from the trigger's nested img
            if (!useMultiOverlay && singleOverlay && image.tagName === "IMG") {
              const nestedImg = trigger.querySelector("img");
              if (nestedImg && nestedImg.src) {
                const nextSrc = nestedImg.src;
                if (image.src !== nextSrc) {
                  // Hide briefly to avoid flashing previous image while the new one loads
                  gsap.set(image, { opacity: 0 });
                  image.onload = () => {
                    gsap.to(image, { opacity: 1, duration: 0.1 });
                  };
                  image.src = nextSrc;
                  // If cached and already complete, show immediately
                  if (image.complete) {
                    gsap.set(image, { opacity: 1 });
                  }
                } else {
                  // Same image as before; just show it again
                  gsap.to(image, { opacity: 1, duration: 0.1 });
                }
              }
            } else {
              // Multiple overlay images (one per trigger) - show immediately
              gsap.to(image, { opacity: 1, duration: 0.1 });
            }

            // Ensure overlay behaves as a true cursor-follow element (don't force opacity here)
            gsap.set(image, {
              position: "fixed",
              pointerEvents: "none",
              zIndex: 9999,
              scale: 1,
            });
          };

          const handleMouseLeave = () => {
            // Cancel any pending onload fade-in to avoid flashing after leave
            if (!useMultiOverlay && singleOverlay && image.tagName === "IMG") {
              try {
                image.onload = null;
              } catch {
                // noop
              }
            }
            gsap.to(image, {
              opacity: 0,
              scale: 0.8,
              duration: 0.3,
              onComplete: () => {
                if (currentImage === image) currentImage = null;
              },
            });
          };

          trigger.addEventListener("mouseenter", handleMouseEnter);
          trigger.addEventListener("mouseleave", handleMouseLeave);

          // Store for cleanup
          handlers.push({ trigger, handleMouseEnter, handleMouseLeave });
        });

        document.addEventListener("mousemove", handleMouseMove);

        // Store cleanup function
        const cleanup = () => {
          gsap.ticker.remove(ticker);
          document.removeEventListener("mousemove", handleMouseMove);

          // Remove all trigger event listeners
          handlers.forEach(
            ({ trigger, handleMouseEnter, handleMouseLeave }) => {
              trigger.removeEventListener("mouseenter", handleMouseEnter);
              trigger.removeEventListener("mouseleave", handleMouseLeave);
            }
          );

          // Reset all images
          images.forEach((image) => {
            gsap.set(image, { opacity: 0, scale: 0.8 });
          });

          // Remove overlays if we created them
          if (useMultiOverlay && overlayImages.length) {
            overlayImages.forEach((img) => {
              if (img && img.parentNode === overlayContainer) {
                overlayContainer.removeChild(img);
              }
            });
            overlayImages = [];
          }
        };

        cleanupRef.current = cleanup;

        return () => {
          clearTimeout(timeout);
          cleanup();
          cleanupRef.current = null;
        };
      }, initDelay);
      return () => clearTimeout(timeout);
    },
    {
      dependencies: [
        imageSelector,
        triggerSelector,
        lag,
        delay,
        isActive,
        // include the bodyDisabled flag so the hook re-initializes when
        // a page toggles the global opt-out class
        typeof document !== "undefined"
          ? document.body.classList.contains("no-image-cursor")
          : false,
        ...dependencies,
      ],
    }
  );

  return imageRef;
};

export const useNavScroll = (
  trigger = ".default",
  start = "top 0%",
  end = "+=200px",
  markers = false,
  scrub = false
) => {
  const navRef = useRef(null);

  useGSAP(
    () => {
      const button = navRef.current;
      if (!button) return;

      const resolvedTrigger =
        typeof trigger === "string" ? document.querySelector(trigger) : trigger;

      const triggerEl = resolvedTrigger || button;

      if (scrub) {
        gsap.fromTo(
          button,
          { y: 0, autoAlpha: 1 },
          {
            y: -200,
            autoAlpha: 0,
            ease: "none",
            scrollTrigger: {
              trigger: triggerEl,
              start,
              end,
              markers,
              scrub: true,
            },
          }
        );
      } else {
        // toggleActions mode: play forward and reverse
        gsap.fromTo(
          button,
          { y: 0, autoAlpha: 1 },
          {
            y: -200,
            autoAlpha: 0,
            ease: "none",
            scrollTrigger: {
              trigger: triggerEl,
              start,
              end,
              markers,
              scrub: true,
            },
          }
        );
      }
    },
    { scope: navRef, dependencies: [trigger, start, end, markers, scrub] }
  );

  return navRef;
};

/**
 * Reusable hook for animating elements with ScrollTrigger
 * @param {Object} fromVars - Initial GSAP properties (e.g., { y: 0, opacity: 0 })
 * @param {Object} toVars - Target GSAP properties (e.g., { y: 100, opacity: 1 })
 * @param {string|Element} trigger - ScrollTrigger trigger element or selector (default: "#root")
 * @param {string} start - ScrollTrigger start position (default: "top 0%")
 * @param {string} end - ScrollTrigger end position (default: "+=300px")
 * @param {string} toggleActions - ScrollTrigger toggle actions (default: "play none none reverse")
 * @param {boolean} markers - Show ScrollTrigger markers for debugging (default: false)
 * @param {string} ease - GSAP easing function (default: "power4.out")
 * @param {number} duration - Animation duration in seconds (default: 0.5)
 * @param {boolean|number} scrub - Link animation progress to scroll position (default: false)
 * @returns {React.RefObject} - Ref to attach to the animated element
 */
export const useScrollAnimation = (
  fromVars = {},
  toVars = {},
  trigger = "#root",
  start = "top 0%",
  end = "+=300px",
  toggleActions = "play none none reverse",
  markers = false,
  ease = "power4.out",
  duration = 0.5,
  scrub = false
) => {
  const elementRef = useRef(null);
  const scrollTriggerRef = useRef(null);

  useGSAP(
    () => {
      const element = elementRef.current;
      if (!element) return;

      // Kill any existing ScrollTrigger
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }

      const timeout = setTimeout(() => {
        const resolvedTrigger =
          typeof trigger === "string"
            ? document.querySelector(trigger)
            : trigger;

        const triggerEl = resolvedTrigger || element;

        // Create the animation and store the ScrollTrigger instance
        const animation = gsap.fromTo(element, fromVars, {
          ...toVars,
          duration,
          ease,
          scrollTrigger: {
            trigger: triggerEl,
            start,
            end,
            markers,
            toggleActions,
            scrub,
            invalidateOnRefresh: true,
            onRefresh: (self) => {
              // Recalculate on refresh
              self.update();
            },
          },
        });

        // Store the ScrollTrigger instance
        scrollTriggerRef.current = animation.scrollTrigger;

        // Refresh after layout is complete
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      }, 1000);

      return () => {
        clearTimeout(timeout);
        if (scrollTriggerRef.current) {
          scrollTriggerRef.current.kill();
          scrollTriggerRef.current = null;
        }
      };
    },
    {
      scope: elementRef,
      dependencies: [
        JSON.stringify(fromVars),
        JSON.stringify(toVars),
        trigger,
        start,
        end,
        toggleActions,
        markers,
        ease,
        duration,
        scrub,
      ],
    }
  );

  return elementRef;
};

/**
 * Reusable hook for GSAP SplitText animation with ScrollTrigger
 * @param {Object} options - Configuration options
 * @param {string} options.type - Split type: "chars", "words", or "lines" (default: "chars")
 * @param {string} options.charsClass - CSS class for characters (default: "char++")
 * @param {string|boolean} options.mask - Mask wrapper type (default: "chars")
 * @param {number} options.yPercent - Y translation percentage (default: 120)
 * @param {string} options.ease - GSAP easing function (default: "power4.out")
 * @param {number} options.duration - Animation duration in seconds (default: 1)
 * @param {Object} options.stagger - Stagger configuration (default: { amount: 0.5, from: "start" })
 * @param {string} options.scrollTriggerStart - ScrollTrigger start position (default: "top 80%")
 * @param {string} options.scrollTriggerEnd - ScrollTrigger end position (default: "top -200%")
 * @param {string} options.toggleActions - ScrollTrigger toggle actions (default: "play none none reverse")
 * @param {boolean} options.markers - Show ScrollTrigger markers for debugging (default: false)
 * @returns {React.RefObject} - Ref to attach to the target element
 */
export const useSplitTextScroll = ({
  type = "chars",
  charsClass = "char++",
  mask = "chars",
  yPercent = 120,
  ease = "power4.out",
  duration = 1,
  stagger = { amount: 0.5, from: "start" },
  scrollTriggerStart = "top 80%",
  scrollTriggerEnd = "top -200%",
  toggleActions = "play none none reverse",
  // If true, the timeline will be restarted immediately on mount (useful when
  // the element is already in view on page load).
  playOnMount = false,
  // When true, tie the timeline progress to the scroll position.
  // This turns the entrance animation into a scrubbed animation.
  scrub = false,
  markers = false,
} = {}) => {
  const elementRef = useRef(null);

  useGSAP(
    () => {
      if (!elementRef.current) return;

      document.fonts.ready.then(() => {
        const split = new SplitText(elementRef.current, {
          type,
          charsClass,
          mask,
        });

        const targets =
          type === "chars"
            ? split.chars
            : type === "words"
            ? split.words
            : split.lines;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: elementRef.current,
            start: scrollTriggerStart,
            end: scrollTriggerEnd,
            toggleActions,
            markers,
            scrub,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(
          targets,
          {
            yPercent,
          },
          {
            yPercent: 0,
            ease,
            duration,
            stagger,
          }
        );

        // If requested, play the animation immediately on mount (useful when
        // the element is already visible on page load). We restart so it runs
        // from the beginning regardless of ScrollTrigger initial state.
        // If requested, play the animation immediately on mount (useful when
        // the element is already visible on page load). We restart so it runs
        // from the beginning regardless of ScrollTrigger initial state.
        // Note: restarting on mount doesn't make sense when scrub=true, since
        // scrub ties the timeline progress to scroll position.
        if (playOnMount && !scrub) {
          // small delay to allow layout/paint then restart
          requestAnimationFrame(() => {
            try {
              tl.restart();
            } catch {
              // swallow any runtime error if timeline isn't ready
            }
          });
        }

        return () => {
          tl.kill();
          split.revert();
        };
      });
    },
    {
      scope: elementRef,
      dependencies: [
        type,
        charsClass,
        mask,
        yPercent,
        ease,
        duration,
        JSON.stringify(stagger),
        scrollTriggerStart,
        scrollTriggerEnd,
        toggleActions,
        playOnMount,
        scrub,
        markers,
      ],
    }
  );

  return elementRef;
};
