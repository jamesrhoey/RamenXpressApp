// API endpoint
const API_URL = 'http://localhost:3000/api/v1';

// Handle login form submission
async function handleLogin(event) {
    event.preventDefault();
    
    // Get form values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.querySelector('input[name="role"]:checked').value;
    
    // Show error message element
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.style.display = 'none';
    
    try {
        // Make API request
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include' // Important for cookies
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }
        
        // Check if user role matches selected role
        if (data.user.role !== role) {
            throw new Error('Invalid role selected');
        }

        // Store the token in localStorage
        if (data.token) {
            localStorage.setItem('authToken', data.token);
            // Also store user info
            localStorage.setItem('userRole', data.user.role);
            localStorage.setItem('username', data.user.username);
        } else {
            throw new Error('No authentication token received');
        }
        
        // Redirect based on role
        if (role === 'admin') {
            window.location.href = './html/dashboard.html';
        } else {
            window.location.href = './html/POS.html';
        }
        
    } catch (error) {
        console.error('Login error:', error);
        errorMessage.textContent = error.message || 'Failed to connect to server';
        errorMessage.style.display = 'block';
    }
    
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