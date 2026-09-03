/* Sàn gỗ Minh Đức - main.js */
document.documentElement.classList.add("js");
(function () {
  "use strict";

  /* ---- Mobile nav ---- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () { nav.classList.toggle("open"); });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") nav.classList.remove("open");
    });
  }

  /* ---- Sticky header: solid on scroll ---- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScrollHeader = function () {
      header.classList.toggle("scrolled", window.scrollY > 40);
    };
    onScrollHeader();
    window.addEventListener("scroll", onScrollHeader, { passive: true });
  }

  /* ---- Back to top ---- */
  var toTop = document.getElementById("toTop");
  if (toTop) {
    window.addEventListener("scroll", function () {
      toTop.classList.toggle("show", window.scrollY > 700);
    }, { passive: true });
  }

  /* ---- Reveal on scroll — enhancement only; base CSS keeps content visible ---- */
  var docEl = document.documentElement;
  var revealEls = document.querySelectorAll("[data-reveal]");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (revealEls.length && "IntersectionObserver" in window && !reduceMotion) {
    docEl.classList.add("anim");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
    /* absolute safety net: after 5s, disable the hide effect entirely */
    setTimeout(function () {
      docEl.classList.remove("anim");
      revealEls.forEach(function (el) { el.classList.add("in"); });
    }, 5000);
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll(".faq__item").forEach(function (item) {
    var q = item.querySelector(".faq__q");
    var a = item.querySelector(".faq__a");
    if (!q || !a) return;
    q.addEventListener("click", function () {
      var open = item.classList.toggle("open");
      a.style.maxHeight = open ? a.scrollHeight + "px" : null;
    });
  });

  /* ---- Quote form -> Web3Forms (email) + mở Zalo ---- */
  var form = document.getElementById("quoteForm");
  var note = document.getElementById("quoteNote");
  var submitBtn = document.getElementById("quoteSubmit");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var data = {
        name: form.name.value,
        phone: form.phone.value,
        area: form.area.value || "chưa rõ",
        type: form.type.value || "cần tư vấn"
      };
      var key = form.getAttribute("data-web3forms-key");
      submitBtn.disabled = true;
      submitBtn.textContent = "Đang gửi...";

      function done() {
        form.querySelectorAll(".field, #quoteSubmit, .quote__formnote").forEach(function (el) { el.style.display = "none"; });
        note.hidden = false;
        var msg = "Yêu cầu báo giá sàn:\n- Tên: " + data.name +
          "\n- SĐT: " + data.phone + "\n- Diện tích: " + data.area + " m²" +
          "\n- Loại sàn: " + data.type;
        if (navigator.clipboard) { navigator.clipboard.writeText(msg).catch(function () {}); }
      }

      if (key && key.indexOf("REPLACE_WITH") === -1) {
        var fd = new FormData(form);
        fd.append("access_key", key);
        fd.append("message", "SĐT: " + data.phone + " | Diện tích: " + data.area + " m² | Loại sàn: " + data.type);
        fetch("https://api.web3forms.com/submit", { method: "POST", body: fd })
          .then(function () { done(); }).catch(function () { done(); });
      } else {
        done();
        window.open("https://zalo.me/0862328456", "_blank");
      }
    });
  }

  /* ---- Footer year ---- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
