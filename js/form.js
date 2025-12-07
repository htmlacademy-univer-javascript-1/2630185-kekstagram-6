const MAX_SYMBOLS = 20;
const MAX_HASHTAGS = 5;

function initForm() {
  const formUpload = document.querySelector('.img-upload__form');
  const fileInput = formUpload.querySelector('.img-upload__input');
  const overlay = document.querySelector('.img-upload__overlay');
  const cancelButton = overlay.querySelector('#upload-cancel');
  const inputHashtag = formUpload.querySelector('.text__hashtags');
  const inputComment = formUpload.querySelector('.text__description');

  const pristine = new Pristine(formUpload, {
    classTo: 'img-upload__field-wrapper',
    errorClass: 'img-upload__field-wrapper--invalid',
    successClass: 'img-upload__field-wrapper--valid',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextTag: 'span',
    errorTextClass: 'img-upload__error',
  });


  let errorMessage = '';

  const getErrorMessage = () => errorMessage;

  const hashtagsHandler = (value) => {
    errorMessage = '';
    const inputText = value.toLowerCase().trim();

    if (!inputText) {
      return true;
    }

    const inputArray = inputText.split(/\s+/);

    const rules = [
      {
        check: inputArray.some((item) => item.indexOf('#', 1) >= 1),
        error: 'Хэш-теги должны разделяться одним пробелом',
      },
      {
        check: inputArray.some((item) => item[0] !== '#'),
        error: 'Хэш-тег должен начинаться с символа #',
      },
      {
        check: inputArray.some((item, num, arr) => arr.includes(item, num + 1)),
        error: 'Хэш-теги не должны повторяться',
      },
      {
        check: inputArray.some((item) => item.length > MAX_SYMBOLS),
        error: `Максимальная длина одного хэш-тега ${MAX_SYMBOLS} символов, включая решётку`,
      },
      {
        check: inputArray.length > MAX_HASHTAGS,
        error: `Нельзя указать больше ${MAX_HASHTAGS} хэш-тегов`,
      },
      {
        check: inputArray.some((item) => !/^#[a-zа-яё0-9]{1,19}$/i.test(item)),
        error: 'Хэш-тег содержит недопустимые символы',
      },
    ];

    const isValid = rules.every((rule) => {
      const isInvalid = rule.check;
      if (isInvalid) {
        errorMessage = rule.error;
      }
      return !isInvalid;
    });

    return isValid;
  };

  pristine.addValidator(inputHashtag, hashtagsHandler, getErrorMessage, 2, false);

  pristine.addValidator(
    inputComment,
    (value) => value.length <= 140,
    'Комментарий не должен превышать 140 символов',
    2,
    false
  );

  const updateSubmitButton = () => {
    const submitButton = formUpload.querySelector('.img-upload__submit');
    const isValid = pristine.validate();

    if (isValid) {
      submitButton.disabled = false;
      submitButton.removeAttribute('title');
    } else {
      submitButton.disabled = true;
      submitButton.setAttribute('title', 'Исправьте ошибки в форме');
    }
  };

  const onHashtagInput = () => {
    pristine.validate();
    updateSubmitButton();
  };

  const onCommentInput = () => {
    pristine.validate();
    updateSubmitButton();
  };

  const openForm = () => {
    if (!fileInput.files[0]) {
      return;
    }
    overlay.classList.remove('hidden');
    document.body.classList.add('modal-open');
  };

  const closeForm = () => {
    overlay.classList.add('hidden');
    document.body.classList.remove('modal-open');
    formUpload.reset();
    pristine.reset();
    fileInput.value = '';

    const submitButton = formUpload.querySelector('.img-upload__submit');
    submitButton.disabled = false;
    submitButton.removeAttribute('title');
  };

  fileInput.addEventListener('change', openForm);
  cancelButton.addEventListener('click', closeForm);

  const onDocumentKeydown = (evt) => {
    if (evt.key === 'Escape') {
      closeForm();
    }
  };

  document.addEventListener('keydown', onDocumentKeydown);

  [inputHashtag, inputComment].forEach((field) => {
    field.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape') {
        evt.stopPropagation();
      }
    });
  });

  inputHashtag.addEventListener('input', onHashtagInput);
  inputComment.addEventListener('input', onCommentInput);

  formUpload.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const isValid = pristine.validate();

    if (isValid) {
      formUpload.submit();
    } else {
      pristine.validate();
      updateSubmitButton();
    }
  });

  updateSubmitButton();
}

export { initForm };
