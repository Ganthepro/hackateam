document.addEventListener('DOMContentLoaded', function() {
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const navbarLinks = document.querySelector('.navbar-links');

    function resetMenuState() {
        const windowWidth = window.innerWidth;
        if (windowWidth > 480) {
            navbarLinks.classList.remove('active');
            dropdownMenu.style.transform = 'rotate(0)';
        }
    }

    window.addEventListener('resize', resetMenuState);

    dropdownMenu.addEventListener('click', function() {
        navbarLinks.classList.toggle('active');
        this.style.transform = navbarLinks.classList.contains('active') 
            ? 'rotate(180deg)'
            : 'rotate(0)';
    });

    document.addEventListener('click', function(event) {
        if (!event.target.closest('.navbar') && navbarLinks.classList.contains('active')) {
            navbarLinks.classList.remove('active');
            dropdownMenu.style.transform = 'rotate(0)';
        }
    });
});