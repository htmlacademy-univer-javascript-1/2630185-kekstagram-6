import { sendDataToServer } from './fetch.js';
import { showMessage } from './util.js';

const MAX_SYMBOLS = 20;
const MAX_HASHTAGS = 5;

function initForm() {
  const formUpload = document.querySelector('.img-upload__form');
  const fileInput = formUpload.querySelector('.img-upload__input');
  const overlay = document.querySelector('.img-upload__overlay');
  const cancelButton = overlay.querySelector('#upload-cancel');
  const inputHashtag = formUpload.querySelector('.text__hashtags');
  const inputComment = formUpload.querySelector('.text__description');
  const submitButton = formUpload.querySelector('.img-upload__submit');

  const pristine = new Pristine(formUpload, {
    classTo: 'img-upload__field-wrapper',
    errorClass: 'img-upload__field-wrapper--invalid',
    successClass: 'img-upload__field-wrapper--valid',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextTag: 'div',
    errorTextClass: 'img-upload__error'
  });

  const validateHashtags = (value) => {
    const inputText = value.trim();
    if (inputText === '') {
      return true;
    }

    const hashtags = inputText.split(/\s+/);
    if (hashtags.length > MAX_HASHTAGS) {
      return false;
    }

    const uniqueTags = new Set();

    return hashtags.every((hashtag) => {
      if (
        hashtag[0] !== '#' ||
        hashtag === '#' ||
        hashtag.length > MAX_SYMBOLS ||
        !/^#[a-zа-яё0-9-]{1,19}$/i.test(hashtag)
      ) {
        return false;
      }

      const lower = hashtag.toLowerCase();
      if (uniqueTags.has(lower)) {
        return false;
      }

      uniqueTags.add(lower);
      return true;
    });
  };

  const getHashtagErrorMessage = (value) => {
    const inputText = value.trim();
    if (inputText === '') {
      return '';
    }

    const hashtags = inputText.split(/\s+/);

    if (hashtags.length > MAX_HASHTAGS) {
      return `Нельзя указать больше ${MAX_HASHTAGS} хэш-тегов`;
    }

    for (const hashtag of hashtags) {
      if (hashtag[0] !== '#') {
        return 'Хэш-тег должен начинаться с символа #';
      }
      if (hashtag === '#') {
        return 'Хэштег не может состоять только из решётки';
      }
      if (hashtag.length > MAX_SYMBOLS) {
        return `Максимальная длина хэштега ${MAX_SYMBOLS} символов`;
      }
      if (!/^#[a-zа-яё0-9-]{1,19}$/i.test(hashtag)) {
        return 'Хэштег содержит недопустимые символы';
      }
      if (hashtag.includes(' ', 1)) {
        return 'Хэштеги должны разделяться пробелами';
      }
    }

    const lowerTags = hashtags.map((tag) => tag.toLowerCase());
    if (new Set(lowerTags).size !== lowerTags.length) {
      return 'Хэштеги не должны повторяться';
    }

    return '';
  };

  pristine.addValidator(inputHashtag, validateHashtags, getHashtagErrorMessage);
  pristine.addValidator(
    inputComment,
    (value) => value.length <= 140,
    'Длина комментария не может превышать 140 символов'
  );

  const updateSubmitButton = () => {
    submitButton.disabled = !pristine.validate();
  };

  const hideForm = () => {
    overlay.classList.add('hidden');
    document.body.classList.remove('modal-open');
  };

  const openForm = () => {
    if (!fileInput.files.length) {
      return;
    }
    overlay.classList.remove('hidden');
    document.body.classList.add('modal-open');
    updateSubmitButton();
  };

  const closeForm = () => {
    overlay.classList.add('hidden');
    document.body.classList.remove('modal-open');

    formUpload.reset();
    pristine.reset();
    fileInput.value = '';

    document.querySelector('.scale__control--value').value = '100%';
    formUpload.querySelector('input[name="effect"][value="none"]').checked = true;

    submitButton.disabled = false;
  };

  fileInput.addEventListener('change', openForm);
  cancelButton.addEventListener('click', closeForm);

  document.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape' && !overlay.classList.contains('hidden')) {
      closeForm();
    }
  });

  [inputHashtag, inputComment].forEach((field) => {
    field.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape') {
        evt.stopPropagation();
      }
    });

    field.addEventListener('input', updateSubmitButton);
  });

  formUpload.addEventListener('submit', (evt) => {
    evt.preventDefault();

    if (!pristine.validate()) {
      return;
    }

    submitButton.disabled = true;

    sendDataToServer(new FormData(formUpload))
      .then(() => {
        closeForm();
        showMessage('#success');
      })
      .catch(() => {
        submitButton.disabled = false;

        hideForm();

        showMessage('#error', {
          onButton: () => {
            overlay.classList.remove('hidden');
            document.body.classList.add('modal-open');
          },

          onClose: () => {
            closeForm();
          }
        });
      });
  });
}

export { initForm };
