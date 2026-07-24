/* O-PAS Adoption Guide — front-end behaviour (no dependencies) */
(function () {
  "use strict";

  /* ---- Mobile navigation ------------------------------------------------ */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- FAQ search & filters --------------------------------------------- */
  var list = document.querySelector("[data-faq-list]");
  if (list) {
    var items = Array.prototype.slice.call(list.querySelectorAll("[data-faq-item]"));
    var searchEl = document.querySelector("[data-faq-search]");
    var roleEl = document.querySelector("[data-faq-role]");
    var stageEl = document.querySelector("[data-faq-stage]");
    var resetEl = document.querySelector("[data-faq-reset]");
    var countEl = document.querySelector("[data-faq-count]");
    var emptyEl = document.querySelector("[data-faq-empty]");

    function apply() {
      var q = (searchEl.value || "").trim().toLowerCase();
      var role = roleEl.value;
      var stage = stageEl.value;
      var shown = 0;

      items.forEach(function (item) {
        var roles = (item.getAttribute("data-roles") || "").split("|");
        var stages = (item.getAttribute("data-stages") || "").split("|");
        var text = item.textContent.toLowerCase();

        var ok =
          (!q || text.indexOf(q) !== -1) &&
          (!role || roles.indexOf(role) !== -1) &&
          (!stage || stages.indexOf(stage) !== -1);

        item.hidden = !ok;
        if (ok) shown++;
      });

      if (countEl) {
        countEl.textContent =
          shown === items.length
            ? "Showing all " + items.length + " questions"
            : "Showing " + shown + " of " + items.length + " questions";
      }
      if (emptyEl) emptyEl.hidden = shown !== 0;
    }

    [searchEl, roleEl, stageEl].forEach(function (el) {
      if (!el) return;
      el.addEventListener("input", apply);
      el.addEventListener("change", apply);
    });
    if (resetEl) {
      resetEl.addEventListener("click", function () {
        searchEl.value = "";
        roleEl.value = "";
        stageEl.value = "";
        apply();
      });
    }

    // Deep link from the home role cards: /faq/?role=End%20User
    var params = new URLSearchParams(window.location.search);
    var preRole = params.get("role");
    if (preRole && roleEl) {
      var match = Array.prototype.slice.call(roleEl.options).some(function (o) {
        return o.value === preRole;
      });
      if (match) roleEl.value = preRole;
    }
    var preStage = params.get("stage");
    if (preStage && stageEl) stageEl.value = preStage;

    apply();
  }

  /* ---- "Ask a Question" form -------------------------------------------- */
  var forms = document.querySelectorAll("[data-ask-form]");
  Array.prototype.forEach.call(forms, function (form) {
    var statusEl = form.querySelector("[data-form-status]");
    var action = form.getAttribute("action");
    var fallbackEmail = form.getAttribute("data-fallback-email");

    form.addEventListener("submit", function (e) {
      // No form service configured → open the visitor's email client.
      if (!action) {
        e.preventDefault();
        var name = (form.querySelector("[name=name]") || {}).value || "";
        var email = (form.querySelector("[name=email]") || {}).value || "";
        var role = (form.querySelector("[name=role]") || {}).value || "";
        var message = (form.querySelector("[name=message]") || {}).value || "";
        var body =
          "Name: " + name + "\nEmail: " + email + "\nRole: " + role + "\n\n" + message;
        var href =
          "mailto:" +
          encodeURIComponent(fallbackEmail || "") +
          "?subject=" +
          encodeURIComponent("O-PAS FAQ question from " + name) +
          "&body=" +
          encodeURIComponent(body);
        window.location.href = href;
        if (statusEl) {
          statusEl.textContent = "Opening your email app to send the question…";
          statusEl.className = "form-status is-ok";
        }
        return;
      }

      // A form service (e.g. Formspree) is configured → submit via fetch.
      e.preventDefault();
      var data = new FormData(form);
      if (statusEl) {
        statusEl.textContent = "Sending…";
        statusEl.className = "form-status";
      }
      fetch(action, { method: "POST", body: data, headers: { Accept: "application/json" } })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            if (statusEl) {
              statusEl.textContent = "Thanks — your question has been submitted.";
              statusEl.className = "form-status is-ok";
            }
          } else {
            throw new Error("Bad response");
          }
        })
        .catch(function () {
          if (statusEl) {
            statusEl.textContent =
              "Something went wrong. Please email " + (fallbackEmail || "us") + " instead.";
            statusEl.className = "form-status is-error";
          }
        });
    });
  });

  /* ---- Shrink header on scroll ------------------------------------------ */
  var header = document.querySelector("[data-header]");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
})();
