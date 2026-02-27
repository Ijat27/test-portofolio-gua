/**
 * script.js — Portfolio Interactive Features
 * Features: Dark Mode Toggle, Hamburger Menu, Smooth Scroll,
 *           Scroll Reveal, Skill Bar Animations, Form Validation,
 *           Active Nav Link Highlighting
 */

"use strict";

/* ============================================================
   1. DARK MODE TOGGLE
   - Default: Light mode (cool blue-white)
   - Toggle adds 'dark-mode' class → deep navy
   - Saves preference to localStorage on toggle
   - Restores saved preference on page load
   ============================================================ */
(function initDarkMode() {
  const toggle = document.getElementById("theme-toggle");
  const body = document.body;
  const STORAGE_KEY = "portfolio-theme";

  // Restore saved preference (default = light)
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  if (savedTheme === "dark") {
    body.classList.add("dark-mode");
  }

  function updateAriaLabel() {
    const isDark = body.classList.contains("dark-mode");
    toggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode"
    );
    toggle.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
  }

  // Set initial aria-label
  updateAriaLabel();

  if (!toggle) return;

  toggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    const isDark = body.classList.contains("dark-mode");
    localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
    updateAriaLabel();
  });
})();

/* ============================================================
   2. HAMBURGER MENU
   - Toggles 'open' class on .nav-links for mobile visibility
   - Updates aria-expanded attribute
   - Closes menu when a nav link is clicked
   - Closes menu on Escape key press
   ============================================================ */
(function initHamburger() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");

  if (!hamburger || !navLinks) return;

  function openMenu() {
    navLinks.classList.add("open");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden"; // prevent background scroll
  }

  function closeMenu() {
    navLinks.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  function toggleMenu() {
    const isOpen = navLinks.classList.contains("open");
    isOpen ? closeMenu() : openMenu();
  }

  hamburger.addEventListener("click", toggleMenu);

  // Close when any nav link is clicked
  navLinks.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navLinks.classList.contains("open")) {
      closeMenu();
      hamburger.focus(); // return focus to hamburger for accessibility
    }
  });

  // Close when clicking outside the nav area
  document.addEventListener("click", (e) => {
    const clickedOutside =
      !hamburger.contains(e.target) && !navLinks.contains(e.target);
    if (clickedOutside && navLinks.classList.contains("open")) {
      closeMenu();
    }
  });
})();

/* ============================================================
   3. SMOOTH SCROLLING
   - Intercepts all clicks on internal anchor links (href="#...")
   - Smoothly scrolls to the target section
   - Accounts for fixed navbar height
   ============================================================ */
(function initSmoothScroll() {
  const NAV_HEIGHT = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue("--nav-h"),
    10
  ) || 68;

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId === "#") return; // Skip empty anchors

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      const targetTop =
        targetEl.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;

      window.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });
    });
  });
})();

/* ============================================================
   4. ACTIVE NAV LINK HIGHLIGHTING
   - Uses IntersectionObserver to detect which section is visible
   - Adds 'active' class to the corresponding nav link
   ============================================================ */
