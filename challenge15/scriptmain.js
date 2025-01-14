let popular = [
  "popular\\ab67616100005174cb6926f44f620555ba444fca_0.jpeg",
  "popular\\ab676161000051745ba2d75eb08a2d672f9b69b7_1.jpeg",
  "popular\\ab67616100005174bd6fbc7d0973cc33940781ad_2.jpeg",
  "popular\\ab67616100005174b19af0ea736c6228d6eb539c_3.jpeg",
  "popular\\ab6761610000517490b6c3d093f9b02aad628eaf_4.jpeg",
  "popular\\ab67616100005174c40600e02356cc86f0debe84_5.jpeg"
];
let popular_album = [
  "popular_album\\ab67616d00001e02aad3f4b601ae8763b3fc4e88_0.jpeg",
  "popular_album\\ab67616d00001e026404721c1943d5069f0805f3_1.jpeg",
  "popular_album\\ab67616d00001e0272a77d038887cdc425f5ee55_5.jpeg",
  "popular_album\\ab67616d00001e0209c9bf421422262c368009d6_6.jpeg",
  "popular_album\\ab67616d00001e02bb25239324c4e16ae01fda36_4.jpeg",
  "popular_album\\ab67616d00001e027f35adfbec3bb2bc8256802b_3.jpeg"
];
let radio = [
  "radio\\en_17.jpeg",
  "radio\\en_18.jpeg",
  "radio\\en_19.jpeg",
  "radio\\en_20.jpeg",
  "radio\\en_21.jpeg",
  "radio\\en_22.jpeg"
];
let featured = [
  "featured\\region_global_default_23.jpeg",
  "featured\\region_us_default_24.jpeg",
  "featured\\region_global_default_25.jpeg",
  "featured\\region_us_default_26.jpeg",
  "featured\\region_global_default_27.jpeg",
  "featured\\region_us_default_28.jpeg"
];
let editorsArray = [
  "editors\\ab67706f00000002dce5bc8321d570243742d421_29.jpeg",
  "editors\\ab67706f0000000240b711f0986fdd846867c4ee_30.jpeg",
  "editors\\ab67706f000000027e52a6ae1c54283a6e45f04a_31.jpeg",
  "editors\\ab67706f0000000282f22593c527716398774f5a_32.jpeg",
  "editors\\ab67706f00000002be86b0e17ba01f2160355952_33.jpeg",
  "editors\\ab67706f0000000233022418e289f388708e2cca_34.jpeg"
];

let pop_art =['Anirudh Ravichander','Shankar-Ehsaan-Loy','Shreya Ghoshal','Arijit Singh','Jasleen Royal','Karan Aujla','Udit Narayan','Vishal-Shekhar','Darshan Raval','Anuv Jain','A.R. Rahman','Yo Yo Honey Singh','Sonu Nigam','Sachin-Jigar','Atif Aslam','Pritam','Sachet Tandon','Badshah','Vishal Mishra','Diljit Dosanjh']
let pop_alm_art = ['Patandar','Still Rollin','Ultimate Love Songs-Arijit Singh','Moosetape','Jab We Met','Rockstar','Animal','Aashiqui','Yeh Jawaani Hain Dewaani','Raanjhan','JIMIN Muse','Die With a Smile','Making Memories','Mismatched','Kabir Singh','Ghost']

let pop = document.querySelectorAll('.circleo');
let pop_alb = document.querySelectorAll('.squareo');
let pop_radio = document.querySelectorAll('.sqo');
let feature = document.querySelectorAll('.featureo');
let editor = document.querySelectorAll('.editorso');


for (let i = 0; i < 6; i++) {
  pop[i].innerHTML = `<img src="${popular[i]}" alt="Circle Image">`;
  pop_alb[i].innerHTML = `<img src="${popular_album[i]}" alt="Square Image">`;
  pop_radio[i].innerHTML = `<img src="${radio[i]}" alt="Sq Image">`;
  feature[i].innerHTML = `<img src="${featured[i]}" alt="Featured Image">`;
  editor[i].innerHTML = `<img src="${editorsArray[i]}" alt="Featured Image">`;
}



window.alwaysRun = function () {

 


  const hidden = document.querySelectorAll('.arto , .arkom');
  hidden.forEach(k => {
    if (!k.querySelector('.playbutton')) {  
      k.innerHTML += `
        <div class="playbutton">
          <img src="playbutton.svg" alt="">
        </div>
      `;

       
      const playButton = k.querySelector('.playbutton');

       
      playButton.style.visibility = 'hidden';
      playButton.style.opacity = '0';
      playButton.style.transition = 'visibility 0s, opacity 0.3s ease';

       
      k.addEventListener('mouseover', () => {
        playButton.style.visibility = 'visible';
        playButton.style.opacity = '1';
      });

      k.addEventListener('mouseout', () => {
        playButton.style.visibility = 'hidden';
        playButton.style.opacity = '0';
      });
    }
  });
};

 
document.addEventListener('DOMContentLoaded', () => {
  alwaysRun();
});

 
const observer = new MutationObserver(() => {
  alwaysRun();  
});

 
observer.observe(document.body, {
  childList: true,  
  subtree: true,   
});




