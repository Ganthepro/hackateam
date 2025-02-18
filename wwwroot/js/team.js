import { teams } from "../mock/teams.js";

let teamId = 1;

function displayTeamDetails(teamId) {
    const selectedTeam = teams.find(team => team.id === teamId);

    if (!selectedTeam) {
        console.error('Team not found');
        return;
    }

    document.getElementById('team-name').textContent = selectedTeam.name;
    document.getElementById('team-lead').textContent = selectedTeam.lead;
    document.getElementById('team-hackathon').textContent = selectedTeam.hackathon.name;
}

document.addEventListener('DOMContentLoaded', () => {
    displayTeamDetails(teamId);
});
