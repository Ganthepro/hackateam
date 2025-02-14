import { teams } from "../mock/teams.js";

function updateItemsPerPage() {
    const width = window.innerWidth;
    if (width <= 480) {
        return 3;
    } else if (width <= 769) {
        return 4;
    } else if (width <= 1199) {
        return 6;
    } else {
        return 8;
    }
}

let ITEMS_PER_PAGE = updateItemsPerPage();
const MAX_PAGE_BUTTONS = 5;
let currentPageFeatured = 1;
let currentPageAll = 1;

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
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const paginatedTeams = teams.slice(start, end);
    
    container.innerHTML = '';
    paginatedTeams.forEach(team => {
        const card = createRequirementCard(team);
        container.appendChild(card);
    });
}

function getPageNumbers(currentPage, totalPages) {
    const pages = [];
    const halfMaxButtons = Math.floor(MAX_PAGE_BUTTONS / 2);
    
    let startPage = Math.max(currentPage - halfMaxButtons, 1);
    let endPage = Math.min(startPage + MAX_PAGE_BUTTONS - 1, totalPages);
    
    if (endPage - startPage + 1 < MAX_PAGE_BUTTONS) {
        startPage = Math.max(endPage - MAX_PAGE_BUTTONS + 1, 1);
    }
    
    if (startPage > 1) {
        pages.push({
            number: 1,
            isNumber: true
        });
        if (startPage > 2) {
            pages.push({
                text: '...',
                isNumber: false
            });
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        pages.push({
            number: i,
            isNumber: true
        });
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pages.push({
                text: '...',
                isNumber: false
            });
        }
        pages.push({
            number: totalPages,
            isNumber: true
        });
    }
    
    return pages;
}

function updatePagination(teams, paginationId, currentPage, containerIdToUpdate, isFeatureSection) {
    const totalPages = Math.ceil(teams.length / ITEMS_PER_PAGE);
    const paginationContainer = document.getElementById(paginationId);
    
    paginationContainer.innerHTML = `
        <button class="pagination-btn prev-btn" ${currentPage === 1 ? 'disabled' : ''}>
            Prev
        </button>
        <div class="pagination-numbers"></div>
        <button class="pagination-btn next-btn" ${currentPage === totalPages ? 'disabled' : ''}>
            Next
        </button>
    `;
    
    const numbersContainer = paginationContainer.querySelector('.pagination-numbers');
    const pages = getPageNumbers(currentPage, totalPages);
    
    pages.forEach(page => {
        if (page.isNumber) {
            const pageBtn = document.createElement('button');
            pageBtn.classList.add('page-number');
            if (page.number === currentPage) pageBtn.classList.add('active');
            pageBtn.textContent = page.number;
            pageBtn.addEventListener('click', () => {
                if (isFeatureSection) {
                    currentPageFeatured = page.number;
                    displayTeams(teams, containerIdToUpdate, currentPageFeatured);
                    updatePagination(teams, paginationId, currentPageFeatured, containerIdToUpdate, isFeatureSection);
                } else {
                    currentPageAll = page.number;
                    displayTeams(teams, containerIdToUpdate, currentPageAll);
                    updatePagination(teams, paginationId, currentPageAll, containerIdToUpdate, isFeatureSection);
                }
            });
            numbersContainer.appendChild(pageBtn);
        } else {
            const ellipsis = document.createElement('span');
            ellipsis.classList.add('page-ellipsis');
            ellipsis.textContent = page.text;
            numbersContainer.appendChild(ellipsis);
        }
    });
    
    const prevBtn = paginationContainer.querySelector('.prev-btn');
    const nextBtn = paginationContainer.querySelector('.next-btn');
    
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
    updatePagination(teams, 'all-pagination', currentPageAll, 'all-cards', false);
    updatePagination(teams, 'featured-pagination', currentPageFeatured, 'featured-cards', true);
}

window.addEventListener('resize', () => {
    ITEMS_PER_PAGE = updateItemsPerPage();
    main();
});

document.addEventListener('DOMContentLoaded', main);