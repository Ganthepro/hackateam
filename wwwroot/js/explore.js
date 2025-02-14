import { teams } from "../mock/teams.js";

let { ITEMS_PER_PAGE, MAX_PAGE_BUTTONS } = updateItemsPerPage();
let currentPageFeatured = 1;
let currentPageAll = 1;
let resizeTimeout;

function updateItemsPerPage() {
    const width = window.innerWidth;
    if (width <= 480) {
        return { ITEMS_PER_PAGE: 3, MAX_PAGE_BUTTONS: 3 };
    } else if (width <= 769) {
        return { ITEMS_PER_PAGE: 4, MAX_PAGE_BUTTONS: 3 };
    } else if (width <= 1199) {
        return { ITEMS_PER_PAGE: 6, MAX_PAGE_BUTTONS: 5 };
    } else {
        return { ITEMS_PER_PAGE: 8, MAX_PAGE_BUTTONS: 5 };
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

function createPaginationButton(page, currentPage, onClick) {
    const pageBtn = document.createElement('button');
    pageBtn.classList.add('page-number');
    if (page.number === currentPage) pageBtn.classList.add('active');
    pageBtn.textContent = page.number;
    pageBtn.addEventListener('click', onClick);
    return pageBtn;
}

function updatePagination(teams, paginationId, currentPage, containerIdToUpdate, isFeatureSection) {
    const paginationContainer = document.getElementById(paginationId);
    if (!paginationContainer) return;

    const totalPages = Math.ceil(teams.length / ITEMS_PER_PAGE);
    
    const paginationHTML = `
        <button class="pagination-btn prev-btn" ${currentPage === 1 ? 'disabled' : ''}>
            Prev
        </button>
        <div class="pagination-numbers"></div>
        <button class="pagination-btn next-btn" ${currentPage === totalPages ? 'disabled' : ''}>
            Next
        </button>
    `;
    
    // Remove old event listeners by replacing the element
    const newPaginationContainer = paginationContainer.cloneNode(false);
    newPaginationContainer.innerHTML = paginationHTML;
    paginationContainer.parentNode.replaceChild(newPaginationContainer, paginationContainer);
    
    const numbersContainer = newPaginationContainer.querySelector('.pagination-numbers');
    const pages = getPageNumbers(currentPage, totalPages);
    
    pages.forEach(page => {
        if (page.isNumber) {
            const onClick = () => {
                const newPage = page.number;
                if (isFeatureSection) {
                    currentPageFeatured = newPage;
                    displayTeams(teams, containerIdToUpdate, currentPageFeatured);
                    updatePagination(teams, paginationId, currentPageFeatured, containerIdToUpdate, isFeatureSection);
                } else {
                    currentPageAll = newPage;
                    displayTeams(teams, containerIdToUpdate, currentPageAll);
                    updatePagination(teams, paginationId, currentPageAll, containerIdToUpdate, isFeatureSection);
                }
            };
            const pageBtn = createPaginationButton(page, currentPage, onClick);
            numbersContainer.appendChild(pageBtn);
        } else {
            const ellipsis = document.createElement('span');
            ellipsis.classList.add('page-ellipsis');
            ellipsis.textContent = page.text;
            numbersContainer.appendChild(ellipsis);
        }
    });
    
    // Add event listeners for prev/next buttons
    const prevBtn = newPaginationContainer.querySelector('.prev-btn');
    const nextBtn = newPaginationContainer.querySelector('.next-btn');
    
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

// Debounced window resize handler
window.addEventListener('resize', () => {
    if (resizeTimeout) {
        clearTimeout(resizeTimeout);
    }
    
    resizeTimeout = setTimeout(() => {
        ({ ITEMS_PER_PAGE, MAX_PAGE_BUTTONS } = updateItemsPerPage());
        main();
    }, 250);
});

document.addEventListener('DOMContentLoaded', main);