let browser = document.querySelector('.browseicon')
browser.addEventListener('click', () => {
  window.location.href = 'index.html'
})


async function getSongs(folder) {
  let response = await fetch(`/${folder}/`);
  let text = await response.text();
  let div = document.createElement("div");
  div.innerHTML = text;

  let as = div.getElementsByTagName("a");
  let arra = [];

  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".jpeg")) {
      let songPath = element.href.split('/').splice(4).join('/');  
     
      arra.push(songPath);
    }
  }

  return arra;
}



let innerboxo = document.querySelector('.innerboxo');
let h2 = document.querySelectorAll('.flexer h2');
let a = document.querySelectorAll('.flexer p')

let poppy = [];  

 
async function preloadImages() {
  poppy = await getSongs('challenge15/popular');  
  poppy_alm = await getSongs('challenge15/popular_album');  
  radfa = await getSongs('challenge15/radio');  
  feature = await getSongs('challenge15/featured');  
  edita = await getSongs('challenge15/editors');  
  poppy.forEach((src) => {
    let img = new Image();  
    img.src = src;  
  });
  poppy.forEach((src) => {
    let img = new Image();  
    img.src = src;  
  });
  feature.forEach((src) => {
    let img = new Image();  
    img.src = src;  
  });
  radfa.forEach((src) => {
    let img = new Image();  
    img.src = src;  
  });
  edita.forEach((src) => {
    let img = new Image();  
    img.src = src;  
  });
}

 
preloadImages();

h2.forEach((e, index) => {
  e.addEventListener('click', () => {
    let cross = document.querySelectorAll('.closer')
cross.forEach((e) =>{
  e.addEventListener('click',() =>{
    window.location.href = 'index.html'
  })

})  
    if (index == 0) {
       
      innerboxo.innerHTML = `
            <div class="flexer">
              <h2>Popular Artists</h2>
              <img  class = 'closer' src = 'cross.svg' ></img>
            </div>
            <div class="artistso"></div>`;


       
      function bazka(link, nameo) {
        let html = `
                <div class="arto">
                  <span class="circleo">
                    <img src="${link}" alt="${nameo}">
                  </span>
                  <div class="white">
                    <h4>${nameo}</h4>
                  </div>
                  <div class="lightgreyo">
                    <p>Artist</p>
                  </div>
                </div>`;
        document.querySelector('.artistso').innerHTML += html;
      }

       
      for (let i = 0; i < poppy.length; i++) {
        bazka(poppy[i], `${pop_art[i]}`);
      }
      
    }

   else if (index == 1) {
       
      innerboxo.innerHTML = `
            <div class="flexer">
              <h2>Popular albums and singles</h2>
              <img  class = 'closer' src = 'cross.svg' ></img>

            </div>
            <div class="artistso"></div>`;


       
      function bazka(link, nameo) {
        let html = `
                <div class="arto">
                  <span class="squareo">
                    <img src="${link}" alt="${nameo}">
                  </span>
                  <div class="white">
                    <h4>${nameo}</h4>
                  </div>
                  <div class="lightgreyo">
                    <p>album</p>
                  </div>
                </div>`;
        document.querySelector('.artistso').innerHTML += html;
      }

       
      for (let i = 0; i < poppy_alm.length; i++) {
        bazka(poppy_alm[i], ` ${pop_alm_art[i]}`);
      }
      alwaysRun()
    }


    else if (index == 2) {
       
      innerboxo.innerHTML = `
            <div class="flexer">
              <h2>Popular radio</h2>
              <img  class = 'closer' src = 'cross.svg' ></img>

            </div>
            <div class="artistso"></div>`;


       
      function bazka(link) {
        let html = `
                <div class="arto">
                  <span class="sqo">
                    <img src="${link}" alt="${nameo}">
                  </span>
                  
                  <div class="lightgreyo">
                    <p>playlist</p>
                  </div>
                </div>`;
        document.querySelector('.artistso').innerHTML += html;
      }

       
      for (let i = 0; i < radfa.length; i++) {
        bazka(radfa[i], );
      }
      alwaysRun()
    }


    else if (index == 3) {
       
      innerboxo.innerHTML = `
            <div class="flexer">
              <h2>Featured Charts</h2>
              <img  class = 'closer' src = 'cross.svg' ></img>

            </div>
            <div class="artistso"></div>`;


       
      function bazka(link) {
        let html = `
                <div class="arto">
                  <span class="featureo">
                    <img src="${link}" ">
                  </span>
                 
                  <div class="lightgreyo">
                    <p>'Your weekly updates of your most loved tracks...'</p>
                  </div>
                </div>`;
        document.querySelector('.artistso').innerHTML += html;
      }

       
      for (let i = 0; i < feature.length; i++) {
        bazka(feature[i]);
      }
      alwaysRun()
    }

   else if ( index == 4) {
       
      innerboxo.innerHTML = `
            <div class="flexer">
              <h2>Playlists from our editors</h2>
              <img  class = 'closer' src = 'cross.svg' ></img>

            </div>
            <div class="artistso"></div>`;


       
      function bazka(link) {
        let html = `
                <div class="arto">
                  <span class="editorso">
                    <img src="${link}" ">
                  </span>
              
                  <div class="lightgreyo">
                    <p>'text'</p>
                  </div>
                </div>`;
        document.querySelector('.artistso').innerHTML += html;
      }

       
      for (let i = 0; i < edita.length; i++) {
        bazka(edita[i], );
      }
      alwaysRun()
    }
    else{console.log('thefuk')}
  });
});


