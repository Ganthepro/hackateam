import { teams } from "../mock/teams.js";

let { ITEMS_PER_PAGE } = updateItemsPerPage();
let currentPageFeatured = 1;
let currentPageAll = 1;
let resizeTimeout;

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

function createRequirementCard(team) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <a asp-controller="Home" asp-action="Explore/${team.id}">
            <div class="card-status">
                ${team.status}
            </div>
            <div class="card-image">
                <img src="${team.image}" alt="${team.name}"/>
            </div>
            <div class="card-detail">
                <h2>${team.name}</h2>
                <p>Lead: ${team.lead}</p>
                <p>Hackathon: ${team.hackathon.name}</p>
                <p>Created At: ${team.createdAt}</p>
                <p>Updated At: ${team.updatedAt}</p>
                <p>Expired At: ${team.expiredAt}</p>
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
        <div class="pagination-wrapper">
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
            <div class="page-navigation">
                <button class="pagination-btn prev-btn" ${currentPage === 1 ? 'disabled' : ''}>
                    Prev
                </button>
                <div class="current-page">
                    ${currentPage}
                </div>
                <button class="pagination-btn next-btn" ${currentPage === totalPages ? 'disabled' : ''}>
                    Next
                </button>
            </div>
        </div>
    `;
    
    const newPaginationContainer = paginationContainer.cloneNode(false);
    newPaginationContainer.innerHTML = paginationHTML;
    paginationContainer.parentNode.replaceChild(newPaginationContainer, paginationContainer);
    
    const pageSearch = newPaginationContainer.querySelector('.page-search');
    const prevBtn = newPaginationContainer.querySelector('.prev-btn');
    const nextBtn = newPaginationContainer.querySelector('.next-btn');
    
    pageSearch.addEventListener('input', (e) => {
        if (e.target.value === '' || /^\d+$/.test(e.target.value)) {
            e.target.dataset.value = e.target.value;
        } else {
            e.target.value = e.target.dataset.value || '';
        }
    });

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
    displayTeams(teams, 'featured-cards', currentPageFeatured);
    displayTeams(teams, 'all-cards', currentPageAll);
    updatePagination(teams, 'featured-pagination', currentPageFeatured, 'featured-cards', true);
    updatePagination(teams, 'all-pagination', currentPageAll, 'all-cards', false);
}

window.addEventListener('resize', () => {
    if (resizeTimeout) {
        clearTimeout(resizeTimeout);
    }
    
    currentPageFeatured = 1;
    currentPageAll = 1;
    resizeTimeout = setTimeout(() => {
        ({ ITEMS_PER_PAGE } = updateItemsPerPage());
        main();
    }, 250);
});

document.addEventListener('DOMContentLoaded', main);