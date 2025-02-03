function controlNavbar() {
    const navLinks = document.getElementById('nav-links');
    navLinks.classList.toggle('active');
}

window.addEventListener('resize', () => {
    const navLinks = document.getElementById('nav-links');
    const navIcon = document.getElementById('nav-icon');
    
    if (window.innerWidth > 600) {
        navLinks.classList.remove('active');
    }
});