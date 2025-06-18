// Global variables
let currentPage = 1;
let itemsPerPage = 10;
let allIngredients = [];
let selectedIngredients = [];
let currentEditingIngredient = null;

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

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    if (!isAuthenticated()) {
        redirectToLogin();
        return;
    }

    initializePage();
    setupEventListeners();
    loadIngredients();
});

function initializePage() {
    // Initialize Bootstrap components
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

function setupEventListeners() {
    // Search functionality
    document.getElementById('searchInput').addEventListener('input', function(e) {
        filterIngredients(e.target.value);
    });

    // Pagination
    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayIngredients();
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        const maxPages = Math.ceil(allIngredients.length / itemsPerPage);
        if (currentPage < maxPages) {
            currentPage++;
            displayIngredients();
        }
    });

    // Modal form submissions
    document.getElementById('addProductForm').addEventListener('submit', handleAddProduct);
    document.getElementById('saveIngredient').addEventListener('click', handleAddIngredient);
    document.getElementById('saveEdit').addEventListener('click', handleEditIngredient);
    document.getElementById('saveQuantity').addEventListener('click', handleUpdateQuantity);

    // Sidebar toggle
    document.getElementById('sidebarToggle').addEventListener('click', function() {
        document.querySelector('.sidebar').classList.toggle('show');
    });

    document.getElementById('closeSidebar').addEventListener('click', function() {
        document.querySelector('.sidebar').classList.remove('show');
    });

    // Quantity calculation for add quantity modal
    document.getElementById('addQuantity').addEventListener('input', function() {
        const currentQty = parseInt(document.getElementById('currentQuantity').value) || 0;
        const addQty = parseInt(this.value) || 0;
        document.getElementById('newTotal').value = currentQty + addQty;
    });
}

// Load all ingredients from API
async function loadIngredients() {
    try {
        const response = await apiRequest('/inventory/all');
        allIngredients = response.data || response || [];
        displayIngredients();
        updateIngredientSelect();
        updateStats();
    } catch (error) {
        console.error('Failed to load ingredients:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load ingredients. Please try again.'
        });
    }
}

// Display ingredients with pagination
function displayIngredients() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedIngredients = allIngredients.slice(startIndex, endIndex);

    const tbody = document.getElementById('ingredientsTableBody');
    tbody.innerHTML = '';

    paginatedIngredients.forEach(ingredient => {
        const row = createIngredientRow(ingredient);
        tbody.appendChild(row);
    });

    updatePaginationInfo();
}

// Create ingredient table row
function createIngredientRow(ingredient) {
    const row = document.createElement('tr');
    
    const statusClass = getStatusClass(ingredient.stocks);
    const statusText = getStatusText(ingredient.stocks);

    row.innerHTML = `
        <td>${ingredient.name}</td>
        <td>${ingredient.stocks}</td>
        <td>${ingredient.units}</td>
        <td>${formatDate(ingredient.restocked || new Date())}</td>
        <td><span class="badge ${statusClass}">${statusText}</span></td>
        <td>
            <div class="btn-group" role="group">
                <button class="btn btn-sm btn-outline-primary" onclick="editIngredient('${ingredient._id}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-success" onclick="addQuantity('${ingredient._id}', ${ingredient.stocks})" title="Add Quantity">
                    <i class="fas fa-plus"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteIngredient('${ingredient._id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;

    return row;
}

// Filter ingredients based on search input
function filterIngredients(searchTerm) {
    const filtered = allIngredients.filter(ingredient =>
        ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ingredient.units.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Reset pagination
    currentPage = 1;
    
    // Display filtered results
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedIngredients = filtered.slice(startIndex, endIndex);

    const tbody = document.getElementById('ingredientsTableBody');
    tbody.innerHTML = '';

    paginatedIngredients.forEach(ingredient => {
        const row = createIngredientRow(ingredient);
        tbody.appendChild(row);
    });

    updatePaginationInfo();
}

// Update pagination info
function updatePaginationInfo() {
    const maxPages = Math.ceil(allIngredients.length / itemsPerPage);
    document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${maxPages}`;
    
    document.getElementById('prevPage').disabled = currentPage <= 1;
    document.getElementById('nextPage').disabled = currentPage >= maxPages;
}

