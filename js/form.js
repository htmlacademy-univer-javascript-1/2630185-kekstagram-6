import { sendDataToServer } from './fetch.js';
import { showMessage } from './util.js';
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

  const pristine = new Pristine(formUpload, {
    classTo: 'img-upload__field-wrapper',
    errorClass: 'img-upload__field-wrapper--invalid',
    successClass: 'img-upload__field-wrapper--valid',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextTag: 'div',
    errorTextClass: 'img-upload__error'
  });

  const loadUserImage = () => {
    const [file] = fileInput.files;
    if (!file) {
      return;
    }
    const fileName = file.name.toLowerCase();
    const isValidType = FILE_TYPES.some((type) => fileName.endsWith(type));
    if (!isValidType) {
      fileInput.value = '';
      return;
    }
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      previewImage.src = reader.result;
    });
    reader.readAsDataURL(file);
  };

  const validateHashtags = (value) => {
    const inputText = value.trim();
    if (inputText === '') {
      return true;
    }
    const hashtags = inputText.split(/\s+/).filter((tag) => tag.length > 0);
    if (hashtags.length > MAX_HASHTAGS) {
      return false;
    }
    const uniqueTags = new Set();
    return hashtags.every((hashtag) => {
      if (
        !hashtag.startsWith('#') ||
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
    const hashtags = inputText.split(/\s+/).filter((tag) => tag.length > 0);
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
      if (!/^#[a-zа-яё0-9-]{1,19}$/i.test(hashtag)) {
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

  const openForm = () => {
    if (!fileInput.files.length) {
      return;
    }
    loadUserImage();
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
    previewImage.src = 'img/upload-default-image.jpg';
    resetImageEditor();
    submitButton.disabled = false;
  };

  const onFormKeydown = (evt) => {
    if (evt.key === 'Escape' && !overlay.classList.contains('hidden')) {
      if (document.activeElement !== inputHashtag && document.activeElement !== inputComment) {
        closeForm();
      }
    }
  };

  fileInput.addEventListener('change', openForm);
  cancelButton.addEventListener('click', closeForm);
  document.addEventListener('keydown', onFormKeydown);

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
        showMessage('#error', {
          onButton: () => {
            overlay.classList.remove('hidden');
            document.body.classList.add('modal-open');
          },
          onClose: () => {
            overlay.classList.remove('hidden');
            document.body.classList.add('modal-open');
          }
        });
      });
  });
}

export { initForm };
