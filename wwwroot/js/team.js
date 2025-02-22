const api = "http://localhost:5234";

let bannerUrls = new Map();

async function fetchUserMe() {
    try {
        const response = await fetch(`${api}/User/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getCookie("token")}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Fetch User Failed: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched User:", data);
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function fetchTeams() {
    try {
        const response = await fetch(`${api}/Team`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getCookie("token")}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Fetch Team Failed: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched Teams:", data);
        return data;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

async function HostedTeam() {
    const user = await fetchUserMe();
    const userId = user.id;
    const teams = await fetchTeams();

    const hostedTeams = teams.filter(team => {
        if (team.leadResponse.id === userId) {
            return true;
        }
        return false;
    });

    console.log("Hosted Teams:", hostedTeams);
}

function main() {
    HostedTeam()
}

main();