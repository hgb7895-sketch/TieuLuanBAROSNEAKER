// --- 1. LOGIC CHO SLIDER ẢNH ---
let slideIndex = 1;
let autoSlideInterval;

function showSlides(n) {
  let slides = document.getElementsByClassName("slider-item");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  const sliderTrack = document.querySelector(".slider-track");
  if (sliderTrack) {
    // Chuyển slide bằng cách dịch chuyển toàn bộ track
    sliderTrack.style.transform = `translateX(-${(slideIndex - 1) * 100}%)`;

    // Cập nhật dấu chấm
    for (let i = 0; i < dots.length; i++) {
      dots[i].classList.remove("active");
    }
    dots[slideIndex - 1].classList.add("active");
  }
}
// Next/previous controls
function moveSlider(n) {
  showSlides((slideIndex += n));
  resetAutoSlide();
}
// Thumbnail image controls
function currentSlide(n) {
  showSlides((slideIndex = n));
  resetAutoSlide();
}
// Tự động chuyển slide
function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    moveSlider(1);
  }, 5000); // Tự động chuyển slide sau mỗi 5 giây
}
function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  startAutoSlide();
}

// --- 2. HÀM XỬ LÝ LỌC SẢN PHẨM ---
function filterProducts(brand, clickedButton) {
  const productCards = document.querySelectorAll(".product-card");

  document.querySelectorAll("#filter-menu button").forEach((button) => {
    button.classList.remove("active");
  });
  clickedButton.classList.add("active");

  productCards.forEach((card) => {
    const cardBrand = card.getAttribute("data-brand");

    if (brand === "all" || cardBrand === brand) {
      card.classList.remove("hidden");
    } else {
      card.classList.add("hidden");
    }
  });
}

// --- 3. TẢI VÀ KHỞI TẠO CHUNG KHI TẢI TRANG SẢN PHẨM (index.html) ---
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("products-grid");

  // Kiểm tra nếu đây là trang index.html
  if (grid && typeof productData !== "undefined") {
    // Tải sản phẩm
    grid.innerHTML = productData
      .map(
        (p) => `
        <div class="product-card" data-brand="${p.brand}" data-name="${
          p.title
        }" data-price="${p.price}">
          <img src="${p.image}" alt="${p.title}" />
          <div class="product-info">
            <h3>${p.title}</h3>
            <p class="price">${p.price.toLocaleString("vi-VN")}₫</p>
            <button class="add-to-cart" onclick="themVaoGioHang(this)">
              Thêm vào Giỏ
            </button>
          </div>
        </div>
      `
      )
      .join("");

    // Khởi tạo bộ lọc mặc định
    const defaultButton = document.querySelector("#filter-menu button.active");
    if (defaultButton) {
      filterProducts("all", defaultButton);
    }

    // Khởi tạo Slider
    showSlides(slideIndex);
    startAutoSlide();
  }
});

// Thêm event listener cho các nút điều hướng và chấm để reset auto-slide
document.querySelectorAll(".slider-button, .dot").forEach((control) => {
  control.addEventListener("click", resetAutoSlide);
});
