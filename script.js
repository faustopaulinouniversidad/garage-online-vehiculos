document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM
  const productsContainer = document.getElementById("productsContainer");
  const loadingSpinner = document.getElementById("loadingSpinner");
  const searchInput = document.getElementById("searchInput");
  const cartBtn = document.getElementById("cartBtn");
  const cartCountSpan = document.getElementById("cartCount");
  const cartItemsContainer = document.getElementById("cartItems");
  const cartTotalSpan = document.getElementById("cartTotal");
  const errorMessage = document.getElementById("errorMessage");
  const quantityInput = document.getElementById("quantityInput");
  const addToCartModalBtn = document.getElementById("addToCartBtn");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const processPaymentBtn = document.getElementById("processPaymentBtn");
  const paymentForm = document.getElementById("paymentForm");
  const currentYearSpan = document.getElementById("currentYear");
  const resultsInfo = document.getElementById("resultsInfo");

  const detailImage = document.getElementById("detailImage");
  const detailTitle = document.getElementById("detailTitle");
  const detailList = document.getElementById("detailList");
  const detailAddToCartBtn = document.getElementById("detailAddToCartBtn");

  // Año actual en el footer
  currentYearSpan.textContent = new Date().getFullYear();

  // Datos
  let vehiclesData = [];
  let cart = [];

  // Clave para localStorage
  const CART_STORAGE_KEY = "garageOnlineCart";

  // Instancias de modales de Bootstrap
  const quantityModalElement = document.getElementById("quantityModal");
  const cartModalElement = document.getElementById("cartModal");
  const paymentModalElement = document.getElementById("paymentModal");
  const detailModalElement = document.getElementById("vehicleDetailModal");

  const quantityModal = new bootstrap.Modal(quantityModalElement);
  const cartModal = new bootstrap.Modal(cartModalElement);
  const paymentModal = new bootstrap.Modal(paymentModalElement);
  const detailModal = new bootstrap.Modal(detailModalElement);

  let selectedVehicleForQuantity = null;

  // ----------------------------
  //  LocalStorage: persistencia
  // ----------------------------
  function saveCartToStorage() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Error guardando el carrito en localStorage:", error);
    }
  }

  function loadCartFromStorage() {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        cart = JSON.parse(stored) || [];
      }
    } catch (error) {
      console.error("Error cargando el carrito desde localStorage:", error);
      cart = [];
    }
  }

  // ----------------------------
  //  Carga de datos desde JSON
  // ----------------------------
  async function loadVehicles() {
    const url =
      "https://raw.githubusercontent.com/JUANCITOPENA/Pagina_Vehiculos_Ventas/refs/heads/main/vehiculos.json";

    try {
      errorMessage.classList.add("d-none");
      loadingSpinner.classList.remove("d-none");
      productsContainer.innerHTML = "";
      productsContainer.setAttribute("aria-busy", "true");

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error al cargar datos (${response.status})`);
      }

      const data = await response.json();
      // Se asume que es un arreglo o un objeto con propiedad 'vehiculos'
      vehiclesData = Array.isArray(data) ? data : data.vehiculos || [];
      displayVehicles(vehiclesData);
    } catch (error) {
      console.error(error);
      errorMessage.textContent =
        "Ocurrió un error al cargar los vehículos. Inténtalo nuevamente más tarde.";
      errorMessage.classList.remove("d-none");
      productsContainer.innerHTML = "";
    } finally {
      loadingSpinner.classList.add("d-none");
      productsContainer.setAttribute("aria-busy", "false");
    }
  }

  // ----------------------------
  //  Mostrar vehículos
  // ----------------------------
  function displayVehicles(vehicles) {
    productsContainer.innerHTML = "";

    if (!vehicles || vehicles.length === 0) {
      productsContainer.innerHTML =
        '<p class="text-center mb-0">No se encontraron vehículos para la búsqueda actual.</p>';
      resultsInfo.textContent = "0 resultados";
      return;
    }

    const fragment = document.createDocumentFragment();

    vehicles.forEach((vehicle) => {
      const col = document.createElement("div");
      col.className = "col-sm-6 col-md-4 mb-4";

      const precio = Number(vehicle.precio_venta) || 0;

      col.innerHTML = `
        <article class="card h-100 product-card" aria-label="${vehicle.marca} ${vehicle.modelo}">
          <div class="card-img-wrapper">
            <img
              src="${vehicle.imagen}"
              class="card-img-top product-image"
              alt="${vehicle.marca} ${vehicle.modelo}"
              loading="lazy"
              data-codigo="${vehicle.codigo}"
            />
          </div>
          <div class="card-body d-flex flex-column">
            <h3 class="card-title product-title" title="${vehicle.marca} ${vehicle.modelo}">
              ${vehicle.marca} ${vehicle.modelo}
            </h3>
            <p class="card-category mb-1">${vehicle.categoria || ""}</p>
            <p class="card-type mb-1">${cleanVehicleType(vehicle.tipo)}</p>
            <p class="card-price mt-auto fw-bold">
              RD$ ${precio.toLocaleString("es-DO")}
            </p>
            <div class="mt-3 d-flex gap-2">
              <button
                type="button"
                class="btn btn-outline-secondary btn-sm flex-grow-1 viewDetailsBtn"
                data-codigo="${vehicle.codigo}"
              >
                Ver detalles
              </button>
              <button
                type="button"
                class="btn btn-primary btn-sm flex-grow-1 addToCartBtn"
                data-codigo="${vehicle.codigo}"
              >
                Añadir al carrito
              </button>
            </div>
          </div>
        </article>
      `;

      fragment.appendChild(col);
    });

    productsContainer.appendChild(fragment);
    resultsInfo.textContent = `${vehicles.length} vehículo(s)`;
    addAddToCartListeners();
  }

  // Limpia emojis del tipo
  function cleanVehicleType(tipo) {
    if (!tipo) return "";
    // Quitar emojis (Extended_Pictographic)
    return tipo.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "").trim();
  }

  // ----------------------------
  //  Filtro de búsqueda
  // ----------------------------
  function filterVehicles() {
    const query = (searchInput.value || "").trim().toLowerCase();

    if (!query) {
      displayVehicles(vehiclesData);
      return;
    }

    const filtered = vehiclesData.filter((vehicle) => {
      const marca = String(vehicle.marca || "").toLowerCase();
      const modelo = String(vehicle.modelo || "").toLowerCase();
      const categoria = String(vehicle.categoria || "").toLowerCase();

      return (
        marca.includes(query) ||
        modelo.includes(query) ||
        categoria.includes(query)
      );
    });

    displayVehicles(filtered);
  }

  // ----------------------------
  //  Gestión del carrito
  // ----------------------------
  function addAddToCartListeners() {
    const buttons = document.querySelectorAll(".addToCartBtn");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const codigo = parseInt(btn.dataset.codigo, 10);
        const vehicle = vehiclesData.find(
          (v) => Number(v.codigo) === codigo
        );
        if (vehicle) {
          showQuantityModal(vehicle);
        }
      });
    });
  }

  function showQuantityModal(vehicle) {
    selectedVehicleForQuantity = vehicle;
    quantityInput.value = 1;
    quantityModal.show();
  }

  addToCartModalBtn.addEventListener("click", () => {
    const quantity = parseInt(quantityInput.value, 10);

    if (!selectedVehicleForQuantity) return;

    if (Number.isNaN(quantity) || quantity <= 0) {
      alert("Por favor, introduce una cantidad válida mayor que cero.");
      return;
    }

    addItemToCart(selectedVehicleForQuantity, quantity);
    quantityModal.hide();
  });

  function addItemToCart(vehicle, quantity) {
    const codigo = Number(vehicle.codigo);
    const existingItem = cart.find((item) => Number(item.codigo) === codigo);
    const precio = Number(vehicle.precio_venta) || 0;

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        imagen: vehicle.imagen,
        logo: vehicle.logo,
        codigo: codigo,
        marca: vehicle.marca,
        modelo: vehicle.modelo,
        precio: precio,
        quantity: quantity,
      });
    }

    updateCartUI();
    saveCartToStorage();
  }

  function updateCartUI() {
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      cartItemsContainer.innerHTML =
        '<p class="mb-0">Tu carrito está vacío.</p>';
      cartTotalSpan.textContent = "RD$ 0.00";
      cartCountSpan.textContent = "0";
      cartCountSpan.classList.remove("pulse");
      return;
    }

    let total = 0;
    const fragment = document.createDocumentFragment();

    cart.forEach((item) => {
      const subtotal = item.precio * item.quantity;
      total += subtotal;

      const container = document.createElement("div");
      container.className =
        "cart-item d-flex align-items-center justify-content-between mb-2";

      container.innerHTML = `
        <div class="d-flex align-items-center gap-2">
          <img
            src="${item.imagen}"
            alt="${item.marca} ${item.modelo}"
            class="cart-item-image"
          />
          <div>
            <div class="fw-semibold small">
              ${item.marca} ${item.modelo}
            </div>
            <div class="text-muted small">
              Cant: ${item.quantity} • Subtotal: RD$ ${subtotal.toLocaleString(
                "es-DO"
              )}
            </div>
          </div>
        </div>
        <span class="badge bg-secondary">#${item.codigo}</span>
      `;

      fragment.appendChild(container);
    });

    cartItemsContainer.appendChild(fragment);
    cartTotalSpan.textContent = "RD$ " + total.toLocaleString("es-DO");

    const totalItems = cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    cartCountSpan.textContent = String(totalItems);

    // Dispara animación "pulse"
    cartCountSpan.classList.remove("pulse");
    // Forzamos reflow para reiniciar la animación
    void cartCountSpan.offsetWidth;
    cartCountSpan.classList.add("pulse");
  }

  // ----------------------------
  //  Simulación de pago y factura
  // ----------------------------
  processPaymentBtn.addEventListener("click", () => {
    const nameInput = document.getElementById("paymentName");
    const cardInput = document.getElementById("paymentCard");

    if (!nameInput.value.trim() || !cardInput.value.trim()) {
      alert(
        "Por favor, completa al menos tu nombre y el número de tarjeta."
      );
      return;
    }

    if (cart.length === 0) {
      alert("Tu carrito está vacío. Añade vehículos antes de pagar.");
      return;
    }

    const snapshot = cart.map((item) => ({ ...item }));
    const customerName = nameInput.value.trim();

    try {
      generateInvoice(snapshot, customerName);
      alert("Pago procesado con éxito. Tu factura PDF se ha descargado.");

      // Limpiar carrito
      cart = [];
      updateCartUI();
      saveCartToStorage();

      paymentModal.hide();
      cartModal.hide();
    } catch (error) {
      console.error("Error al generar la factura:", error);
      alert("Ocurrió un error al generar la factura. Inténtalo nuevamente.");
    }
  });

  function generateInvoice(cartItems, customerName) {
    if (!window.jspdf || !cartItems || cartItems.length === 0) {
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const date = new Date();
    let y = 20;

    doc.setFontSize(16);
    doc.text("GarageOnline - Factura de compra", 10, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(`Cliente: ${customerName}`, 10, y);
    y += 7;
    doc.text(
      `Fecha: ${date.toLocaleDateString("es-DO")} ${date.toLocaleTimeString(
        "es-DO"
      )}`,
      10,
      y
    );
    y += 10;

    doc.text("Detalle de la compra:", 10, y);
    y += 7;

    let total = 0;

    cartItems.forEach((item) => {
      const subtotal = item.precio * item.quantity;
      total += subtotal;
      const line = `${item.marca} ${item.modelo} (x${
        item.quantity
      }) - RD$ ${subtotal.toLocaleString("es-DO")}`;

      doc.text(line, 10, y);
      y += 7;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    y += 5;
    doc.setFontSize(14);
    doc.text(
      `TOTAL: RD$ ${total.toLocaleString("es-DO")}`,
      10,
      y
    );

    doc.save(`Factura_GarageOnline_${date.getTime()}.pdf`);
  }

  // ----------------------------
  //  Eventos principales
  // ----------------------------

  // Filtrado por búsqueda
  searchInput.addEventListener("input", filterVehicles);

  // Abrir carrito
  cartBtn.addEventListener("click", () => {
    cartModal.show();
  });

  // Iniciar checkout
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Tu carrito está vacío. Añade vehículos antes de pagar.");
      return;
    }
    paymentForm.reset();
    paymentModal.show();
  });

  // ----------------------------
  //  Modal de detalles (event delegation)
  // ----------------------------
  productsContainer.addEventListener("click", (event) => {
    const target = event.target;

    // Click exacto sobre botón "Ver detalles"
    if (target.classList.contains("viewDetailsBtn")) {
      const codigo = parseInt(target.getAttribute("data-codigo"), 10);
      const vehicle = vehiclesData.find(
        (v) => Number(v.codigo) === codigo
      );
      if (vehicle) {
        openDetailModal(vehicle);
      }
    }

    // Click en la imagen del vehículo
    if (target.classList.contains("product-image")) {
      const codigo = parseInt(target.getAttribute("data-codigo"), 10);
      const vehicle = vehiclesData.find(
        (v) => Number(v.codigo) === codigo
      );
      if (vehicle) {
        openDetailModal(vehicle);
      }
    }
  });

  function openDetailModal(vehicle) {
    const precio = Number(vehicle.precio_venta) || 0;

    detailImage.src = vehicle.imagen;
    detailImage.alt = `${vehicle.marca} ${vehicle.modelo}`;
    detailTitle.textContent = `${vehicle.marca} ${vehicle.modelo}`;

    detailList.innerHTML = `
      <li><strong>Categoría:</strong> ${vehicle.categoria || ""}</li>
      <li><strong>Tipo:</strong> ${cleanVehicleType(vehicle.tipo)}</li>
      <li><strong>Precio:</strong> RD$ ${precio.toLocaleString("es-DO")}</li>
      <li><strong>Código:</strong> ${vehicle.codigo}</li>
    `;

    detailAddToCartBtn.dataset.codigo = vehicle.codigo;
    detailModal.show();
  }

  // Desde el modal de detalle, añadir al carrito (abre modal de cantidad)
  detailAddToCartBtn.addEventListener("click", () => {
    const codigo = parseInt(detailAddToCartBtn.dataset.codigo, 10);
    const vehicle = vehiclesData.find(
      (v) => Number(v.codigo) === codigo
    );
    if (vehicle) {
      detailModal.hide();
      showQuantityModal(vehicle);
    }
  });

  // ----------------------------
  //  Inicialización
  // ----------------------------
  loadCartFromStorage();
  updateCartUI();
  loadVehicles();

  // Ejemplo de registro de Service Worker (conceptual, comentado)
  /*
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .catch((err) => console.error("Error al registrar el Service Worker", err));
  }
  */
});
