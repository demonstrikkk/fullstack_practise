let finaltime = ['1:50', '4:01', '2:11', '2:13', '2:16', '1:58', '1:24', '3:15', '1:55', '2:21', '5:37', '2:38', '3:31', '2:08', '1:36', '3:08'];
let finaltime2 = ['4:12','5:02','4:04','3:06','4:24','3:25']




const songboxImages = [
  "songboxmusic\\08-26-11-87_200x200_14.jpeg",
  "songboxmusic\\12-31-59-477_200x200_15.jpeg",
  "songboxmusic\\19-00-46-73_200x200_16.jpeg",
  "songboxmusic\\21-04-08-947_200x200_17.png",
  "songboxmusic\\22-20-51-951_200x200_13.jpeg",
  "songboxmusic\\00-45-40-450_200x200_7.jpeg",
  "songboxmusic\\01-12-14-352_200x200_8.png",
  "songboxmusic\\06-03-18-487_200x200_0.png",
  "songboxmusic\\07-16-52-755_200x200_11.jpeg",
  "songboxmusic\\10-06-34-296_200x200_9.jpeg",
  "songboxmusic\\10-46-15-772_200x200_5.png",
  "songboxmusic\\13-19-36-180_200x200_1.jpeg",
  "songboxmusic\\13-58-10-983_200x200_2.jpeg",
  "songboxmusic\\15-20-35-725_200x200_3.png",
  "songboxmusic\\15-24-57-666_200x200_12.png",
  "songboxmusic\\18-00-00-760_200x200_10.jpeg"
];


const watchmusic = [
  'watchimages\\badtameez.jpg',
  'watchimages\\ghungroo.jpg',
  'watchimages\\khoobsurat.jpg',
  'watchimages\\lover.jpg',
  'watchimages\\meredolna.jpg',
  'watchimages\\teeth.jpg'
]
















