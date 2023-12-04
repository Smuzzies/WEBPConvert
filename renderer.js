const imageInput = document.getElementById('imageInput');
const convertButton = document.getElementById('convertButton');
const statusText = document.getElementById('status');
const thumbnailContainer = document.getElementById('thumbnailContainer');

// Drag and Drop functionality
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  thumbnailContainer.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
  thumbnailContainer.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
  thumbnailContainer.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
  thumbnailContainer.classList.add('highlight');
}

function unhighlight(e) {
  thumbnailContainer.classList.remove('highlight');
}

thumbnailContainer.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
  let dt = e.dataTransfer;
  let files = dt.files;
  handleFiles(files);
}

function handleFiles(files) {
  if (files.length > 0) {
    updateThumbnail(files[0]);
    imageInput.files = files; // Update the file input
  }
}

function updateThumbnail(file) {
  var img = document.getElementById('thumbnail');
  img.src = URL.createObjectURL(file);
  img.onload = function() {
    URL.revokeObjectURL(img.src); // Clean up memory
  };
  img.style.display = 'block';
}

// Existing functionality for file input change
imageInput.addEventListener('change', function() {
  if (this.files && this.files[0]) {
    updateThumbnail(this.files[0]);
  }
});

// Status update functions
function updateStatusError(message) {
  statusText.innerText = message;
  statusText.style.color = 'red'; // Error messages in red
}

function updateStatusNormal(message) {
  statusText.innerText = message;
  statusText.style.color = 'green'; // Normal text color
}

// IPC event listeners
window.ipcRenderer.on('conversion-success', (event, outputFilePath) => {
  updateStatusNormal(`Conversion successful! File saved as ${outputFilePath}`);
});

window.ipcRenderer.on('conversion-error', (event, errorMessage) => {
  updateStatusError(errorMessage);
});

// Convert button functionality
convertButton.addEventListener('click', () => {
  if (!imageInput.files.length) {
    updateStatusError('Please select an image file.');
    return;
  }

  const filePath = imageInput.files[0].path;
  updateStatusNormal('Converting, please wait...'); // Inform user that processing is happening
  window.ipcRenderer.send('convert-image', filePath);
});

// Optional: Reset status text when user selects a new file
imageInput.addEventListener('change', () => {
  updateStatusNormal(''); // Clear status text
});

// Exit App button functionality
document.getElementById('exitButton').addEventListener('click', () => {
  window.close(); // Or a suitable method to close the app
});