// Update stats cards
function updateStats() {
    const totalIngredients = allIngredients.length;
    const lowStockCount = allIngredients.filter(ingredient => ingredient.stocks < 10).length;
    
    // Update the stats cards (you may need to adjust these selectors based on your HTML)
    const statsCards = document.querySelectorAll('.bg-white.rounded-4.shadow');
    if (statsCards.length >= 4) {
        statsCards[0].querySelector('.fs-5.fw-bold').textContent = totalIngredients;
        statsCards[3].querySelector('.fs-5.fw-bold').textContent = lowStockCount;
    }
}

// Update ingredient select dropdown for product creation
function updateIngredientSelect() {
    const select = document.getElementById('ingredientSelect');
    select.innerHTML = '<option value="">Select an ingredient</option>';
    
    allIngredients.forEach(ingredient => {
        const option = document.createElement('option');
        option.value = ingredient._id;
        option.textContent = `${ingredient.name} (${ingredient.stocks} ${ingredient.units})`;
        select.appendChild(option);
    });
}

// Add ingredient to product creation
function addIngredient() {
    const select = document.getElementById('ingredientSelect');
    const quantityInput = document.getElementById('ingredientQuantity');
    
    if (!select.value) {
        Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: 'Please select an ingredient first.'
        });
        return;
    }

    const ingredientId = select.value;
    const quantity = parseInt(quantityInput.value) || 1;
    
    const ingredient = allIngredients.find(ing => ing._id === ingredientId);
    if (!ingredient) return;

    // Check if ingredient is already added
    if (selectedIngredients.some(selected => selected._id === ingredientId)) {
        Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: 'This ingredient is already added to the product.'
        });
        return;
    }

    selectedIngredients.push({
        _id: ingredientId,
        name: ingredient.name,
        quantity: quantity,
        unit: ingredient.units
    });

    displaySelectedIngredients();
    
    // Reset inputs
    select.value = '';
    quantityInput.value = 1;
}

// Display selected ingredients in product creation
function displaySelectedIngredients() {
    const container = document.getElementById('ingredientsList');
    container.innerHTML = '';

    selectedIngredients.forEach((ingredient, index) => {
        const div = document.createElement('div');
        div.className = 'd-flex justify-content-between align-items-center p-2 border-bottom';
        div.innerHTML = `
            <span>${ingredient.name} - ${ingredient.quantity} ${ingredient.unit}</span>
            <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeIngredient(${index})">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(div);
    });
}

// Remove ingredient from product creation
function removeIngredient(index) {
    selectedIngredients.splice(index, 1);
    displaySelectedIngredients();
}

// Handle add product form submission
async function handleAddProduct(e) {
    e.preventDefault();

    if (selectedIngredients.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: 'Please add at least one ingredient to the product.'
        });
        return;
    }

    const imageFile = document.getElementById('productImage').files[0];
    if (!imageFile) {
        Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: 'Please select an image for the product.'
        });
        return;
    }

    try {
        // Step 1: Upload image first
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);

        const uploadResponse = await fetch(`${API_BASE_URL}/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: imageFormData
        });

        if (!uploadResponse.ok) {
            throw new Error('Failed to upload image');
        }

        const uploadResult = await uploadResponse.json();
        const imageUrl = uploadResult.imageUrl;

        // Step 2: Create product with image URL
        const productData = {
            name: document.getElementById('productName').value,
            category: document.getElementById('productCategory').value,
            price: parseFloat(document.getElementById('productPrice').value),
            image: imageUrl,
            ingredients: selectedIngredients.map(ing => ({
                inventoryItem: ing.name,
                quantity: ing.quantity
            }))
        };

        const response = await apiRequest('/menu/create', {
            method: 'POST',
            body: JSON.stringify(productData)
        });

        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Product created successfully!'
        });
        
        // Reset form
        document.getElementById('addProductForm').reset();
        selectedIngredients = [];
        displaySelectedIngredients();
        document.getElementById('productImagePreview').src = '../assets/placeholder.jpg';
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
        modal.hide();
    } catch (error) {
        console.error('Error creating product:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to create product. Please try again.'
        });
    }
}

