function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const role = document.querySelector('input[name="role"]:checked').value;
    const errorMessage = document.getElementById('errorMessage');

    if (!username || !password) {
        errorMessage.textContent = 'Please enter both username and password.';
        errorMessage.style.display = 'block';
        return false;
    }

    errorMessage.style.display = 'none';

    if (role === 'admin') {
        window.location.href = './html/dashboard.html';
        return false;
    }
    // If cashier, do nothing for now
    return false;
}

// Add active class to role selector buttons
document.querySelectorAll('.role-selector .btn').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.role-selector .btn').forEach(btn => {
            btn.classList.remove('active');
        });
        this.classList.add('active');
    });
}); 