import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Adds smooth scroll-reveal animations across all pages.
 * - Auto-tags common content blocks with `.reveal`
 * - Uses IntersectionObserver to add `.is-visible` when in view
 * - Re-runs on route changes
 */
const GlobalReveal = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const tagSelectors = [
      "section",
      "main > div",
      "article",
      "h1, h2, h3",
      ".card-hover",
      "[data-reveal]",
    ];

    const candidates = document.querySelectorAll<HTMLElement>(tagSelectors.join(","));
    candidates.forEach((el) => {
      if (!el.classList.contains("reveal") && !el.dataset.revealSkip) {
        el.classList.add("reveal");
      }
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    // Reveal anything already in view immediately (avoid flash on top of page)
    requestAnimationFrame(() => {
      document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.9) el.classList.add("is-visible");
      });
    });

    return () => io.disconnect();
  }, [pathname]);

  return null;
};

export default GlobalReveal;
