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
    if (evt.key === 'Escape') {
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

export { showMessage };
