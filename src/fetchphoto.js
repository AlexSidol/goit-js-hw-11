'use strict';

import axios from 'axios';

export class PixabayApi {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '31500402-387db4a9fd94645d00cfea952';

  constructor() {
    this.page = null;
    this.searchQuery = null;
  }

  fetchPhotos() {
    const searchParams = {
      params: {
        key: this.#API_KEY,
        q: this.searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: this.page,
        per_page: '40',
      },
    };

    return axios.get(`${this.#BASE_URL}`, searchParams);
  }
}
// https://pixabay.com/api/?key=31500402-387db4a9fd94645d00cfea952&q=yellow+flowers&image_type=photo

// webformatURL - посилання на маленьке зображення для списку карток.
// largeImageURL - посилання на велике зображення.
// tags - рядок з описом зображення. Підійде для атрибуту alt.
// likes - кількість лайків.
// views - кількість переглядів.
// comments - кількість коментарів.
// downloads - кількість завантажень.
