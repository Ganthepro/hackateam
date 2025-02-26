document.addEventListener('DOMContentLoaded', function() {
  // Create intersection points
  function createIntersectionPoints() {
    const gridContainer = document.querySelector('.grid-container');
    const width = window.innerWidth;
    const height = window.innerHeight;
    let cellSize = 40; // Match the grid size in CSS
    
    // Adjust cell size for mobile
    if (width <= 769) {
      cellSize = 30;
    }
    if (width <= 480) {
      cellSize = 20;
    }
    
    // Calculate number of points
    const columns = Math.ceil(width / cellSize) + 1;
    const rows = Math.ceil(height / cellSize) + 1;
    
    // Remove existing points if resizing
    const existingPoints = document.querySelectorAll('.intersection-point');
    existingPoints.forEach(point => point.remove());
    
    // Create an intersection point at each grid intersection
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        // Create fewer points for better performance (every other intersection)
        if ((x % 2 === 0 && y % 2 === 0) || (Math.random() > 0.7)) {
          const point = document.createElement('div');
          point.className = 'intersection-point';
          
          // Randomly vary the size and color slightly for more natural look
          const size = 1 + Math.random();
          const opacity = 0.5 + Math.random() * 0.4;
          const hue = Math.random() > 0.7 ? '0, 230, 230' : '0, 163, 255';
          
          point.style.position = 'absolute';
          point.style.width = `${size}px`;
          point.style.height = `${size}px`;
          point.style.borderRadius = '50%';
          point.style.backgroundColor = `rgba(${hue}, ${opacity})`;
          point.style.boxShadow = `0 0 ${3 + Math.random() * 2}px rgba(${hue}, ${opacity * 0.8})`;
          point.style.left = `${x * cellSize}px`;
          point.style.top = `${y * cellSize}px`;
          point.style.transform = 'translate(-50%, -50%)';
          point.style.zIndex = '2';
          
          gridContainer.appendChild(point);
        }
      }
    }
  }
  
  // Initial creation and on resize with debounce
  createIntersectionPoints();
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(createIntersectionPoints, 250);
  });
  
  // Create multiple brightness pulses
  function createBrightnessPulses() {
    const container = document.querySelector('.grid-container');
    const existingPulses = document.querySelectorAll('.brightness-pulse');
    
    // Only create new pulses if they don't exist
    if (existingPulses.length < 3) {
      for (let i = 1; i < 3; i++) {
        const pulse = document.createElement('div');
        pulse.className = 'brightness-pulse';
        pulse.style.animationDelay = `${i * 4}s`;
        container.appendChild(pulse);
      }
    }
  }
  
  createBrightnessPulses();
});