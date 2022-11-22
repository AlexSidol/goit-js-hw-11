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

var lightbox = new SimpleLightbox('.gallery a');

let totalPages = null;

const onSearchFormSubmit = async event => {
  event.preventDefault();

  pixabayApi.page = 1;
  pixabayApi.searchQuery = event.target.elements.searchQuery.value;

  try {
    const response = await pixabayApi.fetchPhotos();
    const { data } = response;

    if (data.total === 0) {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    galleryEl.innerHTML = createGalleryCards(data.hits);
    Notiflix.Notify.success(`Hooray! We found ${data.total} images.`);
    loadMoreBtnEl.classList.remove('is-hidden');

    totalPages = Math.round(data.total / data.hits.length);
    if (pixabayApi.page === totalPages) {
      loadMoreBtnEl.classList.add('is-hidden');
      return Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (err) {
    console.log(err);
  }
};

// pixabayApi
//   .fetchPhotos()
//   .then(response => {
//     //   console.log(response);
//     const { data } = response;

//     if (data.total === 0) {
//       return Notiflix.Notify.failure(
//         'Sorry, there are no images matching your search query. Please try again.'
//       );
//     }

//     galleryEl.innerHTML = createGalleryCards(data.hits);
//     Notiflix.Notify.success(`Hooray! We found ${data.total} images.`);
//     loadMoreBtnEl.classList.remove('is-hidden');

//     totalPages = Math.round(data.total / data.hits.length);
//     if (pixabayApi.page === totalPages) {
//       loadMoreBtnEl.classList.add('is-hidden');
//       return Notiflix.Notify.failure(
//         "We're sorry, but you've reached the end of search results."
//       );
//     }
//   })
//   .catch(err => {
//     console.log(err);
//   });

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
  <img class="photo" src="${webformatURL}" alt="${tags}" loading="lazy" width='340px'/></a>
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

    galleryEl.insertAdjacentHTML('beforeend', createGalleryCards(data.hits));
    totalPages = Math.round(data.total / data.hits.length);

    if (pixabayApi.page === totalPages) {
      loadMoreBtnEl.classList.add('is-hidden');
      return Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (err) {
    console.log(err);
  }
};
// pixabayApi
//   .fetchPhotos()
//   .then(response => {
//     const { data } = response;

//     galleryEl.insertAdjacentHTML('beforeend', createGalleryCards(data.hits));
//     totalPages = Math.round(data.total / data.hits.length);

//     if (pixabayApi.page === totalPages) {
//       loadMoreBtnEl.classList.add('is-hidden');
//       return Notiflix.Notify.failure(
//         "We're sorry, but you've reached the end of search results."
//       );
//     }
//   })
//   .catch(err => {
//     console.log(err);
//   });

searchFormEl.addEventListener('submit', onSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);
