export const menuSlide = {
  initial: {
    x: "calc(100% + 100px)",
  },
  enter: {
    x: "0%",
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
  },
  exit: {
    x: "calc(100% + 100px)",
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
  },
};

export const slide = {
  initial: {
    x: "80px",
  },
  enter: (i) => ({
    x: "0px",
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: i * 0.07 },
  }),
  exit: (i) => ({
    x: "80px",
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: i * 0.07 },
  }),
};

const initialPath = `M100 0 L100 ${window.innerHeight} Q0 ${
  window.innerHeight / 2
} 100 0`;

const targetPath = `M100 0 L100 ${window.innerHeight} Q100 ${
  window.innerHeight / 2
} 100 0`;

export const pathAnimation = {
  initial: {
    d: initialPath,
  },
  enter: {
    d: targetPath,
    transition: { duration: 1.5, ease: [0.76, 0, 0.24, 1] },
  },
  exit: {
    d: initialPath,
    transition: { duration: 1.5, ease: [0.76, 0, 0.24, 1] },
  },
};
