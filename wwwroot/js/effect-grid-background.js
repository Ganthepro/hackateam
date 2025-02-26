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
  const cells = [];
  
  for (let i = 0; i < ROWS * COLS; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    container.appendChild(cell);
    cells.push(cell);
  }
  
  return cells;
}

let cells = createGrid();

function activateRandomCells() {
  const numberOfCells = Math.floor(Math.random() * 3) + 1;
  
  for (let i = 0; i < numberOfCells; i++) {
    const randomIndex = Math.floor(Math.random() * cells.length);
    const cell = cells[randomIndex];
    
    if (!cell.classList.contains('active')) {
      cell.classList.add('active');

      setTimeout(() => {
        cell.classList.remove('active');
      }, 2000);
    }
  }
}

window.addEventListener('resize', () => {
  cells = createGrid();
});

window.addEventListener('load', () => {
  cells = createGrid();
});

setInterval(activateRandomCells, 80);