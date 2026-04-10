const body = document.body;
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const navLinks = document.querySelectorAll("[data-nav-link]");
const revealItems = document.querySelectorAll(".reveal");
const autoRevealSections = document.querySelectorAll(".auto-reveal");
const revealButtons = document.querySelectorAll("[data-reveal-button]");

function closeNav() {
  body.classList.remove("nav-open");
  if (navToggle) {
    navToggle.setAttribute("aria-expanded", "false");
  }
}

function openNav() {
  body.classList.add("nav-open");
  if (navToggle) {
    navToggle.setAttribute("aria-expanded", "true");
  }
}

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = body.classList.contains("nav-open");
    if (isOpen) {
      closeNav();
    } else {
      openNav();
    }
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", closeNav);
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 768) {
    closeNav();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeNav();
  }
});

if (revealItems.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function revealTruth(section) {
  if (!section || section.dataset.revealed === "true") {
    return;
  }

  const truth = section.querySelector(".truth-card");
  const button = section.querySelector("[data-reveal-button]");

  if (truth) {
    truth.classList.add("revealed");
  }

  if (button) {
    button.hidden = true;
    button.setAttribute("aria-expanded", "true");
  }

  section.dataset.revealed = "true";
}

revealButtons.forEach((button) => {
  button.addEventListener("click", () => {
    revealTruth(button.closest(".auto-reveal"));
  });
});

if (autoRevealSections.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const section = entry.target;
        if (!entry.isIntersecting || section.dataset.timerStarted === "true") {
          return;
        }

        section.dataset.timerStarted = "true";
        const delay = Number(section.dataset.revealDelay || 3000);

        window.setTimeout(() => {
          revealTruth(section);
        }, delay);

        revealObserver.unobserve(section);
      });
    },
    {
      threshold: 0.45,
    }
  );

  autoRevealSections.forEach((section) => revealObserver.observe(section));
}