document.addEventListener('DOMContentLoaded', () => {



  const scrollButton = document.getElementById('scrollButton');
  const scrollContainer = document.getElementById('scrollContainer');
  const scrollButtonIcon = scrollButton.querySelector('img');
  function updateBigPhoto(artoElement) {
    const bigPhotoImage = document.querySelector('.bigphotoimage');
    const playlistImageSrc = artoElement.querySelector('img')?.src;
    const textuElement = document.querySelector('.textu');
    if (bigPhotoImage && playlistImageSrc) {
      bigPhotoImage.src = playlistImageSrc;
  
      if (textuElement) {
        textuElement.style.display = 'block';
        textuElement.style.opacity = '0';
        setTimeout(() => {
          textuElement.style.opacity = '1';
          textuElement.style.transition = 'opacity 0.5s ease';
        }, 100);
      }
    }
  }
  
  scrollButton.addEventListener('click', () => {
    if (scrollContainer.classList.contains('active')) {
       
      scrollContainer.classList.remove('active');
      scrollButton.classList.remove('active');
      scrollButtonIcon.src = 'scrollup.svg';  
    } else {
       
      scrollContainer.classList.add('active');
      scrollButton.classList.add('active');
      scrollButtonIcon.src = 'scrolldown.svg';  
    }
  });
  
  
  const normalSizeBreakpoint = window.matchMedia('(min-width: 1366px)');
  
   
  function resetEffects() {
    const element = document.querySelector('.sidebox');
    if (element) {
       
      element.style.left = '';
      element.style.transition = '';
      element.querySelector('.crossey').style.opacity = '0';
    }
  }
  
   
  const hamburger = document.querySelector('.hamburger');
  if (hamburger) {
     
    hamburger.addEventListener('click', () => {
      const element = document.querySelector('.sidebox');
      const crossey = document.querySelector('.crossey')
      crossey.style.opacity = '1'
      crossey.addEventListener('click', () => { element.style.left = '-100%' })
      if (element) {
        if (element.style.left === '0%') {
           
          element.style.left = '-100%';
        } else {
           
          element.style.left = '0%';
          element.style.transition = 'left 0.8s ease';
        }
      }
      alwaysRun()
    });
  }
  
   
  normalSizeBreakpoint.addEventListener('change', (event) => {
    if (event.matches) {
       
      resetEffects();
    }
  });
  
   
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1366) {
      resetEffects();
    }
  });
  const playButton = document.getElementById("play");
  const nextButton = document.getElementById("next");
  const previousButton = document.getElementById("previous");
  const volumeControl = document.querySelector(".range input");
  const seekBar = document.querySelector(".seekbar .smallbox");
  const songInfo = document.querySelector(".textwritten");
  const durationDisplay = document.querySelector(".durationmusic");
  const scrollbar = document.querySelector('.scrollbox');
  const likeButton = document.querySelector('.like');
  const mainBox = document.querySelector('.innerboxo');
  const libLogo = document.querySelector('.liblogo');


    document.getElementById('searchrel').addEventListener('input', function () {
    const searchQuery = this.value.trim().toLowerCase();  
    const artistBoxes = document.querySelectorAll('.arto ,.optionbox ,.arkom');  

     
    artistBoxes.forEach(box => {
      box.style.transform = '';  
      box.style.transition = 'transform 0.3s';  
    });

    if (searchQuery === '') {
      return;  
    }

     
    artistBoxes.forEach(box => {
      const artistName = box.querySelector('h4')?.textContent.toLowerCase();  
      const albumInfo = box.querySelector('p')?.textContent.toLowerCase();  
      const brow = box.querySelector('span').textContent.toLowerCase()
      if (artistName?.includes(searchQuery) || albumInfo?.includes(searchQuery) || brow?.includes(searchQuery)) {
         
        box.style.transform = 'scale(1.25)';
      }
    });
  });



  function updateBigPhoto(artoElement) {
    const bigPhotoImage = document.querySelector('.bigphotoimage');
    const playlistImageSrc = artoElement.querySelector('img')?.src;
    const textuElement = document.querySelector('.textu');
    if (bigPhotoImage && playlistImageSrc) {
      bigPhotoImage.src = playlistImageSrc;

      if (textuElement) {
        textuElement.style.display = 'block';  
        textuElement.style.opacity = '0';     
        setTimeout(() => {
          textuElement.style.opacity = '1';   
          textuElement.style.transition = 'opacity 0.5s ease';  
        }, 100);  
      }
    }
  }



  
  
  let currentSong = new Audio();
  let songs = [];
  let songs2 = [];
  let duratione = [];
  let duratione2 = [];
  
  let likedSongs = [];  
  let currentSongIndex = 0;  
  let currentSongs = [];  
  let isPlaying = false;  
  
   
  function loadSongs(songsList, images) {
    currentSongs = songsList;  
    console.log("Current Songs Loaded:", currentSongs);
    populateCards(currentSongs, images);  
    loadSong(currentSongIndex);  
  }
  
   
  document.body.addEventListener('click', (event) => {
    const artoOptionElement = event.target.closest('.arto, .optionbox');
    const arkomElement = event.target.closest('.arkom');
    
    if (artoOptionElement) {
      loadSongs(songs, songboxImages);  
      updateBigPhoto(artoOptionElement);
    }
    
    if (arkomElement) {
      loadSongs(songs2, watchmusic);  
      updateBigPhoto(arkomElement);
    }
  });
  
   
  function updatePlayButtonStates(index) {
     
    document.querySelectorAll('.card-play-button').forEach((btn, i) => {
      btn.src = i === index && isPlaying ? "pause.svg" : "playbutton.svg";  
    });
  
     
    playButton.src = isPlaying ? "pause.svg" : "playbutton.svg";  
  }


  
  document.querySelectorAll('.card-play-button').forEach((btn) => {
    btn.src = "playbutton.svg";
  });

   
  playButton.src = "playbutton.svg";

  function loadSong(index) {
    if (!currentSongs || currentSongs.length === 0 || !currentSongs[index]) {
      console.error("Song at index " + index + " does not exist.");
      return;
    }
    
    const song = currentSongs[index];
    currentSong.src = song.src;  
    songInfo.innerHTML = `<strong><b>${song.title}</b></strong> <br> <i>${song.artist}</i>`;
    let duration;
    if (currentSongs.length === 6) {
       
      duration = finaltime2[index];
    } else if (currentSongs.length >= 16)
       {
      
      duration = finaltime[index];
    } else {
       
      duration = "00:00";
    }
    durationDisplay.textContent = duration  
    currentSong.currentTime = 0;  
    currentSong.play().then(() => {
      isPlaying = true;
      updatePlayButtonStates(index);
      songInfo.innerHTML = `<strong><b>${song.title}</b></strong> <br> <i>${song.artist}</i>`;
      durationDisplay.textContent = duration;
    }).catch(error => {
      console.error("Error playing the song:", error);
    });

    currentSongIndex = index;
    
    likeButton.src = likedSongs1[index] ? "heart.red.svg" : "heart.svg";
     
    
     
     
     
     
     
    
  }
  

   
   
   
   
   

   
   
   
   
   

   
   
   
   
   




  
  function togglePlay() {
    if (isPlaying) {
      currentSong.pause();
      
      playButton.src = "playbutton.svg";
    } else {
      currentSong.play();
     
      playButton.src = "pause.svg";
    }
    isPlaying = !isPlaying;
    updatePlayButtonStates(currentSongIndex);
  }
  
  playButton.addEventListener('click', togglePlay);
  
   
  function playNext() {
    currentSongIndex = (currentSongIndex + 1) % currentSongs.length;  
    
    loadSong(currentSongIndex);
   
   
   
  }
  function playPrevious() {
    currentSongIndex = (currentSongIndex - 1 + currentSongs.length) % currentSongs.length;  
    loadSong(currentSongIndex);
   
   
   
  }
  
  let likedSongs1 = Array(songs.length).fill(0);  
  let likedSongs2 = Array(songs2.length).fill(0);  
  



  // function toggleLike() {
  //   if (currentSongs === songs) {
  //     // Toggle like status in the likedSongs1 array
  //     likedSongs1[currentSongIndex] = likedSongs1[currentSongIndex] ? 0 : 1;
      
  //     // Save the updated likedSongs1 array to localStorage
  //     localStorage.setItem("likedSongs1", JSON.stringify(likedSongs1));
      
  //     // Update the like button image based on the like status
  //     likeButton.src = likedSongs1[currentSongIndex] ? "heart.red.svg" : "heart.svg";
    
  //   } else if (currentSongs === songs2) {
  //     // Toggle like status in the likedSongs2 array
  //     likedSongs2[currentSongIndex] = likedSongs2[currentSongIndex] ? 0 : 1;
      
  //     // Save the updated likedSongs2 array to localStorage
  //     localStorage.setItem("likedSongs2", JSON.stringify(likedSongs2));
      
  //     // Update the like button image based on the like status
  //     likeButton.src = likedSongs2[currentSongIndex] ? "heart.red.svg" : "heart.svg";
  //   }
  // }
  





