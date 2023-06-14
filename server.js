const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080"); // Replace with your frontend URL
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/readFile', (req, res) => {
    const filePath = path.join(__dirname, 'src/assets', 'data.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
        console.error(err);
        res.status(500).send('Error reading file');
        return;
        }

        res.send(data);
    });
});

app.post('/writeFile', (req, res) => {
    const filePath = path.join(__dirname, 'src/assets', 'data.json');
    const newData = req.body; // Assuming the new data is sent in the request body
    
    // Check if the newData is valid JSON
    if (!newData) {
      res.status(400).send('Invalid JSON data');
      return;
    }
    
    // Convert the newData to a JSON string
    const jsonData = JSON.stringify(newData);
    
    fs.writeFile(filePath, jsonData, 'utf8', (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error writing to file');
        return;
      }
    
      res.send('File updated successfully');
    });
  });
  

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
