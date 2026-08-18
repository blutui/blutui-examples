/**
 * Site behaviour.
 *
 * Blocks are built to work without JavaScript — navigation dropdowns, the
 * mobile menu and the FAQ all use native <details>. This file only adds the
 * small niceties that markup alone can't do.
 */

// Nav dropdowns and the mobile menu opt in with data-dropdown. FAQ accordions
// deliberately don't, so they stay open while the visitor reads the page.
const DROPDOWN = "details[data-dropdown][open]";

// Close any open dropdown when clicking elsewhere on the page.
document.addEventListener("click", (event) => {
  document.querySelectorAll(DROPDOWN).forEach((details) => {
    if (!details.contains(event.target)) {
      details.removeAttribute("open");
    }
  });
});

// Close open dropdowns on Escape.
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  document.querySelectorAll(DROPDOWN).forEach((details) => {
    details.removeAttribute("open");
    details.querySelector("summary")?.focus();
  });
});

// Smooth scroll for in-page anchor links, respecting reduced-motion.
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

document.addEventListener("click", (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || prefersReducedMotion.matches) return;

  const id = link.getAttribute("href");
  if (!id || id === "#") return;

  const target = document.querySelector(id);
  if (!target) return;

  event.preventDefault();
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  history.pushState(null, "", id);
});
