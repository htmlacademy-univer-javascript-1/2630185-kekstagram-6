const MIN_SCALE = 25;
const MAX_SCALE = 100;
const STEP_SCALE = 25;

const form = document.querySelector('.img-upload__form');

const zoomOutBtnElement = form.querySelector('.scale__control--smaller');
const zoomInBtnElement = form.querySelector('.scale__control--bigger');
const scaleValueElement = form.querySelector('.scale__control--value');

const imageElement = form.querySelector('.img-upload__preview img');

const effectsListElement = form.querySelector('.effects__list');
const sliderContainer = form.querySelector('.img-upload__effect-level');
const sliderElement = form.querySelector('.effect-level__slider');
const effectValueElement = form.querySelector('.effect-level__value');

const Effects = {
  none: {
    range: { min: 0, max: 1 },
    start: 1,
    step: 0.1,
  },
  chrome: {
    range: { min: 0, max: 1 },
    start: 1,
    step: 0.1,
  },
  sepia: {
    range: { min: 0, max: 1 },
    start: 1,
    step: 0.1,
  },
  marvin: {
    range: { min: 0, max: 100 },
    start: 100,
    step: 1,
  },
  phobos: {
    range: { min: 0, max: 3 },
    start: 3,
    step: 0.1,
  },
  heat: {
    range: { min: 1, max: 3 },
    start: 3,
    step: 0.1,
  },
};

let currentEffect = 'none';

function applyScale(value) {
  const scale = value / 100;
  imageElement.style.transform = `scale(${scale})`;
}

function onZoomOut() {
  let value = parseInt(scaleValueElement.value, 10);
  if (value > MIN_SCALE) {
    value -= STEP_SCALE;
    scaleValueElement.value = `${value}%`;
    applyScale(value);
  }
}

function onZoomIn() {
  let value = parseInt(scaleValueElement.value, 10);
  if (value < MAX_SCALE) {
    value += STEP_SCALE;
    scaleValueElement.value = `${value}%`;
    applyScale(value);
  }
}

function initScale() {
  scaleValueElement.value = '100%';
  applyScale(100);
  zoomOutBtnElement.addEventListener('click', onZoomOut);
  zoomInBtnElement.addEventListener('click', onZoomIn);
}

function getFilterValue(effect, sliderValue) {
  switch (effect) {
    case 'chrome': return `grayscale(${sliderValue})`;
    case 'sepia': return `sepia(${sliderValue})`;
    case 'marvin': return `invert(${sliderValue}%)`;
    case 'phobos': return `blur(${sliderValue}px)`;
    case 'heat': return `brightness(${sliderValue})`;
    default: return '';
  }
}

function applyEffect(effectName) {
  currentEffect = effectName;
  const config = Effects[effectName];

  if (effectName === 'none') {
    sliderContainer.classList.add('hidden');
    imageElement.style.filter = '';
    effectValueElement.value = Effects.none.start;

    sliderElement.noUiSlider.updateOptions({
      range: Effects.none.range,
      start: Effects.none.start,
      step: Effects.none.step,
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

  effectValueElement.value = config.start;
  imageElement.style.filter = getFilterValue(effectName, config.start);
}

function onEffectChange(evt) {
  const input = evt.target.closest('input[type="radio"]');
  if (!input) { return; }
  applyEffect(input.value);
}

function initEffects() {
  noUiSlider.create(sliderElement, {
    range: Effects.none.range,
    start: Effects.none.start,
    step: Effects.none.step,
    connect: 'lower'
  });

  effectValueElement.value = Effects.none.start;
  sliderContainer.classList.add('hidden');

  sliderElement.noUiSlider.on('update', (_, __, value) => {
    effectValueElement.value = value;
    imageElement.style.filter = getFilterValue(currentEffect, value);
  });

  effectsListElement.addEventListener('change', onEffectChange);
}

function initImageEditor() {
  initScale();
  initEffects();

  const overlay = form.querySelector('.img-upload__overlay');
  const uploadInput = form.querySelector('#upload-file');
  const cancelButton = form.querySelector('#upload-cancel');

  uploadInput.addEventListener('change', () => {
    overlay.classList.remove('hidden');
    resetImageEditor();
  });

  cancelButton.addEventListener('click', () => {
    overlay.classList.add('hidden');
    resetImageEditor();
  });
}

function resetImageEditor() {
  scaleValueElement.value = '100%';
  applyScale(100);

  const noneRadio = form.querySelector('#effect-none');
  if (noneRadio) {noneRadio.checked = true;}

  currentEffect = 'none';
  imageElement.style.filter = '';
  sliderContainer.classList.add('hidden');

  sliderElement.noUiSlider.updateOptions({
    range: Effects.none.range,
    start: Effects.none.start,
    step: Effects.none.step
  });

  sliderElement.noUiSlider.set(Effects.none.start);
  effectValueElement.value = Effects.none.start;
}

export { initImageEditor };
