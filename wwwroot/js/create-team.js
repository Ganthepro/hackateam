const requirementsContainer = document.querySelector('.requirements');

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
                min="1" 
                name="member-quantity" 
                placeholder="Enter member quantity"
            >
        </div>
        <div class="member-requirement-group">
            <label for="member-skill">Skill</label>
            <input 
                type="text" 
                name="member-skill" 
                placeholder="Enter member skill"
            >
        </div>
        <button type="button" class="delete-requirement-btn">
            <img
                src="../pictures/delete-icon.svg"
                alt="delete icon"        
            />
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