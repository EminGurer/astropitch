const form = document.querySelector('form');
const fileInput = document.querySelector('#formFileMultiple');
const modal = document.querySelector('#cropModal');
const modalSaveButton = document.querySelector('#modalSave');
const modalCloseButton = document.querySelector('#modalClose');
const deleteParent = (e) => {
  e.target.parentElement.remove();
};
fileInput.addEventListener('click', (event) => {
  event.target.value = '';
});
fileInput.addEventListener('change', async (event) => {
  const modalOpener = document.querySelector('#modalOpener');
  modalOpener.click();
  const files = event.target.files;
  modal.addEventListener('shown.bs.modal', function () {
    for (file of files) {
      const wrapper = document.createElement('div');
      wrapper.classList.add('crop-wrapper');
      const img = document.createElement('img');
      const deleteButton = document.createElement('button');
      deleteButton.classList.add('btn', 'btn-danger', 'crop-delete-button');
      deleteButton.innerText = 'Delete';
      deleteButton.onclick = deleteParent;
      wrapper.appendChild(deleteButton);
      img.classList.add('crop-image');
      wrapper.appendChild(img);
      if (img.cropper) {
        img.cropper.destroy();
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener('load', () => {
        const cropper = new Cropper(img, {
          aspectRatio: 1,
          initialAspectRatio: 1,
          dragMode: 'crop',
          viewMode: 3,
          guides: true,
          moveable: false,
          zoomable: false,
          toggleDragModeOnDblclick: false,
          highlight: false,
          minCropBoxWidth: 100,
          minCropBoxHeight: 100,
          autoCropArea: 1,
        });
        cropper.replace(reader.result);
      });
      reader.addEventListener('loadend', (e) => {
        e.target.abort();
      });
      modal.querySelector('.modal-body').appendChild(wrapper);
    }
  });
});

modalSaveButton.addEventListener('click', async () => {
  //Get cropped image
  const images = modal.querySelectorAll('.crop-image');
  fileInput.value = '';
  let list = new DataTransfer();

  for (image of images) {
    const croppedCanvas = image.cropper.getCroppedCanvas({
      imageSmoothingQuality: 'high',
    });
    croppedCanvas.toBlob((blob) => {
      const file = new File([blob], `Cropped Image`);
      list.items.add(file);
      fileInput.files = list.files;
    });
    image.cropper.destroy();
  }
  const modalBodyInner = modal
    .querySelector('.modal-body')
    .querySelectorAll('*');
  for (item of modalBodyInner) {
    item.remove();
  }
});

modalCloseButton.addEventListener('click', () => {
  fileInput.value = '';
  const modalBodyInner = modal
    .querySelector('.modal-body')
    .querySelectorAll('*');
  for (item of modalBodyInner) {
    item.remove();
  }
});
