import { getRandomArrayElement, getRandomInteger } from './util.js';
import { DESCRIPTIONS, PHOTOS_COUNT, MIN_LIKES, MAX_LIKES } from './constants.js';
import { createComments } from './comments.js';

const createPhoto = (index) => ({
  id: index,
  url: `photos/${index}.jpg`,
  description: getRandomArrayElement(DESCRIPTIONS),
  likes: getRandomInteger(MIN_LIKES, MAX_LIKES),
  comments: createComments()
});

const generatePhotos = () => {
  const photosArr = [];
  for (let i = 1; i <= PHOTOS_COUNT; i++) {
    photosArr.push(createPhoto(i));
  }
  return photosArr;
};

export { generatePhotos };
