import { getRandomInteger, getRandomArrayElement, createRandomIdFromRangeGenerator } from './util.js';

const messages = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
];

const userNames = [
  'Степан', 'Алёна', 'Григорий', 'Виктория', 'Фёдор', 'Лилия', 'Константин', 'Злата', 'Егор', 'София',
  'Даниил', 'Милана', 'Пётр', 'Арина', 'Леонид', 'Варвара', 'Ярослав', 'Мирослава', 'Олег', 'Валентина',
  'Арсений', 'Ева', 'Руслан', 'Кристина', 'Матвей'
];

const generatePhotoId = createRandomIdFromRangeGenerator(1, 25);
const generateCommentId = createRandomIdFromRangeGenerator(1, 1000);

const createComment = () => ({
  id: generateCommentId(),
  avatar: `img/avatar-${getRandomInteger(1, 6)}.svg`,
  message: getRandomArrayElement(messages),
  name: getRandomArrayElement(userNames),
});

const createPhoto = () => {
  const id = generatePhotoId();
  const comments = Array.from(
    { length: getRandomInteger(0, 30) },
    createComment
  );

  return {
    id,
    url: `photos/${id}.jpg`,
    description: `Описание фотографии №${id}`,
    likes: getRandomInteger(15, 200),
    comments,
  };
};

const generatePhotos = () => Array.from({ length: 25 }, createPhoto);

const renderThumbnails = (photos) => {
  const container = document.querySelector('.pictures');

  const template = document
    .querySelector('#picture')
    .content
    .querySelector('.picture');

  photos.forEach((photo) => {
    const element = template.cloneNode(true);
    element.querySelector('.picture__img').src = photo.url;
    element.querySelector('.picture__likes').textContent = photo.likes;
    element.querySelector('.picture__comments').textContent = photo.comments.length;
    element.dataset.photoId = photo.id;

    container.appendChild(element);
  });
};


export { generatePhotos, renderThumbnails };
