const thumbnailTemplate = document.querySelector('#picture').content.querySelector('.picture');
const picturesContainer = document.querySelector('.pictures');

const createThumbnail = (photoData) => {
  const thumbnail = thumbnailTemplate.cloneNode(true);
  const image = thumbnail.querySelector('.picture__img');
  const comments = thumbnail.querySelector('.picture__comments');
  const likes = thumbnail.querySelector('.picture__likes');

  image.src = photoData.url;
  image.alt = photoData.description;
  likes.textContent = photoData.likes;
  comments.textContent = photoData.comments.length;

  thumbnail.dataset.photoId = photoData.id;

  return thumbnail;
};

const renderThumbnails = (photosData) => {
  const fragment = document.createDocumentFragment();

  photosData.forEach((photo) => {
    const thumbnail = createThumbnail(photo);
    fragment.appendChild(thumbnail);
  });

  picturesContainer.appendChild(fragment);
};

export { renderThumbnails };
