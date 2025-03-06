// API base URL
const api = "http://localhost:5234";

// Get DOM elements
const editBtn = document.getElementById('edit-btn');
const saveBtn = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');
const fullNameInput = document.querySelector('input[name="fullname"]');
const headerSelect = document.querySelector('select');
const telInput = document.querySelector('input[name="tel"]');
const emailInput = document.querySelector('input[name="email"]');

// Store original values for cancel operation
let originalFullname = '';
let originalTel = '';
let originalEmail = '';
let originalHeader = '';

// Initialize the form - fetch current user data
async function initializeForm() {
    try {
        const response = await fetch(`${api}/User/me`, {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getCookie("token")}`,
            }
        });
        
        if (response.ok) {
            const userData = await response.json();
            console.log(userData);
            
            // Extract header and name
            originalHeader = userData.header || 'Mr.';
            originalFullname = userData.fullName || '';
            originalTel = userData.tel || '';
            originalEmail = userData.email || '';
            
            // Set values in form
            headerSelect.value = originalHeader;
            fullNameInput.value = originalFullname;
            telInput.value = originalTel;
            emailInput.value = originalEmail;
            
            // Disable inputs by default (view mode)
            setViewMode();
        } else {
            console.error('Failed to fetch user data');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

// Switch to edit mode
function setEditMode() {
    // Store original values
    originalHeader = headerSelect.value;
    originalFullname = fullNameInput.value;
    originalTel = telInput.value;
    originalEmail = emailInput.value;
    
    // Enable inputs and select
    headerSelect.disabled = false;
    fullNameInput.disabled = false;
    telInput.disabled = false;
    emailInput.disabled = false;
    
    // Show save and cancel buttons, hide edit button
    editBtn.style.display = 'none';
    saveBtn.style.display = 'inline-block';
    cancelBtn.style.display = 'inline-block';
}

// Switch to view mode
function setViewMode() {
    // Disable inputs and select
    headerSelect.disabled = true;
    fullNameInput.disabled = true;
    telInput.disabled = true;
    emailInput.disabled = true;
    
    // Show edit button, hide save and cancel buttons
    editBtn.style.display = 'inline-block';
    saveBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
}

// Save user data
async function saveUserData() {
    try {
        const selectedHeader = headerSelect.value;
        
        const userData = {
            "fullName": fullNameInput.value,
            "header": selectedHeader,
            "tel": telInput.value
        };
        
        const response = await fetch(`${api}/User`, {
            method: 'PATCH',
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getCookie("token")}`,
            },
            body: JSON.stringify(userData)
        });
        
        if (response.ok) {
            // Update original values with new ones
            originalHeader = selectedHeader;
            originalFullname = fullNameInput.value;
            originalTel = telInput.value;
            
            // Switch back to view mode
            setViewMode();
            
            // Show success message
            alert('Profile updated successfully!');
        } else {
            console.error('Failed to update user data');
            alert('Failed to update profile. Please try again.');
        }
    } catch (error) {
        console.error('Error updating user data:', error);
        alert('Error updating profile. Please try again.');
    }
}

// Cancel edit
function cancelEdit() {
    // Restore original values
    headerSelect.value = originalHeader;
    fullNameInput.value = originalFullname;
    telInput.value = originalTel;
    emailInput.value = originalEmail;
    
    // Switch back to view mode
    setViewMode();
}

// Event listeners
editBtn.addEventListener('click', setEditMode);
saveBtn.addEventListener('click', saveUserData);
cancelBtn.addEventListener('click', cancelEdit);

// Initialize the form when the page loads
document.addEventListener('DOMContentLoaded', initializeForm);