// Handle add ingredient form submission
async function handleAddIngredient() {
    const name = document.getElementById('ingredientName').value.trim();
    const stocks = parseInt(document.getElementById('ingredientQuantity').value);
    const units = document.getElementById('ingredientUnit').value.trim();

    if (!name || !stocks || !units) {
        Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: 'Please fill in all fields.'
        });
        return;
    }

    try {
        const response = await apiRequest('/inventory/add', {
            method: 'POST',
            body: JSON.stringify({
                name,
                stocks,
                units
            })
        });

        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Ingredient added successfully!'
        });

        // Reset form and close modal
        document.getElementById('ingredientName').value = '';
        document.getElementById('ingredientQuantity').value = '';
        document.getElementById('ingredientUnit').value = '';
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('addIngredientModal'));
        modal.hide();

        // Reload ingredients
        loadIngredients();
    } catch (error) {
        console.error('Error adding ingredient:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to add ingredient. Please try again.'
        });
    }
}

// Edit ingredient
function editIngredient(ingredientId) {
    const ingredient = allIngredients.find(ing => ing._id === ingredientId);
    if (!ingredient) return;

    currentEditingIngredient = ingredient;
    
    document.getElementById('editIngredientName').value = ingredient.name;
    document.getElementById('editIngredientQuantity').value = ingredient.stocks;
    document.getElementById('editIngredientUnit').value = ingredient.units;

    const modal = new bootstrap.Modal(document.getElementById('editIngredientModal'));
    modal.show();
}

// Handle edit ingredient form submission
async function handleEditIngredient() {
    if (!currentEditingIngredient) return;

    const name = document.getElementById('editIngredientName').value.trim();
    const stocks = parseInt(document.getElementById('editIngredientQuantity').value);
    const units = document.getElementById('editIngredientUnit').value.trim();

    if (!name || !stocks || !units) {
        Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: 'Please fill in all fields.'
        });
        return;
    }

    try {
        const response = await apiRequest(`/inventory/edit/${currentEditingIngredient._id}`, {
            method: 'PUT',
            body: JSON.stringify({
                name,
                stocks,
                units
            })
        });

        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Ingredient updated successfully!'
        });

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editIngredientModal'));
        modal.hide();

        // Reload ingredients
        loadIngredients();
        currentEditingIngredient = null;
    } catch (error) {
        console.error('Error updating ingredient:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update ingredient. Please try again.'
        });
    }
}

// Add quantity to ingredient
function addQuantity(ingredientId, currentQuantity) {
    const ingredient = allIngredients.find(ing => ing._id === ingredientId);
    if (!ingredient) return;

    document.getElementById('currentQuantity').value = currentQuantity;
    document.getElementById('addQuantity').value = 1;
    document.getElementById('newTotal').value = currentQuantity + 1;

    currentEditingIngredient = ingredient;

    const modal = new bootstrap.Modal(document.getElementById('addQuantityModal'));
    modal.show();
}

// Handle update quantity form submission
async function handleUpdateQuantity() {
    if (!currentEditingIngredient) return;

    const addQty = parseInt(document.getElementById('addQuantity').value);
    const newTotal = parseInt(document.getElementById('newTotal').value);

    if (!addQty || addQty <= 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: 'Please enter a valid quantity.'
        });
        return;
    }

    try {
        const response = await apiRequest(`/inventory/update/${currentEditingIngredient._id}`, {
            method: 'PUT',
            body: JSON.stringify({
                quantity: addQty
            })
        });

        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Quantity updated successfully!'
        });

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addQuantityModal'));
        modal.hide();

        // Reload ingredients
        loadIngredients();
        currentEditingIngredient = null;
    } catch (error) {
        console.error('Error updating quantity:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update quantity. Please try again.'
        });
    }
}

// Delete ingredient
async function deleteIngredient(ingredientId) {
    const result = await Swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: 'This action cannot be undone.',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
        try {
            await apiRequest(`/inventory/delete/${ingredientId}`, {
                method: 'DELETE'
            });

            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Ingredient has been deleted.'
            });

            // Reload ingredients
            loadIngredients();
        } catch (error) {
            console.error('Error deleting ingredient:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to delete ingredient. Please try again.'
            });
        }
    }
}

// Utility functions
function getStatusClass(stocks) {
    if (stocks <= 0) return 'bg-danger';
    if (stocks < 10) return 'bg-warning';
    return 'bg-success';
}

function getStatusText(stocks) {
    if (stocks <= 0) return 'Out of Stock';
    if (stocks < 10) return 'Low Stock';
    return 'In Stock';
}

function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

// Image preview function
function previewImage(input) {
    const preview = document.getElementById('productImagePreview');
    const file = input.files[0];
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}