document.body.addEventListener('click', (event) => {
  if (event.target.classList.contains('closer')) {
    window.location.href = 'indexmain.html';
  }
});

 
function bazka(container, link, nameo, text = 'Artist') {
  let html = `
    <div class="arto">
      <span class="circleo">
        <img src="${link}" alt="${nameo}">
      </span>
      <div class="white">
        <h4>${nameo}</h4>
      </div>
      <div class="lightgreyo">
        <p>${text}</p>
      </div>
    </div>`;
  container.innerHTML += html;
  alwaysRun()
}

 
a.forEach((e, index) => {
  e.addEventListener('click', () => {
    innerboxo.innerHTML = '';  
 

    if (index == 0) {
       
      innerboxo.innerHTML = `
            <div class="flexer">
              <h2>Popular Artists</h2>
              <img  class = 'closer' src = 'cross.svg' ></img>
            </div>
            <div class="artistso"></div>`;


       
      function bazka(link, nameo) {
        let html = `
                <div class="arto">
                  <span class="circleo">
                    <img src="${link}" alt="${nameo}">
                  </span>
                  <div class="white">
                    <h4>${nameo}</h4>
                  </div>
                  <div class="lightgreyo">
                    <p>Artist</p>
                  </div>
                </div>`;
        document.querySelector('.artistso').innerHTML += html;
      }

       
      for (let i = 0; i < poppy.length; i++) {
        bazka(poppy[i], `${pop_art[i]}`);
      }
    }

   else if (index == 1) {
       
      innerboxo.innerHTML = `
            <div class="flexer">
              <h2>Popular albums and singles</h2>
              <img  class = 'closer' src = 'cross.svg' ></img>

            </div>
            <div class="artistso"></div>`;


       
      function bazka(link, nameo) {
        let html = `
                <div class="arto">
                  <span class="squareo">
                    <img src="${link}" alt="${nameo}">
                  </span>
                  <div class="white">
                    <h4>${nameo}</h4>
                  </div>
                  <div class="lightgreyo">
                    <p>album</p>
                  </div>
                </div>`;
        document.querySelector('.artistso').innerHTML += html;
      }

       
      for (let i = 0; i < poppy_alm.length; i++) {
        bazka(poppy_alm[i], ` ${pop_alm_art[i]}`);
      }
      alwaysRun()
    }


    else if (index == 2) {
       
      innerboxo.innerHTML = `
            <div class="flexer">
              <h2>Popular radio</h2>
              <img  class = 'closer' src = 'cross.svg' ></img>

            </div>
            <div class="artistso"></div>`;


       
      function bazka(link, nameo) {
        let html = `
                <div class="arto">
                  <span class="sqo">
                    <img src="${link}" alt="${nameo}">
                  </span>
                 
                  <div class="lightgreyo">
                    <p>playlist</p>
                  </div>
                </div>`;
        document.querySelector('.artistso').innerHTML += html;
      }

       
      for (let i = 0; i < radfa.length; i++) {
        bazka(radfa[i]);
      }
      alwaysRun()
    }


    else if (index == 3) {
       
      innerboxo.innerHTML = `
            <div class="flexer">
              <h2>Featured Charts</h2>
              <img  class = 'closer' src = 'cross.svg' ></img>

            </div>
            <div class="artistso"></div>`;


       
      function bazka(link) {
        let html = `
                <div class="arto">
                  <span class="featureo">
                    <img src="${link}" ">
                  </span>
                  
                  <div class="lightgreyo">
                    <p>'Your weekly updates of your most loved tracks...'</p>
                  </div>
                </div>`;
        document.querySelector('.artistso').innerHTML += html;
      }

       
      for (let i = 0; i < feature.length; i++) {
        bazka(feature[i]);
      }
      alwaysRun()
    }

   else if (index == 4) {
       
      innerboxo.innerHTML = `
            <div class="flexer">
              <h2>Playlists from our editors</h2>
              <img  class = 'closer' src = 'cross.svg' ></img>

            </div>
            <div class="artistso"></div>`;


       
      function bazka(link) {
        let html = `
                <div class="arto">
                  <span class="editorso">
                    <img src='${link}' ">
                  </span>
                  
                  <div class="lightgreyo">
                    <p>'text'</p>
                  </div>
                </div>`;
        document.querySelector('.artistso').innerHTML += html;
      }

       
      for (let i = 0; i < edita.length; i++) {
        bazka(edita[i]);
      }
      alwaysRun()
    }
    else{console.log(' ')}
  });
});
