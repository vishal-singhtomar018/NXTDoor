// Bootstrap validation
(function () {
  "use strict";
  var forms = document.querySelectorAll(".needs-validation");
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      },
      false
    );
  });
})();

// Toggle button for hiding container (if used)
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggleButton");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const content = document.querySelector(".container");
      if (content) {
        content.classList.toggle("hidden");
      }
    });
  }

  // Icon Slider (for images below nav bar)
  const iconContainer = document.getElementById("iconContainer");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const items = document.querySelectorAll(".menu-item");
  const visibleItems = 8;

  if (iconContainer && prevBtn && nextBtn) {
    function checkSliderState() {
      if (items.length <= visibleItems) {
        prevBtn.style.display = "none";
        nextBtn.style.display = "none";
      } else {
        prevBtn.style.display = "flex";
        nextBtn.style.display = "flex";
      }
    }

    prevBtn.addEventListener("click", () => {
      iconContainer.scrollBy({ left: -150, behavior: "smooth" });
    });

    nextBtn.addEventListener("click", () => {
      iconContainer.scrollBy({ left: 150, behavior: "smooth" });
    });

    checkSliderState();
  }

  // Prevent Bootstrap dropdown from closing on filter click
  document.querySelectorAll(".dropdown-menu").forEach((menu) => {
    menu.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  });




  // Clear Filters
  const clearBtn = document.getElementById("clear-filters");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      window.location.href = "/search";
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Clean previous event listeners (safe approach to avoid multiple bindings)

  document.querySelectorAll("#priceFilter .dropdown-item").forEach((link) => {
    link.onclick = (e) => {
      e.preventDefault();
      const [min, max] = e.target.dataset.range.split("-");
      const urlParams = new URLSearchParams(window.location.search);
      if (min && max) {
        urlParams.set("min", min);
        urlParams.set("max", max);
      }
      window.location.href = `/search?${urlParams.toString()}`;
    };
  });

  document.querySelectorAll("#city-filter .dropdown-item").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const city = e.currentTarget.dataset.place; // 🔥 Correct fix
      const urlParams = new URLSearchParams(window.location.search);
      if (city) {
        urlParams.set("query", city);
      }
      window.location.href = `/search?${urlParams.toString()}`;
    });
  });
});
