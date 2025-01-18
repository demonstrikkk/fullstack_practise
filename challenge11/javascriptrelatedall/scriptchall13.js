// const colors = [
//     "AliceBlue", "AntiqueWhite", "Aqua", "Aquamarine", "Azure", "Beige", "Bisque", "Black", "BlanchedAlmond", 
//     "Blue", "BlueViolet", "Brown", "BurlyWood", "CadetBlue", "Chartreuse", "Chocolate", "Coral", "CornflowerBlue", 
//     "Cornsilk", "Crimson", "Cyan", "DarkBlue", "DarkCyan", "DarkGoldenRod", "DarkGray", "DarkGreen", "DarkKhaki", 
//     "DarkMagenta", "DarkOliveGreen", "DarkOrange", "DarkOrchid", "DarkRed", "DarkSalmon", "DarkSeaGreen", 
//     "DarkSlateBlue", "DarkSlateGray", "DarkTurquoise", "DarkViolet", "DeepPink", "DeepSkyBlue", "DimGray", 
//     "DodgerBlue", "FireBrick", "FloralWhite", "ForestGreen", "Fuchsia", "Gainsboro", "GhostWhite", "Gold", 
//     "GoldenRod", "Gray", "Green", "GreenYellow", "HoneyDew", "HotPink", "IndianRed", "Indigo", "Ivory", 
//     "Khaki", "Lavender", "LavenderBlush", "LawnGreen", "LemonChiffon", "LightBlue", "LightCoral", 
//     "LightCyan", "LightGoldenRodYellow", "LightGray", "LightGreen", "LightPink", "LightSalmon", 
//     "LightSeaGreen", "LightSkyBlue", "LightSlateGray", "LightSteelBlue", "LightYellow", "Lime", 
//     "LimeGreen", "Linen", "Magenta", "Maroon", "MediumAquaMarine", "MediumBlue", "MediumOrchid", 
//     "MediumPurple", "MediumSeaGreen", "MediumSlateBlue", "MediumSpringGreen", "MediumTurquoise", 
//     "MediumVioletRed", "MidnightBlue", "MintCream", "MistyRose", "Moccasin", "NavajoWhite", "Navy", 
//     "OldLace", "Olive", "OliveDrab", "Orange", "OrangeRed", "Orchid", "PaleGoldenRod", "PaleGreen"
// ];


//     document.querySelectorAll(".box").forEach(e => {
//         e.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
//     });




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

// Function to change the color of all .box elements
function changeColors() {
    document.querySelectorAll(".box").forEach(e => {
        e.style.backgroundColor/*const randomColor*/ = colors[Math.floor(Math.random() * colors.length)];
        // e.style.backgroundColor = randomColor;
    });
}

// Set an interval to change colors every 1 second (1000 ms)
setInterval(changeColors, 500);

// CODE OF HARRY
// console.log("Script.js initializing")
// // let boxes = document.getElementsByClassName("box")
// let boxes = document.querySelector(".container").children 


// function getRandomColor(){
//     let val1 = Math.ceil( 0 + Math.random()* 255);
//     let val2 = Math.ceil(0 + Math.random()* 255);
//     let val3 = Math.ceil( 0 + Math.random()* 255);
//     return `rgb(${val1}, ${val2}, ${val3})`
// }
// Array.from(boxes).forEach(e=>{
//     e.style.backgroundColor = getRandomColor()
//     e.style.color = getRandomColor()
// })