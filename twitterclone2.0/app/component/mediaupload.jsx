"use client";

const MediaUpload = (accept) => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = accept;

  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const previewElement = document.querySelector('.videobox img');
        if (previewElement) {
          previewElement.src = e.target.result;
          document.querySelector('.videobox').style.display = 'flex';
        }
      };
      reader.readAsDataURL(file);
    }
  });

  fileInput.click();
};

export default MediaUpload;
