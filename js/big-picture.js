import { isEscapeKey } from './util.js';

const COMMENTS_STEP = 5;

const bigPicture = document.querySelector('.big-picture');
const bigImageElement = bigPicture.querySelector('.big-picture__img img');
const likesCountElement = bigPicture.querySelector('.likes-count');
const commentsCountElement = bigPicture.querySelector('.comments-count');
const socialCommentsElement = bigPicture.querySelector('.social__comments');
const socialCaptionElement = bigPicture.querySelector('.social__caption');
const commentCountBlockElement = bigPicture.querySelector('.social__comment-count');
const commentsLoaderElement = bigPicture.querySelector('.comments-loader');
const closeButtonElement = bigPicture.querySelector('.big-picture__cancel');

let photoComments = [];
let visibleCommentsCount = 0;

const createCommentElement = (comment) => {
  const li = document.createElement('li');
  li.className = 'social__comment';

  const img = document.createElement('img');
  img.className = 'social__picture';
  img.src = comment.avatar;
  img.alt = comment.name;
  img.width = 35;
  img.height = 35;

  const p = document.createElement('p');
  p.className = 'social__text';
  p.textContent = comment.message;

  li.append(img, p);
  return li;
};

const renderNextComments = () => {
  const next = visibleCommentsCount + COMMENTS_STEP;
  const commentsToRender = photoComments.slice(visibleCommentsCount, next);

  const fragment = document.createDocumentFragment();
  commentsToRender.forEach((comment) => fragment.appendChild(createCommentElement(comment)));
  socialCommentsElement.appendChild(fragment);

  visibleCommentsCount = next;

  commentCountBlockElement.textContent =
    `${Math.min(visibleCommentsCount, photoComments.length)} из ${photoComments.length}`;

  if (visibleCommentsCount >= photoComments.length) {
    commentsLoaderElement.classList.add('hidden');
  }
};

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    closeBigPicture();
  }
};

const onCommentsLoaderClick = () => renderNextComments();

function closeBigPicture() {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');

  commentsLoaderElement.removeEventListener('click', onCommentsLoaderClick);
  document.removeEventListener('keydown', onDocumentKeydown);
  closeButtonElement.removeEventListener('click', closeBigPicture);
}

const openBigPicture = (photo) => {
  bigImageElement.src = photo.url;
  bigImageElement.alt = photo.description;

  likesCountElement.textContent = String(photo.likes);
  commentsCountElement.textContent = String(photo.comments.length);
  socialCaptionElement.textContent = photo.description;

  photoComments = photo.comments;
  visibleCommentsCount = 0;

  socialCommentsElement.innerHTML = '';
  commentsLoaderElement.classList.remove('hidden');
  commentCountBlockElement.classList.remove('hidden');

  renderNextComments();

  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');

  commentsLoaderElement.addEventListener('click', onCommentsLoaderClick);
  document.addEventListener('keydown', onDocumentKeydown);
  closeButtonElement.addEventListener('click', closeBigPicture);
};

export { openBigPicture, closeBigPicture };
