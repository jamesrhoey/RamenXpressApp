// Initial data
let ingredientList = [
  { name: "Noodles", qty: 5, unit: "Packs", date: "11/12/22", status: "In-stock" },
  { name: "Eggs", qty: 0, unit: "Pieces", date: "21/12/22", status: "Out of stock" },
  { name: "Pork", qty: 10, unit: "Kilograms", date: "5/12/22", status: "In-stock" },
  { name: "Chicken", qty: 0, unit: "Kilograms", date: "8/12/22", status: "Out of stock" },
  { name: "Nori", qty: 5, unit: "Packs", date: "9/1/23", status: "Low stock" },
  { name: "Garlics", qty: 20, unit: "Pieces", date: "9/1/23", status: "In-stock" },
  { name: "Onions", qty: 12, unit: "Pieces", date: "10/2/23", status: "In-stock" },
  { name: "Carrots", qty: 2, unit: "Kilograms", date: "11/2/23", status: "Low stock" },
  { name: "Beef", qty: 0, unit: "Kilograms", date: "12/2/23", status: "Out of stock" },
  { name: "Soy Sauce", qty: 15, unit: "Bottles", date: "13/2/23", status: "In-stock" },
  { name: "Salt", qty: 7, unit: "Packs", date: "14/2/23", status: "In-stock" },
  { name: "Pepper", qty: 0, unit: "Packs", date: "15/2/23", status: "Out of stock" },
];

// Pagination settings
let currentPage = 1;
const itemsPerPage = 10;
let searchTerm = "";

// DOM Elements
const tableBody = document.getElementById('ingredientsTableBody');
const searchInput = document.getElementById('searchInput');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');

// Sidebar toggle
const sidebar = document.querySelector('.sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const closeSidebar = document.getElementById('closeSidebar');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  renderTable();
  setupEventListeners();
});

function setupEventListeners() {
  // Search
  searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value.toLowerCase();
    currentPage = 1;
    renderTable();
  });

  // Pagination
  prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }
  });

  nextPageBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(getFilteredData().length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderTable();
    }
  });

  // Sidebar
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.add('show');
  });

  closeSidebar.addEventListener('click', () => {
    sidebar.classList.remove('show');
  });

  // Close sidebar when clicking outside
  document.addEventListener('click', (event) => {
    if (!sidebar.contains(event.target) && !sidebarToggle.contains(event.target)) {
      sidebar.classList.remove('show');
    }
  });

  // Add Product
  document.getElementById('saveProduct').addEventListener('click', () => {
    const name = document.getElementById('productName').value;
    const price = document.getElementById('productPrice').value;
    
    if (!name || !price) {
      Swal.fire('Error', 'Please fill in all fields', 'error');
      return;
    }

    // Add your product saving logic here
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Product added successfully!',
      timer: 2000,
      showConfirmButton: false,
      timerProgressBar: true,
      position: 'center'
    });

    // Close modal and reset form
    bootstrap.Modal.getInstance(document.getElementById('addProductModal')).hide();
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
  });

  // Add Ingredient
  document.getElementById('saveIngredient').addEventListener('click', () => {
    const name = document.getElementById('ingredientName').value;
    const quantity = document.getElementById('ingredientQuantity').value;
    
    if (!name || !quantity) {
      Swal.fire('Error', 'Please fill in all fields', 'error');
      return;
    }

    const newIngredient = {
      name: name,
      qty: Number(quantity),
      unit: "Units",
      date: new Date().toLocaleDateString(),
      status: Number(quantity) === 0 ? "Out of stock" : 
              Number(quantity) < 5 ? "Low stock" : "In-stock"
    };

    ingredientList.unshift(newIngredient);
    renderTable();

    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Ingredient added successfully!',
      timer: 2000,
      showConfirmButton: false,
      timerProgressBar: true,
      position: 'center'
    });

    // Close modal and reset form
    bootstrap.Modal.getInstance(document.getElementById('addIngredientModal')).hide();
    document.getElementById('ingredientName').value = '';
    document.getElementById('ingredientQuantity').value = '';
  });
}

// Helper Functions
function getFilteredData() {
  return ingredientList.filter(item => {
    return item.name.toLowerCase().includes(searchTerm) ||
           item.qty.toString().includes(searchTerm) ||
           item.unit.toLowerCase().includes(searchTerm) ||
           item.date.includes(searchTerm) ||
           item.status.toLowerCase().includes(searchTerm);
  });
}

function renderTable() {
  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredData.slice(startIndex, endIndex);

  // Update pagination info
  pageInfo.textContent = `Page ${totalPages === 0 ? 0 : currentPage} of ${totalPages}`;
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;

  // Render table
  tableBody.innerHTML = currentItems.map(item => `
    <tr>
      <td>${item.name}</td>
      <td>${item.qty}</td>
      <td>${item.unit}</td>
      <td>${item.date}</td>
      <td>
        <span class="${getStatusClass(item.status)}">${item.status}</span>
      </td>
      <td>
        <button class="btn btn-icon text-primary" onclick="handleAddQuantity('${item.name}')">
          <i class="fas fa-plus-circle"></i>
        </button>
        <button class="btn btn-icon text-dark" onclick="handleEdit('${item.name}')">
          <i class="fas fa-pencil-alt"></i>
        </button>
        <button class="btn btn-icon text-danger" onclick="handleDelete('${item.name}')">
          <i class="fas fa-trash-alt"></i>
        </button>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="6" class="text-center">No ingredients found.</td></tr>';
}

function getStatusClass(status) {
  switch(status) {
    case 'In-stock': return 'status-in-stock';
    case 'Low stock': return 'status-low-stock';
    case 'Out of stock': return 'status-out-of-stock';
    default: return '';
  }
}

// Action Handlers
function handleAddQuantity(name) {
  const index = ingredientList.findIndex(item => item.name === name);
  if (index !== -1) {
    ingredientList[index].qty += 1;
    updateStatus(index);
    renderTable();
  }
}

function handleEdit(name) {
  const item = ingredientList.find(item => item.name === name);
  if (item) {
    document.getElementById('editIngredientName').value = item.name;
    document.getElementById('editIngredientQuantity').value = item.qty;
    
    const editModal = new bootstrap.Modal(document.getElementById('editIngredientModal'));
    editModal.show();

    document.getElementById('saveEdit').onclick = () => {
      const newName = document.getElementById('editIngredientName').value;
      const newQty = Number(document.getElementById('editIngredientQuantity').value);

      if (!newName || newQty === "") {
        Swal.fire('Error', 'Please fill in all fields', 'error');
        return;
      }

      ingredientList[index].name = newName;
      ingredientList[index].qty = newQty;
      updateStatus(index);
      renderTable();
      editModal.hide();

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Ingredient updated successfully!',
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
        position: 'center'
      });
    };
  }
}

function handleDelete(name) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      const index = ingredientList.findIndex(item => item.name === name);
      if (index !== -1) {
        ingredientList.splice(index, 1);
        renderTable();
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Ingredient deleted successfully!',
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
          position: 'center'
        });
      }
    }
  });
}

function updateStatus(index) {
  const item = ingredientList[index];
  if (item.qty === 0) {
    item.status = "Out of stock";
  } else if (item.qty < 5) {
    item.status = "Low stock";
  } else {
    item.status = "In-stock";
  }
} 