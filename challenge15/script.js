window.alwaysRun = function () {
    const hidden = document.querySelectorAll('.arto');
    hidden.forEach(k => {
      if (!k.querySelector('.playbutton')) { // Prevent duplicate play buttons
        k.innerHTML += `
          <div class="playbutton">
            <img src="playbutton.svg" alt="">
          </div>
        `;
  
        // Select the playbutton element that was added dynamically
        const playButton = k.querySelector('.playbutton');
  
        // Initially hide the playbutton
        playButton.style.visibility = 'hidden';
        playButton.style.opacity = '0';
        playButton.style.transition = 'visibility 0s, opacity 0.3s ease';
  
        // Add hover effect to parent
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
  
  // Ensure alwaysRun runs when the DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    alwaysRun();
    let cross = document.querySelectorAll('.closer')
cross.forEach((e) =>{
  e.addEventListener('click',() =>{
    window.location.href = 'index.html'
  })
  });
})
  
  // Use MutationObserver to monitor DOM changes
  const observer = new MutationObserver(() => {
    alwaysRun(); // Run the function whenever the DOM changes
  });
  
  // Observe the target node for changes
  observer.observe(document.body, {
    childList: true, // Watch for added/removed nodes
    subtree: true,  // Watch the entire subtree
  });
  



const colors = [
    "AliceBlue", "AntiqueWhite", "Aqua", "Aquamarine", "Azure", "Beige", "Bisque", "Black", "BlanchedAlmond", 
    "Blue", "BlueViolet", "Brown", "BurlyWood", "CadetBlue", "Chartreuse", "Chocolate", "Coral", "CornflowerBlue", 
    "Cornsilk", "Crimson", "Cyan", "DarkBlue", "DarkCyan", "DarkGoldenRod", "DarkGray", "DarkGreen", "DarkKhaki", 
    "DarkMagenta", "DarkOliveGreen", "DarkOrange", "DarkOrchid", "DarkRed", "DarkSalmon", "DarkSeaGreen", 
    "DarkSlateBlue", "DarkSlateGray", "DarkTurquoise", "DarkViolet", "DeepPink", "DeepSkyBlue", "DimGray", 
    "DodgerBlue", "FireBrick", "FloralWhite", "ForestGreen", "Fuchsia", "Gainsboro", "GhostWhite", "Gold", 
    "GoldenRod", "Gray", "Green", "GreenYellow", "HoneyDew", "HotPink", "IndianRed", "Indigo", "Ivory", 
    "Khaki", "Lavender", "LavenderBlush", "LawnGreen", "LemonChiffon", "LightBlue", "LightCoral", 
    "LightCyan", "LightGoldenRodYellow", "LightGray", "LightGreen", "LightPink", "LightSalmon", 
    "LightSeaGreen", "LightSkyBlue", "LightSlateGray", "LightSteelBlue", "LightYellow", "Lime", 
    "LimeGreen", "Linen", "Magenta", "Maroon", "MediumAquaMarine", "MediumBlue", "MediumOrchid", 
    "MediumPurple", "MediumSeaGreen", "MediumSlateBlue", "MediumSpringGreen", "MediumTurquoise", 
    "MediumVioletRed", "MidnightBlue", "MintCream", "MistyRose", "Moccasin", "NavajoWhite", "Navy", 
    "OldLace", "Olive", "OliveDrab", "Orange", "OrangeRed", "Orchid", "PaleGoldenRod", "PaleGreen"
];
let images = [
    "images_spotify\\ab67fb8200005caf474a477debc822a3a45c5acb.jpg",
    "images_spotify\\ab6765630000ba8a81f07e1ead0317ee3c285bfa.jpg",
    "images_spotify\\live-events_category-image.jpg",
    "images_spotify\\ab67fb8200005caf3a376f97c4510dd35ef8118b.jpg",
    "images_spotify\\ab67fb8200005caf90d9ad8b29f59a37da33aeea.jpg",
    "images_spotify\\ab67fb8200005caf194fec0fdc197fb9e4fe8e64.jpg",
    "images_spotify\\ab67fb8200005caff5976b97bcf10d98acbae2cd.jpg",
    "images_spotify\\ab67fb8200005caf4f1aa71a9cdcffdf8430c070.jpg",
    "images_spotify\\ab67fb8200005cafae68f35dc5d86af7a1c1b58f.jpg",
    "images_spotify\\ab67fb8200005caf80699a8b7d59a21b38f964bd.jpg",
    "images_spotify\\7262179db37c498480ef06bfacb60310.jpeg",
    "images_spotify\\9af79fd06e34dea3cd27c4e1cd6ec7343ce20af4.jpg",
    "images_spotify\\e227cd9674618024276c65f1213fb05af34cf512.jpg",
    "images_spotify\\region_global_default.jpg",
    "images_spotify\\ab67fb8200005caf77a5fdbc439492d09d3d84fb.jpg",
    "images_spotify\\ab67fb8200005cafe362fbcb5932b28679cf00f8.jpg",
    "images_spotify\\ab67fb8200008e2c64adf130003faa51378e3d2b.jpg",
    "images_spotify\\ab67fb8200005caf097a46192e6bb67e52cdff60.jpg",
    "images_spotify\\d0fb2ab104dc4846bdc56d72b0b0d785.jpeg",
    "images_spotify\\ab67fb8200005caf666a4ae3e6161da7a120ca14.jpg",
    "images_spotify\\ab67fb8200005caf66d545e6a69d0bfe8bd1e825.jpg",
    "images_spotify\\ab67fb8200005cafa1a252e3a815b65778d8c2aa.jpg",
    "images_spotify\\ab67fb8200005caf21c9a95a2702ce535fb07915.jpg",
    "images_spotify\\ab67fb8200005caf8e97784ff1e12e67ae922715.jpg",
    "images_spotify\\ab67fb8200005cafe542e9b59b1d2ae04b46b91c.jpg",
    "images_spotify\\ab67fb8200005caf0b0d0bfac454671832311615.jpg",
    "images_spotify\\ab67fb8200005cafb7e805033eb938aa75d09336.jpg",
    "images_spotify\\ab67fb8200005caf5f3752b3234e724f9cd6056f.jpg",
    "images_spotify\\ab67fb8200005caf26ada793217994216c79dad8.jpg",
    "images_spotify\\ab67fb8200005cafdad1281e13697e8d8cf8f347.jpg",
    "images_spotify\\ab67fb8200005caf330ca3a3bfaf8b18407fb33e.jpg",
    "images_spotify\\ab67fb8200005caf26dd3719e8824756914ae61f.jpg",
    "images_spotify\\ab67fb8200005caf4b42030ee01cf793663dbb73.jpg",
    "images_spotify\\ab67fb8200005caf6af6d83c78493644c9b0627b.jpg",
    "images_spotify\\ab67fb8200005caf5b340bd0664da28003741733.jpg",
    "images_spotify\\ab67fb8200005caf2354ff5d02a9a0935beb94af.jpg"
  ]


  

function changeColors() {
    document.querySelectorAll(".optionbox").forEach(e => {
        i = 0
        e.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        i++
        // e.style.backgroundColor = randomColor;
    });

}
changeColors()
let div = document.querySelectorAll('.optionbox')
for (const i in images) {
  div[i].innerHTML += `<img class = 'photos' src = '${images[i]}' width = 100px ></img>`
        
    
}
   
let browser = document.querySelector('.home')
browser.addEventListener('click' , () =>{
    window.location.href = 'indexmain.html'
})

  