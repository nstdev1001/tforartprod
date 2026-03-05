export const defaultYMotionProps = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 1 },
  viewport: { once: true },
};
export const defaultXMotionProps = {
  initial: { opacity: 0, x: 30 },
  whileInView: { opacity: 1, x: 0 },
  transition: { duration: 1 },
  viewport: { once: true },
};

export const defaultScaleMotionProps = {
  initial: { opacity: 0, scale: 0.8 },
  whileInView: { opacity: 1, scale: 1 },
  transition: { duration: 1 },
  viewport: { once: true },
};

export const defaultOpacityMotionProps = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  transition: { duration: 1.5 },
  viewport: { once: true },
};

export const createSmoothTextContainerMotionProps = (amount = 0.25) => ({
  initial: { opacity: 0, y: 24, filter: "blur(8px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.8 },
  viewport: { once: true, amount },
});

export const createSmoothTextItemMotionProps = (delay: number, amount = 0.25) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay },
  viewport: { once: true, amount },
});
