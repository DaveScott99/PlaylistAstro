const controls = document.querySelector("#controls");
const btnPlay = document.querySelector("#play-control");
let index = 0;
let currentMusic;
let isPlaying = false;



const getElement = (...queries) => document.querySelector(...queries);

const botaoAbrir = getElement('#abrir-modal')
const container = getElement('.modal-container')

const ativarModal = ''

botaoAbrir.onclick = function() {
  container.classList.toggle('mostrar')
}







// CONTROLE DE EVENTOS
controls.addEventListener("click", function (event) {
  const audios = [];
  let music = {};

  
  if (event.target.id != "controls") {
    const musics =
      event.path[2].childNodes[3].childNodes[1].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes


    musics.forEach(function (item) {
      if (item.nodeName != "#text") {
        music.name = item.childNodes[3].childNodes[0].data;
        music.artist = item.childNodes[5].childNodes[0].data;
        music.image = item.childNodes[1].childNodes[0].currentSrc;
        music.audio = item.childNodes[7].childNodes[1];
        audios.push(music);
        music = {};
      }
    });
  }




  // RENDERIZAR MÚSICAS
  function updateDataMusic() {
    currentMusic = audios[index];
    document.querySelector("#currentImg").src = currentMusic.image;
    document.querySelector("#currentName").innerText = currentMusic.name;
    document.querySelector("#currentArtist").innerText = currentMusic.artist;
    document.querySelector("#volume").value = currentMusic.audio.volume * 100;

    const progressBar = document.querySelector("#progressbar");
    const textCurrentDuration = document.querySelector("#current-duration");
    const textTotalDuration = document.querySelector("#total-duration");

    progressBar.max = currentMusic.audio.duration;
    textTotalDuration.innerText = secondsToMinutes(currentMusic.audio.duration);

    currentMusic.audio.ontimeupdate = function () {
      textCurrentDuration.innerText = secondsToMinutes(
        currentMusic.audio.currentTime
      );
      progressBar.valueAsNumber = currentMusic.audio.currentTime;
    };

  }



  // BOTÃO PLAY
  if (event.target.id == "play-control") {
    if (index === 0) {
      updateDataMusic();
    }
    if (!isPlaying) {
      btnPlay.classList.replace("bi-play-fill", "bi-pause-fill");
      currentMusic.audio.play();
      isPlaying = true;
    } else {
      btnPlay.classList.replace("bi-pause-fill", "bi-play-fill");
      currentMusic.audio.pause();
      isPlaying = false;
    }
    musicEnded();
  }


  


  // BOTÃO DE VOLUME
  if (event.target.id == "vol-icon") {
    currentMusic.audio.muted = !currentMusic.audio.muted;
    if (currentMusic.audio.muted) {
      event.target.classList.replace(
        "bi-volume-up-fill",
        "bi-volume-mute-fill"
      );
    } else {
      event.target.classList.replace(
        "bi-volume-mute-fill",
        "bi-volume-up-fill"
      );
    }
    musicEnded();
  }



  // REGULAR VOLUME
  if (event.target.id == "volume") {
    currentMusic.audio.volume = event.target.valueAsNumber / 100;
    musicEnded();
  }




  // BARRA DE TEMPO DA MÚSICA
  if (event.target.id == "progressbar") {
    currentMusic.audio.currentTime = event.target.valueAsNumber;
    musicEnded();
  }




  // BOTÃO DE PRÓXIMA MÚSICA
  if (event.target.id == "next-control") {
    index++;

    if (index == audios.length) {
      index = 0;
    }

    currentMusic.audio.pause();
    updateDataMusic(index);
    currentMusic.audio.play();
    btnPlay.classList.replace("bi-play-fill", "bi-pause-fill");
    musicEnded();
  }




  // BOTÃO DE MÚSICA ANTERIOR
  if (event.target.id == "prev-control") {
    index--;

    if (index === -1) {
      index = audios.length - 1;
    }

    currentMusic.audio.pause();
    updateDataMusic(index);
    currentMusic.audio.play();
    btnPlay.classList.replace("bi-play-fill", "bi-pause-fill");
    musicEnded();
  }





  // FUNÇÃO DE FIM DE MÚSICA
  function musicEnded() {
    currentMusic.audio.addEventListener("ended", function () {
      index++;

    if (index == audios.length) {
      index = 0;
    }

      currentMusic.audio.pause();
      updateDataMusic();
      currentMusic.audio.play();
      btnPlay.classList.replace("bi-play-fill", "bi-pause-fill");
    });
  }
});



// CALCULAR O TEMPO DA MÚSICA
function secondsToMinutes(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${("0" + minutes).slice(-2)}:${("0" + seconds).slice(-2)}`;
}
