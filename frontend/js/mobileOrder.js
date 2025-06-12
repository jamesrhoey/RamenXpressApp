// Sidebar Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const closeSidebar = document.getElementById('closeSidebar');

    // Toggle sidebar on button click
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.add('show');
    });

    // Close sidebar on close button click
    closeSidebar.addEventListener('click', function() {
        sidebar.classList.remove('show');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768 && 
            !sidebar.contains(event.target) && 
            !sidebarToggle.contains(event.target) && 
            sidebar.classList.contains('show')) {
            sidebar.classList.remove('show');
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('show');
        }
    });
});

// Mobile Order Specific Functions
function initializeMobileOrder() {
    // Add your mobile order specific initialization code here
    console.log('Mobile Order initialized');
}

// Call initialization function
initializeMobileOrder();

const handleUpdateStatus = (e) => {
  const newStatus = e.target.value;

  if (
    selectedOrder.paymentMethod.toLowerCase().includes('cash') &&
    newStatus === 'delivered' &&
    selectedOrder.paymentStatus !== 'Paid'
  ) {
    Swal.fire({
      title: 'Mark as Paid?',
      text: 'This is a COD order. Mark payment as received?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, mark as paid',
      cancelButtonText: 'No, just update delivery'
    }).then((result) => {
      let updatedOrders;
      if (result.isConfirmed) {
        updatedOrders = orders.map(order =>
          order.id === selectedOrder.id
            ? { ...order, deliveryStatus: newStatus, paymentStatus: 'Paid' }
            : order
        );
        setSelectedOrder({ ...selectedOrder, deliveryStatus: newStatus, paymentStatus: 'Paid' });
      } else {
        updatedOrders = orders.map(order =>
          order.id === selectedOrder.id
            ? { ...order, deliveryStatus: newStatus }
            : order
        );
        setSelectedOrder({ ...selectedOrder, deliveryStatus: newStatus });
      }
      setOrders(updatedOrders);
      Swal.fire('Updated!', 'Order status updated.', 'success');
    });
  } else {
    // ... your existing status update logic
  }
};

// --- Mobile Order Management ---

