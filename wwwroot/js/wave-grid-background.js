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
    cell.dataset.index = i;
    container.appendChild(cell);
    cells.push(cell);
  }
  
  return cells;
}

let cells = createGrid();

function createWaveAnimation() {
  const { COLS } = calculateGridSize();
  
  function animateWave() {
    const time = performance.now() * 0.002; // Adjust speed of wave
    
    cells.forEach((cell, index) => {
      // Calculate row and column
      const row = Math.floor(index / COLS);
      const col = index % COLS;
      
      // Create wave effect with sin and cos
      const waveX = Math.sin(time + col * 0.3) * 0.5 + 0.5;
      const waveY = Math.cos(time + row * 0.3) * 0.5 + 0.5;
      
      // Combine wave effects and use as opacity/intensity
      const intensity = (waveX + waveY) / 2;
      
      // Apply wave effect
      cell.style.opacity = intensity;
      cell.style.transform = `scale(${0.7 + intensity * 0.3})`;
    });
    
    requestAnimationFrame(animateWave);
  }
  
  animateWave();
}

// Resize grid on window resize
window.addEventListener('resize', () => {
  cells = createGrid();
  createWaveAnimation();
});

// Initial setup
window.addEventListener('load', () => {
  cells = createGrid();
  createWaveAnimation();
});