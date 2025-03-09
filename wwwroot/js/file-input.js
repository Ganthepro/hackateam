const fileInput = document.getElementById('fileInput');
const fileInput02 = document.getElementById('avatar-upload');
const fileNameDisplay = document.querySelector('.file-name');

if (fileInput) {
    fileInput.addEventListener('change', function() {
        if (this.files && this.files.length > 0) {
            fileNameDisplay.textContent = this.files[0].name;
            fileNameDisplay.style.color = '#5DD161';
        } else {
            fileNameDisplay.textContent = 'No file chosen';
            fileNameDisplay.style.color = '#767779';
        }
    });
} else if (fileInput02) {
    fileInput02.addEventListener('change', function() {
        if (this.files && this.files.length > 0) {
            fileNameDisplay.textContent = this.files[0].name;
            fileNameDisplay.style.color = '#5DD161';
        } else {
            fileNameDisplay.textContent = 'No file chosen';
            fileNameDisplay.style.color = '#767779';
        }
    });
}