// Sample orders data
let orders = [
  {
    id: '#ORD-1001',
    customer: 'James De Castro',
    date: '2023-06-15 10:30 AM',
    total: 299.99,
    paymentStatus: 'Paid',
    deliveryStatus: 'processing',
    items: [
      {
        name: 'Shoyu Ramen',
        price: 299.99,
        quantity: 1,
        image: '../assets/ramen.png'
      }
    ],
    customerInfo: {
      name: 'James De Castro',
      email: 'james@example.com',
      phone: '+632 1234 5678',
      address: '123 Main Street'
    },
    paymentMethod: 'Gcash',
  },
  {
    id: '#ORD-1002',
    customer: 'Juan Dela Cruz',
    date: '2023-06-16 11:45 AM',
    total: 210,
    paymentStatus: 'Pending',
    deliveryStatus: 'pending',
    items: [
      {
        name: 'Spicy Ramen',
        price: 210,
        quantity: 1,
        image: '../assets/ramen.png'
      }
    ],
    customerInfo: {
      name: 'Juan Dela Cruz',
      email: 'juan@example.com',
      phone: '+632 9876 5432',
      address: '456 Magulo Street'
    },
    paymentMethod: 'Cash on Delivery',
  },
  {
    id: '#ORD-1003',
    customer: 'Maria Santos',
    date: '2023-06-17 09:20 AM',
    total: 350.00,
    paymentStatus: 'Paid',
    deliveryStatus: 'delivered',
    items: [
      {
        name: 'Miso Ramen',
        price: 350.00,
        quantity: 1,
        image: '../assets/ramen.png'
      }
    ],
    customerInfo: {
      name: 'Maria Santos',
      email: 'maria@example.com',
      phone: '+632 5555 1234',
      address: '789 Peace Ave'
    },
    paymentMethod: 'Gcash',
  },
  {
    id: '#ORD-1004',
    customer: 'John Smith',
    date: '2023-06-18 14:10 PM',
    total: 180.00,
    paymentStatus: 'Failed',
    deliveryStatus: 'cancelled',
    items: [
      {
        name: 'Tonkotsu Ramen',
        price: 180.00,
        quantity: 1,
        image: '../assets/ramen.png'
      }
    ],
    customerInfo: {
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+632 2222 3333',
      address: '321 Busy St'
    },
    paymentMethod: 'Cash on Delivery',
  },
  {
    id: '#ORD-1005',
    customer: 'Anna Lee',
    date: '2023-06-19 16:30 PM',
    total: 400.00,
    paymentStatus: 'Refunded',
    deliveryStatus: 'delivered',
    items: [
      {
        name: 'Seafood Ramen',
        price: 400.00,
        quantity: 1,
        image: '../assets/ramen.png'
      }
    ],
    customerInfo: {
      name: 'Anna Lee',
      email: 'anna@example.com',
      phone: '+632 7777 8888',
      address: '654 Ocean Dr'
    },
    paymentMethod: 'GCash',
  },
  {
    id: '#ORD-1006',
    customer: 'Carlos Rivera',
    date: '2023-06-20 10:00 AM',
    total: 250.00,
    paymentStatus: 'Paid',
    deliveryStatus: 'processing',
    items: [
      { name: 'Veggie Ramen', price: 250.00, quantity: 1, image: '../assets/ramen.png' }
    ],
    customerInfo: { name: 'Carlos Rivera', email: 'carlos@example.com', phone: '+632 8888 9999', address: '123 Green St' },
    paymentMethod: 'PayMaya',
  },
  {
    id: '#ORD-1007',
    customer: 'Liza Cruz',
    date: '2023-06-21 12:30 PM',
    total: 320.00,
    paymentStatus: 'Pending',
    deliveryStatus: 'pending',
    items: [
      { name: 'Chicken Ramen', price: 320.00, quantity: 1, image: '../assets/ramen.png' }
    ],
    customerInfo: { name: 'Liza Cruz', email: 'liza@example.com', phone: '+632 1111 2222', address: '456 Blue St' },
    paymentMethod: 'PayMaya',
  },
  {
    id: '#ORD-1008',
    customer: 'Mark Tan',
    date: '2023-06-22 15:00 PM',
    total: 280.00,
    paymentStatus: 'Paid',
    deliveryStatus: 'delivered',
    items: [
      { name: 'Pork Ramen', price: 280.00, quantity: 1, image: '../assets/ramen.png' }
    ],
    customerInfo: { name: 'Mark Tan', email: 'mark@example.com', phone: '+632 3333 4444', address: '789 Red St' },
    paymentMethod: 'PayMaya',
  },
  {
    id: '#ORD-1009',
    customer: 'Sandy Lim',
    date: '2023-06-23 18:45 PM',
    total: 310.00,
    paymentStatus: 'Refunded',
    deliveryStatus: 'cancelled',
    items: [
      { name: 'Shrimp Ramen', price: 310.00, quantity: 1, image: '../assets/ramen.png' }
    ],
    customerInfo: { name: 'Sandy Lim', email: 'sandy@example.com', phone: '+632 5555 6666', address: '321 Yellow St' },
    paymentMethod: 'Gcash',
  },
  {
    id: '#ORD-1010',
    customer: 'Paul Gomez',
    date: '2023-06-24 20:10 PM',
    total: 360.00,
    paymentStatus: 'Paid',
    deliveryStatus: 'processing',
    items: [
      { name: 'Kimchi Ramen', price: 360.00, quantity: 1, image: '../assets/ramen.png' }
    ],
    customerInfo: { name: 'Paul Gomez', email: 'paul@example.com', phone: '+632 7777 0000', address: '654 Pink St' },
    paymentMethod: 'PayMaya',
  }
];

let selectedOrder = null;

let filters = {
  date: '',
  orderStatus: '',
  paymentMethod: ''
};

let currentPage = 1;
const ORDERS_PER_PAGE = 5;

function filterOrders() {
  let filtered = orders;
  // Date filter (YYYY-MM-DD or range)
  const dateVal = document.getElementById('filterDate').value;
  if (dateVal) {
    filtered = filtered.filter(order => {
      const orderDate = new Date(order.date);
      // If range, format: YYYY-MM-DD - YYYY-MM-DD
      if (dateVal.includes(' - ')) {
        const [start, end] = dateVal.split(' - ');
        const startDate = new Date(start);
        const endDate = new Date(end);
        return orderDate >= startDate && orderDate <= endDate;
      } else {
        // Single date
        const filterDate = new Date(dateVal);
        return orderDate.toDateString() === filterDate.toDateString();
      }
    });
  }
  // Order status filter
  const statusVal = document.getElementById('filterOrderStatus').value;
  if (statusVal && statusVal !== 'all') {
    filtered = filtered.filter(order => order.deliveryStatus === statusVal);
  }
  // Payment method filter
  const payVal = document.getElementById('filterPaymentMethod').value;
  if (payVal && payVal !== 'all') {
    filtered = filtered.filter(order => order.paymentMethod.toLowerCase().includes(payVal.toLowerCase()));
  }
  return filtered;
}

