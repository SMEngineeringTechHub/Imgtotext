const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
const outputText = document.getElementById('outputText');
const pasteArea = document.getElementById('pasteArea');

let currentImageFile = null;

// Handle file input
imageInput.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    showImage(file);
  }
});

// Handle paste from clipboard
pasteArea.addEventListener('paste', function (e) {
  const items = e.clipboardData.items;
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      const file = items[i].getAsFile();
      showImage(file);
      break;
    }
  }
});

// Show image in preview and store for processing
function showImage(file) {
  currentImageFile = file;
  const reader = new FileReader();
  reader.onload = function () {
    imagePreview.src = reader.result;
    imagePreview.style.display = 'block';
  };
  reader.readAsDataURL(file);
}

// Extract text with Tesseract
function extractText() {
  if (!currentImageFile) {
    alert('Please upload or paste an image first!');
    return;
  }

  outputText.textContent = 'Processing...';

  Tesseract.recognize(
    currentImageFile,
    'eng',
    {
      logger: m => console.log(m)
    }
  ).then(({ data: { text } }) => {
    outputText.textContent = text;
  }).catch(err => {
    console.error(err);
    outputText.textContent = 'Error recognizing text.';
  });
}
