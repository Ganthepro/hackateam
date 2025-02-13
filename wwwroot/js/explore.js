import { teams } from "../mock/teams.js";

function createRequirementCard(team) {  // Changed parameter name to team
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <div class="card-status">
           ${team.status}
        </div>
        <div class="card-image">
           <!-- Add image content if needed -->
        </div>
        <div class="card-detail">
            <h2>${team.name}</h2>
            <p>Lead: ${team.lead}</p>
            <p>Hackathon: ${team.hackathon.name}</p>
            <p>Created At: ${team.createdAt}</p>
            <p>Updated At: ${team.updatedAt}</p>
            <p>Expired At: ${team.expiredAt}</p>
        </div>
    `;

    return card;
}

function generateRequirementCards(teams, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id '${containerId}' not found`);
        return;
    }

    teams.forEach(team => {
        const card = createRequirementCard(team);
        container.appendChild(card);
    });
}

function main() {
    generateRequirementCards(teams, 'all-cards');
}

document.addEventListener('DOMContentLoaded', main);