function renderOrdersTable() {
  const tbody = document.getElementById('ordersTableBody');
  tbody.innerHTML = '';
  const filteredOrders = filterOrders();
  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  if (currentPage > totalPages) currentPage = totalPages || 1;
  const startIdx = (currentPage - 1) * ORDERS_PER_PAGE;
  const endIdx = startIdx + ORDERS_PER_PAGE;
  filteredOrders.slice(startIdx, endIdx).forEach((order) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${order.id}</td>
      <td>${order.customer}</td>
      <td>${order.date}</td>
      <td>₱${order.total.toFixed(2)}</td>
      <td><span class="badge ${order.paymentStatus === 'Paid' ? 'bg-success' : order.paymentStatus === 'Pending' ? 'bg-warning' : order.paymentStatus === 'Refunded' ? 'bg-info' : order.paymentStatus === 'Failed' ? 'bg-danger' : 'bg-secondary'}">${order.paymentStatus}</span></td>
      <td><span class="badge rounded-pill ${getDeliveryStatusClass(order.deliveryStatus)}">${capitalize(order.deliveryStatus)}</span></td>
      <td><button class="btn btn-outline-primary btn-sm" data-idx="${orders.indexOf(order)}" data-bs-toggle="modal" data-bs-target="#orderDetailsModal"><i class="fa fa-eye"></i> View</button></td>
    `;
    tbody.appendChild(tr);
  });
  attachViewHandlers();
  renderPagination(totalPages);
}

function attachViewHandlers() {
  document.querySelectorAll('button[data-bs-target="#orderDetailsModal"]').forEach(btn => {
    btn.onclick = function() {
      const idx = this.getAttribute('data-idx');
      selectedOrder = orders[idx];
      populateOrderModal(selectedOrder);
    };
  });
}

function populateOrderModal(order) {
  // Set modal title
  document.getElementById('orderDetailsModalLabel').textContent = `Order Details - ${order.id}`;
  // Order Summary
  document.getElementById('modalOrderId').textContent = order.id;
  document.getElementById('modalOrderDate').textContent = order.date;
  document.getElementById('modalCustomerName').textContent = order.customerInfo.name;
  document.getElementById('modalCustomerEmail').textContent = order.customerInfo.email;
  document.getElementById('modalCustomerPhone').textContent = order.customerInfo.phone;
  document.getElementById('modalCustomerAddress').textContent = order.customerInfo.address;
  document.getElementById('modalPaymentMethod').textContent = order.paymentMethod;
  document.getElementById('modalPaymentStatus').textContent = order.paymentStatus;
  document.getElementById('modalPaymentStatus').className = `badge ${getPaymentStatusClass(order.paymentStatus)} px-3 py-2`;
  // Delivery status
  document.getElementById('modalDeliveryStatusBadge').textContent = capitalize(order.deliveryStatus);
  document.getElementById('modalDeliveryStatusBadge').className = `badge rounded-pill ${getDeliveryStatusClass(order.deliveryStatus)} px-3 py-2`;
  document.getElementById('modalDeliveryStatusSelect').value = order.deliveryStatus;
  // Order Items
  const itemsTbody = document.getElementById('modalOrderItems');
  itemsTbody.innerHTML = '';
  order.items.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><img src="${item.image}" alt="Product" style="width:40px; height:40px; object-fit:cover; border-radius:8px; margin-right:8px;"> ${item.name}</td>
      <td>₱${item.price.toFixed(2)}</td>
      <td>${item.quantity}</td>
      <td>₱${(item.price * item.quantity).toFixed(2)}</td>
    `;
    itemsTbody.appendChild(tr);
  });
  document.getElementById('modalOrderTotal').textContent = `₱${order.total.toFixed(2)}`;
}

