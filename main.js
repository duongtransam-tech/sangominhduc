/* Sàn gỗ Minh Đức - main.js */
(function () {
  "use strict";

  // Mobile nav toggle
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") nav.classList.remove("open");
    });
  }

  // Back to top button
  var toTop = document.getElementById("toTop");
  if (toTop) {
    window.addEventListener("scroll", function () {
      toTop.classList.toggle("show", window.scrollY > 600);
    });
  }

  // Quote form -> Web3Forms (email) + mở Zalo
  var form = document.getElementById("quoteForm");
  var note = document.getElementById("quoteNote");
  var submitBtn = document.getElementById("quoteSubmit");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
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
        form.querySelectorAll(".field, #quoteSubmit").forEach(function (el) { el.style.display = "none"; });
        note.hidden = false;
        // sao chép nội dung để khách dán nhanh vào Zalo
        var msg = "Yêu cầu báo giá sàn:\n- Tên: " + data.name +
          "\n- SĐT: " + data.phone + "\n- Diện tích: " + data.area + " m²" +
          "\n- Loại sàn: " + data.type;
        if (navigator.clipboard) { navigator.clipboard.writeText(msg).catch(function () {}); }
      }

      if (key && key.indexOf("REPLACE_WITH") === -1) {
        var fd = new FormData(form);
        fd.append("access_key", key);
        fd.append("message",
          "SĐT: " + data.phone + " | Diện tích: " + data.area + " m² | Loại sàn: " + data.type);
        fetch("https://api.web3forms.com/submit", { method: "POST", body: fd })
          .then(function () { done(); })
          .catch(function () { done(); });
      } else {
        // chưa cấu hình key: vẫn báo thành công + mở Zalo
        done();
        window.open("https://zalo.me/0862328456", "_blank");
      }
    });
  }

  // Click-to-load Google Map (nhẹ trang + không tải cookie Google trước khi cần)
  var mapLoad = document.getElementById("mapLoad");
  var mapBox = document.getElementById("mapBox");
  if (mapLoad && mapBox) {
    mapLoad.addEventListener("click", function () {
      var f = document.createElement("iframe");
      f.title = "Bản đồ showroom Sàn gỗ Minh Đức";
      f.src = mapBox.getAttribute("data-src");
      f.loading = "lazy";
      f.referrerPolicy = "no-referrer-when-downgrade";
      mapBox.innerHTML = "";
      mapBox.appendChild(f);
    });
  }

  // Footer year
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
