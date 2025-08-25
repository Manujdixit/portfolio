"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";

interface LazySectionProps {
  children: React.ReactNode;
  className?: string;
  rootMargin?: string;
}

export function LazySection({
  children,
  className,
  rootMargin = "100px",
}: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    margin: rootMargin as any,
    amount: 0.1,
  });

  return (
    <div ref={ref} className={className}>
      {isInView ? children : <div style={{ minHeight: "200px" }} />}
    </div>
  );
}
