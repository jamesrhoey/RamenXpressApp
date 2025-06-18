// Global variables
let menuItems = [];
let cartItems = [];
let selectedCategory = 'All';
let searchQuery = '';
let orderType = 'dine-in';
let paymentMethod = 'cash';

// API Base URL
const API_BASE_URL = 'http://localhost:3000/api/v1';

// Authentication utilities
function getAuthToken() {
    return localStorage.getItem('authToken');
}

function isAuthenticated() {
    return !!getAuthToken();
}

function redirectToLogin() {
    window.location.href = '../login.html';
}

// API request helper
async function apiRequest(endpoint, options = {}) {
    const token = getAuthToken();
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    };

    const config = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        if (response.status === 401) {
            redirectToLogin();
            return;
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// Ramen Add-ons
const ramenAddOns = [
  { name: 'Extra Chashu', price: 50 },
  { name: 'Extra Egg', price: 30 },
  { name: 'Extra Noodles', price: 40 },
  { name: 'Extra Corn', price: 20 },
  { name: 'Extra Seaweed', price: 15 },
  { name: 'Extra Green Onions', price: 10 },
];

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
document.addEventListener('DOMContentLoaded', async () => {
    if (!isAuthenticated()) {
        redirectToLogin();
        return;
    }

    await loadMenuItems();
    setupEventListeners();
    updateCart();
});

// Load menu items from API
async function loadMenuItems() {
    try {
        const response = await apiRequest('/menu/allmenu');
        menuItems = response || [];
        renderMenuItems();
    } catch (error) {
        console.error('Failed to load menu items:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load menu items. Please try again.'
        });
    }
}

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
      // Map frontend order types to backend values
      const orderTypeMap = {
        'Dine-in': 'dine-in',
        'Takeout': 'takeout',
        'Pickup': 'takeout'
      };
      orderType = orderTypeMap[button.dataset.orderType] || 'dine-in';
    });
  });

  // Payment Method Buttons
  paymentMethodButtons.forEach(button => {
    button.addEventListener('click', () => {
      paymentMethodButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      // Map frontend payment methods to backend values
      const paymentMap = {
        'Cash': 'cash',
        'GCash': 'gcash',
        'Maya': 'paymaya'
      };
      paymentMethod = paymentMap[button.dataset.payment] || 'cash';
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

  // Sidebar Toggle
  document.getElementById('sidebarToggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('show');
  });

  document.getElementById('closeSidebar').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.remove('show');
  });
}

// Format category for display
function formatCategory(category) {
    const categoryMap = {
        'ramen': 'Ramen',
        'rice bowls': 'Rice Bowls',
        'side dishes': 'Side Dishes',
        'sushi': 'Sushi',
        'party trays': 'Party Trays',
        'add-ons': 'Add-ons',
        'drinks': 'Drinks'
    };
    return categoryMap[category] || category;
}

// Render Menu Items
function renderMenuItems() {
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery);
    const matchesCategory = selectedCategory === 'All' || formatCategory(item.category) === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  menuItemsGrid.innerHTML = filteredItems.map(item => `
    <div class="col-6 col-md-4 col-lg-3">
      <div class="card h-100" onclick="openAddToCartModal(${JSON.stringify(item).replace(/"/g, '&quot;')})">
        <img src="${getImageUrl(item.image)}" class="card-img-top" alt="${item.name}" onerror="this.src='../assets/placeholder.jpg'">
        <div class="card-body p-2">
          <h6 class="card-title mb-1">${item.name}</h6>
          <p class="card-text text-danger fw-bold mb-0">PHP ${item.price.toFixed(2)}</p>
        </div>
      </div>
    </div>
  `).join('');
}

// Helper function to get correct image URL
function getImageUrl(imagePath) {
  if (!imagePath) {
    return '../assets/placeholder.jpg';
  }
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it starts with /uploads/, it's a backend image
  if (imagePath.startsWith('/uploads/')) {
    return `http://localhost:3000${imagePath}`;
  }
  
  // If it's a relative path, assume it's in assets
  if (imagePath.startsWith('../') || imagePath.startsWith('./')) {
    return imagePath;
  }
  
  // Default to assets folder
  return `../assets/${imagePath}`;
}

// Open Add to Cart Modal
function openAddToCartModal(item) {
  document.getElementById('itemName').textContent = item.name;
  document.getElementById('itemPrice').textContent = `PHP ${item.price.toFixed(2)}`;
  document.getElementById('itemImage').src = getImageUrl(item.image);
  document.getElementById('itemImage').onerror = function() {
    this.src = '../assets/placeholder.jpg';
  };
  document.getElementById('quantity').value = 1;

  const addOnsSection = document.getElementById('addOnsSection');
  const addOnsGrid = document.getElementById('addOnsGrid');

  if (item.category === 'ramen') {
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
  if (item.category === 'ramen') {
    const selectedAddOns = document.querySelectorAll('#addOnsGrid .card.selected');
    addOns = Array.from(selectedAddOns).map(card => {
      const name = card.querySelector('span:first-child').textContent;
      const price = parseFloat(card.querySelector('span:last-child').textContent.replace('+PHP ', ''));
      return { name, price };
    });
  }

  const addOnsTotal = addOns.reduce((sum, addon) => sum + addon.price, 0);
  const total = (item.price + addOnsTotal) * quantity;

  cartItems.push({
    ...item,
    quantity,
    addOns,
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

  const orderTypeIcon = document.querySelector(`[data-order-type="${orderType === 'dine-in' ? 'Dine-in' : 'Takeout'}"] i`).className;
  const paymentMethodIcon = document.querySelector(`[data-payment="${paymentMethod === 'cash' ? 'Cash' : paymentMethod === 'gcash' ? 'GCash' : 'Maya'}"] i`).className;
  const total = cartItems.reduce((sum, item) => sum + item.total, 0);

  document.getElementById('orderTypeIcon').className = orderTypeIcon;
  document.getElementById('orderTypeText').textContent = orderType === 'dine-in' ? 'Dine-in' : 'Takeout';
  document.getElementById('paymentMethodIcon').className = paymentMethodIcon;
  document.getElementById('paymentMethodText').textContent = paymentMethod === 'cash' ? 'Cash' : paymentMethod === 'gcash' ? 'GCash' : 'Maya';
  document.getElementById('paymentTotal').textContent = `PHP ${total.toFixed(2)}`;

  paymentModal.show();
}

// Handle Payment Confirm
async function handlePaymentConfirm() {
  try {
    // Prepare order data for API
    const orderData = {
      items: cartItems.map(item => ({
        menuId: item._id,
        quantity: item.quantity,
        addOns: item.addOns || []
      })),
      orderType: orderType,
      paymentMethod: paymentMethod
    };

    // Send order to backend
    const response = await apiRequest('/sales/order', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });

    Swal.fire({
      title: 'Order Completed!',
      text: `Order ID: ${response.orderDetails.orderId}`,
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

  } catch (error) {
    console.error('Error processing order:', error);
    Swal.fire({
      icon: 'error',
      title: 'Order Failed',
      text: 'Failed to process order. Please try again.',
      confirmButtonColor: '#dc3545'
    });
  }
}