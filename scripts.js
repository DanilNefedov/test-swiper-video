function stateVideo () {
  return  ["824804225", "824804225", "824804225", "824804225", "824804225", "824804225", "824804225", "824804225"];
  //["824804225", "903456026", "910459793", "910151320", "909556066", "902571486", "861736545", "896261088"];
}


function videoPlayer() {
  let currentPlayer = null;
  const playerElement = document.getElementById('player');

  const createPlayer = (videoId) => {
    const options = {
      id: videoId,
      responsive: true,
      autoplay: true
    };

    currentPlayer = new Vimeo.Player(playerElement, options);
  };

  const updatePlayer = (videoId) => {
    if (currentPlayer) {
      currentPlayer.loadVideo(videoId);
    } else {
      createPlayer(videoId);
    }
  };

  const destroyPlayer = () => {
    if (currentPlayer) {
      currentPlayer.destroy();
      currentPlayer = null;
    }
  };

  return {
    createPlayer,
    updatePlayer,
    destroyPlayer,
  };
}



function mainSwiper() {
  const swiper = new Swiper(".mySwiper", {
    slidesPerView: 4,
    spaceBetween: 0,
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,

    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  
}

mainSwiper()



async function createVimeoPlayer() {
  const slides = document.getElementsByClassName('swiper-slide');
  const videoArr = stateVideo()

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const videoId = videoArr[i];
    const indexPagination = i;
    const thumbnailContainer = slide.querySelector('.video-thumbnail');
    
    if (thumbnailContainer) {
      try {
        const thumbnailUrl = await getVimeoThumbnailUrl(videoId);
        thumbnailContainer.style.backgroundImage = `url(${thumbnailUrl})`;
        thumbnailContainer.addEventListener('click', function () {
          openVideoWindow(videoId, indexPagination);
        });
      } catch (error) {
        console.error('Error fetching Vimeo thumbnail:', error);
      }
    }
  }
}

createVimeoPlayer();



async function getVimeoThumbnailUrl(videoId) {
  const apiUrl = `https://vimeo.com/api/v2/video/${videoId}.json`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const thumbnailUrl = data[0].thumbnail_large;
    return thumbnailUrl;
  } catch (error) {
    throw error;
  }
}



function openVideoWindow(videoId, indexPagination) {
  const video = videoPlayer()
  const videoArr = stateVideo();
  const modal = document.getElementById('modal');
  const pagination = document.getElementById('pagination');
  const modalWindowAfter = document.querySelector('#close');

  modal.style.display = 'block';
  pagination.style.display = 'block';

  for(let i = 0; i < pagination.children.length; i++){
    pagination.children[i].classList.remove('swiper-pagination-bullet-active')
  }
  
  pagination.children[indexPagination].classList.add('swiper-pagination-bullet-active');

  video.createPlayer(videoId)

  pagination.addEventListener('click', function (event) {
    if (event.target.classList.contains('swiper-pagination-bullet')) {
      const index = Array.from(pagination.children).indexOf(event.target);
      const clickedVideoId = videoArr[index];

      video.updatePlayer(clickedVideoId);
    }
  });

  modalWindowAfter.addEventListener('click', function () {
    modal.style.display = 'none';
    if (video) {
      video.destroyPlayer();
    }
  });
}
