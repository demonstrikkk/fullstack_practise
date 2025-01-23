// const express = require('express'); 


// const app = express(); 
// const PORT = 3000; 
// app.get('/', (req, res) => {
    
 
// });
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
  
// });
// app.use(express.static('index.html'));

// app.post("/submit", async (req, res) => {
//     const usertitle = req.body.title; // Access the input value
//     const userchannel = req.body.channelName; // Access the input value
//     const usercreator = req.body.creatorName; // Access the input value
//     const userviews = req.body.views; // Access the input value
//     const userlink = req.body.link; // Access the input value
    
//   });

// const express = require("express");
// const path = require("path");
// const fs = require("fs");

// const app = express();

// // Middleware to parse form data (URL-encoded)
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json()); // To parse JSON requests

// // Serve static files from the "public" folder
// app.use(express.static(path.join(__dirname, "public")));

// // Define the path for the JSON file
// const dataFilePath = path.join(__dirname, "data.json");

// // Handle form submission
// app.post("/submit", (req, res) => {
//   const {thumbnail, title, channelName, creatorName, views, link } = req.body;

//   // Create an object with the form data
//   const newEntry = {
//     thumbnail,
//     title,
//     channelName,
//     creatorName,
//     views,
//     link,
//   };

//   // Read the existing data from the JSON file
//   fs.readFile(dataFilePath, "utf8", (err, data) => {
//     if (err) {
//       console.error("Error reading file", err);
//       return res.status(500).send("Error saving data.");
//     }

//     // Parse existing data and add the new entry
//     const existingData = data ? JSON.parse(data) : [];
//     existingData.push(newEntry);

//     // Save the updated data back to the JSON file
//     fs.writeFile(dataFilePath, JSON.stringify(existingData, null, 2), "utf8", (err) => {
//       if (err) {
//         console.error("Error saving file", err);
//         return res.status(500).send("Error saving data.");
//       }

//       res.send("Data saved successfully.");
//     });
//   });
// });

// // Fetch the stored data as JSON
// app.get("/data", (req, res) => {
//   fs.readFile(dataFilePath, "utf8", (err, data) => {
//     if (err) {
//       console.error("Error reading file", err);
//       return res.status(500).send("Error fetching data.");
//     }
//     res.json(JSON.parse(data || "[]"));
//   });
// });

// // Start the server
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });


const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

// Middleware to parse form data (URL-encoded) and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Define the path for the JSON file
const dataFilePath = path.join(__dirname, "data.json");

// Handle form submission
app.post("/submit", (req, res) => {
  const { thumbnail, title, channelName, creatorName, views, link } = req.body;

  // Log the form data for debugging
  console.log("Form data received:", req.body);

  // Create an object with the form data
  const newEntry = {
    thumbnail,
    title,
    channelName,
    creatorName,
    views,
    link,
  };

  // Read the existing data from the JSON file
  fs.readFile(dataFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).json({ error: "Error reading data file" });
    }

    let existingData = "";
    try {
      // If the file has data, parse it and add the new entry
      existingData = data || "";  // Ensure it's a string
    } catch (parseError) {
      console.error("Error parsing data:", parseError);
      return res.status(500).json({ error: "Error parsing data from file" });
    }

    // Add the new entry to the data string (append the new data as a string)
    const updatedData = existingData ? existingData + "\n" + JSON.stringify(newEntry) : JSON.stringify(newEntry);

    // Save the updated data back to the JSON file as a string
    fs.writeFile(dataFilePath, updatedData, "utf8", (writeErr) => {
      if (writeErr) {
        console.error("Error saving data:", writeErr);
        return res.status(500).json({ error: "Error saving data to file" });
      }

      console.log("Data saved successfully.");
      res.status(200).json({ message: "Data saved successfully" });
    });
  });
});

// Fetch the stored data and convert it to an array of objects
app.get("/data", (req, res) => {
    fs.readFile(dataFilePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        return res.status(500).json({ error: "Error reading data file" });
      }
  
      // Split the data into an array of entries and parse each one
      let dataArray = [];
      if (data) {
        // Split the string by newline and parse each line as JSON
        const entries = data.split("\n");
        entries.forEach(entry => {
          try {
            const parsedEntry = JSON.parse(entry);
            dataArray.push(parsedEntry);
          } catch (parseError) {
            console.error("Error parsing entry:", parseError);
          }
        });
      }
  
      // Send the data as an array
      res.status(200).json(dataArray);
    });
  });
  

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
