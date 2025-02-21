const api = "http://localhost:5234";

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
    } catch (error) {
        console.error('Error:', error);
    }
}

function main() {
    fetchUserMe();
}

main();