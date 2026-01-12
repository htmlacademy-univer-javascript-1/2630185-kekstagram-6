const MIN_SCALE = 25;
const MAX_SCALE = 100;
const STEP_SCALE = 25;
const DEFAULT_SCALE_VALUE = 100;

const form = document.querySelector('.img-upload__form');
const zoomOutButtonElement = form.querySelector('.scale__control--smaller');
const zoomInButtonElement = form.querySelector('.scale__control--bigger');
const scaleValueElement = form.querySelector('.scale__control--value');

const imageElement = form.querySelector('.img-upload__preview img');
const effectsListElement = form.querySelector('.effects__list');

const sliderContainer = form.querySelector('.img-upload__effect-level');
const sliderElement = form.querySelector('.effect-level__slider');
const effectValueElement = form.querySelector('.effect-level__value');

const Effects = {
  none: { range: { min: 0, max: 1 }, start: 1, step: 0.1, filter: null },
  chrome: { range: { min: 0, max: 1 }, start: 1, step: 0.1, filter: (v) => `grayscale(${v})` },
  sepia: { range: { min: 0, max: 1 }, start: 1, step: 0.1, filter: (v) => `sepia(${v})` },
  marvin: { range: { min: 0, max: 100 }, start: 100, step: 1, filter: (v) => `invert(${v}%)` },
  phobos: { range: { min: 0, max: 3 }, start: 3, step: 0.1, filter: (v) => `blur(${v}px)` },
  heat: { range: { min: 1, max: 3 }, start: 3, step: 0.1, filter: (v) => `brightness(${v})` },
};

let currentEffect = 'none';
let isEditorInited = false;

const applyScale = (value) => {
  imageElement.style.transform = `scale(${value / 100})`;
};

const onZoomOutButtonClick = () => {
  const currentValue = parseInt(scaleValueElement.value, 10);
  const nextValue = Math.max(MIN_SCALE, currentValue - STEP_SCALE);
  scaleValueElement.value = `${nextValue}%`;
  applyScale(nextValue);
};

const onZoomInButtonClick = () => {
  const currentValue = parseInt(scaleValueElement.value, 10);
  const nextValue = Math.min(MAX_SCALE, currentValue + STEP_SCALE);
  scaleValueElement.value = `${nextValue}%`;
  applyScale(nextValue);
};

const setEffect = (effectName) => {
  currentEffect = effectName;
  const config = Effects[effectName];

  if (effectName === 'none') {
    sliderContainer.classList.add('hidden');
    imageElement.style.filter = '';
    effectValueElement.value = String(config.start);

    sliderElement.noUiSlider.updateOptions({
      range: Effects.none.range,
      start: Effects.none.start,
      step: Effects.none.step
    });

    sliderElement.noUiSlider.set(Effects.none.start);
    return;
  }

  sliderContainer.classList.remove('hidden');

  sliderElement.noUiSlider.updateOptions({
    range: config.range,
    start: config.start,
    step: config.step
  });

  sliderElement.noUiSlider.set(config.start);
  effectValueElement.value = String(config.start);
  imageElement.style.filter = config.filter(config.start);
};

const onEffectsListChange = (evt) => {
  const input = evt.target.closest('input[type="radio"]');
  if (!input) {
    return;
  }
  setEffect(input.value);
};

function initImageEditor() {
  if (isEditorInited) {
    return;
  }
  isEditorInited = true;

  // scale
  scaleValueElement.value = `${DEFAULT_SCALE_VALUE}%`;
  applyScale(DEFAULT_SCALE_VALUE);
  zoomOutButtonElement.addEventListener('click', onZoomOutButtonClick);
  zoomInButtonElement.addEventListener('click', onZoomInButtonClick);

  // slider
  noUiSlider.create(sliderElement, {
    range: Effects.none.range,
    start: Effects.none.start,
    step: Effects.none.step,
    connect: 'lower',
  });

  sliderContainer.classList.add('hidden');
  effectValueElement.value = String(Effects.none.start);

  sliderElement.noUiSlider.on('update', (values) => {
    const value = Number(values[0]);
    effectValueElement.value = String(value);

    const config = Effects[currentEffect];
    imageElement.style.filter = config.filter ? config.filter(value) : '';
  });

  // effects
  effectsListElement.addEventListener('change', onEffectsListChange);
}

function resetImageEditor() {
  scaleValueElement.value = `${DEFAULT_SCALE_VALUE}%`;
  applyScale(DEFAULT_SCALE_VALUE);

  const noneRadio = form.querySelector('#effect-none');
  if (noneRadio) {
    noneRadio.checked = true;
  }

  setEffect('none');
}

export { initImageEditor, resetImageEditor };
