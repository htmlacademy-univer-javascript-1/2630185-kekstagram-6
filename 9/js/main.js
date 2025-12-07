import { generatePhotos, renderThumbnails } from './data.js';
import { openBigPicture } from './big-picture.js';

const picturesContainer = document.querySelector('.pictures');
const photos = generatePhotos();
renderThumbnails(photos);

picturesContainer.addEventListener('click', (evt) => {
  const thumbnail = evt.target.closest('.picture');
  if (!thumbnail) {return;}

  const id = Number(thumbnail.dataset.photoId);
  const photo = photos.find((p) => p.id === id);

  if (photo) {
    openBigPicture(photo);
  }
});