(function initActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${id}`
            );
          });
        }
      });
    },
    {
      rootMargin: "-40% 0px -55% 0px", // Trigger when section is near the middle
    }
  );

  sections.forEach((section) => observer.observe(section));
})();

/* ============================================================
   5. SCROLL REVEAL ANIMATIONS
   - Observes elements with class 'reveal'
   - Adds 'revealed' class when element enters the viewport
   - Also used to trigger skill bar animations
   ============================================================ */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  // Add reveal class to key elements
  const revealTargets = [
    { selector: ".about-text", delay: 0 },
    { selector: ".about-card", delay: 1 },
    { selector: ".skill-category", delay: 0 },
    { selector: ".project-card", delay: 0 },
    { selector: ".contact-intro", delay: 0 },
    { selector: ".contact-form", delay: 1 },
    { selector: ".section-header", delay: 0 },
  ];

  revealTargets.forEach(({ selector, delay }) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add("reveal");
      if (delay || i > 0) {
        el.classList.add(`reveal-delay-${Math.min(delay + i, 3)}`);
      }
    });
  });

  const allReveal = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target); // Only animate once
        }
      });
    },
    { threshold: 0.12 }
  );

  allReveal.forEach((el) => observer.observe(el));
})();

/* ============================================================
   6. SKILL BAR ANIMATIONS
   - Animates skill bars when the skills section enters view
   - Reads 'data-level' attribute for target width %
   ============================================================ */
(function initSkillBars() {
  const skillBars = document.querySelectorAll(".skill-bar[data-level]");
  if (!skillBars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const level = bar.getAttribute("data-level");
          bar.style.setProperty("--w", `${level}%`);
          bar.classList.add("animate");
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 }
  );

  skillBars.forEach((bar) => observer.observe(bar));
})();

/* ============================================================
   7. CONTACT FORM VALIDATION
   - Client-side validation for name, email, and message
   - Shows inline error messages
   - Simulates submission with a success state
   ============================================================ */
(function initFormValidation() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const fields = {
    name: {
      el: document.getElementById("name"),
      errorEl: document.getElementById("name-error"),
      validate: (val) => {
        if (!val.trim()) return "Name is required.";
        if (val.trim().length < 2) return "Name must be at least 2 characters.";
        return null;
      },
    },
    email: {
      el: document.getElementById("email"),
      errorEl: document.getElementById("email-error"),
      validate: (val) => {
        if (!val.trim()) return "Email is required.";
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(val.trim())) return "Please enter a valid email.";
        return null;
      },
    },
    message: {
      el: document.getElementById("message"),
      errorEl: document.getElementById("message-error"),
      validate: (val) => {
        if (!val.trim()) return "Message is required.";
        if (val.trim().length < 10) return "Message must be at least 10 characters.";
        return null;
      },
    },
  };

  const successMsg = document.getElementById("form-success");

  function showError(field, message) {
    field.el.classList.add("error");
    field.errorEl.textContent = message;
    field.el.setAttribute("aria-invalid", "true");
  }

  function clearError(field) {
    field.el.classList.remove("error");
    field.errorEl.textContent = "";
    field.el.removeAttribute("aria-invalid");
  }

  // Live validation on blur
  Object.values(fields).forEach((field) => {
    field.el.addEventListener("blur", () => {
      const error = field.validate(field.el.value);
      if (error) showError(field, error);
      else clearError(field);
    });

    // Clear error on input
    field.el.addEventListener("input", () => {
      if (field.el.classList.contains("error")) {
        clearError(field);
      }
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let isValid = true;

    Object.values(fields).forEach((field) => {
      const error = field.validate(field.el.value);
      if (error) {
        showError(field, error);
        isValid = false;
      } else {
        clearError(field);
      }
    });

    if (!isValid) {
      // Focus first error field
      const firstError = Object.values(fields).find((f) =>
        f.el.classList.contains("error")
      );
      if (firstError) firstError.el.focus();
      return;
    }

    // Simulate successful form submission
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message →";

      if (successMsg) {
        successMsg.hidden = false;
        setTimeout(() => {
          successMsg.hidden = true;
        }, 5000);
      }
    }, 1200);
  });
})();

/* ============================================================
   8. NAVBAR SCROLL SHADOW
   - Adds shadow when page is scrolled, adapts to theme
   ============================================================ */
(function initNavbarScroll() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  const onScroll = () => {
    const isDark = document.body.classList.contains("dark-mode");
    if (window.scrollY > 20) {
      navbar.style.boxShadow = isDark
        ? "0 1px 32px rgba(0,5,30,0.50)"
        : "0 1px 24px rgba(10,30,80,0.12)";
    } else {
      navbar.style.boxShadow = "none";
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  // Also re-apply on theme toggle
  document.getElementById("theme-toggle")?.addEventListener("click", onScroll);
})();