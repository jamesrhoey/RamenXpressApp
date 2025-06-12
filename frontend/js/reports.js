// Sales data
const salesData = [
  { id: '00000001', type: 'Dine In', items: '3 Items', price: '₱430', date: '11/12/22' },
  { id: '00000002', type: 'Pick Up', items: '5 Items', price: '₱257', date: '02/12/22' },
  { id: '00000003', type: 'Delivery', items: '10 Items', price: '₱405', date: '05/12/22' },
  { id: '00000004', type: 'Dine In', items: '1 Items', price: '₱502', date: '08/12/22' },
  { id: '00000005', type: 'Pick Up', items: '5 Items', price: '₱530', date: '09/01/23' },
  { id: '00000006', type: 'Dine In', items: '2 Items', price: '₱605', date: '09/01/23' },
  { id: '00000007', type: 'Delivery', items: '5 Items', price: '₱408', date: '12/12/20' },
  { id: '00000008', type: 'Delivery', items: '3 Items', price: '₱359', date: '06/06/23' },
  { id: '00000009', type: 'Dine In', items: '8 Items', price: '₱205', date: '11/11/22' }
];

let searchQuery = '';
let filterStartDate = '';
let currentPage = 1;
const itemsPerPage = 5;
let sortConfig = { key: null, direction: 'asc' };

const searchInput = document.getElementById('searchInput');
const filterStartDateInput = document.getElementById('filterStartDate');
const salesTableBody = document.getElementById('salesTableBody');
const pagination = document.getElementById('pagination');

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
    const itemDate = parseDate(item.date);
    const searchMatch =
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.items.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.price.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.date.toLowerCase().includes(searchQuery.toLowerCase());
    if (!filterStartDate) return searchMatch;
    const filterDateObj = parseInputDate(filterStartDate);
    return searchMatch && itemDate >= filterDateObj;
  });
}

function sortSales(sales) {
  if (!sortConfig.key) return sales;
  return [...sales].sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];
    if (sortConfig.key === 'date') {
      aValue = parseDate(aValue);
      bValue = parseDate(bValue);
    } else if (sortConfig.key === 'price') {
      aValue = parseFloat(aValue.replace(/[^\d.]/g, ''));
      bValue = parseFloat(bValue.replace(/[^\d.]/g, ''));
    } else if (sortConfig.key === 'items') {
      aValue = parseInt(aValue);
      bValue = parseInt(bValue);
    }
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });
}

function renderTable() {
  const filtered = getFilteredSales();
  const sorted = sortSales(filtered);
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
  const start = (currentPage - 1) * itemsPerPage;
  const paginated = sorted.slice(start, start + itemsPerPage);

  salesTableBody.innerHTML = paginated.length ? paginated.map(item => `
    <tr>
      <td>${item.id}</td>
      <td>
        <span class="badge text-white px-2 py-1 rounded-pill ${
          item.type === 'Dine In' ? 'badge-dinein' :
          item.type === 'Pick Up' ? 'badge-pickup' : 'badge-delivery'
        }">${item.type}</span>
      </td>
      <td>${item.items}</td>
      <td>${item.price}</td>
      <td>${item.date}</td>
    </tr>
  `).join('') : `<tr><td colspan="5" class="text-center py-4 text-muted">No transactions match your search.</td></tr>`;

  // Pagination
  pagination.innerHTML = '';
  if (totalPages > 1) {
    pagination.innerHTML += `<li class="page-item${currentPage === 1 ? ' disabled' : ''}"><button class="page-link" onclick="goToPage(${currentPage - 1})">Previous</button></li>`;
    for (let i = 1; i <= totalPages; i++) {
      pagination.innerHTML += `<li class="page-item${currentPage === i ? ' active' : ''}"><button class="page-link" onclick="goToPage(${i})">${i}</button></li>`;
    }
    pagination.innerHTML += `<li class="page-item${currentPage === totalPages ? ' disabled' : ''}"><button class="page-link" onclick="goToPage(${currentPage + 1})">Next</button></li>`;
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

// Event listeners
searchInput.addEventListener('input', e => {
  searchQuery = e.target.value;
  currentPage = 1;
  renderTable();
});

filterStartDateInput.addEventListener('change', e => {
  filterStartDate = e.target.value;
  currentPage = 1;
  renderTable();
});

document.addEventListener('DOMContentLoaded', () => {
  renderTable();
});

document.addEventListener('DOMContentLoaded', function() {
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
