// --- 1. BIẾN GLOBAL VÀ DỮ LIỆU GIỎ HÀNG ---
// Sử dụng Local Storage để duy trì giỏ hàng giữa các trang
let cart = JSON.parse(localStorage.getItem("barosneaker_cart")) || [];

// Cập nhật số lượng giỏ hàng trên icon
function updateCartCount() {
  document.getElementById("cart-count").textContent = cart.length;
}

// Gọi hàm này khi khởi tạo và bất cứ khi nào giỏ hàng thay đổi
document.addEventListener("DOMContentLoaded", updateCartCount);

// --- 2. HÀM THÊM VÀO GIỎ HÀNG (Dùng trên index.html) ---
function themVaoGioHang(buttonElement) {
  const productCard = buttonElement.closest(".product-card");
  const name = productCard.getAttribute("data-name");
  const priceText = productCard.getAttribute("data-price");
  const price = parseInt(priceText);
  const image = productCard.querySelector("img").getAttribute("src");

  const product = {
    id: Date.now(), // Tạo ID duy nhất dựa trên thời gian hiện tại
    name: name, // Tên sản phẩm được lấy từ productData
    price: price, // Giá sản phẩm
    image: image, // Đường dẫn hình ảnh sản phẩm
    quantity: 1, // Số lượng mặc định khi thêm vào giỏ hàng
  };

  cart.push(product);

  localStorage.setItem("barosneaker_cart", JSON.stringify(cart));
  updateCartCount();

  alert(`Đã thêm "${name}" vào giỏ hàng!\nTổng số mặt hàng: ${cart.length}.`);

  // Hiệu ứng nút
  buttonElement.disabled = true;
  buttonElement.textContent = "Đã thêm ✔️";

  setTimeout(() => {
    buttonElement.disabled = false;
    buttonElement.textContent = "Thêm vào Giỏ";
  }, 1500);
}

// --- 3. HÀM XÓA KHỎI GIỎ HÀNG (Dùng trên cart.html) ---
function xoaKhoiGioHang(itemId) {
  cart = cart.filter((item) => item.id !== itemId);
  localStorage.setItem("barosneaker_cart", JSON.stringify(cart));
  updateCartCount();
  renderCart(); // Tải lại giao diện Giỏ hàng
  alert("Đã xóa sản phẩm khỏi giỏ hàng.");
}

// --- 4. HÀM HIỂN THỊ GIỎ HÀNG (Dùng trên cart.html) ---
function renderCart() {
  const cartListElement = document.getElementById("cart-list");
  const cartTotalElement = document.getElementById("cart-total");
  const checkoutButton = document.getElementById("checkoutBtn");

  if (!cartListElement) return; // Đảm bảo chỉ chạy trên cart.html

  let total = 0;
  let cartHTML = "";

  if (cart.length === 0) {
    cartHTML =
      '<p style="text-align: center; font-style: italic;">Giỏ hàng của bạn đang trống. Hãy thêm sản phẩm trước khi thanh toán!</p>';
    checkoutButton.disabled = true;
  } else {
    checkoutButton.disabled = false;

    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const formattedPrice = item.price.toLocaleString("vi-VN") + " VNĐ";
      const formattedItemTotal = itemTotal.toLocaleString("vi-VN") + " VNĐ";

      cartHTML += `
  <div class="cart-item" style="display: flex; align-items: center; justify-content: space-between; gap: 15px; padding: 10px; border-bottom: 1px solid #ddd;">
      <img src="${item.image}" alt="${item.name}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 8px;">
      <div style="flex-grow: 1;">
          <strong>${item.name}</strong><br>
          <small>SL: ${item.quantity} x ${formattedPrice}</small>
      </div>
      <strong>${formattedItemTotal}</strong>
      <button onclick="xoaKhoiGioHang(${item.id})"
              class="remove-btn"
              style="
                  background: #dc3545;
                  color: white;
                  border: none;
                  padding: 5px 10px;
                  margin-left: 15px;
                  border-radius: 5px;
                  cursor: pointer;
                  font-size: 0.8em;
              ">
          Xóa
      </button>
  </div>
`;
    });
  }

  cartListElement.innerHTML = cartHTML;
  cartTotalElement.textContent = total.toLocaleString("vi-VN") + " VNĐ";
}

// --- 5. LOGIC XỬ LÝ FORM THANH TOÁN (Dùng trên cart.html) ---
document.addEventListener("DOMContentLoaded", () => {
  const checkoutButton = document.getElementById("checkoutBtn");
  const checkoutModal = document.getElementById("checkoutModal");
  const checkoutForm = document.getElementById("checkoutForm");
  const successModal = document.getElementById("successModal");
  const closeModal = document.getElementById("closeModal");

  if (checkoutButton) {
    // 5.1. Hiển thị Form khi bấm "Thanh Toán Ngay"
    checkoutButton.addEventListener("click", function () {
      if (cart.length > 0) {
        checkoutModal.style.display = "block";
      } else {
        alert("Giỏ hàng đang trống! Vui lòng thêm sản phẩm.");
      }
    });

    // 5.2. Đóng Form khi bấm nút X
    closeModal.addEventListener("click", function () {
      checkoutModal.style.display = "none";
    });

    // 5.3. Đóng Form khi click ra ngoài Modal
    window.addEventListener("click", function (event) {
      if (event.target == checkoutModal) {
        checkoutModal.style.display = "none";
      }
    });

    // 5.4. Xử lý sự kiện "Xác nhận đơn"
    checkoutForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!checkoutForm.checkValidity()) {
        alert("Vui lòng điền đầy đủ và chính xác thông tin bắt buộc!");
        return;
      }

      // 2. GIẢ LẬP XỬ LÝ ĐƠN HÀNG
      const formData = {
        name: document.getElementById("fullName").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value,
        email: document.getElementById("email").value,
        shoeSize: document.getElementById("shoeSize").value,
        items: cart,
      };

      console.log("Dữ liệu đơn hàng giả lập:", formData);

      // 3. Ẩn Form Thanh Toán và hiện Thông báo Thành công
      checkoutModal.style.display = "none";
      successModal.style.display = "block";

      // Xóa giỏ hàng sau khi đặt hàng thành công
      cart = [];
      localStorage.removeItem("barosneaker_cart");
      updateCartCount();
    });
  }
});
