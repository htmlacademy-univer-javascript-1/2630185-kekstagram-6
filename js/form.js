import { sendDataToServer } from './fetch.js';
import { showMessage, isEscapeKey } from './util.js';
import { resetImageEditor } from './effects.js';

const MAX_SYMBOLS = 20;
const MAX_HASHTAGS = 5;
const MAX_COMMENT_LENGTH = 140;
const FILE_TYPES = ['jpg', 'jpeg', 'png', 'gif'];

function initForm() {
  const formUpload = document.querySelector('.img-upload__form');
  const fileInput = formUpload.querySelector('.img-upload__input');
  const overlay = document.querySelector('.img-upload__overlay');
  const cancelButton = overlay.querySelector('#upload-cancel');

  const inputHashtag = formUpload.querySelector('.text__hashtags');
  const inputComment = formUpload.querySelector('.text__description');

  const submitButton = formUpload.querySelector('.img-upload__submit');
  const previewImage = formUpload.querySelector('.img-upload__preview img');
  const effectsPreviews = formUpload.querySelectorAll('.effects__preview');

  const pristine = new Pristine(formUpload, {
    classTo: 'img-upload__field-wrapper',
    errorClass: 'img-upload__field-wrapper--invalid',
    successClass: 'img-upload__field-wrapper--valid',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextTag: 'div',
    errorTextClass: 'img-upload__error',
  });

  const isMessageOpened = () => Boolean(document.querySelector('.success, .error'));

  const getHashtags = (value) =>
    value
      .trim()
      .split(/\s+/)
      .filter((tag) => tag.length > 0);

  const isValidFileType = (file) => {
    const fileName = file.name.toLowerCase();
    return FILE_TYPES.some((type) => fileName.endsWith(type));
  };

  const setPreviewImage = (src) => {
    previewImage.src = src;
    effectsPreviews.forEach((preview) => {
      preview.style.backgroundImage = `url(${src})`;
    });
  };

  const loadUserImage = () => {
    const [file] = fileInput.files;
    if (!file) {
      return;
    }

    if (!isValidFileType(file)) {
      fileInput.value = '';
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setPreviewImage(reader.result);
    });

    reader.readAsDataURL(file);
  };

  const validateHashtags = (value) => {
    const hashtags = getHashtags(value);
    if (hashtags.length === 0) {
      return true;
    }

    if (hashtags.length > MAX_HASHTAGS) {
      return false;
    }

    const uniqueTags = new Set();

    return hashtags.every((hashtag) => {
      if (
        !hashtag.startsWith('#') ||
        hashtag === '#' ||
        hashtag.length > MAX_SYMBOLS ||
        !/^#[a-zа-яё0-9]{1,19}$/i.test(hashtag)
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
    const hashtags = getHashtags(value);
    if (hashtags.length === 0) {
      return '';
    }

    if (hashtags.length > MAX_HASHTAGS) {
      return `Нельзя указать больше ${MAX_HASHTAGS} хэш-тегов`;
    }

    for (const hashtag of hashtags) {
      if (!hashtag.startsWith('#')) {
        return 'Хэш-тег должен начинаться с символа #';
      }
      if (hashtag === '#') {
        return 'Хэштег не может состоять только из решётки';
      }
      if (hashtag.length > MAX_SYMBOLS) {
        return `Максимальная длина хэштега ${MAX_SYMBOLS} символов`;
      }
      if (!/^#[a-zа-яё0-9]{1,19}$/i.test(hashtag)) {
        return 'Хэштег содержит недопустимые символы';
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
    (value) => value.length <= MAX_COMMENT_LENGTH,
    `Длина комментария не может превышать ${MAX_COMMENT_LENGTH} символов`
  );

  const updateSubmitButton = () => {
    submitButton.disabled = !pristine.validate();
  };

  const onDocumentKeydown = (evt) => {
    if (!isEscapeKey(evt)) {
      return;
    }
    if (isMessageOpened()) {
      return;
    }
    if (document.activeElement === inputHashtag || document.activeElement === inputComment) {
      return;
    }
    closeForm();
  };

  const showFormOverlay = () => {
    overlay.classList.remove('hidden');
    document.body.classList.add('modal-open');

    document.removeEventListener('keydown', onDocumentKeydown);
    document.addEventListener('keydown', onDocumentKeydown);
  };

  const hideFormOverlay = () => {
    overlay.classList.add('hidden');
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', onDocumentKeydown);
  };

  const resetForm = () => {
    formUpload.reset();
    pristine.reset();
    fileInput.value = '';
    setPreviewImage('img/upload-default-image.jpg');
    resetImageEditor();
    submitButton.disabled = false;
  };

  const openForm = () => {
    if (!fileInput.files.length) {
      return;
    }

    loadUserImage();
    resetImageEditor();
    showFormOverlay();
    updateSubmitButton();
  };

  function closeForm() {
    hideFormOverlay();
    resetForm();
  }

  fileInput.addEventListener('change', openForm);
  cancelButton.addEventListener('click', closeForm);

  [inputHashtag, inputComment].forEach((field) => {
    field.addEventListener('keydown', (evt) => {
      if (isEscapeKey(evt) && !overlay.classList.contains('hidden') && !isMessageOpened()) {
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

        hideFormOverlay();

        showMessage('#error', {
          onButton: showFormOverlay,
          onClose: showFormOverlay,
        });
      });
  });
}

export { initForm };
