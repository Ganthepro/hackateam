const fileInput = document.getElementById('fileInput');
const fileNameDisplay = document.querySelector('.file-name');

fileInput.addEventListener('change', function() {
    if (this.files && this.files.length > 0) {
        fileNameDisplay.textContent = this.files[0].name;
        fileNameDisplay.style.color = '#5DD161';
    } else {
        fileNameDisplay.textContent = 'No file chosen';
        fileNameDisplay.style.color = '#767779';
    }
});