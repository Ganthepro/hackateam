const container = document.getElementById('grid-container');
    
// Calculate number of cells based on viewport and cell size
function calculateGridSize() {
  const cellSize = Math.min(window.innerWidth / 30, window.innerHeight / 30);
  const COLS = Math.floor(window.innerWidth / cellSize);
  const ROWS = Math.floor(window.innerHeight / cellSize);
  return { COLS, ROWS };
}

function createGrid() {
  // Clear existing cells
  container.innerHTML = '';
  const { COLS, ROWS } = calculateGridSize();
  const cells = [];
  
  // Create grid cells
  for (let i = 0; i < ROWS * COLS; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    container.appendChild(cell);
    cells.push(cell);
  }
  
  return cells;
}

let cells = createGrid();

// Randomly activate cells
function activateRandomCells() {
  const numberOfCells = Math.floor(Math.random() * 3) + 1; // Activate 1-3 cells at a time
  
  for (let i = 0; i < numberOfCells; i++) {
    const randomIndex = Math.floor(Math.random() * cells.length);
    const cell = cells[randomIndex];
    
    if (!cell.classList.contains('active')) {
      cell.classList.add('active');
      
      // Remove active class after animation completes
      setTimeout(() => {
        cell.classList.remove('active');
      }, 2000);
    }
  }
}

// Handle window resize
window.addEventListener('resize', () => {
  cells = createGrid();
});

// Reset the grid on page load
window.addEventListener('load', () => {
  cells = createGrid();
});

// Start the animation loop
setInterval(activateRandomCells, 100);