const api = "http://localhost:5234";
const urlParams = new URLSearchParams(window.location.search);
const teamId = urlParams.get('teamId');
console.log(teamId);

async function fetchHostedTeam() {
    try {
        const response = await fetch(`${api}/Team/${teamId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getCookie("token")}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Fetch Hosted Team Failed: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        return data;
    } catch (error) {
        console.error('Error:', error);
        return {};
    }
}

async function fetchRequirements() {
    try {
        const response = await fetch(`${api}/Requirement`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getCookie("token")}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Fetch Requirements Failed: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        const requirements = data.filter(requirement => requirement.team.id === teamId);
        console.log(requirements);

        return requirements;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

async function fetchSubmissions() {
    try {
        const response = await fetch(`${api}/Submission`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getCookie("token")}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Fetch Submissions Failed: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        // const submissions = data.filter(submission => submission.team.id === teamId);
        // console.log(submissions);

        return data;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

async function main() {
    const team = await fetchHostedTeam();
    const requirements = await fetchRequirements();
    const submissions = await fetchSubmissions();
}

main();