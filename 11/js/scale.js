const SCALE_STEP = 25;
const SCALE_MAX = 100;
const SCALE_MIN = 25;
const SCALE_RADIX = 10;

const overlayElement = document.querySelector('.img-upload__overlay');
const previewWrapper = overlayElement.querySelector('.img-upload__preview');
const previewImage = previewWrapper.querySelector('img');

const scaleControl = overlayElement.querySelector('.img-upload__scale');
const scaleValueField = scaleControl.querySelector('.scale__control--value');

const clampScale = (value) => Math.min(Math.max(SCALE_MIN, value), SCALE_MAX);

const parseScaleValue = () => {
  const raw = scaleValueField.value.trim();
  const numeric = parseInt(raw, SCALE_RADIX);
  return Number.isNaN(numeric) ? SCALE_MAX : numeric;
};

const applyScale = (value) => {
  const clamped = clampScale(value);
  const ratio = clamped / SCALE_MAX;

  scaleValueField.value = `${clamped}%`;
  previewImage.style.transform = `scale(${ratio})`;
};

const resetScaleInternal = () => {
  applyScale(SCALE_MAX);
};

const onScaleControlClick = (evt) => {
  const button = evt.target;

  if (button.tagName !== 'BUTTON') {
    return;
  }

  let currentValue = parseScaleValue();

  if (button.classList.contains('scale__control--smaller')) {
    currentValue -= SCALE_STEP;
  }

  if (button.classList.contains('scale__control--bigger')) {
    currentValue += SCALE_STEP;
  }

  applyScale(currentValue);
};

scaleControl.addEventListener('click', onScaleControlClick);

export { resetScaleInternal as setDefaultScale };
