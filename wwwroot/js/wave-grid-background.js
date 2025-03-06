const container = document.getElementById('grid-container');

function calculateGridSize() {
    const cellSize = Math.min(window.innerWidth / 30, window.innerHeight / 30);
    const COLS = Math.floor(window.innerWidth / cellSize);
    const ROWS = Math.floor(window.innerHeight / cellSize);
    return { COLS, ROWS };
}

function createGrid() {
    container.innerHTML = '';
    const { COLS, ROWS } = calculateGridSize();

    for (let i = 0; i < ROWS * COLS; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        container.appendChild(cell);
    }
}

window.addEventListener('resize', createGrid);
window.addEventListener('load', createGrid);
