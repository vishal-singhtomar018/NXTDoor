// ---------------- Bootstrap validation ----------------
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

// ---------------- Sidebar Toggle ----------------
const toggleBtn = document.getElementById("menu-toggle");
const sidebar = document.getElementById("sidebar");
const closeBtn = document.getElementById("close-btn");

if (toggleBtn && sidebar && closeBtn) {
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });

  closeBtn.addEventListener("click", () => {
    sidebar.classList.remove("active");
  });
}

// ---------------- Icon Slider ----------------
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

// ---------------- Prevent dropdown close on filter click ----------------
document.querySelectorAll(".dropdown-menu").forEach((menu) => {
  menu.addEventListener("click", (event) => {
    event.stopPropagation();
  });
});

// ---------------- Clear Filters ----------------
const clearBtn = document.getElementById("clear-filters");
if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    window.location.href = "/search";
  });
}

// ---------------- Filters: Price & City ----------------
document.addEventListener("DOMContentLoaded", () => {
  // Price filter
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

  // City filter
  document.querySelectorAll("#city-filter .dropdown-item").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const city = e.currentTarget.dataset.place;
      const urlParams = new URLSearchParams(window.location.search);
      if (city) {
        urlParams.set("query", city);
      }
      window.location.href = `/search?${urlParams.toString()}`;
    });
  });
});

// ---------------- Image Upload Compression ----------------
const form = document.querySelector("form");
const fileInput = document.querySelector("input[name='listing[images]']");

if (form && fileInput) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const files = Array.from(fileInput.files);
    const compressedFiles = [];

    for (const file of files) {
      try {
        const compressed = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1280,
          useWebWorker: true,
        });
        compressedFiles.push(compressed);
      } catch (error) {
        console.error("Compression error:", error);
      }
    }

    const formData = new FormData(form);
    formData.delete("listing[images]"); // remove original files

    compressedFiles.forEach((file) => {
      formData.append("images", file); // append compressed images
    });

    const res = await fetch("/listings", {
      method: "POST",
      body: formData,
    });

    if (res.redirected) {
      window.location.href = res.url;
    } else {
      const result = await res.text();
      console.log("Upload result:", result);
    }
  });
}

// ---------------- Leaflet Map ----------------
const map = L.map("map").setView([20.5937, 78.9629], 5); // India default
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// Listings from backend
const listings = <%- JSON.stringify(listings) %>;

listings.forEach((place) => {
  if (place.latitude && place.longitude) {
    L.marker([place.latitude, place.longitude])
      .addTo(map)
      .bindPopup(`<b>${place.title}</b><br>${place.location}<br>₹${place.price}`);
  }
});
