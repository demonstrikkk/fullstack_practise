const fs = require('fs');
const path = "C:\\Users\\asus\\spotlifyo0"; 

// Define folder paths
const folderPaths = {
  images: './images72',
  videos: './videos72',
  svgs: './svgs72',
  html: './htmlk72',
  css: './cssk72',
  js: './jsk72',
  music: './music72',
  others: './others72'
};

// Function to create folders
const createFolders = () => {
  for (const folder in folderPaths) {
    fs.mkdir(folderPaths[folder], { recursive: true }, (err) => {
      if (err) {
        console.error(`Error creating folder: ${folderPaths[folder]}`, err);
      } else {
        console.log(`Folder created: ${folderPaths[folder]}`);
      }
    });
  }
};

// Function to classify and move files
const classifyFiles = () => {
  fs.readdir(path, (err, files) => {
    if (err) {
      return console.error(`Error reading directory: ${err.message}`);
    }

    files.forEach((file) => {
      const fileExtension = file.split('.').pop().toLowerCase();
      let destinationFolder;

      // Determine the destination folder based on file extension
      switch (fileExtension) {
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
          destinationFolder = folderPaths.images;
          break;
        case 'mp4':
        case 'avi':
        case 'mkv':
          destinationFolder = folderPaths.videos;
          break;
        case 'svg':
          destinationFolder = folderPaths.svgs;
          break;
        case 'html':
          destinationFolder = folderPaths.html;
          break;
        case 'css':
          destinationFolder = folderPaths.css;
          break;
        case 'js':
          destinationFolder = folderPaths.js;
          break;
        case 'mp3':
          destinationFolder = folderPaths.music;
          break;
        default:
          destinationFolder = folderPaths.others;
          break;
      }

      // Move the file to the appropriate folder
      const sourcePath = `${path}\\${file}`;
      const destinationPath = `${destinationFolder}\\${file}`;

      fs.rename(sourcePath, destinationPath, (err) => {
        if (err) {
          console.error(`Error moving file ${file}: ${err.message}`);
        } else {
          console.log(`Moved ${file} to ${destinationFolder}`);
        }
      });
    });
  });
};

// Execute the functions
createFolders();
classifyFiles();