function getDeliveryStatusClass(status) {
  switch (status) {
    case 'pending': return 'bg-warning-subtle text-warning-emphasis';
    case 'processing': return 'bg-primary-subtle text-primary-emphasis';
    case 'delivered': return 'bg-success-subtle text-success-emphasis';
    case 'cancelled': return 'bg-danger-subtle text-danger-emphasis';
    default: return 'bg-secondary';
  }
}
function getPaymentStatusClass(status) {
  switch (status) {
    case 'Paid': return 'bg-success';
    case 'Pending': return 'bg-warning';
    case 'Refunded': return 'bg-info';
    case 'Failed': return 'bg-danger';
    default: return 'bg-secondary';
  }
}
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function renderPagination(totalPages) {
  const pagination = document.querySelector('.pagination');
  if (!pagination) return;
  pagination.innerHTML = '';
  const prevClass = currentPage === 1 ? 'disabled' : '';
  pagination.innerHTML += `<li class="page-item ${prevClass}"><a class="page-link" href="#" id="prevPageBtn">Previous</a></li>`;
  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `<li class="page-item ${i === currentPage ? 'active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
  }
  const nextClass = currentPage === totalPages ? 'disabled' : '';
  pagination.innerHTML += `<li class="page-item ${nextClass}"><a class="page-link" href="#" id="nextPageBtn">Next</a></li>`;

  // Pagination events
  document.getElementById('prevPageBtn')?.addEventListener('click', function(e) {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      renderOrdersTable();
    }
  });
  document.getElementById('nextPageBtn')?.addEventListener('click', function(e) {
    e.preventDefault();
    const filteredOrders = filterOrders();
    const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
    if (currentPage < totalPages) {
      currentPage++;
      renderOrdersTable();
    }
  });
  document.querySelectorAll('.page-link[data-page]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      currentPage = parseInt(this.getAttribute('data-page'));
      renderOrdersTable();
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // Add IDs to filter fields in HTML: filterDate, filterOrderStatus, filterPaymentMethod
  document.getElementById('filterApplyBtn').addEventListener('click', function(e) {
    e.preventDefault();
    renderOrdersTable();
  });
  renderOrdersTable();

  // Delivery status change handler
  document.getElementById('modalDeliveryStatusSelect').addEventListener('change', function(e) {
    const newStatus = e.target.value;
    if (
      selectedOrder.paymentMethod.toLowerCase().includes('cash') &&
      newStatus === 'delivered' &&
      selectedOrder.paymentStatus !== 'Paid'
    ) {
      Swal.fire({
        title: 'Mark as Paid?',
        text: 'This is a COD order. Mark payment as received?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, mark as paid',
        cancelButtonText: 'No, just update delivery'
      }).then((result) => {
        if (result.isConfirmed) {
          selectedOrder.deliveryStatus = newStatus;
          selectedOrder.paymentStatus = 'Paid';
        } else {
          selectedOrder.deliveryStatus = newStatus;
        }
        renderOrdersTable();
        populateOrderModal(selectedOrder);
        Swal.fire('Updated!', 'Order status updated.', 'success');
      });
    } else {
      selectedOrder.deliveryStatus = newStatus;
      renderOrdersTable();
      populateOrderModal(selectedOrder);
      Swal.fire('Updated!', 'Order status updated.', 'success');
    }
  });

  // Payment status dropdown
  document.querySelectorAll('#modalUpdatePaymentStatusBtn + .dropdown-menu .dropdown-item').forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const newStatus = this.getAttribute('data-status');
      Swal.fire({
        title: 'Confirm Payment Status Change',
        text: `Are you sure you want to change payment status to ${newStatus}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!'
      }).then((result) => {
        if (result.isConfirmed) {
          selectedOrder.paymentStatus = newStatus;
          renderOrdersTable();
          populateOrderModal(selectedOrder);
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: `Payment status updated to: ${newStatus}`,
            showConfirmButton: false,
            timer: 1500
          });
        }
      });
    });
  });

  // Cancel Order
  document.getElementById('modalCancelOrderBtn').addEventListener('click', function() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to cancel this order?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!'
    }).then((result) => {
      if (result.isConfirmed) {
        selectedOrder.deliveryStatus = 'cancelled';
        renderOrdersTable();
        populateOrderModal(selectedOrder);
        Swal.fire('Cancelled!', 'The order has been cancelled.', 'success');
        // Optionally close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('orderDetailsModal'));
        modal.hide();
      }
    });
  });

  // Close Modal
  document.getElementById('modalCloseBtn').addEventListener('click', function() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('orderDetailsModal'));
    modal.hide();
  });

  $(function() {
    $('#filterDate').daterangepicker({
      autoUpdateInput: false,
      locale: {
        cancelLabel: 'Clear'
      }
    });

    $('#filterDate').on('apply.daterangepicker', function(ev, picker) {
      $(this).val(picker.startDate.format('YYYY-MM-DD') + ' - ' + picker.endDate.format('YYYY-MM-DD'));
    });

    $('#filterDate').on('cancel.daterangepicker', function(ev, picker) {
      $(this).val('');
    });
  });
});
