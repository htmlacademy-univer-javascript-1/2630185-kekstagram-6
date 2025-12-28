const bigPicture = document.querySelector('.big-picture');
const bigImg = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const commentsCount = bigPicture.querySelector('.comments-count');
const socialComments = bigPicture.querySelector('.social__comments');
const socialCaption = bigPicture.querySelector('.social__caption');
const commentCountBlock = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const closeBtn = bigPicture.querySelector('.big-picture__cancel');

let onEscKeyDown;
let photoComments = [];
let visibleCommentsCount = 0;
const COMMENTS_STEP = 5;

const createCommentElement = (comment) => {
  const li = document.createElement('li');
  li.className = 'social__comment';

  const img = document.createElement('img');
  img.className = 'social__picture';
  img.src = comment.avatar;
  img.alt = comment.name || 'Аватар';
  img.width = 35;
  img.height = 35;

  const p = document.createElement('p');
  p.className = 'social__text';
  p.textContent = comment.message;

  li.appendChild(img);
  li.appendChild(p);
  return li;
};

const renderNextComments = () => {
  const next = visibleCommentsCount + COMMENTS_STEP;
  const commentsToRender = photoComments.slice(visibleCommentsCount, next);

  const fragment = document.createDocumentFragment();
  commentsToRender.forEach((comment) => {
    fragment.appendChild(createCommentElement(comment));
  });
  socialComments.appendChild(fragment);

  visibleCommentsCount = next;

  commentCountBlock.textContent =
    `${Math.min(visibleCommentsCount, photoComments.length)} из ${photoComments.length}`;

  if (visibleCommentsCount >= photoComments.length) {
    commentsLoader.classList.add('hidden');
  }
};

const openBigPicture = (photo) => {
  if (!photo) {return;}

  bigImg.src = photo.url;
  bigImg.alt = photo.description || '';
  likesCount.textContent = String(photo.likes);
  commentsCount.textContent = String(photo.comments.length);
  socialCaption.textContent = photo.description || '';

  commentCountBlock.classList.remove('hidden');
  commentsLoader.classList.remove('hidden');

  socialComments.innerHTML = '';
  photoComments = photo.comments;
  visibleCommentsCount = 0;

  renderNextComments();

  commentsLoader.onclick = renderNextComments;

  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');

  onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      closeBigPicture();
    }
  };
  document.addEventListener('keydown', onEscKeyDown);
  closeBtn.addEventListener('click', closeBigPicture);
};

function closeBigPicture() {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');

  document.removeEventListener('keydown', onEscKeyDown);
  closeBtn.removeEventListener('click', closeBigPicture);
}

export { openBigPicture, closeBigPicture };
