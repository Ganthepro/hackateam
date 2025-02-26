const api = "http://localhost:5234";

let { ITEMS_PER_PAGE } = updateItemsPerPage();
let currentPageFeatured = 1;
let currentPageAll = 1;
let resizeTimeout;
let bannerUrls = new Map();

function updateItemsPerPage() {
    const width = window.innerWidth;
    if (width <= 480) {
        return { ITEMS_PER_PAGE: 3 };
    } else if (width <= 769) {
        return { ITEMS_PER_PAGE: 4 };
    } else if (width <= 1199) {
        return { ITEMS_PER_PAGE: 6 };
    } else {
        return { ITEMS_PER_PAGE: 8 };
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
        
        return blob;
    } catch (error) {
        console.error(`Error fetching banner for team ${teamId}:`, error);
        return null;
    }
}

function cleanupBannerUrls() {
    bannerUrls.forEach(url => {
        URL.revokeObjectURL(url);
    });
    bannerUrls.clear();
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
            throw new Error(`Fetch teams failed: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched Teams:", data);

        cleanupBannerUrls();

        const teamsWithBanners = await Promise.all(
            data.map(async (team) => {
                const bannerBlob = await fetchTeamBanner(team.id);
                let bannerUrl = '/pictures/default-banner.png';
                
                if (bannerBlob) {
                    bannerUrl = URL.createObjectURL(bannerBlob);
                    bannerUrls.set(team.id, bannerUrl);
                }
                
                return { ...team, bannerUrl};
            })
        );
            
        displayTeams(teamsWithBanners, 'featured-cards', currentPageFeatured);
        displayTeams(teamsWithBanners, 'all-cards', currentPageAll);
        updatePagination(teamsWithBanners, 'featured-pagination', currentPageFeatured, 'featured-cards', true);
        updatePagination(teamsWithBanners, 'all-pagination', currentPageAll, 'all-cards', false);
    } catch (error) {
        console.error("Error fetching teams:", error);
    }
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
                <img src="${team.bannerUrl}" alt="Team Banner" onerror="this.src='/pictures/default-banner.png'">
            </div>
            <div class="card-detail">
                <h2>${team.name}</h2>
                <p class="">Hackathon : ${team.hackathonName}</p>
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
                    currentPageFeatured = pageNum;
                    displayTeams(teams, containerIdToUpdate, currentPageFeatured);
                    updatePagination(teams, paginationId, currentPageFeatured, containerIdToUpdate, isFeatureSection);
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
                currentPageFeatured--;
                displayTeams(teams, containerIdToUpdate, currentPageFeatured);
                updatePagination(teams, paginationId, currentPageFeatured, containerIdToUpdate, isFeatureSection);
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
                currentPageFeatured++;
                displayTeams(teams, containerIdToUpdate, currentPageFeatured);
                updatePagination(teams, paginationId, currentPageFeatured, containerIdToUpdate, isFeatureSection);
            } else {
                currentPageAll++;
                displayTeams(teams, containerIdToUpdate, currentPageAll);
                updatePagination(teams, paginationId, currentPageAll, containerIdToUpdate, isFeatureSection);
            }
        }
    });
}

function main() {
    fetchTeams();
}

window.addEventListener('beforeunload', cleanupBannerUrls);
window.addEventListener('resize', () => {
    if (resizeTimeout) {
        clearTimeout(resizeTimeout);
    }
    
    currentPageFeatured = 1;
    currentPageAll = 1;

    resizeTimeout = setTimeout(() => {
        ({ ITEMS_PER_PAGE } = updateItemsPerPage());
        main();
    }, 100);
});

document.addEventListener('DOMContentLoaded', main);