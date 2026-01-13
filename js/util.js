const isEscapeKey = (evt) => evt.key === 'Escape';

function showMessage(templateId, { onButton, onClose } = {}) {
  document.querySelectorAll('.success, .error').forEach((el) => el.remove());

  const template = document.querySelector(templateId);
  if (!template) {
    return;
  }

  const message = template.content.querySelector('section').cloneNode(true);
  document.body.append(message);

  const innerElement =
    message.querySelector('.success__inner') ||
    message.querySelector('.error__inner') ||
    message;

  const closeMessage = (callback) => {
    message.remove();
    document.removeEventListener('keydown', onDocumentKeydown);
    document.removeEventListener('click', onDocumentClick);

    if (typeof callback === 'function') {
      callback();
    }
  };

  function onDocumentKeydown(evt) {
    if (isEscapeKey(evt)) {
      closeMessage(onClose);
    }
  }

  function onDocumentClick(evt) {
    if (!innerElement.contains(evt.target)) {
      closeMessage(onClose);
    }
  }

  const button =
    message.querySelector('.success__button') ||
    message.querySelector('.error__button') ||
    message.querySelector('button');

  if (button) {
    button.addEventListener('click', () => closeMessage(onButton));
  }

  document.addEventListener('keydown', onDocumentKeydown);
  document.addEventListener('click', onDocumentClick);
}

function debounce(callback, timeoutDelay = 500) {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...rest), timeoutDelay);
  };
}

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export { showMessage, shuffleArray, debounce, isEscapeKey };
