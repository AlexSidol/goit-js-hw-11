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

let simpleLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

let totalPages = null;

const onSearchFormSubmit = async event => {
  event.preventDefault();

  pixabayApi.page = 1;
  pixabayApi.searchQuery = event.target.elements.searchQuery.value;

  // console.log(pixabayApi.searchQuery);

  if (pixabayApi.searchQuery.length !== 0) {
    try {
      const response = await pixabayApi.fetchPhotos();
      const { data } = response;

      if (data.total === 0) {
        return Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }

      galleryEl.innerHTML = createGalleryCards(data.hits);
      simpleLightbox.refresh();
      Notiflix.Notify.success(`Hooray! We found ${data.total} images.`);
      loadMoreBtnEl.classList.remove('is-hidden');

      totalPages = Math.ceil(data.total / data.hits.length);
      if (pixabayApi.page === totalPages) {
        loadMoreBtnEl.classList.add('is-hidden');
        return Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }
    } catch (err) {
      Notiflix.Notify.failure('Oops. An error has occurred!');
      console.log(err);
    }
  }
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
        
<div class="photo-card">
<a href="${largeImageURL}">
  <img class="photo" src="${webformatURL}" alt="${tags}" loading="lazy"/></a>
  <div class="info">
    <p class="info-item">
      <b>Likes:</b> ${likes}
    </p>
    <p class="info-item">
      <b>Views:</b> ${views}
    </p>
    <p class="info-item">
      <b>Comments:</b> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads:</b> ${downloads}
    </p>
  </div>
  
</div>

        `;
      }
    )
    .join('');
}

const onLoadMoreBtnClick = async event => {
  pixabayApi.page += 1;
  try {
    const response = await pixabayApi.fetchPhotos();
    const { data } = response;

    console.log(data);

    galleryEl.insertAdjacentHTML('beforeend', createGalleryCards(data.hits));
    simpleLightbox.refresh();

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
    const defaultAmount = data.totalHits / data.hits.length;

    if (Math.floor(defaultAmount) === pixabayApi.page) {
      loadMoreBtnEl.classList.add('is-hidden');

      return Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (err) {
    Notiflix.Notify.failure('Oops. An error has occurred!');
    console.log(err);
  }
};

searchFormEl.addEventListener('submit', onSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);
