const EFFECT_MAX = 100;
const EFFECT_STEP = 1;
const MAX_BLUR = 3;
const MAX_HEAT = 3;
const RADIX = 10;

const SLIDER_CONFIG = {
  MIN: 0,
  MAX: EFFECT_MAX,
  STEP: EFFECT_STEP,
};

const uploadForm = document.querySelector('.img-upload__form');
const effectsList = uploadForm.querySelector('.effects__list');
const preview = uploadForm.querySelector('.img-upload__preview img');
const effectLevelBlock = uploadForm.querySelector('.img-upload__effect-level');
const effectLevelInput = uploadForm.querySelector('.effect-level__value');
const sliderElement = uploadForm.querySelector('.effect-level__slider');

const baseClass = preview.classList[0];
let currentEffectClass = null;

noUiSlider.create(sliderElement, {
  range: {
    min: SLIDER_CONFIG.MIN,
    max: SLIDER_CONFIG.MAX,
  },
  start: SLIDER_CONFIG.MAX,
  step: SLIDER_CONFIG.STEP,
  connect: 'lower',
});

const hideSlider = () => {
  effectLevelBlock.classList.add('visually-hidden');
};

const showSlider = () => {
  effectLevelBlock.classList.remove('visually-hidden');
};

const EFFECTS_MAP = {
  'effects__preview--none': () => {
    hideSlider();
    return 'none';
  },
  'effects__preview--chrome': () => {
    showSlider();
    const value = parseInt(effectLevelInput.value, RADIX) / EFFECT_MAX;
    return `grayscale(${value})`;
  },
  'effects__preview--sepia': () => {
    showSlider();
    const value = parseInt(effectLevelInput.value, RADIX) / EFFECT_MAX;
    return `sepia(${value})`;
  },
  'effects__preview--marvin': () => {
    showSlider();
    const value = parseInt(effectLevelInput.value, RADIX);
    return `invert(${value}%)`;
  },
  'effects__preview--phobos': () => {
    showSlider();
    const value = parseInt(effectLevelInput.value, RADIX) * (MAX_BLUR / EFFECT_MAX);
    return `blur(${value}px)`;
  },
  'effects__preview--heat': () => {
    showSlider();
    const min = SLIDER_CONFIG.MAX / MAX_HEAT;
    const value = min + parseInt(effectLevelInput.value, RADIX) * ((MAX_HEAT - 1) / EFFECT_MAX);
    return `brightness(${value})`;
  },
};

const applyEffect = (effectClass) => {
  const effectFn = EFFECTS_MAP[effectClass];
  if (!effectFn) {
    preview.style.filter = 'none';
    return;
  }
  preview.style.filter = effectFn();
};

const setDefaultEffect = () => {
  hideSlider();
  preview.className = baseClass;
  preview.style.filter = 'none';
  sliderElement.noUiSlider.set(SLIDER_CONFIG.MAX);
  effectLevelInput.value = SLIDER_CONFIG.MAX;
};

const onEffectsClick = (evt) => {
  let target = evt.target;

  if (target.classList.contains('effects__label')) {
    target = target.querySelector('span');
  }

  if (!target || !target.classList.contains('effects__preview')) {
    return;
  }

  if (currentEffectClass) {
    preview.classList.remove(currentEffectClass);
  }

  currentEffectClass = target.classList[1];
  preview.classList.add(currentEffectClass);

  sliderElement.noUiSlider.set(SLIDER_CONFIG.MAX);
  effectLevelInput.value = SLIDER_CONFIG.MAX;

  applyEffect(currentEffectClass);
};

const onSliderUpdate = () => {
  effectLevelInput.value = Math.round(sliderElement.noUiSlider.get());
  if (currentEffectClass) {
    applyEffect(currentEffectClass);
  }
};

sliderElement.noUiSlider.on('update', onSliderUpdate);
effectsList.addEventListener('click', onEffectsClick);

export { setDefaultEffect };
