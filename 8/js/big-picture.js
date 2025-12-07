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

const openBigPicture = (photo) => {
  if (!photo) {return;}

  bigImg.src = photo.url;
  bigImg.alt = photo.description || '';
  likesCount.textContent = String(photo.likes);
  commentsCount.textContent = String(photo.comments.length);
  socialCaption.textContent = photo.description || '';

  socialComments.innerHTML = '';
  const fragment = document.createDocumentFragment();
  photo.comments.forEach((c) => fragment.appendChild(createCommentElement(c)));
  socialComments.appendChild(fragment);

  if (commentCountBlock) {commentCountBlock.classList.add('hidden');}
  if (commentsLoader) {commentsLoader.classList.add('hidden');}

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
