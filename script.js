/* Portfolio interactions - vanilla JavaScript */
(function () {
  "use strict";

  /* ---------- Mobile hamburger menu ---------- */
  var burger = document.getElementById("burger");
  var navLinks = document.getElementById("navLinks");

  function closeMenu() {
    navLinks.classList.remove("open");
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  }

  burger.addEventListener("click", function () {
    var open = navLinks.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
  });

  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  /* ---------- Smooth scrolling (fallback for older browsers) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var id = anchor.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - 72;
      window.scrollTo({ top: top, behavior: "smooth" });
      history.replaceState(null, "", id);
    });
  });

  /* ---------- Sticky nav shadow + back to top ---------- */
  var nav = document.getElementById("nav");
  var toTop = document.getElementById("toTop");

  function onScroll() {
    var y = window.pageYOffset;
    nav.classList.toggle("scrolled", y > 10);
    toTop.classList.toggle("show", y > 500);
    setActiveLink();
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Active navigation link ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("section[id]"));
  var links = Array.prototype.slice.call(navLinks.querySelectorAll("a"));

  function setActiveLink() {
    var pos = window.pageYOffset + 140;
    var currentId = sections[0] ? sections[0].id : "";
    sections.forEach(function (section) {
      if (section.offsetTop <= pos) currentId = section.id;
    });
    links.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + currentId);
    });
  }

  /* ---------- Scroll reveal animations ---------- */
  var revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealItems.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealItems.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  /* ---------- Contact form validation ---------- */
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");

  function showError(inputId, message) {
    var input = document.getElementById(inputId);
    var error = document.getElementById(inputId + "Error");
    error.textContent = message;
    input.classList.toggle("invalid", Boolean(message));
    return !message;
  }

  function validate() {
    var name = document.getElementById("name").value.trim();
    var email = document.getElementById("email").value.trim();
    var message = document.getElementById("message").value.trim();
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    var okName = showError("name", name.length < 2 ? "Please enter your name." : "");
    var okEmail = showError("email", !emailPattern.test(email) ? "Please enter a valid email address." : "");
    var okMessage = showError("message", message.length < 10 ? "Message should be at least 10 characters." : "");

    return okName && okEmail && okMessage;
  }

  ["name", "email", "message"].forEach(function (id) {
    document.getElementById(id).addEventListener("input", function () {
      if (document.getElementById(id).classList.contains("invalid")) validate();
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.textContent = "";
    if (!validate()) {
      status.textContent = "Please fix the highlighted fields.";
      return;
    }
    // Static site: open the visitor's mail client with the message pre-filled.
    var subject = encodeURIComponent("Portfolio message from " + document.getElementById("name").value.trim());
    var body = encodeURIComponent(
      document.getElementById("message").value.trim() +
        "\n\n— " +
        document.getElementById("name").value.trim() +
        " (" +
        document.getElementById("email").value.trim() +
        ")"
    );
    window.location.href = "mailto:rohithgundu16@gmail.com?subject=" + subject + "&body=" + body;
    status.textContent = "Thanks! Your email app is opening with the message ready to send.";
    form.reset();
  });

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Typing effect: "Passionate ..." ---------- */
  var typedEl = document.getElementById("typed");
  if (typedEl) {
    var words = ["Data Analyst", "Problem Solver", "Software Developer", "Tech Enthusiast", "Lifelong Learner"];
    var wordIndex = 0, charIndex = 0, deleting = false;

    function typeTick() {
      var word = words[wordIndex];
      charIndex += deleting ? -1 : 1;
      typedEl.textContent = word.slice(0, charIndex);

      var delay = deleting ? 45 : 90;
      if (!deleting && charIndex === word.length) {
        delay = 1600;
        deleting = true;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 400;
      }
      setTimeout(typeTick, delay);
    }
    typeTick();
  }

  onScroll();
})();
