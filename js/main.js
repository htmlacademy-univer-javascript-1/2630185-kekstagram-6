import { renderThumbnails } from './thumbnails.js';
import { openBigPicture } from './big-picture.js';
import { initForm } from './form.js';
import { initImageEditor } from './effects.js';
import { getDataFromServer } from './fetch.js';
import { initFilters } from './filters.js';

const picturesContainer = document.querySelector('.pictures');
let photos = [];

getDataFromServer()
  .then((data) => {
    photos = data;
    initFilters(photos, renderThumbnails);
    renderThumbnails(photos);
  })
  .catch(() => {
    const error = document.createElement('div');
    error.style.padding = '10px';
    error.style.backgroundColor = '#ff4d4d';
    error.style.color = '#fff';
    error.style.textAlign = 'center';
    error.textContent = 'Ошибка загрузки данных';
    document.body.append(error);
  });

initImageEditor();
initForm();

picturesContainer.addEventListener('click', (evt) => {
  const thumbnail = evt.target.closest('.picture');
  if (!thumbnail) {
    return;
  }

  const id = Number(thumbnail.dataset.photoId);
  const photo = photos.find((p) => p.id === id);

  if (photo) {
    openBigPicture(photo);
  }
});