function toggleLike() {
    if (currentSongs === songs) {
        // Toggle like status in the likedSongs1 array
        likedSongs1[currentSongIndex] = likedSongs1[currentSongIndex] ? 0 : 1;

        // Save the updated likedSongs1 array to localStorage
        localStorage.setItem("likedSongs1", JSON.stringify(likedSongs1));

        // Update the like button image based on the like status
        likeButton.src = likedSongs1[currentSongIndex] ? "heart.red.svg" : "heart.svg";
    } else if (currentSongs === songs2) {
        // Toggle like status in the likedSongs2 array
        likedSongs2[currentSongIndex] = likedSongs2[currentSongIndex] ? 0 : 1;

        // Save the updated likedSongs2 array to localStorage
        localStorage.setItem("likedSongs2", JSON.stringify(likedSongs2));

        // Update the like button image based on the like status
        likeButton.src = likedSongs2[currentSongIndex] ? "heart.red.svg" : "heart.svg";
    }
}

// Load the like status from localStorage when the page is loaded
window.onload = function() {
    // Retrieve liked song statuses from localStorage (or initialize as empty arrays)
    likedSongs1 = JSON.parse(localStorage.getItem("likedSongs1")) || [];
    likedSongs2 = JSON.parse(localStorage.getItem("likedSongs2")) || [];

    // Check the current song's like status and set the button image accordingly
    if (currentSongs === songs) {
        likeButton.src = likedSongs1[currentSongIndex] ? "heart.red.svg" : "heart.svg";
    } else if (currentSongs === songs2) {
        likeButton.src = likedSongs2[currentSongIndex] ? "heart.red.svg" : "heart.svg";
    }
};

  // Load the like status from localStorage when the page is loaded
  window.onload = function() {
    likedSongs1 = JSON.parse(localStorage.getItem("likedSongs1")) || [];
    likedSongs2 = JSON.parse(localStorage.getItem("likedSongs2")) || [];
  
    // Check the current song's like status and set the button image accordingly
    if (currentSongs === songs) {
      likeButton.src = likedSongs1[currentSongIndex] ? "heart.red.svg" : "heart.svg";
    } else if (currentSongs === songs2) {
      likeButton.src = likedSongs2[currentSongIndex] ? "heart.red.svg" : "heart.svg";
    }
  };
  


  playButton.addEventListener('click', togglePlay);
  nextButton.addEventListener('click', playNext);
  previousButton.addEventListener('click', playPrevious);


   
  
   
   
  
   
  function updateTotalDuration() {
    const totalDuration = currentSongs.reduce((total, song, index) => {
      let duration;
      if (currentSongs.length === 6) {
         
        duration = finaltime2[index];
      } else if (currentSongs.length >= 16)
         {
        
        duration = finaltime[index];
      } else {
         
        duration = "00:00";
      }
      const [minutes, seconds] = duration.split(':').map(Number);
      return total + (minutes * 60 + seconds);
    }, 0);
    
    const totalMinutes = Math.floor(totalDuration / 60);
    const totalSeconds = totalDuration % 60;
    durationDisplay.textContent = `${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;
  }
  
   
   
   
   
   
   
   
   
   
   
  
   
  
  
  
  function attachCardListeners() {
    document.querySelectorAll('.card-play-button').forEach((button, index) => {
      button.addEventListener('click', () => {
        if (currentSongIndex !== index) {
          loadSong(index);
        } else {
          togglePlay();
        }
      });
    });
  }
  
  function populateCards(songList, images) {
    scrollbar.innerHTML = '';  

    songList.forEach((song, index) => {

      let duration;
      if (currentSongs.length === 6) {
         
        duration = finaltime2[index];
      } else if (currentSongs.length >= 16)
         {
        
        duration = finaltime[index];
      } else {
         
        duration = "00:00";
      }

      const card = createCard(
        images[index],  
        song.title,     
        song.artist, 
        duration,
        index
      );
      scrollbar.innerHTML += card;
    });
    attachCardListeners()
  }

   
  function createCard(image, MusicName, MusicWriter, Duration, link, index) {
    return `
      <div class="musicbox" data-title="${MusicName}">
        <div class="imager ${index}">
          <img src="${image}" alt="Album Art">
        </div>
        <div class="textr">
          <h4>${MusicName}</h4>
          <p>${MusicWriter}</p>
        </div>
        <div class="duration">${Duration}</div>
        <input type="checkbox" class="playlistted">
        <div class="graper">
          <img class="card-play-button" src="playbutton.svg" alt="Play Button">
          <audio class="audioPlayer" src="${link}"></audio>
        </div>
      </div>`;
  }




   
  async function populateDurations() {
    let promises = songs.map((song, index) => {
      return new Promise((resolve) => {
        const audio = new Audio(song.src);
        audio.addEventListener('loadedmetadata', () => {
          const totalDuration = audio.duration;
          const minutes = Math.floor(totalDuration / 60);
          const seconds = Math.floor(totalDuration % 60).toString().padStart(2, "0");
          duratione[index] = `${minutes}:${seconds}`;
          resolve();
        });
      });
    });
  
    let promises2 = songs2.map((songa, index) => {
      return new Promise((resolve) => {
        const audio = new Audio(songa.src);
        audio.addEventListener('loadedmetadata', () => {
          const totalDuration = audio.duration;
          const minutes = Math.floor(totalDuration / 60);
          const seconds = Math.floor(totalDuration % 60).toString().padStart(2, "0");
          duratione2[index] = `${minutes}:${seconds}`;
          resolve();
        });
      });
    });
  
    await Promise.all([...promises, ...promises2]);
  }


 
 
  
    function updateSeekBar() {
      setInterval(() => {
        if (currentSong.duration) {
          const progress = (currentSong.currentTime / currentSong.duration) * 100;
          seekBar.style.width = `${progress}%`;
  
          const currentMinutes = Math.floor(currentSong.currentTime / 60);
          const currentSeconds = Math.floor(currentSong.currentTime % 60).toString().padStart(2, "0");
          durationDisplay.textContent = `${currentMinutes}:${currentSeconds} /${currentSongs.length === 6 ? duratione2[currentSongIndex] : duratione[currentSongIndex]}`;  
        }
      }, 500);
    }
    
  
  

  function seek(event) {
    const seekWidth = seekBar.parentElement.offsetWidth;
    const offsetX = event.offsetX;
    const seekTime = (offsetX / seekWidth) * currentSong.duration;
    currentSong.currentTime = seekTime;
  }
  
  
  async function main() {
    await getSongs("challenge15/songsonge", "challenge15/listensongs");
    await populateDurations();  
    loadSong(currentSongIndex);
    updateTotalDuration();
    updatePlayButtonStates(currentSongIndex)
        likeButton.addEventListener("click", toggleLike);






let k = document.querySelector('#play')
k.addEventListener('click',()=>{
  if (currentSong.paused) {
    k.src = 'playbutton.svg'
    currentSong.play();
  } else {
    k.src = 'pause.svg'
    currentSong.pause();
  }
})


     
    seekBar.parentElement.addEventListener('click', seek);

     
    volumeControl.addEventListener('input', () => {
      currentSong.volume = volumeControl.value / 100;
    });

     
    currentSong.addEventListener('ended', playNext);

    updateSeekBar();





  }
  
   
  async function getSongs(folder, folder2) {
    let response = await fetch(`/${folder}/`);
    let response2 = await fetch(`/${folder2}/`);
    let text = await response.text();
    let text2 = await response2.text();
    let div = document.createElement("div");
    let diva = document.createElement("div");
    div.innerHTML = text;
    diva.innerHTML = text2;
  
    let as = div.getElementsByTagName("a");
    let as2 = diva.getElementsByTagName("a");
    songs = [];
    songs2 = [];
    duratione = [];
    duratione2 = [];
  
    for (let index = 0; index < as.length; index++) {
      const element = as[index];
      if (element.href.endsWith(".mp3")) {
        let songPath = element.href;
        songs.push({
          title: songPath.split("/").pop().split("-").slice(0, 2).join("-"),
          artist: "yash",
          src: songPath,
        });
      }
    }
  
    for (let index = 0; index < as2.length; index++) {
      const element = as2[index];
      if (element.href.endsWith(".mp3")) {
        let songPath = element.href;
        songs2.push({
          title: songPath.split('listensongs/')[1].split('.mp3')[0].split('%20').map((word, index) => index === 1 ? word.replace(/\d+$/, '') : word).slice(0, 2).join('-'),
          artist: "yash",
          src: songPath,
        });
      }
    }
  
    console.log("songs:", songs);
    console.log("songs2:", songs2);
  }
  
   
  main();




let reignite = document.querySelector('.reignite');
  let likeplay = document.querySelector('.likeplay');
likeplay.style.display = 'none';
likeplay.innerHTML = ``
likeplay.innerHTML += `
  <div class="flexer">
    <h2>Your playlists</h2>
    <img class='closer' src='cross.svg'></img>
  </div>
  <div class="artistso"></div>
`;

let html = `
  <div class="arti">
    <span class="featureo">
      <img src="liked.jpg">
    </span>
    <div class="lightgreyo">
      <p>'Your all liked songs in one playlist'</p>
    </div>
  </div>
`;
likeplay.innerHTML += html;






let liblogo = document.querySelector('.liblogo');
liblogo.addEventListener('click', () => {
  likeplay.style.display = 'block';
reignite.style.display = 'none';
document.querySelector('.playbar').style.display = 'none';


});

let arti = likeplay.querySelector('.arti');
arti.addEventListener('click', () => {
  scrollbar.innerHTML = '';


  let currentSongIndex = -1;  

  function createCard(image, MusicName, MusicWriter, Duration, link, index) {
    const musicbox = `
      <div class="musicbox" data-title="${MusicName}" data-index="${index}">
        <div class="imager ${index}">
          <img src="${image}" alt="Album Art">
        </div>
        <div class="textr">
          <h4>${MusicName}</h4>
          <p>${MusicWriter}</p>
        </div>
        <div class="duration">${Duration}</div>
        <div class="controls">
          <img width="20" class="inverter previouse" src="previous.svg" alt="">
          <img width="20" class="inverter playe" src="playbutton.svg" alt="">
          <img width="20" class="inverter nexte" src="next.svg" alt="">
          <audio class="audioPlayer" src="${link}"></audio>
        </div>
      </div>`;
    scrollbar.innerHTML += musicbox;
  }

  function playSong(index) {
    const allAudioPlayers = document.querySelectorAll('.audioPlayer');
    const allPlayButtons = document.querySelectorAll('.playe');

    if (currentSongIndex !== index) {
       
      allAudioPlayers.forEach(audio => audio.pause());
      allPlayButtons.forEach(button => button.src = 'playbutton.svg');
    }

    const audioPlayer = allAudioPlayers[index];
    const playButton = allPlayButtons[index];

    if (audioPlayer.paused) {
      audioPlayer.play();
      playButton.src = 'pause.svg';
      currentSongIndex = index;
      syncPlaybar(audioPlayer);
    } else {
      audioPlayer.pause();
      playButton.src = 'playbutton.svg';
      currentSongIndex = -1;
    }
  }

  function nextSong() {
    if (currentSongIndex < likedSongs.length) {
      playSong((currentSongIndex + 1 ));
    }
  }

  function previousSong() {
    if (currentSongIndex > 0) {
      playSong((currentSongIndex - 1));
    }
  }



   
   
   
  



  function syncPlaybar(audioPlayer) {
    const playbar = document.querySelector('.playbar');
    const progress = playbar.querySelector('.progress');

    if (audioPlayer) {
      audioPlayer.addEventListener('timeupdate', () => {
        const progressPercentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
       
      });
    }
  }

   

  likedSongs1.forEach((liked, index) => {
    if (liked === 1) {
      createCard(songboxImages[index], songs[index].title, songs[index].artist, duratione[index], songs[index].src, index);
    }
  });
  likedSongs2.forEach((liked, index) => {
    if (liked === 1) {
      createCard(watchmusic[index], songs2[index].title, songs2[index].artist, duratione2[index], songs2[index].src, index);
    }
  });
  




   
  document.querySelectorAll('.playe').forEach((playButton, index) => {
    playButton.addEventListener('click', () => playSong(index));
  });

  document.querySelectorAll('.nexte').forEach(nextButton => {
    nextButton.addEventListener('click', nextSong);
  });

  document.querySelectorAll('.previouse').forEach(prevButton => {
    prevButton.addEventListener('click', previousSong);
  });
});





let duration;
if (currentSongs.length === 6) {
   
  duration = finaltime2[index];
} else if (currentSongs.length >= 16) {
   
  duration = finaltime[index];
} else {
   
  duration = "00:00";
} 
});













