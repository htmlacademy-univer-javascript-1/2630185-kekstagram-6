const randomInt = (min, max) => {
  const start = Math.ceil(Math.min(min, max));
  const end = Math.floor(Math.max(min, max));
  return Math.floor(Math.random() * (end - start + 1) + start);
};

const pickRandom = (arr) => arr[randomInt(0, arr.length - 1)];

function uniqueIdGenerator(min, max) {
  const used = new Set();

  return () => {
    if (used.size >= (max - min + 1)) {
      return null;
    }

    let value;
    do {
      value = randomInt(min, max);
    } while (used.has(value));

    used.add(value);
    return value;
  };
}

const randomCommentId = uniqueIdGenerator(1, 1000);

const commentTexts = [
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


const makeComment = () => ({
  id: randomCommentId(),
  avatar: `img/avatar-${randomInt(1, 6)}.svg`,
  message: pickRandom(commentTexts),
  name: pickRandom(userNames),
});

const photoIdGen = uniqueIdGenerator(1, 25);

const makePhotoData = () => {
  const id = photoIdGen();
  const comments = Array.from({ length: randomInt(0, 30) }, makeComment);

  return {
    id,
    url: `photos/${id}.jpg`,
    description: `Описание фотографии №${id}`,
    likes: randomInt(15, 200),
    comments,
  };
};

Array.from({ length: 25 }, makePhotoData);
