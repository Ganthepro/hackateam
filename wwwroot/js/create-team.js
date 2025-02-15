const requirementsContainer = document.querySelector('.requirements');

// Function to update delete buttons state
function updateDeleteButtons() {
    const deleteButtons = requirementsContainer.querySelectorAll('.delete-requirement-btn');
    const requirementCount = requirementsContainer.children.length;
    
    deleteButtons.forEach(button => {
        button.disabled = requirementCount === 1;
        if (requirementCount === 1) {
            button.classList.add('delete-btn-disabled');
        } else {
            button.classList.remove('delete-btn-disabled');
        }
    });
}

function createRequirementGroup() {
    const requirementContainer = document.createElement('div');
    requirementContainer.className = 'member-requirement-container';
    
    requirementContainer.innerHTML = `
        <div class="member-requirement-group">
            <label for="member-role">Role</label>
            <input 
                type="text" 
                name="member-role" 
                placeholder="Enter member role"
            >
        </div>
        <div class="member-requirement-group">
            <label for="member-quantity">Quantity</label>
            <input 
                type="number" 
                name="member-quantity"
                min="1"
                placeholder="Enter member quantity"
            >
        </div>
        <button type="button" class="delete-requirement-btn">
            Delete
        </button>
    `;

    const deleteButton = requirementContainer.querySelector('.delete-requirement-btn');
    deleteButton.addEventListener('click', () => {
        requirementContainer.remove();
        updateDeleteButtons();
    });

    return requirementContainer;
}

const addButton = document.createElement('button');
addButton.type = 'button';
addButton.className = 'add-requirement-btn';
addButton.textContent = 'Add Requirement';
requirementsContainer.parentNode.insertBefore(addButton, requirementsContainer.nextSibling);

addButton.addEventListener('click', () => {
    const newContainer = createRequirementGroup();
    requirementsContainer.appendChild(newContainer);
    updateDeleteButtons();
});

document.addEventListener('DOMContentLoaded', () => {
    const initialGroup = createRequirementGroup();
    requirementsContainer.appendChild(initialGroup);
    updateDeleteButtons();
});