// Global variables
let salesData = [];
let searchQuery = '';
let filterStartDate = '';
let currentPage = 1;
const itemsPerPage = 5;
let sortConfig = { key: null, direction: 'asc' };

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

// Load sales data from API
async function loadSalesData() {
    try {
        const response = await apiRequest('/sales/allSales');
        salesData = response || [];
        renderTable();
        updateStats();
    } catch (error) {
        console.error('Failed to load sales data:', error);
        // Show error message to user
        const salesTableBody = document.getElementById('salesTableBody');
        if (salesTableBody) {
            salesTableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-danger">Failed to load sales data. Please try again.</td></tr>';
        }
    }
}

// Update stats cards
function updateStats() {
    const totalSales = salesData.length;
    const totalRevenue = salesData.reduce((sum, sale) => sum + sale.total, 0);
    const averageOrderValue = totalSales > 0 ? (totalRevenue / totalSales).toFixed(2) : 0;
    
    // Update the stats cards
    const statsCards = document.querySelectorAll('.bg-white.rounded-4.shadow');
    if (statsCards.length >= 3) {
        // Total Sales
        const totalSalesElement = statsCards[0].querySelector('.fs-5.fw-bold');
        if (totalSalesElement) totalSalesElement.textContent = totalSales;
        
        // Total Revenue
        const totalRevenueElement = statsCards[1].querySelector('.fs-5.fw-bold');
        if (totalRevenueElement) totalRevenueElement.textContent = `₱${totalRevenue.toFixed(2)}`;
        
        // Average Order Value
        const avgOrderElement = statsCards[2].querySelector('.fs-5.fw-bold');
        if (avgOrderElement) avgOrderElement.textContent = `₱${averageOrderValue}`;
    }
}

// Format date for display
function formatDate(date) {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);
    return `${month}/${day}/${year}`;
}

// Format order type for display
function formatOrderType(orderType) {
    switch (orderType) {
        case 'dine-in':
            return 'Dine In';
        case 'takeout':
            return 'Pick Up';
        default:
            return orderType;
    }
}

// Get order type badge class
function getOrderTypeBadgeClass(orderType) {
    switch (orderType) {
        case 'dine-in':
            return 'badge-dinein';
        case 'takeout':
            return 'badge-pickup';
        default:
            return 'badge-secondary';
    }
}

// Parse date string "mm/dd/yy" to Date
function parseDate(dateStr) {
    const [month, day, year] = dateStr.split('/');
    const fullYear = year.length === 2 ? `20${year}` : year;
    return new Date(fullYear, month - 1, day);
}

function parseInputDate(dateStr) {
    return dateStr ? new Date(dateStr) : null;
}

function getFilteredSales() {
    return salesData.filter(item => {
        const itemDate = new Date(item.orderDate);
        const searchMatch =
            item.orderId.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
            formatOrderType(item.orderType).toLowerCase().includes(searchQuery.toLowerCase()) ||
            `${item.items.length} Items`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            `₱${item.total.toFixed(2)}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            formatDate(item.orderDate).toLowerCase().includes(searchQuery.toLowerCase());
        
        if (!filterStartDate) return searchMatch;
        const filterDateObj = parseInputDate(filterStartDate);
        return searchMatch && itemDate >= filterDateObj;
    });
}

function sortSales(sales) {
    if (!sortConfig.key) return sales;
    return [...sales].sort((a, b) => {
        let aValue, bValue;
        
        switch (sortConfig.key) {
            case 'orderId':
                aValue = a.orderId;
                bValue = b.orderId;
                break;
            case 'orderType':
                aValue = formatOrderType(a.orderType);
                bValue = formatOrderType(b.orderType);
                break;
            case 'items':
                aValue = a.items.length;
                bValue = b.items.length;
                break;
            case 'total':
                aValue = a.total;
                bValue = b.total;
                break;
            case 'orderDate':
                aValue = new Date(a.orderDate);
                bValue = new Date(b.orderDate);
                break;
            default:
                aValue = a[sortConfig.key];
                bValue = b[sortConfig.key];
        }
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });
}

function renderTable() {
    const salesTableBody = document.getElementById('salesTableBody');
    const pagination = document.getElementById('pagination');
    
    if (!salesTableBody) return;
    
    const filtered = getFilteredSales();
    const sorted = sortSales(filtered);
    const totalPages = Math.ceil(sorted.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
    const start = (currentPage - 1) * itemsPerPage;
    const paginated = sorted.slice(start, start + itemsPerPage);

    salesTableBody.innerHTML = paginated.length ? paginated.map(item => `
        <tr>
            <td>${String(item.orderId).padStart(8, '0')}</td>
            <td>
                <span class="badge text-white px-2 py-1 rounded-pill ${getOrderTypeBadgeClass(item.orderType)}">
                    ${formatOrderType(item.orderType)}
                </span>
            </td>
            <td>${item.items.length} Items</td>
            <td>₱${item.total.toFixed(2)}</td>
            <td>${formatDate(item.orderDate)}</td>
        </tr>
    `).join('') : `<tr><td colspan="5" class="text-center py-4 text-muted">No transactions match your search.</td></tr>`;

    // Pagination
    if (pagination) {
        pagination.innerHTML = '';
        if (totalPages > 1) {
            pagination.innerHTML += `<li class="page-item${currentPage === 1 ? ' disabled' : ''}"><button class="page-link" onclick="goToPage(${currentPage - 1})">Previous</button></li>`;
            for (let i = 1; i <= totalPages; i++) {
                pagination.innerHTML += `<li class="page-item${currentPage === i ? ' active' : ''}"><button class="page-link" onclick="goToPage(${i})">${i}</button></li>`;
            }
            pagination.innerHTML += `<li class="page-item${currentPage === totalPages ? ' disabled' : ''}"><button class="page-link" onclick="goToPage(${currentPage + 1})">Next</button></li>`;
        }
    }
}

window.goToPage = function(page) {
    currentPage = page;
    renderTable();
};

window.sortTable = function(key) {
    if (sortConfig.key === key) {
        sortConfig.direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    } else {
        sortConfig.key = key;
        sortConfig.direction = 'asc';
    }
    renderTable();
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    if (!isAuthenticated()) {
        redirectToLogin();
        return;
    }

    // Load sales data
    loadSalesData();

    // Setup event listeners
    const searchInput = document.getElementById('searchInput');
    const filterStartDateInput = document.getElementById('filterStartDate');

    if (searchInput) {
        searchInput.addEventListener('input', e => {
            searchQuery = e.target.value;
            currentPage = 1;
            renderTable();
        });
    }

    if (filterStartDateInput) {
        filterStartDateInput.addEventListener('change', e => {
            filterStartDate = e.target.value;
            currentPage = 1;
            renderTable();
        });
    }

    // Sidebar functionality
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    
    if (sidebarToggle && sidebar && closeSidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.add('show');
        });
        closeSidebar.addEventListener('click', function() {
            sidebar.classList.remove('show');
        });
        document.addEventListener('click', function(event) {
            if (!sidebar.contains(event.target) && !sidebarToggle.contains(event.target)) {
                sidebar.classList.remove('show');
            }
        });
    }
});
