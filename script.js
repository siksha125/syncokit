/* Mobile menu */
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  });
});

/* Header style on scroll */
const header = document.getElementById("header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 20);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* Scroll reveal */
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 70 + "ms";
    io.observe(el);
  });
} else {
  revealEls.forEach((el) => el.classList.add("visible"));
}

/* Active nav link */
const sections = document.querySelectorAll("main section[id]");
const links = navLinks.querySelectorAll("a:not(.nav-cta)");
if ("IntersectionObserver" in window) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => spy.observe(s));
}

/* Chart bar stagger */
document.querySelectorAll(".chart i").forEach((bar, i) => bar.style.setProperty("--n", i));

/* Footer year */
document.getElementById("year").textContent = new Date().getFullYear();

/* Contact form (Web3Forms) */
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const submitButton = contactForm.querySelector('button[type="submit"]');

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const accessKey = contactForm.querySelector('[name="access_key"]').value.trim();
  if (!accessKey || accessKey === "YOUR_ACCESS_KEY") {
    formStatus.textContent = "Please add your Web3Forms access key in index.html before submitting.";
    formStatus.className = "form-status error";
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Sending...";
  formStatus.textContent = "";
  formStatus.className = "form-status";

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: new FormData(contactForm)
    });
    const result = await response.json();

    if (response.ok && result.success) {
      formStatus.textContent = "Thank you! Your enquiry has been sent.";
      formStatus.className = "form-status success";
      contactForm.reset();
    } else {
      throw new Error(result.message || "Unable to send your enquiry. Please try again.");
    }
  } catch (error) {
    formStatus.textContent = error.message || "Something went wrong. Please try again.";
    formStatus.className = "form-status error";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Send enquiry";
  }
});
