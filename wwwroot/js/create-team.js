// Get the requirements container
const requirementsContainer = document.querySelector('.requirements');

// Function to create a new requirement group
function createRequirementGroup() {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'member-requirement-group-container';
    
    groupDiv.innerHTML = `
        <div class="member-requirement-group">
            <label for="member-role">Role</label>
            <input 
                type="text" 
                name="member-role[]" 
                placeholder="Enter member role"
            >
        </div>
        <div class="member-requirement-group">
            <label for="member-quantity">Quantity</label>
            <input 
                type="number" 
                name="member-quantity[]" 
                placeholder="Enter member quantity"
            >
        </div>
        <button type="button" class="delete-requirement-btn">Delete</button>
    `;

    // Add delete button functionality
    const deleteButton = groupDiv.querySelector('.delete-requirement-btn');
    deleteButton.addEventListener('click', () => {
        groupDiv.remove();
    });

    return groupDiv;
}

// Add "Add Requirement" button after the requirements container
const addButton = document.createElement('button');
addButton.type = 'button';
addButton.className = 'add-requirement-btn';
addButton.textContent = 'Add Requirement';
requirementsContainer.parentNode.insertBefore(addButton, requirementsContainer.nextSibling);

// Add click event listener to the Add button
addButton.addEventListener('click', () => {
    const newGroup = createRequirementGroup();
    requirementsContainer.appendChild(newGroup);
});

// Initialize with one requirement group
document.addEventListener('DOMContentLoaded', () => {
    const initialGroup = createRequirementGroup();
    requirementsContainer.appendChild(initialGroup);
});