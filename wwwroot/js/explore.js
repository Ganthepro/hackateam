const api = "http://localhost:5234";

let { ITEMS_PER_PAGE } = updateItemsPerPage();
let currentPageRecommended = 1;
let currentPageAll = 1;
let resizeTimeout;
let bannerUrls = new Map();

function updateItemsPerPage() {
    const width = window.innerWidth;
    
    const style = getComputedStyle(document.documentElement);
    const mobileBp = parseInt(style.getPropertyValue('--mobile-breakpoint') || '480');
    const tabletBp = parseInt(style.getPropertyValue('--tablet-breakpoint') || '769');
    const desktopBp = parseInt(style.getPropertyValue('--desktop-breakpoint') || '1199');

    if (width <= mobileBp) {
        return { ITEMS_PER_PAGE: 3 };
    } else if (width <= tabletBp) {
        return { ITEMS_PER_PAGE: 4 };
    } else if (width <= desktopBp) {
        return { ITEMS_PER_PAGE: 6 };
    } else {
        return { ITEMS_PER_PAGE: 8 };
    }
}

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
        return data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function fetchUserById(userId) {
    try {
        const response = await fetch(`${api}/User/${userId}`, {
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
        return data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function fetchTeams() {
    try {
        const response = await fetch(`${api}/Team?Limit=1000`, {
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
        return data;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

async function fetchSubmissions () {
    try {
        const response = await fetch(`${api}/Submission?Limit=1000`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getCookie("token")}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Fetch Submission Failed: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

async function fetchRequirementsById (requirementId) {
    try {
        const response = await fetch(`${api}/Requirement/${requirementId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getCookie("token")}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Fetch Requirement Failed: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

async function fetchTeamBanner(teamId) {
    try {
        const response = await fetch(`${api}/Team/${teamId}/banner`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${getCookie("token")}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Fetch banner failed: ${response.status}`);
        }

        const blob = await response.blob();
        if (blob.size === 0) {
            return null;
        }

        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error(`Error fetching banner for team ${teamId}:`, error);
        return null;
    }
}

async function HostedTeams() {
    const user = await fetchUserMe();
    if (!user) {
        console.error('Failed to fetch user data');
        return [];
    }

    const userId = user.id;
    const teams = await fetchTeams();

    const hostedTeams = teams.filter(team => 
        team.leadResponse && team.leadResponse.id === userId
    );
    
    const hostedTeamBanners = await Promise.all(
        hostedTeams.map(async (team) => {   
            const base64Banner = await fetchTeamBanner(team.id);
            return { 
                ...team, 
                bannerUrl: base64Banner || '/pictures/default-banner.png'
            };
        })      
    );  

    console.log("Hosted Teams processed:", hostedTeamBanners);
    return hostedTeamBanners;
}

async function PendingTeams() {
    const submissions = await fetchSubmissions();

    const requirements = await Promise.all(
        submissions.map(async (submission) => {
            try {
                return await fetchRequirementsById(submission.requirement);
            } catch (error) {
                console.error(`Error fetching requirement ${submission.requirement}:`, error);
                return null;
            }
        })
    );

    const pendingTeams = requirements
        .filter(req => req && req.team)
        .map(requirement => requirement.team);

    const pendingTeamBanners = await Promise.all(
        pendingTeams.map(async (team) => {
            const base64Banner = await fetchTeamBanner(team.id);
            console.log(team.leadResponse)
            const leadResponse = await fetchUserById(team.leadResponse);
            team.leadResponse = leadResponse;
            return { 
                ...team, 
                bannerUrl: base64Banner || '/pictures/default-banner.png'
            };
        })
    );

    console.log("Pending Teams processed:", pendingTeamBanners);
    return pendingTeamBanners;
}

function createRequirementCard(team) {
    const card = document.createElement('div');
    card.classList.add('card');
    
    const createdDate = new Date(team.createdAt).toLocaleDateString();
    const updatedDate = new Date(team.updatedAt).toLocaleDateString();
    const expiredDate = new Date(team.expiredAt).toLocaleDateString();
    const statusText = team.status === 0 ? 'Open' : 'Closed';
    
    card.innerHTML = `
        <a href="/Home/Explore/${team.id}">
            <div class="card-status ${statusText.toLowerCase()}">
                ${statusText}
            </div>
            <div class="card-image">
                <img 
                    src="${team.bannerUrl}" 
                    alt="Team Banner" 
                    onerror="this.src='/pictures/default-banner.png'"
                    loading="lazy"
                >
            </div>
            <div class="card-detail">
                <h2>${team.name || 'Unnamed Team'}</h2>
                <p>Hackathon : ${team.hackathonName}</p>
                <p class="hackathon-desc line-clamp-2">${team.hackathonDescription}</p>
                <p>Team Lead : ${team.leadResponse.fullName}</p>
                <div class="date-info">
                    <p>Created : ${createdDate}</p>
                    <p>Updated : ${updatedDate}</p>
                    <p>Expires : ${expiredDate}</p>
                </div>
            </div>
        </a>
    `;
    
    return card;
}

function displayTeams(teams, containerId, currentPage) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const paginatedTeams = teams.slice(start, end);
    
    container.innerHTML = '';
    paginatedTeams.forEach(team => {
        const card = createRequirementCard(team);
        container.appendChild(card);
    });
}

function updatePagination(teams, paginationId, currentPage, containerIdToUpdate, isFeatureSection) {
    const paginationContainer = document.getElementById(paginationId);
    if (!paginationContainer) return;

    const totalPages = Math.ceil(teams.length / ITEMS_PER_PAGE);
    
    const paginationHTML = `
        <div class="page-navigation">
            <button class="pagination-btn prev-btn" ${currentPage === 1 ? 'disabled' : ''}>
                Prev
            </button>

            <div class="page-search-wrapper">
                <input 
                    type="text" 
                    placeholder="${currentPage}"
                    class="page-search"
                >
                <div class="total-pages">
                    of ${totalPages}
                </div>
            </div>
    
            <button class="pagination-btn next-btn" ${currentPage === totalPages ? 'disabled' : ''}>
                Next
            </button>
        </div>
    `;
    
    const newPaginationContainer = paginationContainer.cloneNode(false);
    newPaginationContainer.innerHTML = paginationHTML;
    paginationContainer.parentNode.replaceChild(newPaginationContainer, paginationContainer);
    
    const pageSearch = newPaginationContainer.querySelector('.page-search');
    const prevBtn = newPaginationContainer.querySelector('.prev-btn');
    const nextBtn = newPaginationContainer.querySelector('.next-btn');

    pageSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const pageNum = parseInt(e.target.value);
            if (pageNum >= 1 && pageNum <= totalPages) {
                if (isFeatureSection) {
                    currentPageRecommended = pageNum;
                    displayTeams(teams, containerIdToUpdate, currentPageRecommended);
                    updatePagination(teams, paginationId, currentPageRecommended, containerIdToUpdate, isFeatureSection);
                } else {
                    currentPageAll = pageNum;
                    displayTeams(teams, containerIdToUpdate, currentPageAll);
                    updatePagination(teams, paginationId, currentPageAll, containerIdToUpdate, isFeatureSection);
                }
                e.target.value = '';
            }
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            if (isFeatureSection) {
                currentPageRecommended--;
                displayTeams(teams, containerIdToUpdate, currentPageRecommended);
                updatePagination(teams, paginationId, currentPageRecommended, containerIdToUpdate, isFeatureSection);
            } else {
                currentPageAll--;
                displayTeams(teams, containerIdToUpdate, currentPageAll);
                updatePagination(teams, paginationId, currentPageAll, containerIdToUpdate, isFeatureSection);
            }
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            if (isFeatureSection) {
                currentPageRecommended++;
                displayTeams(teams, containerIdToUpdate, currentPageRecommended);
                updatePagination(teams, paginationId, currentPageRecommended, containerIdToUpdate, isFeatureSection);
            } else {
                currentPageAll++;
                displayTeams(teams, containerIdToUpdate, currentPageAll);
                updatePagination(teams, paginationId, currentPageAll, containerIdToUpdate, isFeatureSection);
            }
        }
    });
}

async function main() {
    try {
        const hostedTeams = await fetchTeams();
        const pendingTeams = await fetchTeams();

        if (hostedTeams.length > 0) {
            displayTeams(hostedTeams, 'recommended-cards', currentPageRecommended);
            updatePagination(hostedTeams, 'recommended-pagination', currentPageRecommended, 'recommended-cards', true);
        } else {
            const recommendedTeamsContainer = document.getElementById('recommended-projects');
            const text = document.createElement('p');
            recommendedTeamsContainer.innerHTML = '';

            const recommendedTeamsHeader = document.createElement('h2');
            recommendedTeamsHeader.textContent = 'Recommended Projects';
            recommendedTeamsContainer.appendChild(recommendedTeamsHeader);

            text.classList.add('no-teams');
            text.textContent = 'No Recommended Projects';
            recommendedTeamsContainer.appendChild(text);
        }

        if (pendingTeams.length > 0) {
            displayTeams(pendingTeams, 'all-cards', currentPageAll);
            updatePagination(pendingTeams, 'all-pagination', currentPageAll, 'all-cards', false);
        } else {
            const allTeamsContainer = document.getElementById('all-projects');
            const text = document.createElement('p');
            allTeamsContainer.innerHTML = '';

            const allTeamsHeader = document.createElement('h2');
            allTeamsHeader.textContent = 'All Projects';
            allTeamsContainer.appendChild(allTeamsHeader);

            text.classList.add('no-teams');
            text.textContent = 'No All Projects';
            allTeamsContainer.appendChild(text);
        }

    } catch (error) {
        console.error('Error in main:', error);
    }
}

window.addEventListener('resize', () => {
    if (resizeTimeout) {
        clearTimeout(resizeTimeout);
    }
    
    currentPageRecommended = 1;
    currentPageAll = 1;

    resizeTimeout = setTimeout(() => {
        ({ ITEMS_PER_PAGE } = updateItemsPerPage());
        main();
    }, 100);
});

document.addEventListener('DOMContentLoaded', main);