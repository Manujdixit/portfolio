"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useRef, useMemo } from "react";

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  variant?: {
    hidden: { y: number };
    visible: { y: number };
  };
  duration?: number;
  delay?: number;
  yOffset?: number;
  inView?: boolean;
  inViewMargin?: string;
  blur?: string;
}

const BlurFade = ({
  children,
  className,
  variant,
  duration = 0.4,
  delay = 0,
  yOffset = 6,
  inView = false,
  inViewMargin = "-50px",
  blur = "6px",
}: BlurFadeProps) => {
  const ref = useRef(null);
  const inViewResult = useInView(ref, {
    once: true,
    margin: inViewMargin as any,
    amount: 0.1,
  });
  const isInView = !inView || inViewResult;

  const combinedVariants = useMemo((): Variants => {
    if (variant) return variant;
    return {
      hidden: { y: yOffset, opacity: 0, filter: `blur(${blur})` },
      visible: { y: 0, opacity: 1, filter: `blur(0px)` },
    };
  }, [variant, yOffset, blur]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={combinedVariants}
      transition={{
        delay: delay,
        duration,
        ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for better performance
        willChange: "transform, opacity, filter", // Optimize for GPU acceleration
      }}
      className={className}
      style={{
        willChange: isInView ? "auto" : "transform, opacity, filter", // Reset willChange after animation
      }}
    >
      {children}
    </motion.div>
  );
};

export default BlurFade;
