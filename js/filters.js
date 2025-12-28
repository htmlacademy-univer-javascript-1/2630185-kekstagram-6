import { debounce, shuffleArray } from './util.js';
import { removePictures } from './thumbnails.js';

const COUNT_RANDOM_PHOTOS = 10;
const ACTIVE_CLASS = 'img-filters__button--active';

const imgFilters = document.querySelector('.img-filters');
const imgFiltersForm = imgFilters.querySelector('.img-filters__form');

let photosData = [];
let renderPhotos;

const normalizePhotos = (photos) => (Array.isArray(photos) ? photos : []);

const availableFilters = {
  'filter-default': (photos) => [...normalizePhotos(photos)],

  'filter-random': (photos) => {
    const list = normalizePhotos(photos);
    return shuffleArray([...list]).slice(0, COUNT_RANDOM_PHOTOS);
  },

  'filter-discussed': (photos) => {
    const list = normalizePhotos(photos);
    return [...list].sort(
      (first, second) => second.comments.length - first.comments.length
    );
  },
};

const isButton = (evt) => evt.target.tagName === 'BUTTON';

const onImgFiltersFormClick = debounce((evt) => {
  if (!isButton(evt) || typeof renderPhotos !== 'function') {
    return;
  }

  const filterFunction = availableFilters[evt.target.id];
  if (typeof filterFunction !== 'function') {
    return;
  }

  removePictures();
  const filteredPhotos = filterFunction(photosData);

  if (filteredPhotos.length) {
    renderPhotos(filteredPhotos);
  }
});

const onButtonClick = (evt) => {
  if (!isButton(evt)) {
    return;
  }

  const activeButton = imgFiltersForm.querySelector(`.${ACTIVE_CLASS}`);
  if (activeButton) {
    activeButton.classList.remove(ACTIVE_CLASS);
  }

  evt.target.classList.add(ACTIVE_CLASS);
};

const initFilters = (photos, renderFunction) => {
  if (Array.isArray(photos)) {
    photosData = [...photos];
  }

  if (typeof renderFunction === 'function') {
    renderPhotos = renderFunction;
  }

  imgFilters.classList.remove('img-filters--inactive');

  imgFiltersForm.addEventListener('click', (evt) => {
    onButtonClick(evt);
    onImgFiltersFormClick(evt);
  });

  const defaultButton = imgFiltersForm.querySelector('#filter-default');
  if (defaultButton) {
    defaultButton.classList.add(ACTIVE_CLASS);
  }
};

export { initFilters };
