// Menu Items Data
const menuItems = [
  { name: 'Tonkotsu Ramen', price: 210, image: 'Tramen.jpg', category: 'Ramen' },
  { name: 'Tantanmen Ramen', price: 210, image: 'tantanmen.jpg', category: 'Ramen' },
  { name: 'Karaage Ramen', price: 200, image: 'karaaageRamen.jpg', category: 'Ramen' },
  { name: 'Chicken Karaage', price: 160, image: 'karaage-chicken.jpg', category: 'Side Dishes' },
  { name: 'Chashu Don', price: 150, image: 'Chashu-Don-3.jpg', category: 'Rice Bowls' },
  { name: 'Katsu Curry', price: 180, image: 'katsuCurry.jpg', category: 'Rice Bowls' },
  { name: 'California Roll Sushi', price: 170, image: 'california.jpg', category: 'Side Dishes' },
  { name: 'Gyoza', price: 80, image: 'gyoza.jpg', category: 'Side Dishes' },
  { name: 'Tempura', price: 150, image: 'tempura.jpg', category: 'Side Dishes' },
];

// Ramen Add-ons
const ramenAddOns = [
  { name: 'Extra Chashu', price: 50 },
  { name: 'Extra Egg', price: 30 },
  { name: 'Extra Noodles', price: 40 },
  { name: 'Extra Corn', price: 20 },
  { name: 'Extra Seaweed', price: 15 },
  { name: 'Extra Green Onions', price: 10 },
];

// State Variables
let cartItems = [];
let selectedCategory = 'All';
let searchQuery = '';
let orderType = 'Dine-in';
let paymentMethod = 'Cash';

// DOM Elements
const menuItemsGrid = document.getElementById('menuItemsGrid');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const searchInput = document.getElementById('searchInput');
const categoryButtons = document.querySelectorAll('[data-category]');
const orderTypeButtons = document.querySelectorAll('[data-order-type]');
const paymentMethodButtons = document.querySelectorAll('[data-payment]');
const addToCartModal = new bootstrap.Modal(document.getElementById('addToCartModal'));
const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  renderMenuItems();
  setupEventListeners();
  updateCart();
});

// Setup Event Listeners
function setupEventListeners() {
  // Search Input
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderMenuItems();
  });

  // Category Buttons
  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      categoryButtons.forEach(btn => {
        btn.classList.remove('btn-danger');
        btn.classList.add('btn-outline-danger');
      });
      button.classList.remove('btn-outline-danger');
      button.classList.add('btn-danger');
      selectedCategory = button.dataset.category;
      renderMenuItems();
    });
  });

  // Order Type Buttons
  orderTypeButtons.forEach(button => {
    button.addEventListener('click', () => {
      orderTypeButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      orderType = button.dataset.orderType;
    });
  });

  // Payment Method Buttons
  paymentMethodButtons.forEach(button => {
    button.addEventListener('click', () => {
      paymentMethodButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      paymentMethod = button.dataset.payment;
    });
  });

  // Quantity Controls
  document.getElementById('decreaseQuantity').addEventListener('click', () => {
    const quantityInput = document.getElementById('quantity');
    if (quantityInput.value > 1) {
      quantityInput.value = parseInt(quantityInput.value) - 1;
    }
  });

  document.getElementById('increaseQuantity').addEventListener('click', () => {
    const quantityInput = document.getElementById('quantity');
    quantityInput.value = parseInt(quantityInput.value) + 1;
  });

  // Add to Cart Button
  document.getElementById('addToCartBtn').addEventListener('click', handleAddToCart);

  // Checkout Button
  document.getElementById('checkoutBtn').addEventListener('click', handleCheckout);

  // Confirm Order Button
  document.getElementById('confirmOrderBtn').addEventListener('click', handlePaymentConfirm);

  // Spice Level Buttons
  document.querySelectorAll('[data-spice]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-spice]').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });

  // Sidebar Toggle
  document.getElementById('sidebarToggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('show');
  });

  document.getElementById('closeSidebar').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.remove('show');
  });
}

// Render Menu Items
function renderMenuItems() {
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery);
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  menuItemsGrid.innerHTML = filteredItems.map(item => `
    <div class="col-6 col-md-4 col-lg-3">
      <div class="card h-100" onclick="openAddToCartModal(${JSON.stringify(item).replace(/"/g, '&quot;')})">
        <img src="../assets/${item.image}" class="card-img-top" alt="${item.name}">
        <div class="card-body p-2">
          <h6 class="card-title mb-1">${item.name}</h6>
          <p class="card-text text-danger fw-bold mb-0">PHP ${item.price.toFixed(2)}</p>
        </div>
      </div>
    </div>
  `).join('');
}

