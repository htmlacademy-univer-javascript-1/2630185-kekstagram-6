const Urls = {
  GET: 'https://29.javascript.htmlacademy.pro/kekstagram/data',
  POST: 'https://29.javascript.htmlacademy.pro/kekstagram',
};

const getDataFromServer = () =>
  fetch(Urls.GET)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибка загрузки данных');
      }
      return response.json();
    });

const sendDataToServer = (body) =>
  fetch(Urls.POST, {
    method: 'POST',
    body,
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Ошибка отправки формы');
    }
  });

export { getDataFromServer, sendDataToServer };
