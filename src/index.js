import './css/styles.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { PixabayApi } from './fetchphoto';
import axios from 'axios';
import Notiflix from 'notiflix';

const searchFormEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

const pixabayApi = new PixabayApi();

const onSearchFormSubmit = event => {
  event.preventDefault();

  pixabayApi.page = 1;
  pixabayApi.searchQuery = event.target.elements.searchQuery.value;

  pixabayApi
    .fetchPhotos()
    .then(response => {
      //   console.log(response);
      const { data } = response;

      if (data.total === 0) {
        return Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }

      galleryEl.innerHTML = createGalleryCards(data.hits);

      loadMoreBtnEl.classList.remove('is-hidden');
    })
    .catch(err => {
      console.log(err);
    });
};

function createGalleryCards(galleryItems) {
  return galleryItems
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
        <a class="gallery__item" href="${largeImageURL}">
<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width='340px'/>
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>
</a>
        `;
      }
    )
    .join('');
}

// webformatURL - посилання на маленьке зображення для списку карток.
// largeImageURL - посилання на велике зображення.
// tags - рядок з описом зображення. Підійде для атрибуту alt.
// likes - кількість лайків.
// views - кількість переглядів.
// comments - кількість коментарів.
// downloads - кількість завантажень.

const onLoadMoreBtnClick = event => {
  pixabayApi.page += 1;

  pixabayApi
    .fetchPhotos()
    .then(response => {
      const { data } = response;

      galleryEl.insertAdjacentHTML('beforeend', createGalleryCards(data.hits));
      console.log(data.hits.length);
      console.log(pixabayApi.per_page);
      if (data.hits.length < 4) {
        loadMoreBtnEl.classList.add('is-hidden');
        return Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(err => {
      console.log(err);
    });
};

searchFormEl.addEventListener('submit', onSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);

var lightbox = new SimpleLightbox('.gallery a', { captionDelay: 250 });