// Open Add to Cart Modal
function openAddToCartModal(item) {
  document.getElementById('itemName').textContent = item.name;
  document.getElementById('itemPrice').textContent = `PHP ${item.price.toFixed(2)}`;
  document.getElementById('itemImage').src = `../assets/${item.image}`;
  document.getElementById('quantity').value = 1;

  const spiceLevelSection = document.getElementById('spiceLevelSection');
  const addOnsSection = document.getElementById('addOnsSection');
  const addOnsGrid = document.getElementById('addOnsGrid');

  if (item.category === 'Ramen') {
    spiceLevelSection.classList.remove('d-none');
    addOnsSection.classList.remove('d-none');
    addOnsGrid.innerHTML = ramenAddOns.map(addon => `
      <div class="col-6">
        <div class="card p-2" onclick="toggleAddOn(this, ${addon.price})">
          <div class="d-flex justify-content-between align-items-center">
            <span>${addon.name}</span>
            <span class="text-danger">+PHP ${addon.price.toFixed(2)}</span>
          </div>
        </div>
      </div>
    `).join('');
  } else {
    spiceLevelSection.classList.add('d-none');
    addOnsSection.classList.add('d-none');
  }

  addToCartModal.show();
}

// Toggle Add-on Selection
function toggleAddOn(element, price) {
  element.classList.toggle('selected');
}

// Handle Add to Cart
function handleAddToCart() {
  const itemName = document.getElementById('itemName').textContent;
  const item = menuItems.find(item => item.name === itemName);
  const quantity = parseInt(document.getElementById('quantity').value);
  
  let addOns = [];
  if (item.category === 'Ramen') {
    const selectedAddOns = document.querySelectorAll('#addOnsGrid .card.selected');
    addOns = Array.from(selectedAddOns).map(card => {
      const name = card.querySelector('span:first-child').textContent;
      const price = parseFloat(card.querySelector('span:last-child').textContent.replace('+PHP ', ''));
      return { name, price };
    });
  }

  const spiceLevel = document.querySelector('#spiceLevelSection .btn.active')?.dataset.spice || 'Mild';
  const addOnsTotal = addOns.reduce((sum, addon) => sum + addon.price, 0);
  const total = (item.price + addOnsTotal) * quantity;

  cartItems.push({
    ...item,
    quantity,
    addOns,
    spiceLevel,
    total
  });

  updateCart();
  addToCartModal.hide();
}

// Update Cart
function updateCart() {
  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = '<div class="text-center text-muted py-4">Your cart is empty</div>';
  } else {
    cartItemsContainer.innerHTML = cartItems.map((item, index) => `
      <div class="cart-item">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <h6 class="mb-1">${item.name}</h6>
            <p class="text-muted small mb-1">Qty: ${item.quantity}</p>
            ${item.spiceLevel ? `<p class="text-muted small mb-1">Spice: ${item.spiceLevel}</p>` : ''}
            ${item.addOns.length > 0 ? `
              <p class="text-muted small mb-0">Add-ons: ${item.addOns.map(addon => addon.name).join(', ')}</p>
            ` : ''}
          </div>
          <div class="text-end">
            <p class="mb-0">PHP ${item.total.toFixed(2)}</p>
            <button class="btn btn-link text-danger p-0" onclick="removeCartItem(${index})">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  const total = cartItems.reduce((sum, item) => sum + item.total, 0);
  cartTotal.textContent = `PHP ${total.toFixed(2)}`;
}

// Remove Cart Item
function removeCartItem(index) {
  cartItems.splice(index, 1);
  updateCart();
}

// Handle Checkout
function handleCheckout() {
  if (cartItems.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Cart is empty',
      text: 'Please add items to cart first',
      confirmButtonColor: '#dc3545'
    });
    return;
  }

  const orderTypeIcon = document.querySelector(`[data-order-type="${orderType}"] i`).className;
  const paymentMethodIcon = document.querySelector(`[data-payment="${paymentMethod}"] i`).className;
  const total = cartItems.reduce((sum, item) => sum + item.total, 0);

  document.getElementById('orderTypeIcon').className = orderTypeIcon;
  document.getElementById('orderTypeText').textContent = orderType;
  document.getElementById('paymentMethodIcon').className = paymentMethodIcon;
  document.getElementById('paymentMethodText').textContent = paymentMethod;
  document.getElementById('paymentTotal').textContent = `PHP ${total.toFixed(2)}`;

  paymentModal.show();
}

// Handle Payment Confirm
function handlePaymentConfirm() {
  Swal.fire({
    title: 'Order Completed!',
    icon: 'success',
    confirmButtonText: 'OK',
    confirmButtonColor: '#dc3545',
    customClass: {
      popup: 'rounded-lg',
      title: 'text-xl font-bold',
      confirmButton: 'rounded-lg'
    }
  }).then(() => {
    cartItems = [];
    updateCart();
    paymentModal.hide();
  });
} 