function isEscapeKey(evt) {
  return evt.key === 'Escape';
}

function showMessage(templateId, { onButton, onClose } = {}) {
  const template = document.querySelector(templateId).content.cloneNode(true);
  const message = template.querySelector('section');
  document.body.append(message);

  function closeMessage(callback) {
    message.remove();
    document.removeEventListener('keydown', onEscKeydown);
    document.removeEventListener('click', onOutsideClick);
    if (callback) {
      callback();
    }
  }

  function onEscKeydown(evt) {
    if (isEscapeKey(evt)) {
      closeMessage(onClose);
    }
  }

  function onOutsideClick(evt) {
    if (!evt.target.closest(`.${message.className}__inner`)) {
      closeMessage(onClose);
    }
  }

  message.querySelector('button').addEventListener('click', () => {
    closeMessage(onButton);
  });
  document.addEventListener('keydown', onEscKeydown);
  document.addEventListener('click', onOutsideClick);
}

function debounce(callback, timeoutDelay = 500) {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
}

const shuffleArray = (array) => {
  for (let indexOne = array.length - 1; indexOne > 0; indexOne--) {
    const indexTwo = Math.floor(Math.random() * (indexOne + 1));
    [array[indexOne], array[indexTwo]] = [array[indexTwo], array[indexOne]];
  }
  return array;
};

export { showMessage, shuffleArray, debounce, isEscapeKey };
