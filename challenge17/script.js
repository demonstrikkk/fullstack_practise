const express = require('express'); 
const mongoose = require('mongoose'); 
const { faker } = require('@faker-js/faker'); 

const app = express(); 
const PORT = 3000; 

const DB_URL = 'mongodb://127.0.0.1:27017/fakerDB'; 
mongoose
  .connect(DB_URL)
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error('MongoDB connection error:', err));

const dataSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  company: String,
});

const DataModel = mongoose.model('datas', dataSchema); 

app.use(express.static('public'));


app.get('/api/add-data', async (req, res) => {
  try {
    await DataModel.deleteMany({});


    const fakeData = [];
    for (let i = 0; i < 10; i++) {
      fakeData.push({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        company: faker.company.name(),
      });
    
    }

    await DataModel.insertMany(fakeData);
    console.log('New data added to MongoDB.');
    res.status(200).json(fakeData); // Return the newly added data as JSON
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to add data to MongoDB.');
  }
});

app.get('/api/get-data', async (req, res) => {
  try {
    const allData = await DataModel.find(); // Fetch all data from MongoDB
    res.json(allData);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch data from MongoDB.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
