"use client";

import { useEffect } from "react";

export function LandingEffects() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08 },
    );

    const reveals = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    reveals.forEach((el, i) => {
      if (el.closest("[data-hero]")) {
        window.setTimeout(() => el.classList.add("in"), 120 + i * 90);
      } else {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
